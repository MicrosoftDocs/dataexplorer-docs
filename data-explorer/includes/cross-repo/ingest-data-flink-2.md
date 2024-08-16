---
ms.topic: include
ms.date: 02/15/2024
---

This service principal will be the identity used by the connector to write data your table in Kusto. You'll later grant permissions for this service principal to access Kusto resources.

[!INCLUDE [entra-service-principal](../entra-service-principal.md)]

1. Grant the application user permissions on the database:

    ```kusto
    // Grant database user permissions
    .add database <MyDatabase> users ('aadapp=<Application ID>;<Tenant ID>')
    ```

1. Grant the application either ingestor or admin permissions on the  table. The required permissions depend on the chosen data writing method. Ingestor permissions are sufficient for SinkV2, while WriteAndSink requires admin permissions.

    ```kusto
    // Grant table ingestor permissions (SinkV2)
    .add table <MyTable> ingestors ('aadapp=<Application ID>;<Tenant ID>')

    // Grant table admin permissions (WriteAheadSink)
    .add table <MyTable> admins ('aadapp=<Application ID>;<Tenant ID>')
    ```

For more information on authorization, see [Kusto role-based access control](/azure/data-explorer/kusto/access-control/role-based-access-control).
