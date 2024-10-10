---
title: Authentication methods for Kusto client libraries
description: Learn about the different authentication methods that can be used in apps using Kusto client libraries.
ms.reviewer: yogilad
ms.topic: how-to
ms.date: 09/25/2024
monikerRange: "azure-data-explorer"
#customer intent: To learn about the different authentication methods that can be used in apps.
---
# App authentication methods

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

This documentation provides an overview of the primary methods of authentication methods available for the Kusto client libraries. The provided code snippets demonstrate different approaches to authenticate users and apps, enabling seamless interaction with Kusto clusters. Each method is suitable for different scenarios and requirements.

Where possible, we recommend using managed identities instead of username and password authentication or connection strings. Managed identities provide a more secure and streamlined approach to authentication.

<!-- TODO: Add table showing which authentication methods are supported by each language SDK. -->

In this article, you learn how to authenticate using:

> [!div class="checklist"]
>
> **Application Principal**
>
> - [Managed Identity authentication](#managed-identity-authentication)
> - [Certificate-Based Authentication](#certificate-based-authentication)
> - [Application key authentication](#application-key-authentication)
>
> **User Principal**
>
> - [Interactive user sign-in authentication](#interactive-user-sign-in-authentication)
> - [Azure Command-Line Interface (CLI) authentication](#azure-command-line-interface-cli-authentication)
> - [Device code authentication](#device-code-authentication)
>
> **Custom Token Provider**
>
> - [Custom token provider for federated Managed Identity credential authentication](#custom-token-provider-for-federated-managed-identity-credential-authentication)
> - [Using Azure TokenCredential authentication](#using-azure-tokencredential-authentication)

## Prerequisites

- [Set up your development environment](app-set-up.md) to use the Kusto client library.

## Application Principal authentication methods

This section covers the different methods of authenticating using an application principal.

### Managed Identity authentication

There are two types of managed identities: system-assigned and user-assigned. System-assigned managed identities have their lifecycle tied to the resource that created them. This identity is restricted to only one resource. User-assigned managed identities can be used on multiple resources. For more information, see [Managed Identities](/entra/identity/managed-identities-azure-resources/overview).

| In the following examples, replace *`<QueryEndpointUri>`* and *`<ManagedIdentityId>`* with your own values.

- For authentication using a system-assigned managed identity:

    #### [C\#](#tab/csharp)

    ```csharp
    var kcsb = new KustoConnectionStringBuilder("<QueryEndpointUri>")
        .WithAadSystemManagedIdentity();
    ```

    #### [Python](#tab/python)

    ```python
    kcsb = KustoConnectionStringBuilder.with_aad_managed_service_identity_authentication("<QueryEndpointUri>")
    ```

    #### [Typescript](#tab/typescript)

    ```typescript
    const kcsb = KustoConnectionStringBuilder.withSystemManagedIdentity("<QueryEndpointUri>");
    ```

    #### [Java](#tab/java)

    ```java
    KustoConnectionStringBuilder kcsb = KustoConnectionStringBuilder.createWithAadManagedIdentity("<QueryEndpointUri>");
    ```

    ---

- For authentication using a user-assigned managed identity, the identity client ID is required, as follows:

    #### [C\#](#tab/csharp)

    ```csharp
    var kcsb = new KustoConnectionStringBuilder("<QueryEndpointUri>")
        .WithAadUserManagedIdentity("<ManagedIdentityId>");
    ```

    #### [Python](#tab/python)

    ```python
    kcsb = KustoConnectionStringBuilder.with_aad_managed_service_identity_authentication("<QueryEndpointUri>", "<ManagedIdentityId>")
    ```

    #### [Typescript](#tab/typescript)

    ```typescript
    const kcsb = KustoConnectionStringBuilder.withUserManagedIdentity("<QueryEndpointUri>", "<ManagedIdentityId>");
    ```

    #### [Java](#tab/java)

    ```java
    KustoConnectionStringBuilder kcsb = KustoConnectionStringBuilder.createWithAadManagedIdentity("<QueryEndpointUri>", "<ManagedIdentityId>");
    ```

    ---

> [!IMPORTANT]
>
> - The object, or principal, ID of the Managed Identity resource must be assigned a role to access the Kusto cluster. You can do this in the Azure portal in your Kusto cluster resource page under **Security + networking** > **Permissions**. Managed Identity should not be attached directly to the Kusto cluster.
> - Managed Identity authentication is not supported in local development environments. To test Managed Identity authentication, deploy the application to Azure or use a different authentication method when working locally.

### Certificate-Based Authentication

Certificates can serve as secrets to authenticate the application's identity when requesting a token. There are several methods to load the certificate, such as loading it from disk or the machine's credentials store.

| In the following examples, replace *`<QueryEndpointUri>`*, *`<ApplicationId>`*, *`<CertificateSubjectName>`*, *`<CertificateIssuerName>`*, *`<AuthorityId>`*, *`<PemCertificate>`* and *`<CertificateObject>`* with your own values.

- For authentication using a certificate from the local store:

    #### [C\#](#tab/csharp)

    ```csharp
    var kcsb = new KustoConnectionStringBuilder("<QueryEndpointUri>").
        WithAadApplicationSubjectAndIssuerAuthentication("<ApplicationId>", "<CertificateSubjectName>", "<CertificateIssuerName>", "<AuthorityId>");
    ```

    #### [Python](#tab/python)

    ```python
    kcsb = KustoConnectionStringBuilder.with_aad_application_certificate_authentication(
      "<QueryEndpointUri>", "<ApplicationId>", "<CertificateSubjectName>", "<CertificateIssuerName>", "<AuthorityId>"
    )
    ```

    #### [Typescript](#tab/typescript)

    ```typescript
    const kcsb = KustoConnectionStringBuilder.withAadApplicationCertificateAuthentication(
      "<QueryEndpointUri>", "<ApplicationId>", "<CertificateSubjectName>", "<CertificateIssuerName>", "<AuthorityId>"
    );
    ```

    #### [Java](#tab/java)

    ```java
    KustoConnectionStringBuilder kcsb = KustoConnectionStringBuilder.createWithAadApplicationSubjectAndIssuerAuthentication(
      "<QueryEndpointUri>", "<ApplicationId>", "<CertificateSubjectName>", "<CertificateIssuerName>", "<AuthorityId>"
    );
    ```

    ---

- For authentication using a certificate in a connection string. If the connection string loads a local certificate, set `PreventAccessToLocalSecretsViaKeywords` to `false`:

    ```csharp
    var connectionString = 
        "Data Source=<QueryEndpointUri>;Initial Catalog=NetDefaultDB;Application Client Id=<ApplicationId>;Application Certificate Subject=<CertificateSubjectName>;Application Certificate Issuer=<CertificateIssuerName>;Authority Id=<AuthorityId>";
    var kcsb = new KustoConnectionStringBuilder() {
        PreventAccessToLocalSecretsViaKeywords = false,
        ConnectionString = connectionString
    };
    ```

    For more information, see [Kusto connection strings](../connection-strings/kusto.md).

- For authentication using a certificate from an arbitrary source, such as a file on disk, cache, or secure store like Azure Key Vault, the certificate object must contain a private key:

    #### [C\#](#tab/csharp)

    ```csharp
    X509Certificate2 certificate = <CertificateObject>;
    var kcsb = new KustoConnectionStringBuilder("<QueryEndpointUri>").
        WithAadApplicationCertificateAuthentication("<ApplicationId>", certificate, "<AuthorityId>");
    ```

    #### [Python](#tab/python)

    #### [Typescript](#tab/typescript)

    ```typescript
    const pemCertificate: string = await fs.promises.readFile(privateKeyPemFilePath, "utf8");
    const kcsb = KustoConnectionStringBuilder.withAadApplicationCertificateAuthentication(
      "<QueryEndpointUri>", "<ApplicationId>", "<PemCertificate>", "<AuthorityId>"
    );
    ```

    #### [Java](#tab/java)

    ---

> [!IMPORTANT]
>
> - To load certificates from Azure Key Vault, you can use the *Azure.Security.KeyVault.Certificates* [client](https://www.nuget.org/packages/Azure.Security.KeyVault.Certificates/).
> - When using subject name and issuer, the certificate must be installed in the local machine's certificate store.

### Application key authentication

Application key, also known as an application password, is a secret string that an application uses to authenticate and prove its identity when requesting a token. It serves as a form of credential for the application to access protected resources. The application key is typically generated and assigned by the identity provider or authorization server. It's important to securely manage and protect the application key to prevent unauthorized access to sensitive information or actions.

| In the following examples, replace *`<QueryEndpointUri>`*, *`<ApplicationId>`*, *`<ApplicationKey>`*, and *`<AuthorityId>`* with your own values.

- For authentication using an application key:

    ```csharp
    var kcsb = new KustoConnectionStringBuilder("<QueryEndpointUri>").
        WithAadApplicationKeyAuthentication("<ApplicationId>", "<ApplicationKey>", "<AuthorityId>");
    ```

- For authentication using an application key in a connection string:

    ```csharp
    var connectionString = 
        "Data Source=<QueryEndpointUri>;Initial Catalog=NetDefaultDB;AAD Federated Security=True;AppClientId=<ApplicationId>;AppKey=<ApplicationKey>;Authority Id=<AuthorityId>";
    var kcsb = new KustoConnectionStringBuilder(connectionString);
    ```

> [!IMPORTANT]
> Hard-coding secrets in your code is considered a bad practice. Storing sensitive information, such as authentication credentials, in plain text can lead to security vulnerabilities. We recommended that you keep sensitive information encrypted or store them securely in a key vault. By using encryption or a key vault, you can ensure that your secrets are protected and only accessible to authorized users or applications.

## User Principal authentication methods

This section covers the different methods of authenticating using a user principal.

### Interactive user sign-in authentication

This authentication method uses the user's credentials to establish a secure connection with Kusto. The method opens a web browser where the user is prompted to enter their username and password to complete the authentication process.

| In the following examples, replace *`<QueryEndpointUri>`* and *`<AuthorityId>`* with your own values.

- For authentication using interactive user sign-in:

    ```csharp
    var kcsb = new KustoConnectionStringBuilder("<QueryEndpointUri>").
        WithAadUserPromptAuthentication();
    ```

- For authentication using interactive user sign-in in a connection string:

    ```csharp
    var connectionString =
        "Data Source=<QueryEndpointUri>;Initial Catalog=NetDefaultDB;AAD Federated Security=True;Authority Id=<AuthorityId>"
    var kcsb = new KustoConnectionStringBuilder(connectionString);
    ```

### Azure Command-Line Interface (CLI) authentication

This authentication method uses the Azure Command-Line Interface (CLI) to authenticate and obtain a token for the user. By running the `az login` command, the user can securely establish a connection and retrieve the necessary token for authentication purposes. The user might be prompted to sign-in if the token isn't available in the Azure CLI cache and the `interactive` parameter is set to `true`. For more information, see [Azure Command-Line Interface (CLI)](/cli/azure/).

| In the following example, replace *`<QueryEndpointUri>`*  with your own value.

```csharp
var kcsb = new KustoConnectionStringBuilder("<QueryEndpointUri>")
    .WithAadAzCliAuthentication(interactive: true);
```

> [!IMPORTANT]
> This method is only supported for .NET Framework apps.

### Device code authentication

This method is designed for devices lacking a proper user interface for sign-in, such as IoT devices and server terminals. It provides the user with a code and a URL to authenticate using a different device, such as a smartphone. This interactive method requires the user to sign in through a browser.

| In the following example, replace *`<QueryEndpointUri>`*  with your own value.

```csharp
var kcsb = new KustoConnectionStringBuilder("<QueryEndpointUri>")
    .WithAadDeviceCodeAuthentication((msg, uri, code) =>
    {
        // The callback is used to display instructions to the user on how to authenticate using the device code
        Console.WriteLine("Device Code Message: {0}", msg);
        Console.WriteLine("Device Code Uri: {0}", uri);
        Console.WriteLine("Device Code: {0}", code);

        return Task.CompletedTask;
    });
```

> [!IMPORTANT]
> Device code authentication may be blocked by tenant Conditional Access Policies.
> If this occurs, select an alternative authentication method.

## Custom token provider authentication methods

This section covers the different methods of authenticating using a custom token provider.

### Custom token provider for federated Managed Identity credential authentication

Custom token providers can be used to acquire a Microsoft Entra ID token for authentication. The following example demonstrates how to use a custom token provider to obtain a token using federated managed identity. You can modify the code to fit your application's requirements.

| In the following example, replace *`<ApplicationTenantId>`*, *`<ApplicationId>`*, *`<ManagedIdentityClientId>`*, and *`<QueryEndpointUri>`*  with your own values.

```csharp
public class TokenProvider
{
  private ClientAssertionCredential m_clientAssertion;
  private TokenRequestContext m_tokenRequestContext;

  public TokenProvider(string queryEndpointUri)
  {
    var resourceId = null;

    try
    {
      // Get the appropiate resource id by querying the metadata
      var httpClient = new HttpClient();
      var response = httpClient.GetByteArrayAsync($"{queryEndpointUri}/v1/rest/auth/metadata").Result;
      var json = JObject.Parse(Encoding.UTF8.GetString(response));
      var resourceId = json["AzureAD"]?["KustoServiceResourceId"]?.ToString();
      // Append scope to resource id
      resourceId = !string.IsNullOrWhiteSpace(resourceId) ? $"{resourceId}/.default" : null;
    }
    catch { /* Handle exception */}

    m_tokenRequestContext = new TokenRequestContext(new string[] { resourceId ?? "https://kusto.kusto.windows.net/.default" });

    // Create client assertion credential to authenticate with Kusto
    m_clientAssertion = new ClientAssertionCredential
    (
      "<ApplicationTenantId>",
      "<ApplicationId>",
      async (token) =>
      {
        // Get Managed Identity token
        var miCredential = new ManagedIdentityCredential("<ManagedIdentityClientId>");
        var miToken = await miCredential.GetTokenAsync(new TokenRequestContext(new[] {
          "api://AzureADTokenExchange/.default" 
        })).ConfigureAwait(false);
        return miToken.Token;
      }
    );
  }

  public async Task<string> GetTokenAsync()
  {
    var accessToken = await m_clientAssertion.GetTokenAsync(m_tokenRequestContext).ConfigureAwait(false);
    return accessToken.Token;
  }
}

var tokenProvider = new TokenProvider("<QueryEndpointUri>");

var kcsb = new KustoConnectionStringBuilder("<QueryEndpointUri>")
  .WithAadTokenProviderAuthentication(
    async () =>
    {
      return await tokenProvider.GetTokenAsync();
    });
```

### Using Azure TokenCredential authentication

Create a custom token provider by creating a class that inherits from `TokenCredential` and implements the `GetToken` method. Alternatively, you can use an existing token provider like `DefaultAzureCredential`. This method provides flexibility for different authentication scenarios when a custom token provider is required.

You can use `DefaultAzureCredential` for supporting production code that uses Managed Identity authentication, or  testing code using Visual Studio or Azure CLI. `DefaultAzureCredential` can be configured to use different authentication methods.

| In the following example, replace *`<QueryEndpointUri>`* and *`<ManagedIdentityClientId>`*  with your own values.

```csharp
var credentialProvider = new DefaultAzureCredential(new DefaultAzureCredentialOptions {
  ManagedIdentityClientId = "<ManagedIdentityClientId>"
 });
var kcsb = new KustoConnectionStringBuilder("<QueryEndpointUri>")
    .WithAadAzureTokenCredentialsAuthentication(credentialProvider);
```

> [!NOTE]
> `DefaultAzureCredential` is used to authenticate with Azure services.
> It attempts multiple authentication methods to obtain a token and can be configured to work with Managed Identity, Visual Studio, Azure CLI, and more.
> This credential is suitable for both testing and production environments as it can be set up to use different authentication methods.
> For more information, see [DefaultAzureCredential Class](/dotnet/api/azure.identity.defaultazurecredential).

## Next step

<!-- Advance to the next article to learn how to create... -->
<!-- > [!div class="nextstepaction"]
> [TBD](../../kql-quick-reference.md) -->

> [!div class="nextstepaction"]
> [KQL quick reference](../../query/kql-quick-reference.md)