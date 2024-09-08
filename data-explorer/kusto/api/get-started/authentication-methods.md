# Authentication Methods Documentation for Kusto SDK

This documentation provides an overview of different authentication methods that can be used with the Kusto SDK. The code snippets provided demonstrate various ways to authenticate a user or an application to interact with a Kusto cluster.

## Application Principal Authentication Methods

### Managed Identity Authentication

There are two types of managed identities: user-assigned and system-assigned.
User-assgined MI is a standalone Azure resource that can be assigned to one or more Azure resources.
System-assigned MI is created by Azure for a specific Azure resource, such as a virtual machine or an Azure Function.
For more information, see [Managed Identities](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview).

```csharp
// For user-assigned managed identity, the identity client ID is required
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri").
    WithAadUserManagedIdentity("your-managed-identity-id");

// For system-assigned managed identity, no  additional parameters are required
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri").
    WithAadSystemManagedIdentity();
```

> [!IMPORTANT]
> The object (principal) ID of the MI resource need to be assigned with a role to have access to the Kusto cluster.\
> This can be done on Azure portal in the Kusto cluster resource page under Serutiy/Permissions.\
> Managed identity should not be attached to the Kusto cluster directly.\
> **Managed identity authentication is not supported on local development environments.**\
> To test managed identity authentication, deploy the application to Azure or use a different authentication method when working locally.

### Certificate-Based Authentication

Certificates can be used as secrets to prove the application's identity when requesting a token.
There are multiple ways to load the Certificate, including loading from disk or from the machine's credentials store.

```csharp
// Loading certificate from the local store using the certificate subject and issuer names
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri").
    WithAadApplicationSubjectAndIssuerAuthentication("your-application-id", "ertificate-subject-name", "certificate-issuer-name", "authority-id");

// Loading certificate from an arbitrary source (such as a file on disk, cache, or secure store like Azure Key Vault)
// The certificate object must contain a private key
X509Certificate2 certificate = <your certificate object>;
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri")
    .WithAadApplicationCertificateAuthentication("your-application-id", certificate, "authority-id");

// Equivalent Kusto connection string
var connectionString = 
    "Data Source=<your-kusto-cluster-uri>;Initial Catalog=NetDefaultDB;Application Client Id=<app-id>;Application Certificate Subject=<subject-name>;Application Certificate Issuer=<issuer-name>;Authority Id=<authority-id>";
// Allow access to local secrets when using a connection string
KustoConnectionStringBuilder.DefaultPreventAccessToLocalSecretsViaKeywords = false;
var kcsb = new KustoConnectionStringBuilder(connectionString);
```

