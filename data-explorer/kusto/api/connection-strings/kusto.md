---
title:  Kusto connection strings
description: This article describes Kusto connection strings in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 07/18/2023
---
# Kusto connection strings

Kusto connection strings provide the information necessary for a Kusto client application to establish a connection to a Kusto service endpoint. Kusto connection strings are modeled after the ADO.NET connection strings. That is, the connection string is a semicolon-delimited list of name-value parameter pairs, optionally prefixed by a single URI.

For example, the following Kusto connection string begins with a URI that specifies the service endpoint for communication: `https://help.kusto.windows.net`. This URI is assigned to the `Data Source` property. Next, `/Samples` within the connection string represents the default database and is assigned to the `Initial Catalog` property. Lastly, two other properties, `Fed` and `Accept`, provide further configuration or customization options for the connection.

```text
https://help.kusto.windows.net/Samples; Fed=true; Accept=true
```

> [!NOTE]
>
> * Property names are not case sensitive.
> * Property values are case sensitive.
> * Spaces between name-value parameter pairs are ignored.
> * A property value that contains a semicolon (`;`), a single quotation mark (`'`), or a double quotation mark (`"`)
>   must be enclosed between double quotation marks.

Several Kusto client tools support an extension over the URI prefix of the connection string that allows for a shorthand format of `@`*ClusterName*`/`*InitialCatalog*. For example, these tools translate the connection string `@help/Samples` to `https://help.kusto.windows.net/Samples; Fed=true`.

Programmatically, the C# `Kusto.Data.KustoConnectionStringBuilder` class can parse and manipulate Kusto connection strings. This class validates all connection strings and generates a runtime exception if validation fails. This functionality is present in all flavors of Kusto SDK.

## Trusted endpoints

A connection with a Kusto endpoint can only be established if that endpoint is trusted.
The Kusto client trusts all endpoints whose hostname part is issued by the service.
For instance, endpoints whose DNS hostname ends with `kusto.windows.net`.

By default, the client doesn't establish connections to other endpoints. In order to allow connections
to other endpoints, use the `Kusto.Data.Common.KustoTrustedEndpoints` class to add endpoints to the list of trusted endpoints. Use `SetOverridePolicy` to override the default policy, and `AddTrustedHosts` to add new entries to the existing policy.

```csharp
KustoTrustedEndpoints.AddTrustedHosts(
    new[]
    {
        // Allow an explicit service address
        new FastSuffixMatcher.MatchRule("my-kusto.contoso.com", exact: true),
        // Allow services whose DNS name end with ".contoso.com"
        new FastSuffixMatcher.MatchRule(".contoso.com", exact: false),
    }
);
```

## Connection string properties

The following tables list all the possible properties that can be included in a Kusto connection string. The tables also provide alias names for each property. Moreover, the tables indicate the programmatic names associated with each property, which represents the name of the property in the `Kusto.Data.KustoConnectionStringBuilder` object.

### General properties

| Property name | Programmatic name | Description |
|--|--|--|
| Client Version for Tracing | TraceClientVersion | When tracing the client version, use this property. |
| Data Source</br></br>**Aliases:** Addr, Address, Network Address, Server | DataSource | The URI specifying the Kusto service endpoint. For example, `https://mycluster.kusto.windows.net`. |
| Initial Catalog</br></br>**Alias:** Database | InitialCatalog | The name of the database to be used by default. For example, `MyDatabase`. |
| Query Consistency</br></br>**Alias:** QueryConsistency | QueryConsistency | Set to either `strongconsistency` or `weakconsistency` to determine if the query should synchronize with the metadata before running. |

### User authentication properties

| Property name | Programmatic name | Description |
|--|--|--|
| AAD Federated Security </br></br>**Aliases:** Federated Security, Federated, Fed, AADFed | FederatedSecurity | A boolean value that instructs the client to perform Azure Active Directory (Azure AD) authentication.|
| Authority ID </br></br>**Alias:** TenantId | Authority | A string value that provides the name or ID of the user's tenant. The default value is `microsoft.com`. For more information, see [Azure AD authority](/azure/active-directory/develop/msal-client-application-configuration#authority). |
| Enforce MFA </br></br>**Alias:** MFA, EnforceMFA | EnforceMfa | An optional boolean value that instructs the client to acquire a multifactor-authentication token. |
| User ID </br></br>**Aliases:** UID, User | UserID | A string value that instructs the client to perform user authentication with the indicated user name. |
| User Name for Tracing | TraceUserName | An optional string value that reports to the service which user name to use when tracing the request internally. |
| User Token </br></br>**Aliases:** UsrToken, UserToken | UserToken | A string value that instructs the client to perform user authentication with the specified bearer token. </br></br>Overrides `ApplicationClientId`, `ApplicationKey`, and `ApplicationToken`. If specified, skips the actual client authentication flow in favor of the provided token. |

