---
title:  Kusto connection strings
description: This article describes Kusto connection strings in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/24/2020
---
# Kusto connection strings

Kusto connection strings can provide the information necessary
for a Kusto client application to establish a connection to a Kusto service
endpoint. Kusto connection strings are modeled after the ADO.NET connection
strings. That is, the connection string is a semicolon-delimited list of name/value
parameter pairs, optionally prefixed by a single URI.

**Example:**

```text
https://help.kusto.windows.net/Samples; Fed=true; Accept=true
```

The URI provides the service endpoint to communicate with:

* (`https://help.kusto.windows.net`) - value of the `Data Source` property.
* `Samples`(default database) - value of the`Initial Catalog` property.

Two additional properties are provided using the name/value syntax: 

* `Fed` property (also called `AAD Federated Security`) set to `true`.
* `Accept` property set to `true`.

> [!NOTE]
>
> * Property names are not case sensitive, and spaces between name/value pairs are ignored.
> * Property values **are** case sensitive. A property value that contains
>   a semicolon (`;`), a single quotation mark (`'`), or a double quotation mark (`"`)
>   must be enclosed between double quotation marks.

Several Kusto client tools support an extension over the URI prefix of the connection
string, in that they allow the shorthand format `@` _ClusterName_ `/` _InitialCatalog_ to be used.
For example, the connection string `@help/Samples` is translated by these tools
to `https://help.kusto.windows.net/Samples; Fed=true`, which indicates three
properties (`Data Source`, `Initial Catalog`, and `AAD Federated Security`).

Programmatically, Kusto connection strings can be parsed and manipulated
by the C# `Kusto.Data.KustoConnectionStringBuilder` class. This class validates
all connection strings and generates a runtime exception if validation fails.
This functionality is present in all flavors of Kusto SDK.

## Trusted endpoints

A connection with a Kusto endpoint can only be established if that endpoint is trusted.
The Kusto client trusts all endpoints whose hostname part is issued by the service
(e.g., endpoints whose DNS hostname ends with `kusto.windows.net`) by default.
The client won't establish connections to other endpoints; in order to allow that,
one can use the `Kusto.Data.Common.KustoTrustedEndpoints` class to add additional endpoints
to the list of trusted endpoints (by using either `SetOverridePolicy` which overrides
the default policy, or `AddTrustedHosts` which adds new entries to the existing policy.)

```csharp
Kusto.Data.Common.Impl.WellKnownKustoEndpoints.AddTrustedHosts(
    new[] {
        // Allow an explicit service address
        new FastSuffixMatcher.MatchRule("my-kusto.contoso.com", exact: true),
        // Allow services whose DNS name end with ".contoso.com"
        new FastSuffixMatcher.MatchRule(".contoso.com", exact: false),
    });
```

## Connection string properties

The following table lists all the properties you can specify in a Kusto connection string.
It lists programmatic names (which is the name of the property in the
`Kusto.Data.KustoConnectionStringBuilder` object) as well as additional property names that are aliases.

### General properties

| Property name              | Alternative names                      | Programmatic name  | Description                                                                                                                          |
|----------------------------|----------------------------------------|--------------------|---------------------------------------------------|
| Client Version for Tracing |                                        | TraceClientVersion | When tracing the client version, use this value   |
| Data Source                | Addr, Address, Network Address, Server | DataSource         | The URI specifying the Kusto service endpoint. For example, `https://mycluster.kusto.windows.net` or `net.tcp://localhost`               |
| Initial Catalog            | Database                               | InitialCatalog     | The name of the database to be used by default. For example, MyDatabase|
| Query Consistency          | QueryConsistency                       | QueryConsistency   | Set to either `strongconsistency` or `weakconsistency` to determine if the query should synchronize with the metadata before running |

### User authentication properties

