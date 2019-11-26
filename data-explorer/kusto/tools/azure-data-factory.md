---
title: Azure Data Factory - Azure Data Explorer | Microsoft Docs
description: This article describes Azure Data Factory in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 11/20/2019
---
# Azure Data Factory

You can copy data from any supported source data store to Kusto, or copy data from Kusto to any
supported sink data store.

The Kusto connector allows you to do the following:
* Copy data by using Azure Active Directory (Azure AD) application token authentication with a service principal.
* As a source, retrieve data by using a KQL (Kusto) query.
* As a sink, append data to a destination table.

## Additional information:
* [Integration with ADF](https://docs.microsoft.com/en-us/azure/data-explorer/data-factory-integration) - Overview on capabilities, performance, permissions, and more.
* [ADX Connector](https://docs.microsoft.com/en-us/azure/data-factory/connector-azure-data-explorer) - Overview on ADX Connector and its usage in Copy and Lookup activities.
* [Walkthrough: Copying data](https://docs.microsoft.com/en-us/azure/data-factory/connector-azure-data-explorer)
* [Walkthrough: ADX Command and Lookup activities](https://docs.microsoft.com/en-us/azure/data-explorer/data-factory-command-activity)
* [Walkthrough: Bulk Copy from Database to ADX Template](https://docs.microsoft.com/en-us/azure/data-explorer/data-factory-template)

## Tips and common pitfalls

**Failure to ingest CSV files due to improper escaping:**<br/>
ADX expects CSV files to align with [RFC 4180] (https://www.ietf.org/rfc/rfc4180.txt).
In particular, it expects:
1. Fields which contain characters that require escaping (such as double-quotes and newlines) should start and end with a double-quote character (w/o whitespace!) and all double-quote characters *inside* the field are escaped by doubling them up. For example, _"Hello, ""World"""_ is a valid CSV file with a single record having a single column/field whose content is _Hello, "World"_.
2. All records in the file must have the same number of columns/fields.

ADF on the other hand, allows choosing the escape character, which means that if you have a double-quotes character inside your field, that character can be escaped by any other character, and not necessarily by doubling up the double-quotes character.
If for instance you'll generate a CSV file using ADF, and use ADF's default escape character (backslash) or set the escape character to any other character which is not double-quotes, then you'll end up receiving a CSV file which doesn't comply to RFC 4180, and hence ingestion of that file to Kusto will fail.

As an example, the following text values:
Hello, "World"<br/>
ABC   DEF<br/>
"ABC\D"EF<br/>
"ABC DEF<br/>

Should appear in a proper CSV file as follows:
"Hello, ""World"""<br/>
"ABC   DEF"<br/>
"""ABC DEF"<br/>
"""ABC\D""EF"<br/>

By using the default escape character (backslash), the CSV will have the following values (*which won't work with ADX*):
"Hello, \"World\""<br/>
"ABC   DEF"<br/>
"\"ABC DEF"<br/>
"\"ABC\D\"EF"<br/>


**Nested JSON objects**<br/>
When copying a JSON file to ADX, you might encounter some difficulties if your JSON structue has either an Array or an Object data types:
a. Arrays are still not supported by default.
b. By default, ADF will flatten the child items of that object, and try to map each child item to a different column in your Kusto table. That might not fit your needs, if you'd like the entire object item to be mapped to a single column in Kusto.

In that case, you have the following options:
1. Ingest the entire JSON row into a single dynamic column in Kusto.
2. Manually edit the pipeline definition, by using ADF's json editor (the "Code" button on the top-right corner of the page):
   a. Under the 'mappings' section, remove the multiple mappings that were created for each child item, and instead - add a single mapping that maps your object type to your Kusto column.
   b. At the end of the 'mappings' section, right after the closing square bracket, you should add a comma followed by the following line:<br/>
   _"mapComplexValuesToString": true_