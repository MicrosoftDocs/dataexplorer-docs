---
title: 'Manage an Azure Data Explorer cluster & database using Azure Go SDK'
description: Learn how to create,list and delete an Azure Data Explorer cluster and database with Azure Go SDK.
author: abhirockzz
ms.author: abhishgu
ms.service: data-explorer
ms.topic: how-to
ms.date: 09/08/2020
---

# Manage an Azure Data Explorer cluster & database using Go

> [!div class="op_single_selector"]
> * [Portal](create-cluster-database-portal.md)
> * [CLI](create-cluster-database-cli.md)
> * [PowerShell](create-cluster-database-powershell.md)
> * [C#](create-cluster-database-csharp.md)
> * [Python](create-cluster-database-python.md)
> * [Go](create-cluster-database-go.md)
> * [ARM template](create-cluster-database-resource-manager.md)

In this article, you execute create, list, delete operations on Azure Data Explorer cluster and database using [Go](https://golang.org/). Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. To use Azure Data Explorer, first create a cluster, and create one or more databases in that cluster. Then ingest, or load, data into a database so that you can run queries against it.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free) before you begin.
* Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
* Install an appropriate version of Go. The [Azure Go SDK](https://github.com/Azure/azure-sdk-for-go) officially supports the last two major releases of Go.

## Review the code

This section is optional. If you're interested to learn how the code works, you can review the following code snippets. Otherwise, you can skip ahead to [Run the application](#run-the-application).

### Authentication

The program needs to authenticate to Azure Data Explorer before executing any operations. The [Client credentials authentication type](https://docs.microsoft.com/en-us/azure/developer/go/azure-sdk-authorization#use-environment-based-authentication) is used by [auth.NewAuthorizerFromEnvironment](https://pkg.go.dev/github.com/Azure/go-autorest/autorest/azure/auth?tab=doc#NewAuthorizerFromEnvironment) that looks for pre-defined environment variables - `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`

For example, here is how a [kusto.ClustersClient](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go@v0.0.0-20200513030755-ac906323d9fe/services/kusto/mgmt/2020-02-15/kusto?tab=doc#ClustersClient) is created using this technique:

```go
func getClustersClient(subscription string) kusto.ClustersClient {
	client := kusto.NewClustersClient(subscription)
	authR, err := auth.NewAuthorizerFromEnvironment()
	if err != nil {
		log.Fatal(err)
	}
	client.Authorizer = authR

	return client
}
```

### Create Cluster

The [CreateOrUpdate](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go@v0.0.0-20200513030755-ac906323d9fe/services/kusto/mgmt/2020-02-15/kusto?tab=doc#ClustersClient.CreateOrUpdate) function on `kusto.ClustersClient` is used to create a new Azure Data Explorer cluster. We wait for the process to complete before inspecting the result.

```go
func createCluster(sub, name, location, rgName string) {
    ...
	result, err := client.CreateOrUpdate(ctx, rgName, name, kusto.Cluster{Location: &location, Sku: &kusto.AzureSku{Name: kusto.DevNoSLAStandardD11V2, Capacity: &numInstances, Tier: kusto.Basic}})
    ...
    err = result.WaitForCompletionRef(context.Background(), client.Client)
    ...
    r, err := result.Result(client)
}
```

### List Clusters

The [ListByResourceGroup](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go@v0.0.0-20200513030755-ac906323d9fe/services/kusto/mgmt/2020-02-15/kusto?tab=doc#ClustersClient.ListByResourceGroup) function on `kusto.ClustersClient` is used to get a [kusto.ClusterListResult](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go@v0.0.0-20200513030755-ac906323d9fe/services/kusto/mgmt/2020-02-15/kusto?tab=doc#ClusterListResult) which is then iterated to show the output in a tabular form.


```go
func listClusters(sub, rgName string) {
    ...
	result, err := getClustersClient(sub).ListByResourceGroup(ctx, rgName)
    ...
    for _, c := range *result.Value {
		// setup tabular representation
	}
    ...
}
```

### Create database

The [CreateOrUpdate](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go@v0.0.0-20200513030755-ac906323d9fe/services/kusto/mgmt/2020-02-15/kusto?tab=doc#DatabasesClient.CreateOrUpdate) function on [kusto.DatabasesClient](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go@v0.0.0-20200513030755-ac906323d9fe/services/kusto/mgmt/2020-02-15/kusto?tab=doc#DatabasesClient) is used to create a new Azure Data Explorer database in an existing cluster. We wait for the process to complete before inspecting the result.


```go
func createDatabase(sub, rgName, clusterName, location, dbName string) {
	future, err := client.CreateOrUpdate(ctx, rgName, clusterName, dbName, kusto.ReadWriteDatabase{Kind: kusto.KindReadWrite, Location: &location})
    ...
    err = future.WaitForCompletionRef(context.Background(), client.Client)
    ...
    r, err := future.Result(client)
    ...
}
```

### List databases

The [ListByCluster](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go@v0.0.0-20200513030755-ac906323d9fe/services/kusto/mgmt/2020-02-15/kusto?tab=doc#DatabasesClient.ListByCluster) function on `kusto.DatabasesClient` is used to get [kusto.DatabaseListResult](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go@v0.0.0-20200513030755-ac906323d9fe/services/kusto/mgmt/2020-02-15/kusto?tab=doc#DatabaseListResult) which is then iterated to show the output in a tabular form.


```go
func listDatabases(sub, rgName, clusterName string) {
	result, err := getDBClient(sub).ListByCluster(ctx, rgName, clusterName)
    ...
	for _, db := range *result.Value {
		// setup tabular representation
    }
    ...
}

```

### Delete database

The [Delete](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go@v0.0.0-20200513030755-ac906323d9fe/services/kusto/mgmt/2020-02-15/kusto?tab=doc#DatabasesClient.Delete) function on a `kusto.DatabasesClient` is used to delete an existing database in a cluster. We wait for the process to complete before inspecting the result.

```go
func deleteDatabase(sub, rgName, clusterName, dbName string) {
	...
    future, err := getDBClient(sub).Delete(ctx, rgName, clusterName, dbName)
    ...
    err = future.WaitForCompletionRef(context.Background(), client.Client)
    ...
    r, err := future.Result(client)
    if r.StatusCode == 200 {
        // determine success or failure
    }
    ...
}

```

### Delete Cluster

The [Delete](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go@v0.0.0-20200513030755-ac906323d9fe/services/kusto/mgmt/2020-02-15/kusto?tab=doc#ClustersClient.Delete) function on a `kusto.ClustersClient` is used to delete an existing database in a cluster. We wait for the process to complete before inspecting the result.

```go
func deleteCluster(sub, clusterName, rgName string) {
	result, err := client.Delete(ctx, rgName, clusterName)
    ...
	err = result.WaitForCompletionRef(context.Background(), client.Client)
    ...
	r, err := result.Result(client)
    if r.StatusCode == 200 {
        // determine success or failure
    }
    ...
}
```

## Run the application

When you run the sample code as is, the following actions are performed:
    
1. An Azure Data Explorer cluster is created.
1. All the Azure Data Explorer clusters in the specified resource group are listed.
1. An Azure Data Explorer database is created as a part of the cluster created earlier.
1. All the databases in the specified cluster are listed.
1. The database is deleted.
1. The cluster is deleted.

> [!TIP]
> To try different combinations of operations, you can uncomment/comment the respective functions in `main.go`.

1. Clone the sample code from GitHub:

    ```console
    git clone https://github.com/Azure-Samples/azure-data-explorer-go-cluster-management.git
    cd azure-data-explorer-go-cluster-management
    ```

1. Run the sample code as seen in this snippet from `main.go`: 

    ```go
    func main() {
    	createCluster(subscription, clusterNamePrefix+clusterName, location, rgName)
    	listClusters(subscription, rgName)
    	createDatabase(subscription, rgName, clusterNamePrefix+clusterName, location, dbNamePrefix+databaseName)
    	listDatabases(subscription, rgName, clusterNamePrefix+clusterName)
    	deleteDatabase(subscription, rgName, clusterNamePrefix+clusterName, dbNamePrefix+databaseName)
    	deleteCluster(subscription, clusterNamePrefix+clusterName, rgName)
    }
    ```

1. Export required environment variables, including service principal information used to authenticate to Azure Data Explorer for executing cluster and operation operations. To create a service principal, use Azure CLI with the [az ad sp create-for-rbac](https://docs.microsoft.com/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command. Set the information with the cluster endpoint and the database name in the form of environment variables that will be used by the program:

    ```console
    export AZURE_CLIENT_ID="<enter service principal client ID>"
    export AZURE_CLIENT_SECRET="<enter service principal client secret>"
    export AZURE_TENANT_ID="<enter tenant ID>"

    export SUBSCRIPTION="<enter subscription ID>"
    export RESOURCE_GROUP="<enter resource group name>"
    export LOCATION="<enter azure location e.g. Southeast Asia>"

    export CLUSTER_NAME_PREFIX="<enter prefix. name of cluster [prefix]-ADXTestCluster>"
    export DATABASE_NAME_PREFIX="<enter prefix. name of database [prefix]-ADXTestDB>"
    ```

1. Run the program:

    ```console
    go run main.go
    ```

    You'll get a similar output:

    ```console
    waiting for cluster creation to complete - fooADXTestCluster
    created cluster fooADXTestCluster
    listing clusters in resource group <your resource group>
    +-------------------+---------+----------------+-----------+-----------------------------------------------------------+
    |       NAME        |  STATE  |    LOCATION    | INSTANCES |                            URI                           |
    +-------------------+---------+----------------+-----------+-----------------------------------------------------------+
    | fooADXTestCluster | Running | Southeast Asia |         1 | https://fooADXTestCluster.southeastasia.kusto.windows.net |
    +-------------------+---------+----------------+-----------+-----------------------------------------------------------+
    
    waiting for database creation to complete - barADXTestDB
    created DB fooADXTestCluster/barADXTestDB with ID /subscriptions/<your subscription ID>/resourceGroups/<your resource group>/providers/Microsoft.Kusto/Clusters/fooADXTestCluster/Databases/barADXTestDB and type Microsoft.Kusto/Clusters/Databases
    
    listing databases in cluster fooADXTestCluster
    +--------------------------------+-----------+----------------+------------------------------------+
    |              NAME              |   STATE   |    LOCATION    |                TYPE                |
    +--------------------------------+-----------+----------------+------------------------------------+
    | fooADXTestCluster/barADXTestDB | Succeeded | Southeast Asia | Microsoft.Kusto/Clusters/Databases |
    +--------------------------------+-----------+----------------+------------------------------------+
    
    waiting for database deletion to complete - barADXTestDB
    deleted DB barADXTestDB from cluster fooADXTestCluster

    waiting for cluster deletion to complete - fooADXTestCluster
    deleted ADX cluster fooADXTestCluster from resource group <your resource group>
    ```


## Clean up resources

If you did not delete the cluster programmatically using the sample code in this article, you can do so manually using the [Azure CLI](create-cluster-database-cli.md#clean-up-resources).

## Next steps

* [Ingest data using the Azure Data Explorer Python library](python-ingest-data.md)