| Property name          | Alternative names                          | Programmatic name | Description                       |
|------------------------|--------------------------------------------|-------------------|-----------------------------------|
| AAD Federated Security | Federated Security, Federated, Fed, AADFed | FederatedSecurity | A Boolean value that instructs the client to perform Azure Active  |
|Authority Id            |TenantId                                    |Authority          |A String value that provides the name or ID of the user's tenant. The default value is microsoft.com. For more information, see [AAD authority](/azure/active-directory/develop/msal-client-application-configuration#authority). |
| Enforce MFA            | MFA,EnforceMFA                             | EnforceMfa        | A Boolean value that instructs the client to acquire a multifactor-authentication token       |
| User ID                | UID, User                                  | UserID            | A String value that instructs the client to perform user authentication with the indicated user name           |
| User Name for Tracing  |                                            | TraceUserName     | A String value that reports to the service which user name to use when tracing the request internally         |
| User Token             | UsrToken, UserToken                        | UserToken         | A String value that instructs the client to perform user authentication with the specified bearer token.<br/>Overrides ApplicationClientId, ApplicationKey, and ApplicationToken. (If specified, skips the actual client authentication flow in favor of the provided token.)       |

The following combinations of properties are supported (`AAD Federated Security` must be true for all of them):

* `WithAadUserPromptAuthentication`: `User ID` (optional) and `Authority Id` (optional).
* `WithAadUserTokenAuthentication`: `User Token` (mandatory.)

Note that `Enforce MFA` and `User Name for Tracing` are both optional, and can always be specified.

### Application authentication properties