### Supported property combinations for user authentication

For user authentication, specify `AAD Federated Security` as `true`. Then, choose one of the following authentication modes, and specify the relevant properties for that mode.

| Authentication mode | Property names |
|--|--|
| Azure AD User Prompt Authentication | - User ID (optional)</br>- Authority ID (optional)</br>- Enforce MFA (optional)</br>- User Name for Tracing (optional)|
| Azure AD User Token Authentication | - User Token</br>- Enforce MFA (optional)</br>- User Name for Tracing (optional)|

### Application authentication properties

| Property name | Programmatic name | Description |
|--|--|--|
| AAD Federated Security </br></br>**Aliases:** Federated Security, Federated, Fed, AADFed | FederatedSecurity | A boolean value that instructs the client to perform Azure AD federated authentication. |
| Application Certificate SendX5c </br></br>**Aliases:** Application Certificate Send Public Certificate, SendX5c | ApplicationCertificateSendX5c | A boolean value that instructs the client to perform subject name and issuer based authentication. |
| Application Certificate Thumbprint </br></br>**Alias:** AppCert | ApplicationCertificateThumbprint | A string value that provides the thumbprint of the client certificate to use when using an application client certificate authenticating flow. |
| Application Client ID </br></br>**Alias:** AppClientId | ApplicationClientId | A string value that provides the application client ID to use when authenticating. |
| Application Key </br></br>**Alias:** AppKey | ApplicationKey | A string value that provides the application key to use when authenticating using an application secret flow. |
| Application Name for Tracing </br></br>**Alias:** TraceAppName | ApplicationNameForTracing | An optional string value that reports to the service which application name to use when tracing the request internally. |
| Application Token </br></br>**Alias:** AppToken | ApplicationToken | A string value that instructs the client to perform application authenticating with the specified bearer token. |
| Authority ID </br></br>**Alias:** TenantId | Authority | A string value that provides the name or ID of the tenant in which the application is registered. The default value is `microsoft.com`. For more information, see [Azure AD authority](/azure/active-directory/develop/msal-client-application-configuration#authority). |
| Azure Region </br></br>**Aliases:** AzureRegion, Region | AzureRegion | A string value that provides the name of the Azure Region in which to authenticate. |
| ManagedServiceIdentity | EmbeddedManagedIdentity | A string value that instructs the client which application identity to use with managed identity authentication. Use `system` to indicate the system-assigned identity. </br></br>This property can't be set with a connection string, only programmatically. |
| Application Certificate Subject Distinguished Name </br></br>**Alias:** Application Certificate Subject | ApplicationCertificateSubjectDistinguishedName |  A string value that specifies the application certificate subject distinguished name.|
| Application Certificate Issuer Distinguished Name </br></br>**Alias:** Application Certificate Issuer | ApplicationCertificateIssuerDistinguishedName |  A string value that specifies the application certificate issuer distinguished name.|

### Supported property combinations for application authentication

For application authentication, specify `AAD Federated Security` as `true`. Then, choose one of the following authentication modes, and specify the relevant properties for that mode.

| Authentication mode | Property names |
|--|--|
| Azure AD Application Key Authentication | - Application Client Id</br>- Application Key</br>- Authority Id</br> - Application Name for Tracing (optional) |
| Azure AD Application Thumbprint Authentication | - Application Client Id</br>- Application Certificate Thumbprint</br>- Authority Id</br> - Application Name for Tracing (optional) |
| Azure AD Application Subject and Issuer Authentication | - Application Client Id</br>- Application Certificate Subject Distinguished Name</br>- Application Certificate Issuer Distinguished Name</br>- Authority Id</br>- Azure Region (optional)</br>- Application Certificate SendX5c (optional)</br> - Application Name for Tracing (optional) |
| Azure AD Application Subject Name Authentication | - Application Client Id</br>- Application Certificate Subject Distinguished Name</br>- Authority Id</br>- and Azure Region (optional)</br> - Application Name for Tracing (optional) |
| Azure AD Application Token Authentication | - Application Token</br> - Application Name for Tracing (optional) |

#### Authentication with an application certificate

1. The application should be configured to accept the given certificate. [How to authentication based-on Azure AD application's certificate](https://github.com/Azure-Samples/active-directory-dotnet-daemon-certificate-credential).
1. The application should be configured as an authorized principal in the relevant Kusto cluster.
1. The certificate needs to be installed in Local Machine store or in Current User store.
1. The certificate's public key should contain at least 2048 bits.

### Client communication properties

| Property name | Programmatic name | Description |
|--|--|--|
| Accept | Accept |A boolean value that requests detailed error objects to be returned on failure. |
| Streaming | Streaming | A boolean value that requests the client not accumulate data before providing it to the caller. This is a default behavior. |
| Uncompressed | Uncompressed | A boolean value that requests the client not ask for transport-level compression. |

> [!NOTE]
> When the `Streaming` flag is enabled (as is the default),
> the SDK does not buffer all response data in memory;
> instead, it "pulls" the data from the service when the caller
> requests it. Therefore, it is essential that in this case
> the caller properly disposes of the data (such as `IDataReader`)
> once it is done reading the data, as the network connection
> to the service is held open unnecessarily.

## Examples

**Azure AD Federated authentication using the currently logged-on user identity (user will be prompted if required)**

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";
var authority = "contoso.com"; // Or the AAD tenant GUID
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri)
    .WithAadUserPromptAuthentication(authority);
// Equivalent Kusto connection string: $"Data Source={kustoUri};Database=NetDefaultDB;Fed=True;Authority Id={authority}"
```

**Azure AD Federated authentication with user id hint (user will be prompted if required)**

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";
var authority = "contoso.com"; // Or the AAD tenant GUID
var userId = "johndoe@contoso.com";
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri)
  .WithAadUserPromptAuthentication(authority, userId);
// Equivalent Kusto connection string: $"Data Source={kustoUri};Database=NetDefaultDB;Fed=True;Authority Id={authority};User ID={userId}"
```

**Azure AD Federated application authentication using ApplicationClientId and ApplicationKey**

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";
var appId = "<appId>";
var appKey = "<appKey>";
var authority = "contoso.com"; // Or the AAD tenant GUID
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri)
    .WithAadApplicationKeyAuthentication(appId, appKey, authority);
