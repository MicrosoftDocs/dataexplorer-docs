# Authentication Methods Documentation for Kusto SDK

This documentation provides an overview of different authentication methods that can be used with the Kusto SDK. The code snippets provided demonstrate various ways to authenticate a user or an application to interact with a Kusto cluster.

## Managed Identity Authentication

There are two types of managed identities: user-assigned and system-assigned.
User-assgined MI is a standalone Azure resource that can be assigned to one or more Azure resources.
System-assigned MI is created by Azure for a specific Azure resource, such as a virtual machine or an Azure Function.
For more information, see [Managed Identities](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview).

### User-Assigned Managed Identity

For resources with a user-assigned managed identity, the identity client ID is required to authenticate with the correct managed identity.

```csharp
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri").
    WithAadUserManagedIdentity("your-managed-identity-id");
```

**Notes!**

- The object (principal) ID of the MI must be authorized for the Kusto cluster. The permissions can be granted in Azure portal under Security > Permissions in the Kusto cluster resource page.
- Don't assign the MI to the Kusto cluster resource directly.
- **Managed identity authentication is not supported on local development environments.** To test managed identity authentication, deploy the application to Azure or use a different authentication method while developing locally.

### System-Assigned Managed Identity

For resources with a system-assigned managed identity, no client ID is required.

```csharp
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri").
    WithAadSystemManagedIdentity();
```

**Notes!**

- The object (principal) ID of the MI must be authorized for the Kusto cluster. This can be done in Azure portal under Security > Permissions in the Kusto cluster resource page.
- Don't assign the MI to the Kusto cluster resource directly.
- **Managed identity authentication is not supported on local development environments.** To test managed identity authentication, deploy the application to Azure or use a different authentication method while developing locally.

## Certificate-Based Authentication

Certificates can be used as secrets to prove the application's identity when requesting a token.
There are multiple ways to load the Certificate, including loading from disk or from the machine's credentials store.

### Using Certificate Subject Name And Issuer (C# SDK only)

The certificate subject name - with or without the issuer - can be used to locate the certificate in the machine's local store.
When there are multiple certificates with the same subject name and issuer, the latest certificate is used.

```csharp
// Subject name only
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri").
    WithAadApplicationSubjectNameAuthentication("your-application-id", "certificate-subject-name", "authority-id", "true/false to send x5c");
// Subject and issuer
kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri").
    WithAadApplicationSubjectAndIssuerAuthentication("your-application-id", "certificate-subject-name", "certificate-issuer-name", "authority-id");

// Equivalent Kusto connection string (issuer is optional):
// Data Source=<your-kusto-cluster-uri>;Initial Catalog=NetDefaultDB;Application Client Id=<app-id>;Application Certificate Subject=<subject-name>;Application Certificate Issuer=<issuer-name>;Authority Id=<authority-id>;SendX5c=<true/false>
```

**Notes!**

- The certificate should be stored in the "Personal" store location under `CurrentUser` (or `LocalMachine` on Windows).
- The certificate must be trusted in order for the lookup to work.
- When using Kusto connection string, an environment variable must be set to allow access to the certificate store. The environment variable is `KUSTO_DATA_ALLOW_ACCESS_TO_LOCAL_SECRETS_VIA_KCSB_KEYWORDS` and its value should be `1`.
- Use the SendX5c property to send the certificate's public key to achieve easy certificate rollover in Azure AD

### Loading Certificate from Azure Key Vault

