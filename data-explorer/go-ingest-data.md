---
title: 'Ingest data with Azure Data Explorer Go SDK'
description: In this article, you learn how to ingest (load) data into Azure Data Explorer using Go SDK.
ms.reviewer: abhishgu
ms.topic: how-to
ms.date: 09/11/2022

# Customer intent: As a Go developer, I want to ingest data into Azure Data Explorer so that I can query data to include in my apps.
---

# Ingest data using the Azure Data Explorer Go SDK 

> [!div class="op_single_selector"]
> * [.NET](net-sdk-ingest-data.md)
> * [Python](python-ingest-data.md)
> * [Node](node-ingest-data.md)
> * [Go](go-ingest-data.md)
> * [Java](java-ingest-data.md)

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. It provides a [Go SDK client library](kusto/api/golang/kusto-golang-client-library.md) for interacting with the Azure Data Explorer service. You can use the [Go SDK](https://github.com/Azure/azure-kusto-go) to ingest, control, and query data in Azure Data Explorer clusters. 

In this article, you first create a table and data mapping in a test cluster. You then queue an ingestion to the cluster using the Go SDK and validate the results.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
* Install [Go](https://golang.org/) with the following [Go SDK minimum requirements](kusto/api/golang/kusto-golang-client-library.md#minimum-requirements). 
* Create an [App Registration and grant it permissions to the database](provision-azure-ad-app.md). Save the client ID and client secret for later use.

## Install the Go SDK

The Azure Data Explorer Go SDK will be automatically installed when you run the [sample application that uses [Go modules](https://golang.org/ref/mod). If you installed the Go SDK for another application, create a Go module and fetch the Azure Data Explorer package (using `go get`), for example:

```console
go mod init foo.com/bar
go get github.com/Azure/azure-kusto-go/kusto
```

The package dependency will be added to the `go.mod` file. Use it in your Go application.

## Review the code

This [Review the code](#review-the-code) section is optional. If you're interested to learn how the code works, you can review the following code snippets. Otherwise, you can skip ahead to [Run the application](#run-the-application).

### Authenticate

The program needs to authenticate to Azure Data Explorer service before executing any operations.

```go
auth := kusto.Authorization{Config: auth.NewClientCredentialsConfig(clientID, clientSecret, tenantID)}
client, err := kusto.New(kustoEndpoint, auth)
```

An instance of [kusto.Authorization](https://godoc.org/github.com/Azure/azure-kusto-go/kusto#Authorization) is created using the service principal credentials. It's then used to create a [kusto.Client](https://godoc.org/github.com/Azure/azure-kusto-go/kusto#Client) with the [New](https://godoc.org/github.com/Azure/azure-kusto-go/kusto#New]) function that also accepts the cluster endpoint.

### Create table

The create table command is represented by a [Kusto statement](https://godoc.org/github.com/Azure/azure-kusto-go/kusto#Stmt).The [Mgmt](https://godoc.org/github.com/Azure/azure-kusto-go/kusto#Client.Mgmt) function is used to execute management commands. It's used to execute the command to create a table. 

```go
func createTable(kc *kusto.Client, kustoDB string) {
	_, err := kc.Mgmt(context.Background(), kustoDB, kusto.NewStmt(createTableCommand))
	if err != nil {
		log.Fatal("failed to create table", err)
	}
	log.Printf("Table %s created in DB %s\n", kustoTable, kustoDB)
}
```

> [!TIP]
> A Kusto statement is constant, by default, for better security. [`NewStmt`](https://godoc.org/github.com/Azure/azure-kusto-go/kusto#NewStmt) accepts string constants. The [`UnsafeStmt`](https://godoc.org/github.com/Azure/azure-kusto-go/kusto#UnsafeStmt) API allows for use of non-constant statement segments, but isn't recommended.

The Kusto create table command is as follows:

```kusto
.create table StormEvents (StartTime: datetime, EndTime: datetime, EpisodeId: int, EventId: int, State: string, EventType: string, InjuriesDirect: int, InjuriesIndirect: int, DeathsDirect: int, DeathsIndirect: int, DamageProperty: int, DamageCrops: int, Source: string, BeginLocation: string, EndLocation: string, BeginLat: real, BeginLon: real, EndLat: real, EndLon: real, EpisodeNarrative: string, EventNarrative: string, StormSummary: dynamic)
```

### Create mapping

Data mappings are used during ingestion to map incoming data to columns inside Azure Data Explorer tables. For more information, see [data mapping](kusto/management/mappings.md). Mapping is created, in the same way as a table, using the `Mgmt` function with the database name and the appropriate command. The complete command is available in the [GitHub repo for the sample](https://github.com/Azure-Samples/Azure-Data-Explorer-Go-SDK-example-to-ingest-data/blob/main/main.go#L20).

```go
func createMapping(kc *kusto.Client, kustoDB string) {
	_, err := kc.Mgmt(context.Background(), kustoDB, kusto.NewStmt(createMappingCommand))
	if err != nil {
		log.Fatal("failed to create mapping - ", err)
	}
	log.Printf("Mapping %s created\n", kustoMappingRefName)
}
```

### Ingest data

An ingestion is queued using a file from an existing Azure Blob Storage container. 

```go
func ingestFile(kc *kusto.Client, blobStoreAccountName, blobStoreContainer, blobStoreToken, blobStoreFileName, kustoMappingRefName, kustoDB, kustoTable string) {
	kIngest, err := ingest.New(kc, kustoDB, kustoTable)
	if err != nil {
		log.Fatal("failed to create ingestion client", err)
	}
	blobStorePath := fmt.Sprintf(blobStorePathFormat, blobStoreAccountName, blobStoreContainer, blobStoreFileName, blobStoreToken)
	err = kIngest.FromFile(context.Background(), blobStorePath, ingest.FileFormat(ingest.CSV), ingest.IngestionMappingRef(kustoMappingRefName, ingest.CSV))

	if err != nil {
		log.Fatal("failed to ingest file", err)
	}
	log.Println("Ingested file from -", blobStorePath)
}
```

The [Ingestion](https://godoc.org/github.com/Azure/azure-kusto-go/kusto/ingest#Ingestion) client is created using [ingest.New](https://godoc.org/github.com/Azure/azure-kusto-go/kusto/ingest#New). The [FromFile](https://godoc.org/github.com/Azure/azure-kusto-go/kusto/ingest#Ingestion.FromFile) function is used to refer to the Azure Blob Storage URI. The mapping reference name and the data type are passed in the form of [FileOption](https://godoc.org/github.com/Azure/azure-kusto-go/kusto/ingest#FileOption). 

## Run the application

1. Clone the sample code from GitHub:

    ```console
    git clone https://github.com/Azure-Samples/Azure-Data-Explorer-Go-SDK-example-to-ingest-data.git
    cd Azure-Data-Explorer-Go-SDK-example-to-ingest-data
    ```

1. Run the sample code as seen in this snippet from `main.go`: 

    ```go
    func main {
        ...
        dropTable(kc, kustoDB)
        createTable(kc, kustoDB)
        createMapping(kc, kustoDB)
        ingestFile(kc, blobStoreAccountName, blobStoreContainer, blobStoreToken, blobStoreFileName, kustoMappingRefName, kustoDB, kustoTable)
        ...
    }
    ```

    > [!TIP]
    > To try different combinations of operations, you can uncomment/comment the respective functions in `main.go`.

    When you run the sample code, the following actions are performed:
    
    1. **Drop table**: `StormEvents` table is dropped (if it exists).
    1. **Table creation**: `StormEvents` table is created.
    1. **Mapping creation**: `StormEvents_CSV_Mapping` mapping is created.
    1. **File ingestion**: A CSV file (in Azure Blob Storage) is queued for ingestion.

1. To create a service principal for authentication, use Azure CLI with the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command. Set the service principal information with the cluster endpoint and the database name in the form of environment variables that will be used by the program:

    ```console
    export AZURE_SP_CLIENT_ID="<replace with appID>"
    export AZURE_SP_CLIENT_SECRET="<replace with password>"
    export AZURE_SP_TENANT_ID="<replace with tenant>"
    export KUSTO_ENDPOINT="https://<cluster name>.<azure region>.kusto.windows.net"
    export KUSTO_DB="name of the database"
    ```

1. Run the program:

    ```console
    go run main.go
    ```

    You'll get a similar output:

    ```console
    Connected to Azure Data Explorer
    Using database - testkustodb
    Failed to drop StormEvents table. Maybe it does not exist?
    Table StormEvents created in DB testkustodb
    Mapping StormEvents_CSV_Mapping created
    Ingested file from - https://kustosamples.blob.core.windows.net/samplefiles/StormEvents.csv
    ```

## Validate and troubleshoot

Wait for 5 to 10 minutes for the queued ingestion to schedule the ingestion process and load the data into Azure Data Explorer. 

1. Sign in to [https://dataexplorer.azure.com](https://dataexplorer.azure.com) and connect to your cluster. Then run the following command to get the count of records in the `StormEvents` table.

    ```kusto
    StormEvents | count
    ```

2. Run the following command in your database to see if there were any ingestion failures in the last four hours. Replace the database name before running.

    ```kusto
    .show ingestion failures
    | where FailedOn > ago(4h) and Database == "<DatabaseName>"
    ```

1. Run the following command to view the status of all ingestion operations in the last four hours. Replace the database name before running.

    ```kusto
    .show operations
    | where StartedOn > ago(4h) and Database == "<DatabaseName>" and Operation == "DataIngestPull"
    | summarize arg_max(LastUpdatedOn, *) by OperationId
    ```

## Clean up resources

If you plan to follow our other articles, keep the resources you created. If not, run the following command in your database to drop the `StormEvents` table.

```kusto
.drop table StormEvents
```

## Next step

> [!div class="nextstepaction"]
> [Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