// Equivalent Kusto connection string: $"Data Source={kustoUri};Database=NetDefaultDB;Fed=True;AppClientId={appId};AppKey={appKey};Authority Id={authority}"
```

**Using System-assigned Managed Identity**

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri)
    .WithAadSystemManagedIdentity();
```

**Using User-assigned Managed Identity**

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";
var managedIdentityClientId = "<managedIdentityClientId>";
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri)
    .WithAadUserManagedIdentity(managedIdentityClientId);
```

**Azure AD Federated authentication using user / application token**

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";
var userAccessToken = "<userAccessToken>";
var appAccessToken = "<appAccessToken>";
// AAD User token
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri)
    .WithAadUserTokenAuthentication(userAccessToken);
    
// Equivalent Kusto connection string: "Data Source={kustoUri};Database=NetDefaultDB;Fed=True;UserToken={userAccessToken}"
// AAD Application token
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri)
    .WithAadApplicationTokenAuthentication(appAccessToken);
    
// Equivalent Kusto connection string: "Data Source={kustoUri};Database=NetDefaultDB;Fed=True;ApplicationToken={appAccessToken}"
```

**Using token provider callback (will be invoked each time a token is required)**

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";
Func<string> tokenProviderCallback; // User-defined method to retrieve the access token
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri)
    .WithAadTokenProviderAuthentication(tokenProviderCallback);
```

**Using X.509 certificate**

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";
var appId = "<appId>";
X509Certificate2 appCert;
var authority = "contoso.com"; // Or the AAD tenant GUID
bool sendX5c; // Set to 'True' to use Trusted Issuer feature of AAD
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri)
    .WithAadApplicationCertificateAuthentication(appId, appCert, authority, sendX5c);
```

**Using X.509 certificate by thumbprint (client will attempt to load the certificate from local store)**

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";
var appId = "<appId>";
var appCert = "<appCert>";
var authority = "contoso.com"; // Or the AAD tenant GUID
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri)
    .WithAadApplicationThumbprintAuthentication(appId, appCert, authority);
// Equivalent Kusto connection string: $"Data Source={kustoUri};Database=NetDefaultDB;Fed=True;AppClientId={appId};AppCert={appCert};Authority Id={authority}"
```
