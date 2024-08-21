---
title: 'Ingest data from Kafka into Azure Data Explorer'
description: In this article, you learn how to ingest (load) data into Azure Data Explorer from Kafka.
ms.reviewer: ankhanol
ms.topic: how-to
ms.date: 08/21/2024

#Customer intent: As an integration developer, I want to build integration pipelines from Kafka into Azure Data Explorer, so I can make data available for near real time analytics.
---
# Ingest data from Apache Kafka into Azure Data Explorer

[!INCLUDE [ingest-data-kafka](includes/cross-repo/ingest-data-kafka.md)]

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer [cluster and database](/azure/data-explorer/create-cluster-and-database) with the default cache and retention policies.
* [Azure CLI](/cli/azure/install-azure-cli).
* [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install).

[!INCLUDE [ingest-data-kafka-2](includes/cross-repo/ingest-data-kafka-2.md)]

### Review the files in the cloned repo

The following sections explain the important parts of the files in the file tree.

#### adx-sink-config.json

This file contains the Kusto sink properties file where you update specific configuration details:

```json
{
    "name": "storm",
    "config": {
        "connector.class": "com.microsoft.azure.kusto.kafka.connect.sink.KustoSinkConnector",
        "flush.size.bytes": 10000,
        "flush.interval.ms": 10000,
        "tasks.max": 1,
        "topics": "storm-events",
        "kusto.tables.topics.mapping": "[{'topic': 'storm-events','db': '<enter database name>', 'table': 'Storms','format': 'csv', 'mapping':'Storms_CSV_Mapping'}]",
        "aad.auth.authority": "<enter tenant ID>",
        "aad.auth.appid": "<enter application ID>",
        "aad.auth.appkey": "<enter client secret>",
        "kusto.ingestion.url": "https://ingest-<name of cluster>.<region>.kusto.windows.net",
        "kusto.query.url": "https://<name of cluster>.<region>.kusto.windows.net",
        "key.converter": "org.apache.kafka.connect.storage.StringConverter",
        "value.converter": "org.apache.kafka.connect.storage.StringConverter"
    }
}
```

[!INCLUDE [ingest-data-kafka-3](includes/cross-repo/ingest-data-kafka-3.md)]

### Managed identity

By default, the Kafka connector uses the application method for authentication during ingestion. To authenticate using managed identity:

1. Assign your cluster a managed identity and grant your storage account read permissions. For more information, see [Ingest data using managed identity authentication](ingest-data-managed-identity.md).

1. In your **adx-sink-config.json** file, set `aad.auth.strategy` to `managed_identity` and ensure that `aad.auth.appid` is set to the managed identity client (application) ID.

1. Use a [private instance metadata service token](/azure/active-directory/managed-identities-azure-resources/how-to-use-vm-token) instead of the [Microsoft Entra service principal](#create-a-microsoft-entra-service-principal).

> [!NOTE]
> When using a managed identity, `appId` and `tenant` are deduced from the context of the call site and `password` isn't needed.

[!INCLUDE [ingest-data-kafka-4](includes/cross-repo/ingest-data-kafka-4.md)]

## Clean up resources

To delete the Azure Data Explorer resources, use [az kusto cluster delete (kusto extension)](/cli/azure/kusto/cluster#az-kusto-cluster-update(kusto)) or [az kusto database delete (kusto extension)](/cli/azure/kusto/database#az-kusto-database-delete(kusto)):

```azurecli-interactive
az kusto cluster delete --name "<cluster name>" --resource-group "<resource group name>"
az kusto database delete --cluster-name "<cluster name>" --database-name "<database name>" --resource-group "<resource group name>"
```

You can also delete your cluster and database via the [Azure portal](https://portal.azure.com/). For more information, see [Delete an Azure Data Explorer cluster](delete-cluster.md) and [Delete a database in Azure Data Explorer](delete-database.md).

[!INCLUDE [ingest-data-kafka-5](includes/cross-repo/ingest-data-kafka-5.md)]

## Related content

* Learn more about [Big data architecture](/azure/architecture/solution-ideas/articles/big-data-azure-data-explorer).
* Learn [how to ingest JSON formatted sample data into Azure Data Explorer](./ingest-json-formats.md?tabs=kusto-query-language).
* Learn more with Kafka labs:
   * [Hands on lab for ingestion from Confluent Cloud Kafka in distributed mode](https://github.com/Azure/azure-kusto-labs/blob/master/kafka-integration/confluent-cloud/README.md)
   * [Hands on lab for ingestion from HDInsight Kafka in distributed mode](https://github.com/Azure/azure-kusto-labs/tree/master/kafka-integration/distributed-mode/hdinsight-kafka)
   * [Hands on lab for ingestion from Confluent IaaS Kafka on AKS in distributed mode](https://github.com/Azure/azure-kusto-labs/blob/master/kafka-integration/distributed-mode/confluent-kafka/README.md)
