---
title: Kusto bindings for Azure Functions overview (preview)
description: Learn how to use Kusto bindings for Azure Functions.
ms.reviewer: ramacg
ms.topic: conceptual
ms.date: 09/13/2022
---

# Integrating Azure Functions with Kusto using Input and Output Bindings

Azure Functions allow you to run serverless code in the cloud on a schedule or in response to an event. With Kusto input and output bindings for Azure Functions, you can easily integrate Kusto into your workflows, making it easy to ingest data and run queries against your Kusto cluster.

## Kusto Input Binding

Takes a KQL query or KQL function to run (with optional parameters) and returns the output to the function. Here are couple of scenarios as to how to use the bindings

## Prerequisites

To follow these scenarios, you'll need the following:

- An Azure subscription
- A Kusto database with sample data
- An Azure Blob Storage account and container
- Visual Studio or another code editor

A simple Azure functions project can be created on Visual Studio with the Microsoft.Azure.WebJobs.Extensions.Kusto NuGet package installed. The snippets that follow are samples to be used in the Azure Functions project created. A sample project can be found [here](https://github.com/Azure/Webjobs.Extensions.Kusto/tree/main/samples/samples-csharp/)

### Scenario 1: HTTP endpoint to query data from Kusto

The scenario of using an HTTP trigger to query Kusto using an input binding is applicable in situations where you need to expose Kusto data through a REST API. By using an Azure Function with an HTTP trigger and a Kusto input binding, a simple REST API that allows for the query Kusto data using HTTP requests.

This scenario is particularly useful in situations where you need to provide programmatic access to Kusto data for external applications or services. By exposing the Kusto data through a REST API, you can make it easier for other applications to consume the data without requiring them to connect directly to the Kusto database.

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

This code defines an Azure Function with an HTTP trigger and a Kusto input binding. The Kusto input binding specifies the query to run against the Products table in the productsdb database, using the productId as the predicate passed through the context path in the HTTP API. This can then be invoked as follows

```powershell
curl https://myfunctionapp.azurewebsites.net/api/getproducts/1    
```

### Scenario 2: A scheduled trigger to export data from Kusto

This scenario is applicable in situations where data needs to be exported on a time-based schedule.

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

This code defines and Azure Function with a timer trigger that exports and aggregation of sales data from the productsdb database to a CSV file in Azure Blob Storage.

## Kusto Output Binding

Takes row(s) and inserts them into the Kusto table.

## Scenario 1: HTTP endpoint to ingest data into Kusto

This scenario is applicable in situations where incoming HTTP requests need to processed and ingesting them to Kusto. By using an output binding, incoming data from the request can be written into Kusto tables.

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

This code defines an Azure Function with an HTTP trigger and a Kusto output binding. This function takes a JSON payload in the HTTP request body and writes it to the products table in the productsdb database. This can then be invoked as follows

```powershell
curl -X POST https://myfunctionapp.azurewebsites.net/api/addproductuni -d '{"Name":"Product1","ProductID":1,"Cost":100,"ActivatedOn":"2023-01-02T00:00:00"}'
```

## Scenario 2: Ingest data from RabbitMQ or other messaging systems supported on Azure

This scenario is applicable in situations where data from a messaging system needs to be ingested into Kusto. By using an output binding, incoming data from the messaging system can be ingested into Kusto tables

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

This code defines an Azure Function with messages (JSON data) incoming through a RabbitMQ trigger that are ingested into the products table in the productsdb database in Kusto.

To read more about functions refer to the [Azure Functions documentation](https://learn.microsoft.com/en-us/azure/azure-functions/). The Kusto extension is on [GitHub](https://github.com/Azure/Webjobs.Extensions.Kusto) and the NuGet package is on [NuGet.org](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Kusto/1.0.7-Preview)
