---
ms.topic: include
ms.date: 07/03/2024
---

## Create a Microsoft Entra service principal

The Microsoft Entra service principal can be created through the [Azure portal](/azure/active-directory/develop/howto-create-service-principal-portal) or programmatically, as in the following example.

This service principal is the identity used by the connector to write data to your table in Kusto. You'll grant permissions for this service principal to access Kusto resources.

[!INCLUDE [entra-service-principal](../entra-service-principal.md)]

## Create a target table

Create a target table for the incoming data and an ingestion mapping to map the ingested data columns to the columns in the target table.

1. Run the following [table creation command](/azure/data-explorer/kusto/management/create-table-command.md) in your query editor, replacing the placeholder *TableName* with the name of the target table:

    ```kusto
    .create table <TableName> (_raw: string, _time: long, cribl_pipe: dynamic)
    ```

1. Run the following [.create ingestion mapping command](/azure/data-explorer/kusto/management/create-ingestion-mapping-command.md), replacing the placeholders *TableName* with the target table name and *TableNameMapping* with the name of the ingestion mapping:

    ```kusto
    .create table <TableName> ingestion csv mapping '<TableNameMapping>' 'CriblLogMapping' '[{"Name":"_raw","DataType":"string","Ordinal":"0","ConstValue":null},{"Name":"_time","DataType":"long","Ordinal":"1","ConstValue":null},{"Name":"cribl_pipe","DataType":"dynamic","Ordinal":"2","ConstValue":null}]'
    ```

1. Grant the service principal from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal) [database ingestor](/azure/data-explorer/kusto/access-control/role-based-access-control.md) role permissions to work with the database. For more information, see [Examples](../../kusto/management/manage-database-security-roles.md). Replace the placeholder *DatabaseName* with the name of the target database and *ApplicationID* with the `AppId` value you saved when creating a Microsoft Entra service principal.

    ```kusto
    .add database <DatabaseName> ingestors ('aadapp=<ApplicationID>') 'App Registration'
    ```
<!--1. Create an [ingestion batching policy](/azure/data-explorer/kusto/management/batching-policy) on the table for configurable queued ingestion latency.

    > [!TIP]
    > The ingestion batching policy is a performance optimizer and includes three parameters. The first condition satisfied triggers ingestion into the Azure Data Explorer table.

    ```kusto
    .alter table SyslogMapping policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:15", "MaximumNumberOfItems": 100, "MaximumRawDataSizeMB": 300}'
    ```
-->
## Connect a KQL table to Cribl Stream

The following section describes how to connect your KQL table to Cribl Stream. For each KQL table that you want to connect, you need a separate Cribl Stream destination connector.

### Select destination

To connect Cribl Stream to your KQL table:

1. From the top navigation in Cribl, select **Manage** then select a Worker Group.

1. Select **Routing** > **QuickConnect (Stream)** > **Add Destination**. <!-- confirm with Ram that this is how its called>

1. In the **Set up new QuickConnect Destination** window, choose **Azure Data Explorer**, then **Add now**.
:::image type="content" source="../media/ingest-data-cribl/add-azure-data-explorer.png" alt-text="Screenshot of the Set up new QuickConnect Destination window in Cribl with Azure Data Explorer selected."  lightbox="../media/ingest-data-cribl/add-azure-data-explorer.png":::
