---
title: Configure customer-managed-keys using C#
description: 'This article describes how to configure customer-managed keys to encrypt Azure Data Explorer data using C#.'
ms.reviewer: itsagui
ms.topic: how-to
ms.date: 01/06/2020
---

# Configure customer-managed-keys using C#

> [!div class="op_single_selector"]
> * [Portal](customer-managed-keys-portal.md)
> * [C#](customer-managed-keys-csharp.md)
> * [Azure Resource Manager template](customer-managed-keys-resource-manager.md)
> * [CLI](customer-managed-keys-cli.md)
> * [PowerShell](customer-managed-keys-powershell.md)

[!INCLUDE [data-explorer-configure-customer-managed-keys](includes/data-explorer-configure-customer-managed-keys.md)]

[!INCLUDE [data-explorer-configure-customer-managed-keys part 2](includes/data-explorer-configure-customer-managed-keys-b.md)]

## Configure encryption with customer-managed keys

This section shows you how to configure customer-managed keys encryption using the Azure Data Explorer C# client. 

### Prerequisites

* [Visual Studio 2022 Community Edition](https://www.visualstudio.com/downloads/). Turn on **Azure development** during the Visual Studio setup.
* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-portal.md).

### Install C# NuGet packages

* Install the [Azure Data Explorer (Kusto) NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).
* Install the [MSAL NuGet package](https://www.nuget.org/packages/Microsoft.Identity.Client/) for authentication with Azure Active Directory (Azure AD).

### Authentication

To run the examples in this article, [create an Azure AD application](/azure/active-directory/develop/howto-create-service-principal-portal) and service principal that can access resources. You can add role assignment at the subscription scope and get the required `Azure AD Directory (tenant) ID`, `Application ID`, and `Application Secret`.

The following code snippet demonstrates how to use the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to acquire an Azure AD application token to access your cluster. For the flow to succeed, the application must be registered with Azure AD and you must have the credentials for application authentication, such as an Azure AD-issued application key or an Azure AD-registered X.509v2 certificate.

### Configure cluster

By default, Azure Data Explorer encryption uses Microsoft-managed keys. Configure your Azure Data Explorer cluster to use customer-managed keys and specify the key to associate with the cluster.

1. Update your cluster by using the following code:

    ```csharp
    var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";    // Azure AD Directory (tenant) ID
    var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";    // Application ID
    var clientSecret = "PlaceholderClientSecret";           // Application secret
    var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
    
    // Create a confidential authentication client for Azure AD:
    var authClient = ConfidentialClientApplicationBuilder.Create(clientId)
            .WithAuthority($"https://login.microsoftonline.com/{tenantId}")
            .WithClientSecret(clientSecret)                 // can be replaced by .WithCertificate to authenticate with an X.509 certificate
            .Build();

    // Define scopes for accessing Azure management plane
    string[] scopes = new string[] { "https://management.core.windows.net/.default" };

    // Acquire application token
    AuthenticationResult result = authClient.AcquireTokenForClient(scopes).ExecuteAsync().Result;

    var credentials = new TokenCredentials(result.AccessToken, result.TokenType);
    var kustoManagementClient = new KustoManagementClient(credentials)
    {
        SubscriptionId = subscriptionId
    };

    var resourceGroupName = "testrg";
    var clusterName = "mykustocluster";
    var keyName = "myKey";
    var keyVersion = "5b52b20e8d8a42e6bd7527211ae32654"; // Optional, leave as NULL for the latest version of the key.
    var keyVaultUri = "https://mykeyvault.vault.azure.net/";
    var keyVaultIdentity = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourcegroups/identityResourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identityName"; // Use NULL if you want to use system assigned identity.
    var keyVaultProperties = new KeyVaultProperties(keyName, keyVaultUri, keyVersion, keyVaultIdentity);
    var clusterUpdate = new ClusterUpdate(keyVaultProperties: keyVaultProperties);
    await kustoManagementClient.Clusters.UpdateAsync(resourceGroupName, clusterName, clusterUpdate);
    ```

1. Run the following command to check if your cluster was successfully updated:

    ```csharp
    kustoManagementClient.Clusters.Get(resourceGroupName, clusterName);
    ```

    If the result contains `ProvisioningState` with the `Succeeded` value, then your cluster was successfully updated.

## Update the key version

When you create a new version of a key, you'll need to update the cluster to use the new version. First, call `Get-AzKeyVaultKey` to get the latest version of the key. Then update the cluster's key vault properties to use the new version of the key, as shown in [Configure cluster](#configure-cluster).

## Next steps

* [Secure Azure Data Explorer clusters in Azure](security.md)
* [Configure managed identities for your Azure Data Explorer cluster](./configure-managed-identities-cluster.md)
* [Secure your cluster using Disk Encryption in Azure Data Explorer - Azure portal](./cluster-encryption-disk.md) by enabling encryption at rest.
* [Configure customer-managed-keys using the Azure Resource Manager template](customer-managed-keys-resource-manager.md)
