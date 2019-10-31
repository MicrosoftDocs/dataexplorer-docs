---
title: HowTo Data Ingestion without Kusto.Ingest Library - Azure Data Explorer | Microsoft Docs
description: This article describes HowTo Data Ingestion without Kusto.Ingest Library in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/30/2019
---
# HowTo Data Ingestion without Kusto.Ingest Library

## When to Consider Not Using Kusto.Ingest library?
Generally, using Kusto.Ingest library should be preferred whenever ingesting data to Kusto is considered.<BR>
When this is not an option (usually due to OS constraints), with some effort one can achieve almost the same functionality.<BR>
This article shows how to implement **Queued Ingestion** to Kusto without taking dependency on the Kusto.Ingest package.

>**Note:** The code below is written in C# making use of Azure Storage SDK, ADAL Authentication library, and NewtonSoft.JSON package in order to simplify the sample code.<BR>If needed, the corresponding code can be replaced with appropriate [Azure Storage REST API](https://docs.microsoft.com/rest/api/storageservices/blob-service-rest-api) calls, [non-.NET ADAL package](https://docs.microsoft.com/azure/active-directory/develop/active-directory-authentication-libraries) and any available JSON handling package.

## Overview
The following code sample demonstrates Queued (going via Kusto Data Management service) data ingestion to Kusto without the use of Kusto.Ingest library.<BR>
This may be useful if full .NET is inaccessible or unavailable due to environment or other restrictions.<BR>

> This article deals with the recommended mode of ingestion for production-grade pipelines, which is also referred to as **Queued Ingestion** (in terms of the Kusto.Ingest library, the corresponding entity is the [IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient) interface). In this mode the client code interacts with the Kusto service by posting ingestion notification messages to an Azure queue, reference to which is obtained from the Kusto Data Management (a.k.a. Ingestion) service. Interaction with the Data Management service must be authenticated with **AAD**.

The outline of this flow is described in the code sample below and is comprised of the following:
1. Create an Azure Storage client and upload the data to a blob
1. Obtain authentication token for accessing Kusto ingestion service
2. Query the Kusto ingestion service in order to obtain:
    * Ingestion resources (queues and blob containers)
    * Kusto identity token that will be added to every ingestion message
3. Upload data to a blob on one of the blob containers obtained from Kusto in (2)
4. Compose an ingestion message identifying the target DB and Table and pointing to the blob from (3)
5. Post the ingestion message we composed in (4) to one of the ingestion queues obtained from Kusto in (2)
6. Retrieve any error encountered by the service during ingestion

Subsequent sections explain each step in greater detail.

```csharp
// A container class for ingestion resources we are going to obtain from Kusto
internal class IngestionResourcesSnapshot
{
    public IList<string> IngestionQueues { get; set; } = new List<string>();
    public IList<string> TempStorageContainers { get; set; } = new List<string>();

    public string FailureNotificationsQueue { get; set; } = string.Empty;
    public string SuccessNotificationsQueue { get; set; } = string.Empty;
}

public static void IngestSingleFile(string file, string db, string table, string ingestionMappingRef)
{
    // Your Kusto ingestion service URI, typically ingest-<your cluster name>.kusto.windows.net
    string DmServiceBaseUri = @"https://ingest-{serviceNameAndRegion}.kusto.windows.net";

    // 1. Authenticate the interactive user (or application) to access Kusto ingestion service
    string bearerToken = AuthenticateInteractiveUser(DmServiceBaseUri);

    // 2a. Retrieve ingestion resources
    IngestionResourcesSnapshot ingestionResources = RetrieveIngestionResources(DmServiceBaseUri, bearerToken);

    // 2b. Retrieve Kusto identity token
    string identityToken = RetrieveKustoIdentityToken(DmServiceBaseUri, bearerToken);

    // 3. Upload file to one of the blob containers we got from Kusto.
    // This example uses the first one, but when working with multiple blobs,
    // one should round-robin the containers in order to prevent throttling
    long blobSizeBytes = 0;
    string blobName = $"TestData{DateTime.UtcNow.ToString("yyyy-MM-dd_HH-mm-ss.FFF")}";
    string blobUriWithSas = UploadFileToBlobContainer(file, ingestionResources.TempStorageContainers.First(),
                                                            "temp001", blobName, out blobSizeBytes);

    // 4. Compose ingestion command
    string ingestionMessage = PrepareIngestionMessage(db, table, blobUriWithSas, blobSizeBytes, ingestionMappingRef, identityToken);

    // 5. Post ingestion command to one of the ingestion queues we got from Kusto.
    // This example uses the first one, but when working with multiple blobs,
    // one should round-robin the queues in order to prevent throttling
    PostMessageToQueue(ingestionResources.IngestionQueues.First(), ingestionMessage);

    Thread.Sleep(20000);

    // 6a. Read success notifications
    var successes = PopTopMessagesFromQueue(ingestionResources.SuccessNotificationsQueue, 32);
    foreach (var sm in successes)
    {
        Console.WriteLine($"Ingestion completed: {sm}");
    }

    // 6b. Read failure notifications
    var errors = PopTopMessagesFromQueue(ingestionResources.FailureNotificationsQueue, 32);
    foreach (var em in errors)
    {
        Console.WriteLine($"Ingestion error: {em}");
    }
}
```

