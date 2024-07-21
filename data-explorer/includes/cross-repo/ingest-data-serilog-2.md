---
ms.topic: include
ms.date: 07/02/2024
---

<a name='create-an-azure-ad-app-registration'></a>

## Create a Microsoft Entra service principal

Microsoft Entra application authentication is used for applications that need to access your KQL database table without a user present. To ingest data using the Serilog connector, you need to create and register a Microsoft Entra service principal, and then authorize this principal as the identity used by the connector to ingest data to your KQL database.

The Microsoft Entra service principal can be created through the [Azure portal](/azure/active-directory/develop/howto-create-service-principal-portal) or programmatically, as in the following example.

You'll later grant permissions for this service principal to access Kusto resources.
<a name='grant-the-azure-ad-app-permissions'></a>

[!INCLUDE [entra-service-principal](../entra-service-principal.md)]

## Create a target table and ingestion mapping

Create a target table for the incoming data and an ingestion mapping to map the ingested data columns to the columns in the target table. In the following steps, the table schema and mapping correspond to the data sent from the [sample app](#run-the-sample-app).

1. Run the following [table creation command](/azure/data-explorer/kusto/management/create-table-command) in your query editor, replacing the placeholder *TableName* with the name of the target table:

    ```kusto
    .create table <TableName> (Timestamp: datetime, Level: string, Message: string, Exception: string, Properties: dynamic, Position: dynamic, Elapsed: int)
    ```

1. Run the following [.create ingestion mapping command](/azure/data-explorer/kusto/management/create-ingestion-mapping-command), replacing the placeholders *TableName* with the target table name and *TableNameMapping* with the name of the ingestion mapping:

    ```kusto
    .create table <TableName> ingestion csv mapping '<TableNameMapping>' '[{"Name":"Timestamp","DataType":"","Ordinal":"0","ConstValue":null},{"Name":"Level","DataType":"","Ordinal":"1","ConstValue":null},{"Name":"Message","DataType":"","Ordinal":"2","ConstValue":null},{"Name":"Exception","DataType":"","Ordinal":"3","ConstValue":null},{"Name":"Properties","DataType":"","Ordinal":"4","ConstValue":null},{"Name":"Position","DataType":"","Ordinal":"5","ConstValue":null},{"Name":"Elapsed","DataType":"","Ordinal":"6","ConstValue":null}]'
    ```

1. Grant the service principal from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal) [database ingestor](/azure/data-explorer/kusto/access-control/role-based-access-control) role permissions to work with the database. For more information, see [Examples](/azure/data-explorer/kusto/management/manage-database-security-roles.md). Replace the placeholder *DatabaseName* with the name of the target database and *ApplicationID* with the `AppId` value you saved when creating a Microsoft Entra service principal.

    ```kusto
    .add database <DatabaseName> ingestors ('aadapp=<ApplicationID>') 'App Registration'
    ```