Azure Key Vault can be used to store and manage certificates securely.
To authenticate with a certificate stored in Azure Key Vault, the certificate must be downloaded from the Key Vault using the certificate name.
This can be done using the `CertificateClient` class from the Azure SDK.
For more information, see [Certificate Client](https://www.nuget.org/packages/Azure.Security.KeyVault.Certificates/).

```csharp
// Load certificate from Azure Key Vault using the certificate name
var certificateClient = new CertificateClient(new Uri("your-azure-key-vault-uri"), new DefaultAzureCredential());
var certificateFromKV = certificateClient.DownloadCertificate(new DownloadCertificateOptions("certificate-name")).Value;

// Use the loaded certificate for authentication
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri")
    .WithAadApplicationCertificateAuthentication("your-application-id", certificateFromKV, "authority-id");
```

**Notes!**

- This exmaple demonstrates a scenario where we use one identity to access Azure Key Vault (using `DefaultAzureCredential` which supports MI, user credentials and more) and another identity (that is, application principal) to authenticate with Kusto.
- This code example isn't intended for production use, certificates should be cached and not loaded from the Key Vault every time.

### Loading Certificate From An Arbitrary Source

Certificates can be retrieved from various sources, such as a file on disk, cache, or a secure store.
Assuming you're able to create a `X509Certificate2` object, you can use the following code to authenticate with Kusto.
For more information, see [X509Certificate2](https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.x509certificates.x509certificate2).

```csharp
// Load certificate from an arbitrary source
X509Certificate2 certificate = <your certificate object>;

// Use the loaded certificate for authentication
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri")
    .WithAadApplicationCertificateAuthentication("your-application-id", certificate, "authority-id");
```

**Notes!**

- The certificate used must contain a private key for the authentication to work.

### Using Certificate Thumbprint (C# SDK only)

Loading a certificate from the machine's local store using the certificate thumbprint.

```csharp
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri").
    WithAadApplicationThumbprintAuthentication("your-application-id", "certificate-thumbprint", "authority-id");

// Equivalent Kusto connection string:
// Data Source=<your-kusto-cluster-uri>;Initial Catalog=NetDefaultDB;AAD Federated Security=True;AppClientId=<your-application-id>;AppCert=<certificate-thumbprint>;Authority Id=<authority-id>
```

**Notes!**

- The certificate should be stored in the "Personal" store location under `CurrentUser` (or `LocalMachine` on Windows).
- Using the certificate thumbprint is a bad practice as it changes when the certificate is renewed.
- When using Kusto connection string, an environment variable must be set to allow access to the certificate store. The environment variable is `KUSTO_DATA_ALLOW_ACCESS_TO_LOCAL_SECRETS_VIA_KCSB_KEYWORDS` and its value should be `1`.

## Application Key

Application key - a secret string that the application uses to prove its identity when requesting a token.
Also can be referred to as application password.

```csharp
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri").
    WithAadApplicationKeyAuthentication("app-id", "app-key", "authority-id");

// Equivalent Kusto connection string:
// Data Source=<your-kusto-cluster-uri>;Initial Catalog=NetDefaultDB;AAD Federated Security=True;AppClientId=<app-id>;AppKey=<app-key>;Authority Id=<authority-id>
```

**Notes!**

- Hard-coding secrets is a bad practice. Sensitive information should be kept encrypted or in a key vault.

## User Credentials Authentication

### Using User Prompt

This method uses the user's credentials to authenticate with Kusto. The user is prompted to enter their username and password.

```csharp
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri").
    WithAadUserPromptAuthentication();

// Equivalent Kusto connection string:
// Data Source=<your-kusto-cluster-uri>;Initial Catalog=NetDefaultDB;AAD Federated Security=True;Authority Id=<authority-id>
```

### Using Azure Command-Line Interface (CLI)

This method uses Azure CLI ('az login' command) to authenticate and obtain a token for the user.
The user may be prompted to sign-in if the token isn't available in the Azure CLI cache and the `interactive` parameter is set to True.
More on Azure CLI and its installation can be found [here](https://learn.microsoft.com/en-us/cli/azure/).

```csharp
// Passing interactive == true allows intercative user login (prompt) if necessary
var kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri")
    .WithAadAzCliAuthentication(interactive: true);
```

### Using Device Code

This method is intended to be used on devices that don't have a proper user interface to sign-in. This includes IoT devices, servers terminals, and more. With this method, the user is provided with a code and a URL to authenticate using a different device (such as smartphone).
This method is interactive and requires a user to sign-in using a browser.

```csharp
kcsb = new KustoConnectionStringBuilder("your-kusto-cluster-uri").WithAadDeviceCodeAuthentication((msg, uri, code) =>
{
    // The callback is used to display instructions to the user on how to authenticate using the device code
    Console.WriteLine("Device Code Message: {0}", msg);
    Console.WriteLine("Device Code Uri: {0}", uri);
    Console.WriteLine("Device Code: {0}", code);

    return Task.CompletedTask;
},"authority", "authority-id");
```

**Notes!**

- Device code authentication may be blocked by tenant Conditional Access Policies. Choose different methods in this case.

## Custom Token Provider Authentication

### Using user provided callback to obtain Microsoft Entra ID token

Custom token providers can be used to obtain a Microsoft Entra ID token for authentication. The following example demonstrates how to use a custom token provider to authenticate:

```csharp
public class TokenProvider
{
    private TokenRequestContext m_tokenRequestContext;
    private const string c_defaultResourceId = "https://kusto.kusto.windows.net";

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
        }
        catch { /* Handle exception */}

        m_tokenRequestContext = new TokenRequestContext(new string[] { resourceId ?? c_defaultResourceId });
    }

    public async Task<string> GetTokenAsync()
    {
        var accessToken = await new DefaultAzureCredential().GetTokenAsync(m_tokenRequestContext, default);
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

**Notes!**

- This code example wasn't tested and is intended for demonstration purposes only. Modify the code to fit your application's requirements.

## Azure Token Credential Authentication

### Using Azure TokenCredential

Azure TokenCredential is a base class for all Azure SDK credentials that can provide a Microsoft Entra ID token. The following example demonstrates how to use Azure TokenCredential to authenticate:

```csharp
var kcsb = new KustoConnectionStringBuilder("our-kusto-cluster-uri").
    WithAadAzureTokenCredentialsAuthentication(new DefaultAzureCredential());
```

**Notes!**

- `DefaultAzureCredential` class is used to authenticate with Azure services. It tries multiple authentication methods to obtain a token. It can be configured to work with Managed Identity, Visual Studio, Azure CLI, and more.
- `DefaultAzureCredential` is appropriate for both testing and production as it can be configured to use different authentication methods.

This documentation covers the primary methods of authenticating with the Kusto SDK using certificates, managed identities, token providers, and application ID and key. Each method is suitable for different scenarios and requirements, providing flexibility in how applications interact with Kusto clusters.
