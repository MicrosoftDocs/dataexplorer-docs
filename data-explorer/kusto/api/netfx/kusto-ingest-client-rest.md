---
title:  How to ingest data with the REST API
description: This article describes how to ingest data without Kusto.Ingest library by using the REST API in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/08/2023
---
# How to ingest data with the REST API

The Kusto.Ingest library is preferred for ingesting data to your cluster. However, you can still achieve almost the same functionality, without being dependent on the Kusto.Ingest package.
This article shows you how, by using *Queued Ingestion* to your cluster for production-grade pipelines.

> [!NOTE]
> The code below is written in C#, and makes use of the Azure Storage SDK, the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview), and the NewtonSoft.JSON package, to simplify the sample code. If needed, the corresponding code can be replaced with appropriate [Azure Storage REST API](/rest/api/storageservices/blob-service-rest-api) calls, [non-.NET MSAL package](/azure/active-directory/develop/msal-overview), and any available JSON handling package.

This article deals with the recommended mode of ingestion. For the Kusto.Ingest library, its corresponding entity is the [IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient) interface. Here, the client code interacts with your cluster by posting ingestion notification messages to an Azure queue. References to the messages are obtained from the Kusto Data Management (also known as the Ingestion) service. Interaction with the service must be authenticated with Microsoft Entra ID.

The following code shows how the Kusto Data Management service handles queued data ingestion without using the Kusto.Ingest library. This example may be useful if full .NET is inaccessible or unavailable because of the environment, or other restrictions.

The code includes the steps to create an Azure Storage client and upload the data to a blob.
Each step is described in greater detail, after the sample code.

