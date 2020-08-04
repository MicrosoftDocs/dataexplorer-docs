---
title: 'Ingest data with Azure Data Explorer Go SDK'
description: In this article, you learn how to ingest (load) data into Azure Data Explorer using Go SDK.
author: abhirockzz
ms.author: abhishgu
ms.service: data-explorer
ms.topic: conceptual
ms.date: 08/04/2020

# Customer intent: As a Go developer, I want to ingest data into Azure Data Explorer so that I can ingest data to include in my apps.
---

# Ingest data using the Azure Data Explorer Go SDK 

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. It provides a [Go client library](https://docs.microsoft.com/azure/data-explorer/kusto/api/golang/kusto-golang-client-library?WT.mc_id=adxgo-docs-abhishgu) for interacting with the Azure Data Explorer service. You can use the [Go SDK](https://github.com/Azure/azure-kusto-go) to query, control, and ingest into Azure Data Explorer clusters

> [!TIP]
> For the control plane (resource administration), go to: https://github.com/Azure/azure-sdk-for-go/tree/master/services/kusto/mgmt

In this article, you first create a table and data mapping in a test cluster. You then queue an ingestion to the cluster using the Go SDK and validate the results.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/?WT.mc_id=adxgo-docs-abhishgu) before you begin.

* You need [Go](https://golang.org/) installed on your computer. The [Go SDK requires Go 1.13](https://docs.microsoft.com/azure/data-explorer/kusto/api/golang/kusto-golang-client-library?WT.mc_id=adxgo-docs-abhishgu#minimum-requirements) as a minimum version

* Create [an Azure Data Explorer cluster and database](create-cluster-database-portal.md)

* You need [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed on your computer

## Install the Go SDK

The Azure Data Explorer Go SDK will be automatically installed when you run the [sample application for this article](https://github.com/Azure-Samples/Azure-Data-Explorer-Go-SDK-example-to-ingest-data) (since it uses [Go modules]())

If you want to install the SDK for another application, create a Go module (if needed) and fetch the Azure Data Explorer package (using `go get`). For example:


```shell
go mod init foo.com/bar
go get github.com/Azure/azure-kusto-go/kusto
```

You should see the package dependency being added to the `go.mod` file and use it in your Go application.

## Review the code

This step is optional. If you're interested to learn how the code works, you can review the following code snippets. Otherwise, you can skip ahead to [Run the application](#run-the-application)

### Authentication

The program needs to authenticate to Azure Data Explorer service before executing any operations.

```go
auth := kusto.Authorization{Config: auth.NewClientCredentialsConfig(clientID, clientSecret, tenantID)}
client, err := kusto.New(kustoEndpoint, auth)
```

An instance of [kusto.Authorization](https://godoc.org/github.com/Azure/azure-kusto-go/kusto#Authorization) is created using the Service Principal credentials. It is then used to create a [kusto.Client](https://godoc.org/github.com/Azure/azure-kusto-go/kusto#Client) with [New](https://godoc.org/github.com/Azure/azure-kusto-go/kusto#New]) function that also accepts the cluster endpoint.

### Table creation

The [Mgmt](https://godoc.org/github.com/Azure/azure-kusto-go/kusto#Client.Mgmt) function is meant for executing management queries. It is used for executing the command to create a table.

```go
func createTable(kc *kusto.Client, kustoDB string) {
	_, err := kc.Mgmt(context.Background(), kustoDB, kusto.NewStmt(createTableCommand))
	if err != nil {
		log.Fatal("failed to create table", err)
	}
	log.Printf("Table %s created in DB %s\n", kustoTable, kustoDB)
}
```

The create table command is represented by a [kusto.Stmt](https://godoc.org/github.com/Azure/azure-kusto-go/kusto#Stmt)

The create table command is as follows:

```kusto
.create table StormEvents (StartTime: datetime, EndTime: datetime, EpisodeId: int, EventId: int, State: string, EventType: string, InjuriesDirect: int, InjuriesIndirect: int, DeathsDirect: int, DeathsIndirect: int, DamageProperty: int, DamageCrops: int, Source: string, BeginLocation: string, EndLocation: string, BeginLat: real, BeginLon: real, EndLat: real, EndLon: real, EpisodeNarrative: string, EventNarrative: string, StormSummary: dynamic)
```

### Mapping creation

Mapping is also created in the same way as table: using the `Mgmt` function with the database name and the mapping creation command.

```go
func createMapping(kc *kusto.Client, kustoDB string) {
	_, err := kc.Mgmt(context.Background(), kustoDB, kusto.NewStmt(createMappingCommand))
	if err != nil {
		log.Fatal("failed to create mapping - ", err)
	}
	log.Printf("Mapping %s created\n", kustoMappingRefName)
}
```

The mapping creation command is as follows:

```kusto
.create table StormEvents ingestion csv mapping 'StormEvents_CSV_Mapping' '[{"Name":"StartTime","datatype":"datetime","Ordinal":0}, {"Name":"EndTime","datatype":"datetime","Ordinal":1},{"Name":"EpisodeId","datatype":"int","Ordinal":2},{"Name":"EventId","datatype":"int","Ordinal":3},{"Name":"State","datatype":"string","Ordinal":4},{"Name":"EventType","datatype":"string","Ordinal":5},{"Name":"InjuriesDirect","datatype":"int","Ordinal":6},{"Name":"InjuriesIndirect","datatype":"int","Ordinal":7},{"Name":"DeathsDirect","datatype":"int","Ordinal":8},{"Name":"DeathsIndirect","datatype":"int","Ordinal":9},{"Name":"DamageProperty","datatype":"int","Ordinal":10},{"Name":"DamageCrops","datatype":"int","Ordinal":11},{"Name":"Source","datatype":"string","Ordinal":12},{"Name":"BeginLocation","datatype":"string","Ordinal":13},{"Name":"EndLocation","datatype":"string","Ordinal":14},{"Name":"BeginLat","datatype":"real","Ordinal":16},{"Name":"BeginLon","datatype":"real","Ordinal":17},{"Name":"EndLat","datatype":"real","Ordinal":18},{"Name":"EndLon","datatype":"real","Ordinal":19},{"Name":"EpisodeNarrative","datatype":"string","Ordinal":20},{"Name":"EventNarrative","datatype":"string","Ordinal":21},{"Name":"StormSummary","datatype":"dynamic","Ordinal":22}]'
```

### Ingestion

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

The [Ingestion](https://godoc.org/github.com/Azure/azure-kusto-go/kusto/ingest#Ingestion) client is created using [ingest.New](https://godoc.org/github.com/Azure/azure-kusto-go/kusto/ingest#New). [FromFile](https://godoc.org/github.com/Azure/azure-kusto-go/kusto/ingest#Ingestion.FromFile) function is used to refer to the Azure Blob Storage URI. The mapping reference name along with the data type (CSV in this case) is passed in the form of [FileOption](https://godoc.org/github.com/Azure/azure-kusto-go/kusto/ingest#FileOption)s 

## Run the application

Clone the sample code from GitHub:

```shell
git clone https://github.com/Azure-Samples/Azure-Data-Explorer-Go-SDK-example-to-ingest-data.git
cd Azure-Data-Explorer-Go-SDK-example-to-ingest-data
```

When you run the sample code, the following sequence of events will be executed:

- Drop table: `StormEvents` table will be dropped (if it exists)
- Table creation: `StormEvents` table will be created
- Mapping creation: `StormEvents_CSV_Mapping` mapping will be created
- File ingestion: A CSV file (in Azure Blob Storage) will be queued for ingestion

Here is the snippet from `main.go`

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
> To try different combinations of operations, you can uncomment/comment the respective functions in `main.go`

You will need to create Service Principal for authentication. For example, you can do it with Azure CLI using the [az ad sp create-for-rbac](https://docs.microsoft.com/cli/azure/ad/sp?view=azure-cli-latest&WT.mc_id=adxgo-docs-abhishgu#az-ad-sp-create-for-rbac) command

Set Service Principal information along with cluster endpoint in the form of environment variables that will be used by the program:

```shell
export AZURE_SP_CLIENT_ID="<replace with appID>"
export AZURE_SP_CLIENT_SECRET="<replace with password>"
export AZURE_SP_TENANT_ID="<replace with tenant>"
export KUSTO_ENDPOINT="https://<cluster name>.<azure region>.kusto.windows.net"
export KUSTO_DB="name of the database"
```

Finally, to run the program:

```shell
go run main.go
```

You will see an output similar to the following:

```shell
Connected to Azure Data Explorer
Using database - testkustodb
Failed to drop StormEvents table. Maybe it does not exist?
Table StormEvents created in DB testkustodb
Mapping StormEvents_CSV_Mapping created
Ingested file from - https://kustosamplefiles.blob.core.windows.net/samplefiles/StormEvents.csv?st=2018-08-31T22%3A02%3A25Z&se=2020-09-01T22%3A02%3A00Z&sp=r&sv=2018-03-28&sr=b&sig=LQIbomcKI8Ooz425hWtjeq6d61uEaq21UVX7YrM61N4%3D
```

## Validate and troubleshoot

Wait for five to ten minutes for the queued ingestion to schedule the ingest and load the data into Azure Data Explorer. Sign in to [https://dataexplorer.azure.com](https://dataexplorer.azure.com) and connect to your cluster. Then run the following code to get the count of records in the `StormEvents` table

```kusto
StormEvents | count
```

Run the following command in your database to see if there were any ingestion failures in the last four hours. Replace the database name before running.

```kusto
.show ingestion failures
| where FailedOn > ago(4h) and Database == "<DatabaseName>"
```

Run the following command to view the status of all ingestion operations in the last four hours. Replace the database name before running.

```kusto
.show operations
| where StartedOn > ago(4h) and Database == "<DatabaseName>" and Operation == "DataIngestPull"
| summarize arg_max(LastUpdatedOn, *) by OperationId
```

## Clean up resources

If you plan to follow our other articles, keep the resources you created. If not, run the following command in your database to clean up the `StormEvents` table.

```kusto
.drop table StormEvents
```

## Next steps

* [Write queries](write-queries.md)