|Property name                                     |Alternative names                         |Programmatic name                             |Description      |
|--------------------------------------------------|------------------------------------------|----------------------------------------------|-----------------|
|AAD Federated Security                            |Federated Security, Federated, Fed, AADFed|FederatedSecurity                             |A Boolean value that instructs the client to perform Azure Active Directory (AAD) federated authentication|
|Application Certificate SendX5c                   |Application Certificate Send Public Certificate, SendX5c|ApplicationCertificateSendX5c   |A Boolean value that instructs the client to send the public key of the certificate to AAD|
|Application Certificate Thumbprint                |AppCert                                   |ApplicationCertificateThumbprint              |A String value that provides the thumbprint of the client certificate to use when using an application client certificate authenticating flow|
|Application Client Id                             |AppClientId                               |ApplicationClientId                           |A String value that provides the application client ID to use when authenticating|
|Application Key                                   |AppKey                                    |ApplicationKey                                |A String value that provides the application key to use when authenticating using an application secret flow|
|Application Name for Tracing                      |TraceAppName                              |ApplicationNameForTracing                     |A String value that reports to the service which application name to use when tracing the request internally|
|Application Token                                 |AppToken                                  |ApplicationToken                              |A String value that instructs the client to perform application authenticating with the specified bearer token|
|Authority Id                                      |TenantId                                  |Authority                                     |A String value that provides the name or ID of the tenant in which the application is registered. The default value is microsoft.com. For more information, see [AAD authority](/azure/active-directory/develop/msal-client-application-configuration#authority). |
|Azure Region                                      |AzureRegion, Region                       |AzureRegion                                   |A string value that provides the name of the Azure Region in which to authenticate.|
|ManagedServiceIdentity                            |N/A                                       |EmbeddedManagedIdentity                       |A String value that instructs the client which application identity to use with managed identity authentication; use `system` to indicate the system-assigned identity. This property can't be set with a connection string, only programmatically.|
|Application Certificate Subject Distinguished Name|Application Certificate Subject           |ApplicationCertificateSubjectDistinguishedName||
|Application Certificate Issuer Distinguished Name |Application Certificate Issuer            |ApplicationCertificateIssuerDistinguishedName ||
|Application Certificate Send Public Certificate   |Application Certificate SendX5c, SendX5c  |ApplicationCertificateSendPublicCertificate   ||

The following combinations of properties are supported (`AAD Federated Security` must be true for all of them):

* `WithAadApplicationKeyAuthentication`: `Application Client Id` (mandatory), `Application Key` (mandatory), `Authority Id` (mandatory).
* `WithAadApplicationThumbprintAuthentication`: `Application Client Id` (mandatory), `Application Certificate Thumbprint` (mandatory), `Authority Id` (mandatory).
* `WithAadApplicationSubjectAndIssuerAuthentication`: `Application Client Id` (mandatory), `Application Certificate Subject Distinguished Name` (mandatory), `Application Certificate Issuer Distinguished Name` (mandatory), `Authority Id` (mandatory), `Azure Region` (optional), `Application Certificate SendX5c` (optional).
* `WithAadApplicationSubjectNameAuthentication`: `Application Client Id` (mandatory), `Application Certificate Subject Distinguished Name` (mandatory), `Authority Id` (mandatory), `Azure Region` (optional).
* `WithAadApplicationTokenAuthentication`: `Application Token` (mandatory).

Note that `Application Name for Tracing` is optional, and can always be specified.

### Client communication properties

|Property name|Alternative names|Programmatic name  |Description                                                   |
|-------------|-----------------|-------------------|--------------------------------------------------------------|
|Accept       |                 |Accept             |A Boolean value that requests detailed error objects to be returned on failure.|
|Streaming    |                 |Streaming          |A Boolean value that requests the client won't accumulate data before providing it to the caller.|
|Uncompressed |                 |Uncompressed       |A Boolean value that requests the client won't ask for transport-level compression.|

> [!NOTE]
> When the Streaming flag is enabled (as is the default),
> the SDK does not buffer all response data in memory;
> instead, it "pulls" the data from the service when the caller
> requests it. Therefore, it is essential that in this case
> the caller properly disposes of the data (such as `IDataReader`)
> once it is done reading the data, as the network connection
> to the service is held open unnecessarily.

## Authentication properties (details)

One of the important tasks of the connection string is to tell the client how to authenticate to the service.
The following algorithm is generally used by clients for authentication against HTTP/HTTPS endpoints:

1. If AadFederatedSecurity is true:
    1. If UserToken is specified, use AAD federated authentication with the specified token
    1. Otherwise, if ApplicationToken is specified, perform federated authentication with the specified token
    1. Otherwise, if ApplicationClientId and ApplicationKey are specified, perform federated authentication with the specified application client ID and key
    1. Otherwise, if ApplicationClientId and ApplicationCertificateThumbprint are specified, perform federated authentication with the specified application client ID and certificate
    1. Otherwise, perform federated authentication with the current logged-on user's identity (user will be prompted if this is the first authentication in the session)

1. Otherwise don't authenticate.


### AAD federated application authentication with application certificate

1. Authentication based on an application's certificate is supported only for web applications (and not for native client applications).
1. The web application should be configured to accept the given certificate. [How to authentication based-on AAD application's certificate](https://github.com/Azure-Samples/active-directory-dotnet-daemon-certificate-credential)
1. The web application should be configured as an authorized principal in the relevant Kusto cluster.
1. The certificate with the given thumbprint should be installed (in Local Machine store or in Current User store).
1. The certificate's public key should contain at least 2048 bits.

## AAD-based authentication examples

**AAD Federated authentication using the currently logged-on user identity (user will be prompted if required)**

```csharp
var serviceUri = "Service URI, typically of the form https://cluster.region.kusto.windows.net";
var authority = "contoso.com"; // Or the AAD tenant GUID: "..."

// Recommended syntax
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
  .WithAadUserPromptAuthentication(authority);

// Legacy syntax
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
{
    FederatedSecurity = true,
    InitialCatalog = "NetDefaultDB",
    Authority = authority,
};

// Equivalent Kusto connection string: $"Data Source={serviceUri};Database=NetDefaultDB;Fed=True;Authority Id={authority}"
```

**AAD Federated authentication with user id hint (user will be prompted if required)**

```csharp
var serviceUri = "Service URI, typically of the form https://cluster.region.kusto.windows.net";
var authority = "contoso.com"; // Or the AAD tenant GUID: "..."
var userUPN = "johndoe@contoso.com";

// Recommended syntax
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
  .WithAadUserPromptAuthentication(authority);
kustoConnectionStringBuilder.UserID = userUPN;

// Legacy syntax
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
{
    FederatedSecurity = true,
    InitialCatalog = "NetDefaultDB",
    UserID = userUPN,
    Authority = authority,
};

// Equivalent Kusto connection string: $"Data Source={serviceUri};Database=NetDefaultDB;Fed=True;User ID={userUPN};Authority Id={authority}"
```

**AAD Federated application authentication using ApplicationClientId and ApplicationKey**

```csharp
var serviceUri = "Service URI, typically of the form https://cluster.region.kusto.windows.net";
var authority = "contoso.com"; // Or the AAD tenant GUID: "..."
var applicationClientId = <ApplicationClientId>;
var applicationKey = <ApplicationKey>;

// Recommended syntax
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
    .WithAadApplicationKeyAuthentication(applicationClientId, applicationKey, authority);

// Legacy syntax
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
{
    FederatedSecurity = true,
    InitialCatalog = "NetDefaultDB",
    ApplicationClientId = applicationClientId,
    ApplicationKey = applicationKey,
    Authority = authority,
};

// Equivalent Kusto connection string: $"Data Source={serviceUri};Database=NetDefaultDB;Fed=True;AppClientId={applicationClientId};AppKey={applicationKey};Authority Id={authority}"
```

**Using System-assigned Managed Identity**

```csharp
var serviceUri = "Service URI, typically of the form https://cluster.region.kusto.windows.net";

// Recommended syntax
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
    .WithAadSystemManagedIdentity();
```

**Using User-assigned Managed Identity**

```csharp
var serviceUri = "Service URI, typically of the form https://cluster.region.kusto.windows.net";
var managedIdentityClientId = "<managed identity client id>";

// Recommended syntax
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
    .WithAadUserManagedIdentity(managedIdentityClientId);
```

**AAD Federated authentication using user / application token**

```csharp
var serviceUri = "Service URI, typically of the form https://cluster.region.kusto.windows.net";
var authority = "contoso.com"; // Or the AAD tenant GUID: "..."
var access_token = "<access token obtained from AAD>"

// Recommended syntax - AAD User token
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
    .WithAadUserTokenAuthentication(access_token, authority);

// Legacy syntax - AAD User token
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
{
    FederatedSecurity = true,
    UserToken = access_token,
    Authority = authority,
};

// Equivalent Kusto connection string: "Data Source={serviceUri};Database=NetDefaultDB;Fed=True;UserToken={access_token};Authority Id={authority}"

// Recommended syntax - AAD Application token
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
    .WithAadApplicationTokenAuthentication(access_token, authority);

// Legacy syntax - AAD Application token
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
{
    FederatedSecurity = true,
    ApplicationToken = access_token,
    Authority = authority,
};

// Equivalent Kusto connection string: $"Data Source={serviceUri};Database=NetDefaultDB;Fed=True;AppToken={applicationToken};Authority Id={authority}"
```

**Using token provider callback (will be invoked each time a token is required)**

```csharp
var serviceUri = "Service URI, typically of the form https://cluster.region.kusto.windows.net";
Func<string> tokenProviderCallback; // User-defined method to retrieve the access token

// Recommended syntax
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
    .WithAadTokenProviderAuthentication(tokenProviderCallback);

// Legacy syntax
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
{
    FederatedSecurity = true,
    TokenProviderCallback = () => Task.FromResult(tokenProviderCallback()),
};
```

**Using X.509 certificate**

```csharp
var serviceUri = "Service URI, typically of the form https://cluster.region.kusto.windows.net";
var authority = "contoso.com"; // Or the AAD tenant GUID: "..."
string applicationClientId = "<applicationClientId>";
X509Certificate2 applicationCertificate = "<certificate blob>";
bool sendX5c = <desired value>; // Set too 'True' to use Trusted Issuer feature of AAD

// Recommended syntax
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
    .WithAadApplicationCertificateAuthentication(applicationClientId, applicationCertificate, authority, sendX5c);

// Legacy syntax
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
{
    FederatedSecurity = true,
    ApplicationClientId = applicationClientId,
    ApplicationCertificateBlob = applicationCertificate,
    ApplicationCertificateSendX5c = sendX5c,
    Authority = authority,
};
```

**Using X.509 certificate by thumbprint (client will attempt to load the certificate from local store)**

```csharp
var serviceUri = "Service URI, typically of the form https://cluster.region.kusto.windows.net";
var authority = "contoso.com"; // Or the AAD tenant GUID: "..."
string applicationClientId = "<applicationClientId>";
string applicationCertificateThumbprint = "<ApplicationCertificateThumbprint>";

// Recommended syntax
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
    .WithAadApplicationThumbprintAuthentication(applicationClientId, applicationCertificateThumbprint, authority);

// Legacy syntax
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(serviceUri)
{
    FederatedSecurity = true,
    ApplicationClientId = applicationClientId,
    ApplicationCertificateThumbprint = applicationCertificateThumbprint,
    Authority = authority,
};

// Equivalent Kusto connection string: $"Data Source={serviceUri};Database=NetDefaultDB;Fed=True;AppClientId={applicationClientId};AppCert={applicationCertificateThumbprint};Authority Id={authority}"
```
