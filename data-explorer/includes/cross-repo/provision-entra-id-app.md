---
ms.topic: include
ms.date: 01/11/2024
---
## Create Microsoft Entra application registration

Microsoft Entra application authentication requires creating and registering an application with Microsoft Entra ID.
A service principal is automatically created when the application registration is created in a Microsoft Entra tenant.

The app registration can either be created in the Azure portal, or programatically with Azure CLI. Choose the tab that fits your scenario.

### [Portal](#tab/portal)

#### Register the app

1. Sign in to [Azure portal](https://portal.azure.com) and open the **Identity** blade
1. Browse to **App registrations** and select **New registration**.

    :::image type="content" source="../media/provision-entra-id-app/create-app-new-registration.png" alt-text="Screenshot showing how to start a new app registration." lightbox="../media/provision-entra-id-app/create-app-new-registration.png":::

1. Name the application, for example "example-app".
1. Select a supported account type, which determines who can use the application.
1. Under **Redirect URI**, select **Web** for the type of application you want to create. The URI is optional and is left blank in this case.

    :::image type="content" source="../media/provision-entra-id-app/create-app-register-app.png" alt-text="Screenshot showing how to register a new app registration." lightbox="../media/provision-entra-id-app/create-app-register-app.png":::

1. Select **Register**.

#### Set up authentication

There are two types of authentication available for service principals: password-based authentication (application secret) and certificate-based authentication. The following section describes using a password-based authentication for the application's credentials. You can alternatively use an X509 certificate to authenticate your application. For more information, see [How to configure Microsoft Entra certificate-based authentication](/entra/identity/authentication/how-to-certificate-based-authentication).

Through the course of this section, you'll copy the following values: **Application ID** and **key value**. Paste these values somewhere, like a text editor, for use in the step [configure client credentials to the database](#grant-a-service-principal-access-to-the-database).

1. Browse to the **Overview** blade.
1. Copy the **Application (client) ID** and the **Directory (tenant) ID**.

    > [!NOTE]
    > You'll need the application ID and the tenant ID to [authorize the service principal to access the database](#grant-a-service-principal-access-to-the-database).

1. In the **Certificates & secrets** blade, select **New client secret**.

    :::image type="content" source="../media/provision-entra-id-app/create-app-new-client-secret.png" alt-text="Screenshot showing how to start the creation of client secret." lightbox="../media/provision-entra-id-app/create-app-new-client-secret.png":::

1. Enter a description and expiration.
1. Select **Add**.
1. Copy the key value.

    > [!NOTE]
    > When you leave this page, the key value won't be accessible. 

You've created your Microsoft Entra application and service principal.

### [Azure CLI](#tab/azurecli)

1. Sign in to your Azure subscription via Azure CLI. Then authenticate in the browser.

   ```azurecli-interactive
   az login
   ```

2. Choose the subscription to host the principal. This step is needed when you have multiple subscriptions.

   ```azurecli-interactive
   az account set --subscription YOUR_SUBSCRIPTION_GUID
   ```

3. Create the service principal. In this example, the service principal is called `splunk-uf`.

   ```azurecli-interactive
   az ad sp create-for-rbac -n "my-service-principal" --role Contributor --scopes /subscriptions/{SubID}
   ```

4. From the returned JSON data, copy the `appId`, `password`, and `tenant` for future use.

    ```json
    {
      "appId": "1234abcd-e5f6-g7h8-i9j0-1234kl5678mn",
      "displayName": "my-service-principal",
      "name": "my-service-principal",
      "password": "1234abcd-e5f6-g7h8-i9j0-1234kl5678mn",
      "tenant": "1234abcd-e5f6-g7h8-i9j0-1234kl5678mn"
    }
    ```

You've created your Microsoft Entra application and service principal.

---

## Configure delegated permissions for the application - optional

If your application needs to access your database using the credentials of the calling user, configure delegated permissions for your application. For example, if you're building a web API and you want to authenticate using the credentials of the user who is *calling* your API.

If you only need access to an authorized data resource, you can skip this section and continue to [Grant a service principal access to the database](#grant-a-service-principal-access-to-the-database).

1. Browse to the the **API permissions** blade of your **App registration**.
1. Select **Add a permission**.
1. Select **APIs my organization uses**. 
1. Search for and select **Azure Data Explorer**.

    :::image type="content" source="../media/provision-entra-id-app/configure-delegated-add-api-permission.png" alt-text="Screenshot showing how to add Azure Data Explorer API permission." lightbox="../media/provision-entra-id-app/configure-delegated-add-api-permission.png":::

1. In **Delegated permissions**, select the **user_impersonation** box.
1. Select **Add permissions**.

    :::image type="content" source="../media/provision-entra-id-app/configure-delegated-click-add-permissions.png" alt-text="Screenshot showing how to select delegated permissions with user impersonation." lightbox="../media/provision-entra-id-app/configure-delegated-click-add-permissions.png":::

## Grant a service principal access to the database

Once your application registration is created, you need to grant the corresponding service principal access to your database. The following example gives viewer access. For other roles, see [Manage database permissions](/azure/data-explorer/manage-database-permissions).

1. Use the values of Application ID and Tenant ID as copied in the [step above](#set-up-authentication).
1. Execute the following command in your query editor, replacing the placeholder values *ApplicationID* and *TenantID* with your actual values:

    ```kusto
    .add database <DatabaseName> viewers ('aadapp=<ApplicationID>;<TenantID>') '<Notes>'
    ```

    For example:

    ```kusto
    .add database Logs viewers ('aadapp=1234abcd-e5f6-g7h8-i9j0-1234kl5678mn;9876abcd-e5f6-g7h8-i9j0-1234kl5678mn') 'App Registration'
    ```

    The last parameter is a string that shows up as notes when you query the roles associated with a database.

    > [!NOTE]
    > After creating the application registration, there might be a several minute delay until it can be referenced. If you receive an error that the application is not found, wait and try again.

For more information on roles, see [Role-based access control](/azure/data-explorer/kusto/access-control/role-based-access-control).

## Use application credentials to access a database

Use the application credentials to programmatically access your database by using the [client library](/azure/data-explorer/kusto/api/netfx/about-kusto-data).

```C#
. . .
string applicationClientId = "<myClientID>";
string applicationKey = "<myApplicationKey>";
string authority = "<myApplicationTenantID>";
. . .
var kcsb = new KustoConnectionStringBuilder($"https://{clusterName}.kusto.windows.net/{databaseName}")
    .WithAadApplicationKeyAuthentication(
        applicationClientId,
        applicationKey,
        authority);
var client = KustoClientFactory.CreateCslQueryProvider(kcsb);
var queryResult = client.ExecuteQuery($"{query}");
```

   > [!NOTE]
   > Specify the application id and key of the application registration (service principal) created earlier.

For more information, see [How to authenticate with Microsoft Authentication Library (MSAL) in apps](/azure/data-explorer/kusto/api/rest/authenticate-with-msal) and [use Azure Key Vault with .NET Core web app](/azure/key-vault/tutorial-net-create-vault-azure-web-app#create-a-net-core-web-app).

## Troubleshooting

### Invalid resource error

If your application is used to authenticate users, or applications for access, you must set up delegated permissions for the service application. Declare your application can authenticate users or applications for access. Not doing so will result in an error similar to the following, when an authentication attempt is made:

`AADSTS650057: Invalid resource. The client has requested access to a resource which is not listed in the requested permissions in the client's application registration...`

You'll need to follow the instructions to [configure delegated permissions for the application](#configure-delegated-permissions-for-the-application---optional).

### Enable user consent error

Your Microsoft Entra tenant administrator might enact a policy that prevents tenant users from giving consent to applications. This situation will result in an error similar to the following, when a user tries to sign in to your application:

`AADSTS65001: The user or administrator has not consented to use the application with ID '<App ID>' named 'App Name'`

You'll need to contact your Microsoft Entra administrator to grant consent for all users in the tenant, or enable user consent for your specific application.

## Related content

* [Kusto connection strings](/azure/data-explorer/kusto/api/connection-strings/kusto)
* [Create a Microsoft Entra application and service principal that can access resources](/entra/identity-platform/howto-create-service-principal-portal)
