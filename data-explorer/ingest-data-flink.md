---
title: Ingest data with Apache Flink into Azure Data Explorer
description: Learn how to ingest data with Apache Flink into Azure Data Explorer.
ms.reviewer: ramacg
ms.topic: how-to
ms.date: 11/05/2023
---

# Ingest data with Apache Flink into Azure Data Explorer

[!INCLUDE [ingest-data-flink-1](includes/cross-repo/ingest-data-flink-1.md)]

### [Application](#tab/application)

You can authenticate from Flink to using either a Microsoft Entra ID application or a managed identity.

[!INCLUDE [ingest-data-flink-2](includes/cross-repo/ingest-data-flink-2.md)]

### [Managed Identity](#tab/managed-identity)

To use managed identity authentication:

1. Add a [system-assigned](configure-managed-identities-cluster.md#add-a-system-assigned-identity) or [user-assigned](configure-managed-identities-cluster.md#add-a-user-assigned-identity) managed identity to your cluster. Save the **Object ID**.

1. Grant the managed identity user permissions on the Azure Data Explorer database:

    ```kusto
    // Grant database user permissions
    .add database <MyDatabase> users ('aadapp=<Object ID>;<Tenant ID>')
    ```

1. Grant the managed identity either ingestor or admin permissions on the Azure Data Explorer table. The required permissions depend on the chosen data writing method. Ingestor permissions are sufficient for SinkV2, while WriteAndSink requires admin permissions.

    ```kusto
    // Grant table ingestor permissions (SinkV2)
    .add table <MyTable> ingestors ('aadapp=<Object ID>;<Tenant ID>')

    // Grant table admin permissions (WriteAheadSink)
    .add table <MyTable> admins ('aadapp=<Object ID>;<Tenant ID>')
    ```

For more information on authorization, see [Kusto role-based access control](kusto/access-control/role-based-access-control.md).

---

## Write data from Flink

To write data from Flink:

1. Import the required options:

    ```java
    import com.microsoft.azure.flink.config.KustoConnectionOptions;
    import com.microsoft.azure.flink.config.KustoWriteOptions;
    ```

1. Use your application or managed identity to Authenticate.

    For application authentication:

    ```java
    KustoConnectionOptions kustoConnectionOptions = KustoConnectionOptions.builder()
    .setAppId("<Application ID>")
    .setAppKey("<Application key>")
    .setTenantId("<Tenant ID>")
    .setClusterUrl("<Cluster URI>").build();
    ```

    For managed identity authentication:

    ```java
    KustoConnectionOptions kustoConnectionOptions = KustoConnectionOptions.builder()
    .setManagedIdentityAppId("<Object ID>")
    .setClusterUrl("<Cluster URI>").build();
    ```

[!INCLUDE [ingest-data-flink-3](includes/cross-repo/ingest-data-flink-3.md)]

## Related content

* [Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
* Use [Apache Flink on Azure HDInsight on AKS with Azure Data Explorer](/azure/hdinsight-aks/flink/integration-of-azure-data-explorer)
