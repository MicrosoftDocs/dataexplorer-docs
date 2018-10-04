---
title: Kusto Connection Strings - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto Connection Strings in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto Connection Strings

Kusto connection string is a way to provide the information necessary
for a Kusto client application to establish a connection to a Kusto service
endpoint. Kusto connection strings are modeled after the ADO.NET connection
strings, namely the connection string is a semicolon-delimited list of name/value
parameter pairs, optionally prefixed by a single URI. For example:

```text
https://help.kusto.windows.net/Samples; Fed=true; Accept=true
```

Here, the URI provides the service endpoint to communicate with (`https://help.kusto.windows.net`),
which is the value of the `Data Source` property,
and the default database to use (`Samples`), which is the value of the
`Initial Catalog` property. Additionally, two properties are provided using the
name/value syntax: the `Fed` property (also called `AAD Federated Security`) is set to `true`,
as is the `Accept` property.

Property names are not case sensitive, and spaces between name/value pairs are ignored.
Property values **are** case sensitive, in general. A property value that contains
a semicolon (`;`), a single quotation mark (`'`), or a double quotation mark (`"`)
must be enclosed between double quotation marks.

Several Kusto client tools support an extension over the URI prefix of the connection
string, in that they allow the shorthand format `@` *ClusterName* `/` *InitialCatalog* to be used.
For example, the connection string `@help/Samples` is translated by these tools
to `https://help.kusto.windows.net/Samples; Fed=true`, which indicates three
properties (`Data Source`, `Initial Catalog`, and `AAD Federated Security`).

Programmatically, Kusto connection strings can be parsed and manipulated
by the C# `Kusto.Data.KustoConnectionStringBuilder` class. This class validates
all connection strings and will generate a runtime exception if validation fails.
This functionality is present in al the flavors of Kusto SDK.

## Connection string properties

The following table lists all the properties one may specify in a Kusto connection string.
The table lists additional property names that are aliases, as well as a programmatic name (which is the name of the property in the
`Kusto.Data.KustoConnectionStringBuilder` object).

### General properties

|Property name                      |Alternative names|Programmatic name  |Description                                                   |
|-----------------------------------|-----------------|-------------------|--------------------------------------------------------------|
|Client Version for Tracing         |                                      |TraceClientVersion|When tracing the client version, use this value                                          |
|Data Source                        |Addr, Address, Network Address, Server|DataSource        |The URI specifying the Kusto service endpoint. For example, https://mycluster.kusto.windows.net or net.tcp://localhost
|Initial Catalog                    |Database                              |InitialCatalog    |The name of the database to be used by default. For example, MyDatabase|
|Query Consistency                  |QueryConsistency                      |QueryConsistency  |Set to either `strongconsistency` or `weakconsistency` to determine if the query should synchronize with the metadata before running|


### User Authentication properties


|Property name                      |Alternative names|Programmatic name  |Description                                                   |
|-----------------------------------|-----------------|-------------------|--------------------------------------------------------------|
|AAD Federated Security             |Federated Security, Federated, Fed, AADFed|FederatedSecurity    |A Boolean value that instructs the client to perform AAD federated authentication|
|Enforce MFA                        |MFA,EnforceMFA                            |EnforceMfa           |A Boolean value that instructs the client to force acquiring a multifactor-authentication token regardless of the service endpoint connecting to|
|User ID                            |UID, User                                 |UserID               |Username hint for AAD Federated AuthN|
|User Name for Tracing              |                                          |TraceUserName        |When tracing the user name, use this value                                               |
|User Token                         |UsrToken, UserToken                       |UserToken            |AAD-issued user token to use for authentication when AAD Federated authentication is used. Overrides ApplicationClientId, ApplicationKey and ApplicationToken. (Used rarely, if the caller has already authenticated against AAD and wants to use the token to communicate with Kusto)|



### Application Authentication properties

|Managed Service Identity                          |ManagedServiceIdentity, dMSI              |ManagedServiceIdentity                        |TODO|
|Application Certificate Subject Distinguished Name|Application Certificate Subject           |ApplicationCertificateSubjectDistinguishedName|TODO|
|Application Certificate Issuer Distinguished Name |Application Certificate Issuer            |ApplicationCertificateIssuerDistinguishedName |TODO|
|Application Certificate Send Public Certificate   |Application Certificate SendX5c, SendX5c  |ApplicationCertificateSendPublicCertificate   |TODO|
