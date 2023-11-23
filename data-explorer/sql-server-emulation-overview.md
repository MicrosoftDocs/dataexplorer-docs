---
title: Query data in Azure Data Explorer with SQL Server emulation - Azure Data Explorer
description: This article provides an overview on SQL Server emulation in Azure Data Explorer.
ms.topic: reference
ms.date: 06/14/2023
---
# Query data in Azure Data Explorer using SQL Server emulation

Any library and application that can connect to a Microsoft Azure SQL Database with Microsoft Entra authentication can also connect to Azure Data Explorer. This functionality is made possible by Azure Data Explorer's TDS-compliant endpoint, which emulates Microsoft SQL Server. The endpoint supports TDS versions 7.x and 8.0.

With SQL Server emulation, you can connect to Azure Data Explorer through various methods, including [ODBC](connect-odbc.md), [JDBC](connect-jdbc.md), and [common apps](connect-common-apps.md) like LINQPad and Azure Data Studio.

## Authentication

Azure Data Explorer requires authentication through Microsoft Entra ID.

To authenticate an application principal, you need to include the tenant ID in the [tuning options](#tuning-options). For an example, see [connect with ODBC](connect-odbc.md#application-authentication).

It's possible to configure the Microsoft Entra tenant ID at the cluster level and remove the need to specify it from the client. To change the tenant ID at the cluster level, open a support request in the  [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) about configuring *SecuritySettings.TdsEndpointDefaultAuthority* with the required tenant ID.

## Tuning options

For customizing Azure Data Explorer according to your specific requirements, you might need to supply certain information that's not supported by the standard SQL Server connection configuration.

To allow for such parameters, Azure Data Explorer lets you input these values into the TDS `Language` and `Application` properties. We recommend using the `Language` property when possible.

### Supported tuning options

The following table describes the supported tuning options. To learn how to use these options, see the [syntax](#syntax) explanation.

|Tuning option|Description|
|--|--|
|`MaxStringSize`|The default behavior of Azure Data Explorer is to consider string values as `NVARCHAR(MAX)`. For applications that don't work well with the `NVARCHAR(MAX)` type, you can cast the data to `NVARCHAR(`*n*`)`.|
|`AadAuthority`|Used to specify the Microsoft Entra tenant ID for authentication.|

### Syntax

[ `Language` | `Application` ] `=` *ExpectedArguments*`@`*TuningOptions*

[!INCLUDE [syntax-conventions-note](includes/syntax-conventions-note.md)]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*ExpectedArguments*|string|&check;|The expected value for the `Language` or `Application` field in TDS.|
|*TuningOptions*|string||Zero or more comma-separated [supported tuning options](#supported-tuning-options). Each tuning option must be in the format of *TuningOptionName*`:`*TuningOptionValue*.|

### Example

The following example specifies the Microsoft Entra tenant ID in an ODBC connection string using the `Language` property and the `AadAuthority` tuning option.

```odbc
Driver={ODBC Driver 17 for SQL Server};Server=myadxcluster.westeurope.kusto.windows.net;Database=mydatabase;Authentication=ActiveDirectoryServicePrincipal;Language=any@AadAuthority:57B489CD-590C-417F-A8B9-E75D2F9A04C8,MaxStringSize:5000;UID=A9BCAB99-8AAD-4411-A232-37E2116B935E;PWD=mysecret
```

## Related content

* [Connect with ODBC](connect-odbc.md)
* [Connect with JDBC](connect-jdbc.md)
* [Connect from common apps](connect-common-apps.md)
* [Run KQL queries and call stored functions](sql-kql-queries-and-stored-functions.md)
