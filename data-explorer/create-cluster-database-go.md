---
title: 'Create an Azure Data Explorer cluster & database using Azure Go SDK'
description: Learn how to create, list, and delete an Azure Data Explorer cluster and database with Azure Go SDK.
ms.reviewer: abhishgu
ms.topic: how-to
ms.date: 09/06/2022
---

# Create an Azure Data Explorer cluster and database using Go

> [!div class="op_single_selector"]
>
> * [Web UI free cluster](start-for-free-web-ui.md)
> * [Portal](create-cluster-database-portal.md)
> * [CLI](create-cluster-database-cli.md)
> * [PowerShell](create-cluster-database-powershell.md)
> * [C#](create-cluster-database-csharp.md)
> * [Python](create-cluster-database-python.md)
> * [Go](create-cluster-database-go.md)
> * [ARM template](create-cluster-database-resource-manager.md)

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then you ingest (load) data into a database so that you can run queries against it.

In this article, you create an Azure Data Explorer cluster and database using [Go](https://golang.org/). You can then list and delete your new cluster and database and execute operations on your resources.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
* Install an appropriate version of Go. For more information regarding supported releases, see the [Azure Go SDK](https://github.com/Azure/azure-sdk-for-go).

## Review the code

This section is optional. If you're interested to learn how the code works, you can review the following code snippets. Otherwise, you can skip ahead to [Run the application](#run-the-application).

### Authentication

The program needs to authenticate to Azure Data Explorer before executing any operations. The [Client credentials authentication type](/azure/developer/go/azure-sdk-authorization#use-environment-based-authentication) is used by [auth.NewAuthorizerFromEnvironment](https://pkg.go.dev/github.com/Azure/go-autorest/autorest/azure/auth?tab=doc#NewAuthorizerFromEnvironment) that looks for the following pre-defined environment variables: `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`.

The following example shows how a [kusto.ClustersClient](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go@v48.2.0+incompatible/services/kusto/mgmt/2020-02-15/kusto) is created using this technique:

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

> [!TIP]
> Use the [auth.NewAuthorizerFromCLIWithResource](https://pkg.go.dev/github.com/Azure/go-autorest/autorest/azure/auth?tab=doc#NewAuthorizerFromCLIWithResource) function for local development if you have Azure CLI installed and configured for authentication.

### Create cluster

Use the [CreateOrUpdate](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/kusto/mgmt/2018-09-07-preview/kusto) function on `kusto.ClustersClient` to create a new Azure Data Explorer cluster. Wait for the process to complete before inspecting the results.

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

### List clusters

Use the [ListByResourceGroup](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/kusto/mgmt/2018-09-07-preview/kusto#ClustersClient.ListByResourceGroup) function on `kusto.ClustersClient` to get a [kusto.ClusterListResult](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/kusto/mgmt/2018-09-07-preview/kusto#ClusterListResult) that is then iterated to show the output in a tabular format.

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

Use [CreateOrUpdate](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/kusto/mgmt/2018-09-07-preview/kusto#DatabasesClient.CreateOrUpdate) function on [kusto.DatabasesClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/kusto/mgmt/2018-09-07-preview/kusto#DatabasesClient) to create a new Azure Data Explorer database in an existing cluster. Wait for the process to complete before inspecting the results.

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

Use [ListByCluster](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/kusto/mgmt/2018-09-07-preview/kusto#DatabasesClient.ListByCluster) function on `kusto.DatabasesClient` to get [kusto.DatabaseListResult](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/kusto/mgmt/2018-09-07-preview/kusto#DatabaseListResult) that is then iterated to show the output in a tabular format.

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

Use [Delete](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/kusto/mgmt/2018-09-07-preview/kusto#DatabasesClient.Delete) function on a `kusto.DatabasesClient` to delete an existing database in a cluster. Wait for the process to complete before inspecting the results.

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

### Delete cluster

Use [Delete](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/kusto/mgmt/2018-09-07-preview/kusto#ClustersClient.Delete) function on a `kusto.ClustersClient` to delete a cluster. Wait for the process to complete before inspecting the results.

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
1. An Azure Data Explorer database is created in the existing cluster.
1. All the databases in the specified cluster are listed.
1. The database is deleted.
1. The cluster is deleted.

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

    > [!TIP]
    > To try different combinations of operations, you can uncomment and comment the respective functions in `main.go` as needed.

1. Clone the sample code from GitHub:

    ```console
    git clone https://github.com/Azure-Samples/azure-data-explorer-go-cluster-management.git
    cd azure-data-explorer-go-cluster-management
    ```

1. The program authenticates using client credentials. Use the Azure CLI [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command to create a service principal. Save the client ID, client secret, and tenant ID information for use in the next step.

1. Export required environment variables including service principal information. Enter your subscription ID, resource group, and region where you want to create the cluster.

    ```console
    export AZURE_CLIENT_ID="<enter service principal client ID>"
    export AZURE_CLIENT_SECRET="<enter service principal client secret>"
    export AZURE_TENANT_ID="<enter tenant ID>"

    export SUBSCRIPTION="<enter subscription ID>"
    export RESOURCE_GROUP="<enter resource group name>"
    export LOCATION="<enter azure location e.g. Southeast Asia>"

    export CLUSTER_NAME_PREFIX="<enter prefix (cluster name will be [prefix]-ADXTestCluster)>"
    export DATABASE_NAME_PREFIX="<enter prefix (database name will be [prefix]-ADXTestDB)>"
    ```

    > [!TIP]
    > You're likely to use environment variables in production scenarios to provide credentials to your application. As mentioned in [Review the code](#review-the-code), for local development, use [auth.NewAuthorizerFromCLIWithResource](https://pkg.go.dev/github.com/Azure/go-autorest/autorest/azure/auth?tab=doc#NewAuthorizerFromCLIWithResource) if you have Azure CLI installed and configured for authentication. In that situation, you don't need to create a service principal.

1. Run the program:

    ```console
    go run main.go
    ```

    You'll get an output similar to the following:

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
    deleted Azure Data Explorer cluster fooADXTestCluster from resource group <your resource group>
    ```

## Clean up resources

If you didn't delete the cluster programmatically using the sample code in this article, delete them manually using [Azure CLI](create-cluster-database-cli.md#clean-up-resources).

## Next steps

[Ingest data using the Azure Data Explorer Go SDK](go-ingest-data.md)
