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

| In the following examples, replace *`<QueryEndpointUri>`* and *`<ManagedIdentityClientId>`* with your own values.

- System-assigned managed identity:

    #### [C\#](#tab/csharp)

    ```csharp
    var kcsb = new KustoConnectionStringBuilder(<QueryEndpointUri>)
      .WithAadSystemManagedIdentity();
    ```

    #### [Python](#tab/python)

    ```python
    kcsb = KustoConnectionStringBuilder
      .with_aad_managed_service_identity_authentication(<QueryEndpointUri>)
    ```

    #### [TypeScript](#tab/typescript)

    ```typescript
    const kcsb = KustoConnectionStringBuilder
      .withSystemManagedIdentity(<QueryEndpointUri>);
    ```

    #### [Java](#tab/java)

    ```java
    KustoConnectionStringBuilder kcsb = KustoConnectionStringBuilder
      .createWithAadManagedIdentity(<QueryEndpointUri>);
    ```

    ---

- User-assigned managed identity. Use the identity client ID or object ID, as follows:

    #### [C\#](#tab/csharp)

    ```csharp
    var kcsb = new KustoConnectionStringBuilder(<QueryEndpointUri>)
      .WithAadUserManagedIdentity(<ManagedIdentityClientId>);
    ```

    #### [Python](#tab/python)

    ```python
    kcsb = KustoConnectionStringBuilder
      .with_aad_managed_service_identity_authentication(<QueryEndpointUri>, client_id=<ManagedIdentityClientId>)
    ```

    > [!NOTE]
    > To use an object ID instead of a client ID, use the `object_id` parameter.

    #### [TypeScript](#tab/typescript)

    ```typescript
    const kcsb = KustoConnectionStringBuilder
      .withUserManagedIdentity(<QueryEndpointUri>, <ManagedIdentityClientId>);
    ```

    #### [Java](#tab/java)

    ```java
    KustoConnectionStringBuilder kcsb = KustoConnectionStringBuilder
      .createWithAadManagedIdentity(<QueryEndpointUri>, <ManagedIdentityClientId>);
    ```

    ---

> [!IMPORTANT]
>
> - The object, or principal, ID of the Managed Identity resource must be assigned a role to access the Kusto cluster. You can do this in the Azure portal in your Kusto cluster resource page under **Security + networking** > **Permissions**. Managed Identity should not be attached directly to the Kusto cluster.
> - Managed Identity authentication is not supported in local development environments. To test Managed Identity authentication, deploy the application to Azure or use a different authentication method when working locally.

### Certificate-based authentication

Certificates can serve as secrets to authenticate an application's identity when requesting a token. There are several methods to load the certificate, such as loading it from the machine's local credentials store or from disk.

| In the following examples, replace *`<QueryEndpointUri>`*, *`<ApplicationId>`*, *`<CertificateSubjectName>`*, *`<CertificateIssuerName>`*, *`<CertificateThumbprint>`*, *`<CertificateObject>`*, *`<AuthorityId>`*, *`<PemPublicCertificate>`*, *`<PemPrivateKey>`*, *`<privateKeyPemFilePath>`*, *`<PemCertificatePath>`*, and *`<EnableSubjectAndIssuerAuth>`* with your own values.

- Certificate from the machine's local credentials store is only support using C#:

    ```csharp
    var kcsb = new KustoConnectionStringBuilder(<QueryEndpointUri>)
      .WithAadApplicationSubjectAndIssuerAuthentication(<ApplicationId>, <CertificateSubjectName>, <CertificateIssuerName>, <AuthorityId>);
    ```