> [!IMPORTANT]
> To load certificates from Azure Key Vault use [Certificate Client](https://www.nuget.org/packages/Azure.Security.KeyVault.Certificates/).\
> When using subject name and issuer, the certificate must be installed in the local machine's certificate store.\

### Application Key

Application key - a secret string that the application uses to prove its identity when requesting a token.
Also can be referred to as application password.

```csharp
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri").
    WithAadApplicationKeyAuthentication("app-id", "app-key", "authority-id");

// Equivalent Kusto connection string:
var connectionString = 
    "Data Source=<your-kusto-cluster-uri>;Initial Catalog=NetDefaultDB;AAD Federated Security=True;AppClientId=<app-id>;AppKey=<app-key>;Authority Id=<authority-id>";
var kcsb = new KustoConnectionStringBuilder(connectionString);
```

> [!IMPORTANT]
> Hard-coding secrets is a bad practice. Sensitive information should be kept encrypted or in a key vault.

## User Principal Authentication Methods

### Interactive User Login

This method uses the user's credentials to authenticate with Kusto. The user is prompted to enter their username and password.
This method requires a web browser to complete the authentication process.

```csharp
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri").
    WithAadUserPromptAuthentication();

// Equivalent Kusto connection string:
var connectionString =
    "Data Source=<your-kusto-cluster-uri>;Initial Catalog=NetDefaultDB;AAD Federated Security=True;Authority Id=<authority-id>"
var kcsb = new KustoConnectionStringBuilder(connectionString);
```

### Using Azure Command-Line Interface (CLI)

This method uses Azure CLI (`az login` command) to authenticate and obtain a token for the user.
The user may be prompted to sign-in if the token isn't available in the Azure CLI cache and the `interactive` parameter is set to `true`.
More on Azure CLI and its installation can be found [here](https://learn.microsoft.com/en-us/cli/azure/).

```csharp
// Passing interactive == true allows intercative user login (prompt) if necessary
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri")
    .WithAadAzCliAuthentication(interactive: true);
```

> [!IMPORTANT]
> This method is currently supported for .NET Framework applications only.

### Using Device Code

This method is intended to be used on devices that don't have a proper user interface to sign-in.\
This includes IoT devices, servers terminals, and more. With this method, the user is provided with a code and a URL to authenticate using a different device (such as smartphone).
This method is interactive and requires a user to sign-in using a browser.

```csharp
kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri").WithAadDeviceCodeAuthentication((msg, uri, code) =>
{
    // The callback is used to display instructions to the user on how to authenticate using the device code
    Console.WriteLine("Device Code Message: {0}", msg);
    Console.WriteLine("Device Code Uri: {0}", uri);
    Console.WriteLine("Device Code: {0}", code);

    return Task.CompletedTask;
});
```

> [!IMPORTANT]
> Device code authentication may be blocked by tenant Conditional Access Policies. Choose different methods in this case.

## Custom Token Provider Authentication Methods

### Custom Token Provider For Federated Managed Identity Credential

Custom token providers can be used to obtain a Microsoft Entra ID token for authentication.\
The following example demonstrates how to use a custom token provider to obtain token using federated managed identity.

```csharp
public class TokenProvider
{
    private ClientAssertionCredential m_clientAssertion;
    private TokenRequestContext m_tokenRequestContext;

    public TokenProvider(string clusterUri)
    {
        var resourceId = null;

        try
        {
            // Get the apropiate resource id by querying the cluster metadata
            var httpClient = new HttpClient();
            var response = httpClient.GetByteArrayAsync($"{clusterUri}/v1/rest/auth/metadata").Result;
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
            "application-tenant-id",
            "your-application-id",
            async (token) =>
            {
                // Get Managed Identity token
                var miCredential = new ManagedIdentityCredential("your-managed-identity-client-id");
                var miToken = await miCredential.GetTokenAsync(new TokenRequestContext(new[] { "api://AzureADTokenExchange/.default" })).ConfigureAwait(false);
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

var tokenProvider = new TokenProvider("your-kusto-cluster-uri");

var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri")
    .WithAadTokenProviderAuthentication(
        async () =>
        {
            return await tokenProvider.GetTokenAsync();
        });
```

> [!IMPORTANT]
> This code example wasn't tested and is intended for demonstration purposes only.\
> Modify the code to fit your application's requirements.

### Using Azure TokenCredential

Create a custom token provider by creating a class that inherits from `TokenCredential` and implements the `GetToken` method, or use an existing token provider like `DefaultAzureCredential`.
This method offers flexibility for different authentication scenarios when a custom token provider is required.

```csharp
// Use DefaultAzureCredential to support production code using Managed Identity and testing code using Visual Studio or Azure CLI
// DefaultAzureCredential can be configured to use different authentication methods
var credentialProvider = new DefaultAzureCredential(new DefaultAzureCredentialOptions { ManagedIdentityClientId = "<your-client-id>" });
var kcsb = new KustoConnectionStringBuilder("our-kusto-cluster-uri").
    WithAadAzureTokenCredentialsAuthentication(credentialProvider);
```

> [!IMPORTANT]
> `DefaultAzureCredential` is used to authenticate with Azure services.\
> It tries multiple authentication methods to obtain a token.\
> It can be configured to work with Managed Identity, Visual Studio, Azure CLI, and more.\
> `DefaultAzureCredential` is appropriate for both testing and production as it can be configured to use different authentication methods.
> For more information, see [DefaultAzureCredential]("https://learn.microsoft.com/en-us/dotnet/api/azure.identity.defaultazurecredential")

This documentation covers the primary methods of authenticating with the Kusto SDK using certificates, managed identities, token providers, and application ID and key. Each method is suitable for different scenarios and requirements, providing flexibility in how applications interact with Kusto clusters.
