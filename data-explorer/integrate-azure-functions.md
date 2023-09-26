---
title: Azure Data Explorer bindings for Azure Functions overview (preview)
description: Learn how to use Azure Data Explorer bindings for Azure Functions.
ms.reviewer: ramacg
ms.topic: conceptual
ms.date: 09/13/2022
---

# Integrating Azure Functions with Azure Data Explorer using input and output bindings (preview)

[!INCLUDE [real-time-analytics-connectors--note](includes/real-time-analytics-connectors--note.md)]

Azure Functions allow you to run serverless code in the cloud on a schedule or in response to an event. With Azure Data Explorer input and output bindings for Azure Functions, you can integrate Azure Data Explorer into your workflows to ingest data and run queries against your cluster.

## Prerequisites

- An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
- An Azure Data Explorer cluster and database with sample data. [Create a cluster and database](create-cluster-and-database.md).
- A [storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal).

Try out the integration with our [sample project](https://github.com/Azure/Webjobs.Extensions.Kusto/tree/main/samples/samples-csharp/)

## How to use Azure Data Explorer bindings for Azure Functions

For information on how to use Azure Data Explorer bindings for Azure Functions, see the following topics:

- [Azure Data Explorer bindings for Azure Functions overview](https://aka.ms/adx-docs-af-overview)
- [Azure Data Explorer input bindings for Azure Functions](https://aka.ms/adx-docs-af-input)
- [Azure Data Explorer output bindings for Azure Functions](https://aka.ms/adx-docs-af-output)

## Scenarios for using Azure Data Explorer bindings for Azure Functions

The following sections describe some common scenarios for using Azure Data Explorer bindings for Azure Functions.

### Input bindings

Input bindings run a Kusto Query Language (KQL) query or KQL function, optionally with parameters, and returns the output to the function.

The following sections describe some how to use input bindings in some common scenarios.

#### Scenario 1: An HTTP endpoint to query data from a cluster

Using input bindings is applicable in situations where you need to expose Azure Data Explorer data through a REST API. In this scenario, you use an Azure Functions HTTP trigger to query data in your cluster. The scenario is particularly useful in situations where you need to provide programmatic access to Azure Data Explorer data for external applications or services. By exposing your data through a REST API, applications can readily consume the data without requiring them to connect directly to your cluster.

The code defines a function with an HTTP trigger and an Azure Data Explorer input binding. The input binding specifies the query to run against the **Products** table in the **productsdb** database. The function uses the **productId** column as the predicate passed through as a parameter.

```csharp
{
    [FunctionName("GetProduct")]
    public static async Task<IActionResult> RunAsync(
        [HttpTrigger(AuthorizationLevel.User, "get", Route = "getproducts/{productId}")]
        HttpRequest req,
        [Kusto(Database:"productsdb" ,
        KqlCommand = "declare query_parameters (productId:long);Products | where ProductID == productId" ,
        KqlParameters = "@productId={productId}",
        Connection = "KustoConnectionString")]
        IAsyncEnumerable<Product> products)
    {
        IAsyncEnumerator<Product> enumerator = products.GetAsyncEnumerator();
        var productList = new List<Product>();
        while (await enumerator.MoveNextAsync())
        {
            productList.Add(enumerator.Current);
        }
        await enumerator.DisposeAsync();
        return new OkObjectResult(productList);
    }
}
```

The function can then be invoked, as follows:

```powershell
curl https://myfunctionapp.azurewebsites.net/api/getproducts/1
```

### Scenario 2: A scheduled trigger to export data from a cluster

The following scenario is applicable in situations where data needs to be exported on a time-based schedule.

The code defines a function with a timer trigger that exports an aggregation of sales data from the **productsdb** database to a CSV file in Azure Blob Storage.

```csharp
public static async Task Run([TimerTrigger("0 0 1 * * *")] TimerInfo myTimer,
    [Kusto(ConnectionStringSetting = "KustoConnectionString",
            DatabaseName = "productsdb",
            Query = "ProductSales | where OrderDate >= ago(1d) | summarize Sales = sum(ProductSales) by ProductName | top 10 by Sales desc")] IEnumerable<dynamic> queryResults,
[Blob("salescontainer/productsblob.csv", FileAccess.Write, Connection = "BlobStorageConnection")] CloudBlockBlob outputBlob,
ILogger log)
{
    // Write the query results to a CSV file
    using (var stream = new MemoryStream())
    using (var writer = new StreamWriter(stream))
    using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
    {
        csv.WriteRecords(queryResults);
        writer.Flush();
        stream.Position = 0;
        await outputBlob.UploadFromStreamAsync(stream);
    }
}
```

## Output bindings

Output bindings takes one or more rows and inserts them into an Azure Data Explorer table.

The following sections describe some how to use output bindings in some common scenarios.

## Scenario 1: HTTP endpoint to ingest data into a cluster

The following scenario is applicable in situations where incoming HTTP requests need to be processed and ingested into your cluster. By using an output binding, incoming data from the request can be written into Azure Data Explorer tables.

The code defines a function with an HTTP trigger and an Azure Data Explorer output binding. This function takes a JSON payload in the HTTP request body and writes it to the **products** table in the **productsdb** database.

```csharp
public static IActionResult Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "addproductuni")]
    HttpRequest req, ILogger log,
    [Kusto(Database:"productsdb" ,
    TableName ="products" ,
    Connection = "KustoConnectionString")] out Product product)
{
    log.LogInformation($"AddProduct function started");
    string body = new StreamReader(req.Body).ReadToEnd();
    product = JsonConvert.DeserializeObject<Product>(body);
    string productString = string.Format(CultureInfo.InvariantCulture, "(Name:{0} ID:{1} Cost:{2})",
                product.Name, product.ProductID, product.Cost);
    log.LogInformation("Ingested product {}", productString);
    return new CreatedResult($"/api/addproductuni", product);
}
```

The function can then be invoked, as follows:

```powershell
curl -X POST https://myfunctionapp.azurewebsites.net/api/addproductuni -d '{"Name":"Product1","ProductID":1,"Cost":100,"ActivatedOn":"2023-01-02T00:00:00"}'
```

## Scenario 2: Ingest data from RabbitMQ or other messaging systems supported on Azure

The following scenario is applicable in situations where data from a messaging system needs to be ingested into into your cluster. By using an output binding, incoming data from the messaging system can be ingested into Azure Data Explorer tables.

The code defines a function with messages, data in JSON format, incoming through a RabbitMQ trigger that are ingested into the **products** table in the **productsdb** database.

```csharp
public class QueueTrigger
{
    [FunctionName("QueueTriggerBinding")]
    [return: Kusto(Database: "productsdb",
                TableName = "products",
                Connection = "KustoConnectionString")]
    public static Product Run(
        [RabbitMQTrigger(queueName: "bindings.products.queue", ConnectionStringSetting = "rabbitMQConnectionAppSetting")] Product product,
        ILogger log)
    {
        log.LogInformation($"Dequeued product {product.ProductID}");
        return product;
    }
}
```

For more information about functions, see [Azure Functions documentation](/azure/azure-functions/). The Azure Data Explorer extension is available on:

- [GitHub](https://github.com/Azure/Webjobs.Extensions.Kusto)
- [NuGet.org](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Kusto/1.0.7-Preview)

## Next steps

- [Kusto Query Language (KQL) overview](kusto/query/index.md)