- Certificate in a connection string. If the connection string loads a local certificate, set `PreventAccessToLocalSecretsViaKeywords` to `false`:

    #### [C\#](#tab/csharp)

    ```csharp
    var connectionString =
      "Data Source=<QueryEndpointUri>;Initial Catalog=NetDefaultDB;Application Client Id=<ApplicationId>;Application Certificate Subject=<CertificateSubjectName>;Application Certificate Issuer=<CertificateIssuerName>;Authority Id=<AuthorityId>;
    var kcsb = new KustoConnectionStringBuilder() {ConnectionString = connectionString};
    ```

    #### [Python](#tab/python)

    - Certificate loaded in memory:

        ```python
        kcsb = KustoConnectionStringBuilder
          .with_aad_application_certificate_authentication(<QueryEndpointUri>, <ApplicationId>, <PemPrivateKey>, <CertificateThumbprint>, <AuthorityId>)
        ```

    - Subject and Issuer (SNI) authentication:

        ```python
        kcsb = KustoConnectionStringBuilder
         .with_aad_application_certificate_sni_authentication(<QueryEndpointUri>, <ApplicationId>, <PemPrivateKey>, <PemPublicCertificate>, <CertificateThumbprint>, <AuthorityId>)
        ```

    #### [TypeScript](#tab/typescript)

    - Certificate loaded in memory:

        ```typescript
        const kcsb = KustoConnectionStringBuilder
          .withAadApplicationCertificateAuthentication(<QueryEndpointUri>, <ApplicationId>, <PemPublicCertificate>, <AuthorityId>);
        ```

    - Certificate loaded from a file:

        ```typescript
        const kcsb = KustoConnectionStringBuilder
          .withAadApplicationCertificateAuthentication(<QueryEndpointUri>, <ApplicationId>, undefined, <AuthorityId>, <EnableSubjectAndIssuerAuth>, <PemCertificatePath>);
        ```

    #### [Java](#tab/java)

    - Certificate loaded in memory:

        ```java
        const kcsb = KustoConnectionStringBuilder
          .createWithAadApplicationCertificate(<QueryEndpointUri>, <ApplicationId>, <X509Certificate>, <PrivateKey>, <AuthorityId>);
        ```

    - Subject and Issuer (SNI) authentication:

        ```typescript
        const kcsb = KustoConnectionStringBuilder
          .createWithAadApplicationCertificateSubjectNameIssuer(<QueryEndpointUri>, <ApplicationId>, <PublicCertificateChain>, <PrivateKey>, <AuthorityId>
        ```

    ---

    For more information, see [Kusto connection strings](../connection-strings/kusto.md).

- Certificate from an arbitrary source, such as a file on disk, cache, or secure store like Azure Key Vault. The certificate object must contain a private key:

    #### [C\#](#tab/csharp)

    ```csharp
    X509Certificate2 certificate = <CertificateObject>;
    var kcsb = new KustoConnectionStringBuilder(<QueryEndpointUri>)
      .WithAadApplicationCertificateAuthentication(<ApplicationId>, certificate, <AuthorityId>);
    ```

    #### [Python](#tab/python)

    #### [TypeScript](#tab/typescript)

    ```typescript
    const certificate: string = await fs.promises.readFile(<privateKeyPemFilePath>, "utf8");
    const kcsb = KustoConnectionStringBuilder
      .withAadApplicationCertificateAuthentication(<QueryEndpointUri>, <ApplicationId>, certificate, <AuthorityId>);
    ```

    #### [Java](#tab/java)

    ---

