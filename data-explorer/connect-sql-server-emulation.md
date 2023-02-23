---
title: Connect to Azure Data Explorer with SQL Server emulation - Azure Data Explorer
description: This article provides an overview on SQL Server emulation in Azure Data Explorer.
ms.topic: reference
ms.date: 02/23/2023
---
# Connect to Azure Data Explorer with SQL Server emulation

Any library and application that can connect to a Microsoft Azure SQL Database with Azure Active Directory (Azure AD) authentication can also connect to Azure Data Explorer. This functionality is made possible by Azure Data Explorer's TDS-compliant endpoint, which emulate Microsoft SQL Server.

For example, you can connect to Azure Data Explorer using [ODBC](connect-odbc.md), [JDBC](connect-jdbc.md), or from [common clients](connect-sql-clients.md) such as LINQPad, Azure Data Studio, and more.

## Tuning options

There are specific Azure Data Explorer parameters that aren't natively supported from certain SQL Server connection configurations. In order to provide these parameters, Azure Data Explorer allows these values to be provided in the `Language` and `Application` properties of TDS. It's recommended to use the `Language` property.

### Supported tuning options

The supported tuning options are described in the following table. To learn how to use these options, see the [syntax](#syntax) explanation and the [example](#example).

|Tuning option|Description|
|--|--|
|`MaxStringSize`|The default behavior of Azure Data Explorer is to consider string values as `NVARCHAR(MAX)`. For applications that don't work well with the `NVARCHAR(MAX)` type, you can cast the data to `NVARCHAR(`*n*`)`.|
|`AadAuthority`|This tuning option is used to specify the Azure AD tenant ID for authentication.|

### Syntax

[ `Language` | `Application` ] `=` *ExpectedArguments* `@` *TuningOptionName*`:`*TuningOptionValue*

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*ExpectedArguments*|string|&check;|The expected value for the `Language` or `Application` field in TDS.|
|*TuningOptionName*|string|&check;|One of the [supported tuning options](#supported-tuning-options).|
|*TuningOptionValue*|string|&check;|The value of the tuning option.|

### Example

When connecting with ODBC, specify the Azure AD tenant using the `Language` parameter and the `AadAuthority` tuning option in the connection string.

```odbc
"Driver={ODBC Driver 17 for SQL Server};Server=<adx_cluster_name>.<region_name>.kusto.windows.net;Database=<adx_database_name>;Authentication=ActiveDirectoryServicePrincipal;Language=any@AadAuthority:<aad_tenant_id>"
```

## Authentication

Azure Data Explorer requires authentication through Azure AD. Most SQL Server compatible clients allow for Azure AD user authentication. In some cases, to achieve application authentication, you need to provide the tenant ID in the [tuning options](#tuning-options) previously mentioned. For an example, see [connect with ODBC](connect-odbc.md#application-authentication).

The Azure AD tenant ID can also be configured at the cluster level, so you don't have to specify it on the client. If you need to change the tenant ID at the cluster level, open a support request in the  [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) about configuring *SecuritySettings.TdsEndpointDefaultAuthority* with the required tenant ID.