## 1. Obtain Authentication Evidence from AAD
Here we use ADAL to obtain an AAD token to access the Kusto Data Management service in order to ask for its input queues.
ADAL is available on [non-Windows platforms](https://docs.microsoft.com/azure/active-directory/develop/active-directory-authentication-libraries) if needed.
```csharp
// Authenticates the interactive user and retrieves AAD Access token for specified resource
internal static string AuthenticateInteractiveUser(string resource)
{
    // Create Auth Context for MSFT AAD:
    AuthenticationContext authContext = new AuthenticationContext("https://login.microsoftonline.com/{AAD Tenant ID or name}");

    // Acquire user token for the interactive user for Kusto:
    AuthenticationResult result =
        authContext.AcquireTokenAsync(resource, "<your client app ID>", new Uri(@"<your client app URI>"),
                                        new PlatformParameters(PromptBehavior.Auto), UserIdentifier.AnyUser, "prompt=select_account").Result;
    return result.AccessToken;
}
```

## 2. Retrieve Kusto Ingestion Resources
This is where the things get interesting. Here we manually construct an HTTP POST request to Kusto Data Management service, requesting to return the ingestion resources.
These include queues that the DM service is listening on, as well as blob containers for data uploading.
The Data Management service will process any message containing ingestion requests that arrives on one of those queues.
```csharp
// Retrieve ingestion resources (queues and blob containers) with SAS from specified Kusto Ingestion service using supplied Access token
internal static IngestionResourcesSnapshot RetrieveIngestionResources(string ingestClusterBaseUri, string accessToken)
{
    string ingestClusterUri = $"{ingestClusterBaseUri}/v1/rest/mgmt";
    string requestBody = $"{{ \"csl\": \".get ingestion resources\" }}";

    IngestionResourcesSnapshot ingestionResources = new IngestionResourcesSnapshot();

    using (WebResponse response = SendPostRequest(ingestClusterUri, accessToken, requestBody))
    using (StreamReader sr = new StreamReader(response.GetResponseStream()))
    using (JsonTextReader jtr = new JsonTextReader(sr))
    {
        JObject responseJson = JObject.Load(jtr);
        IEnumerable<JToken> tokens;

        // Input queues
        tokens = responseJson.SelectTokens("Tables[0].Rows[?(@.[0] == 'SecuredReadyForAggregationQueue')]");
        foreach (var token in tokens)
        {
            ingestionResources.IngestionQueues.Add((string) token[1]);
        }

        // Temp storage containers
        tokens = responseJson.SelectTokens("Tables[0].Rows[?(@.[0] == 'TempStorage')]");
        foreach (var token in tokens)
        {
            ingestionResources.TempStorageContainers.Add((string)token[1]);
        }

        // Failure notifications queue
        var singleToken =
            responseJson.SelectTokens("Tables[0].Rows[?(@.[0] == 'FailedIngestionsQueue')].[1]").FirstOrDefault();
        ingestionResources.FailureNotificationsQueue = (string)singleToken;

        // Success notifications queue
        singleToken =
            responseJson.SelectTokens("Tables[0].Rows[?(@.[0] == 'SuccessfulIngestionsQueue')].[1]").FirstOrDefault();
        ingestionResources.SuccessNotificationsQueue = (string)singleToken;
    }

    return ingestionResources;
}

// Executes a POST request on provided URI using supplied Access token and request body
internal static WebResponse SendPostRequest(string uriString, string authToken, string body)
{
    WebRequest request = WebRequest.Create(uriString);

    request.Method = "POST";
    request.ContentType = "application/json";
    request.ContentLength = body.Length;
    request.Headers.Set(HttpRequestHeader.Authorization, $"Bearer {authToken}");

    Stream bodyStream = request.GetRequestStream();
    using (StreamWriter sw = new StreamWriter(bodyStream))
    {
        sw.Write(body);
        sw.Flush();
    }

    bodyStream.Close();
    return request.GetResponse();
}
```

## Obtaining Kusto Identity Token
An important step in authorizing data ingestion is obtaining an identity token and attaching it to every ingest message. As ingest messages are handed off to Kusto via a non-direct channel (Azure queue), there is no way to perform in-band authorization validation. The identity token mechanism allows this by issuing a Kusto-signed identity evidence that can be validated by the Kusto service once it receives the ingestion message.
```csharp
// Retrieves a Kusto identity token that will be added to every ingest message
internal static string RetrieveKustoIdentityToken(string ingestClusterBaseUri, string accessToken)
{
    string ingestClusterUri = $"{ingestClusterBaseUri}/v1/rest/mgmt";
    string requestBody = $"{{ \"csl\": \".get kusto identity token\" }}";
    string jsonPath = "Tables[0].Rows[*].[0]";

    using (WebResponse response = SendPostRequest(ingestClusterUri, accessToken, requestBody))
    using (StreamReader sr = new StreamReader(response.GetResponseStream()))
    using (JsonTextReader jtr = new JsonTextReader(sr))
    {
        JObject responseJson = JObject.Load(jtr);
        JToken identityToken = responseJson.SelectTokens(jsonPath).FirstOrDefault();

        return ((string)identityToken);
    }
}
```

## 3. Upload Data to Azure Blob Container
This step is about uploading a local file to an Azure Blob which will later be handed off for ingestion. This code utilizes Azure Storage SDK, but where this dependency is not possible, one could achieve the same with [Azure Blob Service REST API](https://docs.microsoft.com/rest/api/storageservices/fileservices/blob-service-rest-api).
```csharp
// Uploads a single local file to an Azure Blob container, returns blob URI and original data size
internal static string UploadFileToBlobContainer(string filePath, string blobContainerUri, string containerName, string blobName, out long blobSize)
{
    var blobUri = new Uri(blobContainerUri);
    CloudBlobContainer blobContainer = new CloudBlobContainer(blobUri);
    CloudBlockBlob blockBlob = blobContainer.GetBlockBlobReference(blobName);

    using (Stream stream = File.OpenRead(filePath))
    {
        blockBlob.UploadFromStream(stream);
        blobSize = blockBlob.Properties.Length;
    }

    return string.Format("{0}{1}", blockBlob.Uri.AbsoluteUri, blobUri.Query);
}
```

## 4. Compose Kusto Ingestion Message
Here we use NewtonSoft.JSON package again to compose a valid ingestion request message that will be posted to the Azure Queue the appropriate Kusto Data Management service is listening on.
* This is the bare minimum for the ingestion message.
* Note, that identity token is mandatory and must reside in the `AdditionalProperties` JSON object
* Whenever needed a `CsvMapping` or a `JsonMapping` properties must be provided as well
* See [article on ingestion mapping pre-creation](../../management/tables.md#create-ingestion-mapping) for more details
* [Appendix A](#appendix-a-ingestion-message-internal-structure) provides explanation on the ingestion message structure

```csharp
internal static string PrepareIngestionMessage(string db, string table, string dataUri, long blobSizeBytes, string mappingRef, string identityToken)
{
    var message = new JObject();

    message.Add("Id", Guid.NewGuid().ToString());
    message.Add("BlobPath", dataUri);
    message.Add("RawDataSize", blobSizeBytes);
    message.Add("DatabaseName", db);
    message.Add("TableName", table);
    message.Add("RetainBlobOnSuccess", true);   // Do not delete the blob on success
    message.Add("Format", "json");              // Data is in JSON format
    message.Add("FlushImmediately", true);      // Do not aggregate
    message.Add("ReportLevel", 2);              // Report failures and successes (might incur perf overhead)
    message.Add("ReportMethod", 0);             // Failures are reported to an Azure Queue

    message.Add("AdditionalProperties", new JObject(
                                            new JProperty("authorizationContext", identityToken),
                                            new JProperty("jsonMappingReference", mappingRef)));
    return message.ToString();
}
```

## 5. Post Kusto Ingestion Message to Kusto Ingestion Queue
And finally, the deed itself - merely post the message we constructed to the Queue we chose.<BR>
Note: When using .Net storage client, it encodes the message to base64 by default. Please see [storage docs](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.queue.cloudqueue.encodemessage?view=azure-dotnet#Microsoft_WindowsAzure_Storage_Queue_CloudQueue_EncodeMessage).<BR>
If you are NOT using that client, please make sure to encode the message content properly.

```csharp
internal static void PostMessageToQueue(string queueUriWithSas, string message)
{
    CloudQueue queue = new CloudQueue(new Uri(queueUriWithSas));
    CloudQueueMessage queueMessage = new CloudQueueMessage(message);

    queue.AddMessage(queueMessage, null, null, null, null);
}
```

## 6. Pop Messages from an Azure Queue
Post-ingestion, we use this method to read any failure messages from the appropriate queue that is written to by Kusto Data Management service.<BR>
[Appendix B](#appendix-b-ingestion-failure-message-structure) provides explanation on the failure message structure

```csharp
internal static IEnumerable<string> PopTopMessagesFromQueue(string queueUriWithSas, int count)
{
    List<string> messages = Enumerable.Empty<string>().ToList();
    CloudQueue queue = new CloudQueue(new Uri(queueUriWithSas));
    var messagesFromQueue = queue.GetMessages(count);
    foreach (var m in messagesFromQueue)
    {
        messages.Add(m.AsString);
        queue.DeleteMessage(m);
    }

    return messages;
}
```

## Appendix A: Ingestion Message Internal Structure
The message that Kusto Data Management service expects to read from the input Azure Queue is a JSON document in the following format:

```json
{
    "Id" : "<Id>", 
    "BlobPath" : "https://<AccountName>.blob.core.windows.net/<ContainerName>/<PathToBlob>?<SasToken>",
    "RawDataSize" : "<RawDataSizeInBytes>",
    "DatabaseName": "<DatabaseName>",
    "TableName" : "<TableName>",
    "RetainBlobOnSuccess" : "<RetainBlobOnSuccess>",
    "Format" : "<csv|tsv|...>",
    "FlushImmediately": "<true|false>",
    "ReportLevel" : <0-Failures, 1-None, 2-All>,
    "ReportMethod" : <0-Queue, 1-Table>,
    "AdditionalProperties" : { "<PropertyName>" : "<PropertyValue>" }
}
```


|Property | Description |
|---------|-------------|
|Id |Message identifier (GUID) |
|BlobPath |Blob URI, including the SAS key granting Kusto permissions to read/write/delete it (write/delete permissions are required if Kusto is to delete the blob once it has completed ingesting the data) |
|RawDataSize |Size of the uncompressed data in bytes. Providing this value allows Kusto to optimize ingestion by potentially aggregating multiple blobs together. This property is optional, but if not provided, Kusto will access the blob just to retrieve the size |
|DatabaseName |Target database name |
|TableName |Target table name |
|RetainBlobOnSuccess |If set to `true`, the blob will not be deleted once ingestion is completed successfully. Defaults to `false` |
|Format |Uncompressed data format |
|FlushImmediately |If set to `true`, any aggregation will be skipped. Defaults to `false` |
|ReportLevel |Success/Error reporting level: 0-Failures, 1-None, 2-All |
|ReportMethod |Reporting mechanism: 0-Queue, 1-Table |
|AdditionalProperties |Any additional properties (tags, etc.) |


## Appendix B: Ingestion Failure Message Structure
The following table message that Kusto Data Management service expects to read from the input Azure Queue is a JSON document in the following format:

|Property | Description |
|---------|-------------
|OperationId |Operation identifier (GUID) that can be used to track the operation on the service side |
|Database |Target database name |
|Table |Target table name |
|FailedOn |Failure timestamp |
|IngestionSourceId |GUID identifying the data chunk that Kusto failed to ingest |
|IngestionSourcePath |Path (URI) to the data chunk that Kusto failed to ingest |
|Details |Failure message |
|ErrorCode |Kusto error code (see all the error codes [here](kusto-ingest-client-errors.md#ingestion-error-codes)) |
|FailureStatus |Indicates whether the failure is permanent or transient |
|RootActivityId |Kusto correlation identifier (GUID) that can be used to track the operation on the service side |
|OriginatesFromUpdatePolicy |Indicates whether the failure was caused by an errorneous [transactional update policy](../../concepts/updatepolicy.md) |
|ShouldRetry | Indicates whether the ingestion may succeed if retried as is |