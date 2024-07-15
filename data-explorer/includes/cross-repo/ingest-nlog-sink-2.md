---
ms.topic: include
ms.date: 06/30/2024
---
## Set up your environment

In this section, you'll prepare your environment to use the NLog connector.

### Install the package

Add the [NLog.Azure.Kusto](https://aka.ms/adx-docs-nlog-nuget) NuGet package. Use the Install-Package command specifying the name of the NuGet package.

```powershell
Install-Package NLog.Azure.Kusto
```

### Create a Microsoft Entra app registration

Microsoft Entra application authentication is used for applications that need to access the platform without a user present. To get data using the NLog connector, you need to create and register a Microsoft Entra service principal, and then authorize this principal to get data from a database.

The Microsoft Entra service principal can be created through the [Azure portal](/azure/active-directory/develop/howto-create-service-principal-portal) or programatically, as in the following example.

This service principal will be the identity used by the connector to write data your table in Kusto. You'll later grant permissions for this service principal to access Kusto resources.

[!INCLUDE [entra-service-principal](../entra-service-principal.md)]

Save the following values to be used in later steps:
    * Application (client) ID
    * Directory (tenant) ID
    * Client secret key value

### Grant the Microsoft Entra app permissions

1. In your query environment, run the following management command, replacing the placeholders. Replace *DatabaseName* with the name of the target database and *ApplicationID* with the previously saved value. This command grants the app the [database ingestor](/azure/data-explorer/kusto/management/access-control/role-based-access-control) role. For more information, see [Manage database security roles](/azure/data-explorer/kusto/management/manage-database-security-roles).

     ```kusto
    .add database <DatabaseName> ingestors ('aadapp=<ApplicationID>') 'NLOG Azure App Registration role'
    ```
    > [!NOTE]
    > The last parameter is a string that shows up as notes when you query the roles associated with a database. For more information, see [View existing security roles](/azure/data-explorer/kusto/management/manage-database-security-roles#show-existing-security-roles).