> [!IMPORTANT]
>
> - To load certificates from Azure Key Vault, you can use the *Azure.Security.KeyVault.Certificates* [client](https://www.nuget.org/packages/Azure.Security.KeyVault.Certificates/).
> - When using subject name and issuer, the certificate must be installed in the local machine's certificate store.

### Application key authentication

Application key, also known as an application password, is a secret string that an application uses to authenticate and prove its identity when requesting a token. It serves as a form of credential for the application to access protected resources. The application key is typically generated and assigned by the identity provider or authorization server. It's important to securely manage and protect the application key to prevent unauthorized access to sensitive information or actions.

| In the following examples, replace *`<QueryEndpointUri>`*, *`<ApplicationId>`*, *`<ApplicationKey>`*, *`<AuthorityId>`*, and *`<AuthorityId>`* with your own values.

- Application key:

    #### [C\#](#tab/csharp)

    ```csharp
    var kcsb = new KustoConnectionStringBuilder(<QueryEndpointUri>)
      .WithAadApplicationKeyAuthentication(<ApplicationId>, <ApplicationKey>, <AuthorityId>);
    ```

    #### [Python](#tab/python)

    ```python
    kcsb = KustoConnectionStringBuilder
      .with_aad_application_key_authentication(<QueryEndpointUri>, <ApplicationId>, <ApplicationKey>, <AuthorityId>)
    ```

    #### [TypeScript](#tab/typescript)

    ```typescript
    const kcsb = KustoConnectionStringBuilder
      .withAadApplicationKeyAuthentication(<QueryEndpointUri>, <ApplicationId>, <ApplicationKey>, <AuthorityId>);
    ```

    #### [Java](#tab/java)

    ```java
    KustoConnectionStringBuilder kcsb = KustoConnectionStringBuilder
      .createWithAadApplicationCredentials(<QueryEndpointUri>, <ApplicationId>, <ApplicationKey>, <AuthorityId>);
    ```

    ---

- Connection string with application key:

    #### [C\#](#tab/csharp)

    ```csharp
    var connectionString =
      "Data Source=<QueryEndpointUri>;Initial Catalog=NetDefaultDB;AAD Federated Security=True;AppClientId=<ApplicationId>;AppKey=<ApplicationKey>;Authority Id=<AuthorityId>;
    var kcsb = new KustoConnectionStringBuilder(connectionString);
    ```

    #### [Python](#tab/python)

    ```python
    Not supported
    ```

    #### [TypeScript](#tab/typescript)

    ```typescript
    Not supported
    ```

    #### [Java](#tab/java)

    ```java
    Not supported
    ```

    ---

> [!IMPORTANT]
> Hard-coding secrets in your code is considered a bad practice. Storing sensitive information, such as authentication credentials, in plain text can lead to security vulnerabilities. We recommended that you keep sensitive information encrypted or store them securely in a key vault. By using encryption or a key vault, you can ensure that your secrets are protected and only accessible to authorized users or applications.

## User Principal authentication methods

This section covers the different methods of authenticating using a user principal.

### Interactive user sign-in authentication

This authentication method uses the user's credentials to establish a secure connection with Kusto. The method opens a web browser where the user is prompted to enter their username and password to complete the authentication process.

| In the following examples, replace *`<QueryEndpointUri>`* ,*`<AuthorityId>`*, and *`<AuthorityId>`* with your own values.

- Interactive user sign-in:

    #### [C\#](#tab/csharp)

    ```csharp
    var kcsb = new KustoConnectionStringBuilder(<QueryEndpointUri>)
      .WithAadUserPromptAuthentication();
    ```

    #### [Python](#tab/python)

    ```python
    kcsb = KustoConnectionStringBuilder
      .with_interactive_login(<QueryEndpointUri>)
    ```

    #### [TypeScript](#tab/typescript)

    ```typescript
    const kcsb = KustoConnectionStringBuilder
      .createWithUserPrompt(<QueryEndpointUri>, {tenantId: <AuthorityId>});
    ```

    #### [Java](#tab/java)

    ```java
    KustoConnectionStringBuilder kcsb = KustoConnectionStringBuilder
      .createWithAadApplicationCredentials(<QueryEndpointUri>, <AuthorityId>);
    ```

    ---

- For authentication using interactive user sign-in in a connection string:

    #### [C\#](#tab/csharp)

    ```csharp
    var connectionString =
        "Data Source=<QueryEndpointUri>;Initial Catalog=NetDefaultDB;AAD Federated Security=True;Authority Id=<AuthorityId>
    var kcsb = new KustoConnectionStringBuilder(connectionString);
    ```

    #### [Python](#tab/python)

    ```python
    Not supported
    ```

    #### [TypeScript](#tab/typescript)

    ```typescript
    Not supported
    ```

    #### [Java](#tab/java)

    ```java
    Not supported
    ```

    ---

### Azure Command-Line Interface (CLI) authentication

This authentication method uses the Azure Command-Line Interface (CLI) to authenticate and obtain a token for the user. Running the `az login` command means the user can securely establish a connection and retrieve the necessary token for authentication purposes. The user might be prompted to sign in if the token isn't available in the Azure CLI cache and the `interactive` parameter is set to `true`. For more information, see [Azure Command-Line Interface (CLI)](/cli/azure/).

| In the following example, replace *`<QueryEndpointUri>`*  with your own value.

#### [C\#](#tab/csharp)

```csharp
var kcsb = new KustoConnectionStringBuilder(<QueryEndpointUri>)
  .WithAadAzCliAuthentication(interactive: true);
```

#### [Python](#tab/python)

```python
kcsb = KustoConnectionStringBuilder
  .with_az_cli_authentication(<QueryEndpointUri>)
```

#### [TypeScript](#tab/typescript)

```typescript
const kcsb = KustoConnectionStringBuilder
  .withAzLoginIdentity(<QueryEndpointUri>);
```

#### [Java](#tab/java)

```java
KustoConnectionStringBuilder kcsb = KustoConnectionStringBuilder
  .createWithAzureCli(<QueryEndpointUri>);
```

---

> [!IMPORTANT]
> This method is only supported for .NET Framework apps.

### Device code authentication

This method is designed for devices lacking a proper user interface for sign-in, such as IoT devices and server terminals. It provides the user with a code and a URL to authenticate using a different device, such as a smartphone. This interactive method requires the user to sign in through a browser.

| In the following example, replace *`<QueryEndpointUri>`*  with your own value.

#### [C\#](#tab/csharp)

```csharp
var kcsb = new KustoConnectionStringBuilder(<QueryEndpointUri>)
  .WithAadDeviceCodeAuthentication((msg, uri, code) =>
  {
    // The callback is used to display instructions to the user on how to authenticate using the device code
    Console.WriteLine("Device Code Message: {0}", msg);
    Console.WriteLine("Device Code Uri: {0}", uri);
    Console.WriteLine("Device Code: {0}", code);

    return Task.CompletedTask;
  });
```

#### [Python](#tab/python)

```python
kcsb = KustoConnectionStringBuilder
  .with_aad_device_authentication(<QueryEndpointUri>)
```

#### [TypeScript](#tab/typescript)

```typescript
const kcsb = KustoConnectionStringBuilder
  .withAadDeviceAuthentication(<QueryEndpointUri>);
```

#### [Java](#tab/java)

```java
KustoConnectionStringBuilder kcsb = KustoConnectionStringBuilder
  .createWithDeviceCode(<QueryEndpointUri>);
```

---

> [!IMPORTANT]
> Device code authentication may be blocked by tenant Conditional Access Policies.
> If this occurs, select an alternative authentication method.

## Custom token provider authentication methods

This section covers the different methods of authenticating using a custom token provider.

### Custom token provider for federated Managed Identity credential authentication

Custom token providers can be used to acquire a Microsoft Entra ID token for authentication. The following example demonstrates how to use a custom token provider to obtain a token using federated managed identity. You can modify the code to fit your application's requirements.

| In the following example, replace *`<AuthorityIdId>`*, *`<ApplicationId>`*, *`<ManagedIdentityClientId>`*, and *`<QueryEndpointUri>`*  with your own values.

#### [C\#](#tab/csharp)

```csharp
public class TokenProvider
{
  private ClientAssertionCredential m_clientAssertion;
  private TokenRequestContext m_tokenRequestContext;

  public TokenProvider(string queryEndpointUri)
  {
    string resourceId = null;

    try
    {
      // Get the appropiate resource id by querying the metadata
      var httpClient = new HttpClient();
      var response = httpClient.GetByteArrayAsync($"{queryEndpointUri}/v1/rest/auth/metadata").Result;
      var json = JObject.Parse(Encoding.UTF8.GetString(response));
      resourceId = json["AzureAD"]?["KustoServiceResourceId"]?.ToString();
      // Append scope to resource id
      resourceId = !string.IsNullOrWhiteSpace(resourceId) ? $"{resourceId}/.default" : null;
    }
    catch { /* Handle exception */}

    m_tokenRequestContext = new TokenRequestContext(new string[] { resourceId ?? "https://kusto.kusto.windows.net/.default" });

    // Create client assertion credential to authenticate with Kusto
    m_clientAssertion = new ClientAssertionCredential
    (
      <AuthorityIdId>,
      <ApplicationId>,
      async (token) =>
      {
        // Get Managed Identity token
        var miCredential = new ManagedIdentityCredential(<ManagedIdentityClientId>);
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

var tokenProvider = new TokenProvider(<QueryEndpointUri>);

var kcsb = new KustoConnectionStringBuilder(<QueryEndpointUri>)
  .WithAadTokenProviderAuthentication(
    async () =>
    {
      return await tokenProvider.GetTokenAsync();
    });
```

#### [Python](#tab/python)

```python
import requests
from azure.identity import ClientAssertionCredential, ManagedIdentityCredential
from azure.kusto.data import KustoConnectionStringBuilder

class TokenProvider:
  def __init__(self, query_endpoint_uri):
    self.query_endpoint_uri = query_endpoint_uri
    self.resource_id = None
    self.token_request_context = None
    self.client_assertion = None
    self._initialize()

  def _initialize(self):
    try:
      # Get the appropriate resource id by querying the metadata
      response = requests.get(f"{self.query_endpoint_uri}/v1/rest/auth/metadata")
      json = response.json()
      self.resource_id = json.get("AzureAD", {}).get("KustoServiceResourceId", "https://kusto.kusto.windows.net")
      # Append scope to resource id
      self.resource_id = f"{self.resource_id}/.default"
    except Exception as error:
      print(f"Error fetching metadata: {error}")

    self.token_request_context = {"scopes": [self.resource_id or "https://kusto.kusto.windows.net/.default"]}

    # Create client assertion credential to authenticate with Kusto
    self.client_assertion = ClientAssertionCredential(
      tenant_id="<AuthorityId>"
      client_id="<ApplicationId>",
      func=self._get_managed_identity_token
    )

  async def _get_managed_identity_token(self):
    mi_credential = ManagedIdentityCredential()
    mi_token = await mi_credential.get_token("api://AzureADTokenExchange/.default")
    return mi_token.token

  async def get_token_async(self):
    access_token = await self.client_assertion.get_token(self.token_request_context)
    return access_token.token

def main():
  query_endpoint_uri = "<QueryEndpointUri>"
  token_provider = TokenProvider(query_endpoint_uri)
  kcsb = KustoConnectionStringBuilder.with_token_provider(
    query_endpoint_uri,
    token_provider.get_token_async
  )
```

#### [TypeScript](#tab/typescript)

```typescript
import { ManagedIdentityCredential, ClientAssertionCredential } from '@azure/identity';
import get from 'axios';
import { KustoConnectionStringBuilder } from 'azure-kusto-data';

class TokenProvider {
  constructor(queryEndpointUri) {
    this.queryEndpointUri = queryEndpointUri;
    this.resourceId = null;
    this.tokenRequestContext = null;
    this.clientAssertion = null;
  }

  async initialize() {
    try {
      // Get the appropriate resource id by querying the metadata
      const response = await get(`${this.queryEndpointUri}/v1/rest/auth/metadata`);
      const json = response.data;
      this.resourceId = json.AzureAD?.KustoServiceResourceId || 'https://kusto.kusto.windows.net';
      // Append scope to resource id
      this.resourceId = `${this.resourceId}/.default`;
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }

    this.tokenRequestContext = { scopes: [this.resourceId || 'https://kusto.kusto.windows.net/.default'] };

    // Create client assertion credential to authenticate with Kusto
    this.clientAssertion = new ClientAssertionCredential(
      '<AuthorityId>', // tenantId
      '<ApplicationId>', // clientId
      async () => {
        const miCredential = new ManagedIdentityCredential();
        const miToken = await miCredential.getToken({ scopes: ['api://AzureADTokenExchange/.default'] });
        return miToken.token;
      }
    );
  }

  async getTokenAsync() {
    const accessToken = await this.clientAssertion.getToken(this.tokenRequestContext);
    return accessToken.token;
  }
}

const tokenProvider = new TokenProvider("<QueryEndpointUri>");
await tokenProvider.initialize();

const kcsb = KustoConnectionStringBuilder.withAadTokenProviderAuthentication(
  "<QueryEndpointUri>",
  async () => {
    return await tokenProvider.getTokenAsync();
  }
);
```

#### [Java](#tab/java)

```java
public class TokenProvider {
  private TokenRequestContext tokenRequestContext;
  private ClientAssertionCredential clientAssertion;

  public TokenProvider(String queryEndpointUri) {
    String resourceId = "";
    try {
      // Get the appropriate resource id by querying the metadata
      URL url = new URL(queryEndpointUri + "/v1/rest/auth/metadata");
      HttpURLConnection conn = (HttpURLConnection) url.openConnection();
      conn.setRequestMethod("GET");
      conn.connect();

      Scanner scanner = new Scanner(url.openStream(), StandardCharsets.UTF_8);
      String jsonResponse = scanner.useDelimiter("\\A").next();
      scanner.close();

      ObjectMapper mapper = new ObjectMapper();
      JsonNode jsonNode = mapper.readTree(jsonResponse);
      resourceId = jsonNode.path("AzureAD").path("KustoServiceResourceId").asText("https://kusto.kusto.windows.net");
      // Append scope to resource id
      resourceId = resourceId + "/.default";
    } catch (IOException e) {
      System.err.println("Error fetching metadata: " + e.getMessage());
      resourceId = "https://kusto.kusto.windows.net/.default";
    }

    tokenRequestContext = new TokenRequestContext().addScopes(resourceId);

    // Create client assertion credential to authenticate with Kusto
    clientAssertion = new ClientAssertionCredential(
      "<AuthorityId>",
      "<ApplicationId>", // clientId
      () -> {
        ManagedIdentityCredential miCredential = new ManagedIdentityCredential();
        return miCredential.getToken(new TokenRequestContext().addScopes("api://AzureADTokenExchange/.default")).block().getToken();
      }
    );
  }

  public CompletableFuture<String> getTokenAsync() {
    return clientAssertion.getToken(tokenRequestContext).thenApply(token -> token.getToken());
  }   
}

TokenProvider tokenProvider = new TokenProvider("<QueryEndpointUri>");
ConnectionStringBuilder kcsb = ConnectionStringBuilder.createWithAadTokenProviderAuthentication(queryEndpointUri,tokenProvider::getTokenAsync);
```

---

### Using Azure TokenCredential authentication

Create a custom token provider by creating a class that inherits from `TokenCredential` and implements the `GetToken` method. Alternatively, you can use an existing token provider like `DefaultAzureCredential`. This method provides flexibility for different authentication scenarios when a custom token provider is required.

You can use `DefaultAzureCredential` for supporting production code that uses Managed Identity authentication, or  testing code using Visual Studio or Azure CLI. `DefaultAzureCredential` can be configured to use different authentication methods.

| In the following example, replace *`<QueryEndpointUri>`* and *`<ManagedIdentityClientId>`*  with your own values.

#### [C\#](#tab/csharp)

```csharp
var credentialProvider = new DefaultAzureCredential(new DefaultAzureCredentialOptions {
  ManagedIdentityClientId = <ManagedIdentityClientId>
 });
var kcsb = new KustoConnectionStringBuilder(<QueryEndpointUri>)
  .WithAadAzureTokenCredentialsAuthentication(credentialProvider);
```

#### [Python](#tab/python)

```python
from azure.identity import DefaultAzureCredential
token_credential = DefaultAzureCredential()
kcsb = KustoConnectionStringBuilder
  .with_azure_token_credential(<QueryEndpointUri>, token_credential)
```

#### [TypeScript](#tab/typescript)

```typescript
import { DefaultAzureCredential } from "@azure/identity";
const credential = new DefaultAzureCredential();
const kcsb = KustoConnectionStringBuilder
  .withTokenCredential(<QueryEndpointUri>, credential);
```

#### [Java](#tab/java)

Not supported.

---

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