1. [Obtain an authentication token for accessing the ingestion service](#obtain-authentication-evidence-from-azure-ad)
1. Query the ingestion service to obtain:
    * [Ingestion resources (queues and blob containers)](#retrieve-ingestion-resources)
    * [A Kusto identity token that will be added to every ingestion message](#obtain-a-kusto-identity-token)
1. [Upload data to a blob on one of the blob containers obtained from Kusto in (2)](#upload-data-to-the-azure-blob-container)
1. [Compose an ingestion message that identifies the target database and table and that points to the blob from (3)](#compose-the-ingestion-message)
1. [Post the ingestion message we composed in (4) to an ingestion queue obtained in (2)](#post-the-ingestion-message-to-the-ingestion-queue)
1. [Retrieve any error found by the service during ingestion](#check-for-error-messages-from-the-azure-queue)

```csharp
// A container class for ingestion resources we are going to obtain
internal class IngestionResourcesSnapshot
{
    public IList<string> IngestionQueues { get; set; } = new List<string>();
    public IList<string> TempStorageContainers { get; set; } = new List<string>();

    public string FailureNotificationsQueue { get; set; } = string.Empty;
    public string SuccessNotificationsQueue { get; set; } = string.Empty;
}

public static void IngestSingleFile(string file, string db, string table, string ingestionMappingRef)
{
    // Your Azure Data Explorer ingestion service URI, typically ingest-<your cluster name>.kusto.windows.net
    var dmServiceBaseUri = @"https://ingest-{serviceNameAndRegion}.kusto.windows.net";
    // 1. Authenticate the interactive user (or application) to access Kusto ingestion service
    var bearerToken = AuthenticateInteractiveUser(dmServiceBaseUri);
    // 2a. Retrieve ingestion resources
    var ingestionResources = RetrieveIngestionResources(dmServiceBaseUri, bearerToken);
    // 2b. Retrieve Kusto identity token
    var identityToken = RetrieveKustoIdentityToken(dmServiceBaseUri, bearerToken);
    // 3. Upload file to one of the blob containers we got from Azure Data Explorer.
    // This example uses the first one, but when working with multiple blobs,
    // one should round-robin the containers in order to prevent throttling
    var blobName = $"TestData{DateTime.UtcNow:yyyy-MM-dd_HH-mm-ss.FFF}";
    var blobUriWithSas = UploadFileToBlobContainer(
        file, ingestionResources.TempStorageContainers.First(), blobName,
        out var blobSizeBytes
    );
    // 4. Compose ingestion command
    var ingestionMessage = PrepareIngestionMessage(db, table, blobUriWithSas, blobSizeBytes, ingestionMappingRef, identityToken);
    // 5. Post ingestion command to one of the previously obtained ingestion queues.
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

## Using queued ingestion for production-grade pipelines

<a name='obtain-authentication-evidence-from-azure-ad'></a>

### Obtain authentication evidence from Microsoft Entra ID

Here we use [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to obtain a Microsoft Entra token to access the Kusto Data Management service and ask for its input queues. MSAL is available on multiple platforms.

```csharp
// Authenticates the interactive user and retrieves Azure AD Access token for specified resource
internal static string AuthenticateInteractiveUser(string resource)
{
    // Create an authentication client for Azure AD:
    var authClient = PublicClientApplicationBuilder.Create("<appId>")
        .WithAuthority("https://login.microsoftonline.com/<appTenant>")
        .WithRedirectUri("<appRedirectUri>")
        .Build();
    // Acquire user token for the interactive user for Azure Data Explorer:
    var result = authClient.AcquireTokenInteractive(
        new[] { $"{resource}/.default" } // Define scopes
    ).ExecuteAsync().Result;
    return result.AccessToken;
}
```

### Retrieve ingestion resources

Manually construct an HTTP POST request to the Data Management service, requesting the return of the ingestion resources. These resources include queues that the DM service is listening on, and blob containers for data uploading.
The Data Management service will process any messages containing ingestion requests that arrive on one of those queues.

```csharp
// Retrieve ingestion resources (queues and blob containers) with SAS from specified ingestion service using supplied access token
internal static IngestionResourcesSnapshot RetrieveIngestionResources(string ingestClusterBaseUri, string accessToken)
{
    var ingestClusterUri = $"{ingestClusterBaseUri}/v1/rest/mgmt";
    var requestBody = "{ \"csl\": \".get ingestion resources\" }";
    var ingestionResources = new IngestionResourcesSnapshot();
    using var response = SendPostRequest(ingestClusterUri, accessToken, requestBody);
    using var sr = new StreamReader(response.GetResponseStream());
    using var jtr = new JsonTextReader(sr);
    var responseJson = JObject.Load(jtr);
    // Input queues
    var tokens = responseJson.SelectTokens("Tables[0].Rows[?(@.[0] == 'SecuredReadyForAggregationQueue')]");
    foreach (var token in tokens)
    {
        ingestionResources.IngestionQueues.Add((string)token[1]);
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
    return ingestionResources;
}

// Executes a POST request on provided URI using supplied Access token and request body
internal static WebResponse SendPostRequest(string uriString, string authToken, string body)
{
    var request = WebRequest.Create(uriString);
    request.Method = "POST";
    request.ContentType = "application/json";
    request.ContentLength = body.Length;
    request.Headers.Set(HttpRequestHeader.Authorization, $"Bearer {authToken}");
    using var bodyStream = request.GetRequestStream();
    using (var sw = new StreamWriter(bodyStream))
    {
        sw.Write(body);
        sw.Flush();
    }
    bodyStream.Close();
    return request.GetResponse();
}
```

### Obtain a Kusto identity token

Ingest messages are handed off to your cluster via a non-direct channel (Azure queue), making it impossible to do in-band authorization validation for accessing the ingestion service. The solution is to attach an identity token to every ingest message. The token enables in-band authorization validation. This signed token can then be validated by the ingestion service when it receives the ingestion message.

```csharp
// Retrieves a Kusto identity token that will be added to every ingest message
internal static string RetrieveKustoIdentityToken(string ingestClusterBaseUri, string accessToken)
{
    var ingestClusterUri = $"{ingestClusterBaseUri}/v1/rest/mgmt";
    var requestBody = "{ \"csl\": \".get kusto identity token\" }";
    var jsonPath = "Tables[0].Rows[*].[0]";
    using var response = SendPostRequest(ingestClusterUri, accessToken, requestBody);
    using var sr = new StreamReader(response.GetResponseStream());
    using var jtr = new JsonTextReader(sr);
    var responseJson = JObject.Load(jtr);
    var identityToken = responseJson.SelectTokens(jsonPath).FirstOrDefault();
    return (string)identityToken;
}
```

### Upload data to the Azure Blob container

This step is about uploading a local file to an Azure Blob that will be handed off for ingestion. This code uses the Azure Storage SDK. If dependency isn't possible, it can be achieved with [Azure Blob Service REST API](/rest/api/storageservices/fileservices/blob-service-rest-api).

```csharp
// Uploads a single local file to an Azure Blob container, returns blob URI and original data size
internal static string UploadFileToBlobContainer(string filePath, string blobContainerUri, string blobName, out long blobSize)
{
    var blobUri = new Uri(blobContainerUri);
    var blobContainer = new BlobContainerClient(blobUri);
    var blob = blobContainer.GetBlobClient(blobName);
    using (var stream = File.OpenRead(filePath))
    {
        blob.UploadAsync(BinaryData.FromStream(stream));
        blobSize = blob.GetProperties().Value.ContentLength;
    }
    return $"{blob.Uri.AbsoluteUri}{blobUri.Query}";
}
```

### Compose the ingestion message

The NewtonSoft.JSON package will again compose a valid ingestion request to identify the target database and table, and that points to the blob.
The message will be posted to the Azure Queue that the relevant Kusto Data Management service is listening on.

Here are some points to consider.

* This request is the bare minimum for the ingestion message.

> [!NOTE]
> The identity token is mandatory and must be part of the **AdditionalProperties** JSON object.

* Whenever necessary, CsvMapping or JsonMapping properties must be provided as well
* For more information, see the [article on ingestion mapping pre-creation](../../management/create-ingestion-mapping-command.md).
* Section [Ingestion message internal structure](#ingestion-message-internal-structure) provides an explanation of the ingestion message structure

```csharp
internal static string PrepareIngestionMessage(string db, string table, string dataUri, long blobSizeBytes, string mappingRef, string identityToken)
{
    var message = new JObject
    {
        { "Id", Guid.NewGuid().ToString() },
        { "BlobPath", dataUri },
        { "RawDataSize", blobSizeBytes },
        { "DatabaseName", db },
        { "TableName", table },
        { "RetainBlobOnSuccess", true }, // Do not delete the blob on success
        { "FlushImmediately", true }, // Do not aggregate
        { "ReportLevel", 2 }, // Report failures and successes (might incur perf overhead)
        { "ReportMethod", 0 }, // Failures are reported to an Azure Queue
        {
            "AdditionalProperties", new JObject(
                new JProperty("authorizationContext", identityToken),
                new JProperty("mappingReference", mappingRef),
                // Data is in JSON format
                new JProperty("format", "multijson")
            )
        }
    };
    return message.ToString();
}
```

### Post the ingestion message to the ingestion queue

Finally, post the message that you constructed, to the selected ingestion queue that you previously obtained.

> [!NOTE]
> .Net storage client versions below v12, by default, encode the message to base64 For more information, see [storage docs](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.encodemessage?view=azure-dotnet-legacy&preserve-view=true#Microsoft_WindowsAzure_Storage_Queue_CloudQueue_EncodeMessage).
If you are using .Net storage client versions above v12, you must properly encode the message content.

```csharp
internal static void PostMessageToQueue(string queueUriWithSas, string message)
{
    var queue = new QueueClient(new Uri(queueUriWithSas));
    queue.SendMessage(message);
}
```

### Check for error messages from the Azure queue

After ingestion, we check for failure messages from the relevant queue that the Data Management writes to. For more information on the failure message structure, see [Ingestion failure message structure](#ingestion-failure-message-structure). 

```csharp
internal static IEnumerable<string> PopTopMessagesFromQueue(string queueUriWithSas, int count)
{
    var queue = new QueueClient(new Uri(queueUriWithSas));
    var messagesFromQueue = queue.ReceiveMessages(maxMessages: count).Value;
    var messages = messagesFromQueue.Select(m => m.MessageText);
    return messages;
}
```

## Ingestion messages - JSON document formats

### Ingestion message internal structure

The message that the Kusto Data Management service expects to read from the input Azure Queue is a JSON document in the following format.

```JSON
{
    "Id" : "<ID>",
    "BlobPath" : "https://<AccountName>.blob.core.windows.net/<ContainerName>/<PathToBlob>?<SasToken>",
    "RawDataSize" : "<RawDataSizeInBytes>",
    "DatabaseName": "<DatabaseName>",
    "TableName" : "<TableName>",
    "RetainBlobOnSuccess" : "<RetainBlobOnSuccess>",
    "FlushImmediately": "<true|false>",
    "ReportLevel" : <0-Failures, 1-None, 2-All>,
    "ReportMethod" : <0-Queue, 1-Table>,
    "AdditionalProperties" : { "<PropertyName>" : "<PropertyValue>" }
}
```

|Property | Description |
|---------|-------------|
|Id |Message identifier (GUID) |
|BlobPath |Path (URI) to the blob, including the SAS key granting permissions to read/write/delete it. Permissions are required so that the ingestion service can delete the blob once it has completed ingesting the data.|
|RawDataSize |Size of the uncompressed data in bytes. Providing this value allows the ingestion service to optimize ingestion by potentially aggregating multiple blobs. This property is optional, but if not given, the service will access the blob just to retrieve the size. |
|DatabaseName |Target database name |
|TableName |Target table name |
|RetainBlobOnSuccess |If set to `true`, the blob won't be deleted once ingestion is successfully completed. Default is `false` |
|FlushImmediately |If set to `true`, any aggregation will be skipped. Default is `false` |
|ReportLevel |Success/Error reporting level: 0-Failures, 1-None, 2-All |
|ReportMethod |Reporting mechanism: 0-Queue, 1-Table |
|AdditionalProperties |Other properties such as `format`, `tags`, and `creationTime`. For more information, see [data ingestion properties](../../../ingestion-properties.md).|

### Ingestion failure message structure

The message that the Data Management expects to read from the input Azure Queue is a JSON document in the following format.

|Property | Description |
|---------|-------------
|OperationId |Operation identifier (GUID) that can be used to track the operation on the service side |
|Database |Target database name |
|Table |Target table name |
|FailedOn |Failure timestamp |
|IngestionSourceId |GUID identifying the data chunk that failed to ingest |
|IngestionSourcePath |Path (URI) to the data chunk that failed to ingest |
|Details |Failure message |
|ErrorCode |The error code. For all the error codes, see [Ingestion error codes](kusto-ingest-client-errors.md#ingestion-error-codes). |
|FailureStatus |Indicates whether the failure is permanent or transient |
|RootActivityId |The correlation identifier (GUID) that can be used to track the operation on the service side |
|OriginatesFromUpdatePolicy |Indicates whether the failure was caused by an erroneous [transactional update policy](../../management/updatepolicy.md) |
|ShouldRetry | Indicates whether the ingestion could succeed if retried as is |
