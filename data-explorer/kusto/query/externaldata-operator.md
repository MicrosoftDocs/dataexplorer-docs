---
title: externaldata operator - Azure Data Explorer | Microsoft Docs
description: This article describes externaldata operator in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# externaldata operator

Returns a table whose schema is defined in the query itself, and whose data is read from an external raw file.

Note that this operator does not have a pipeline input.

**Syntax**

`externaldata` `(` *ColumnName* `:` *ColumnType* [`,` ...] `)` `[` *DataFileUri* `]` [`with` `(` *Prop1* `=` *Value1* [`,` ...] `)`]

**Arguments**

* *ColumnName*, *ColumnType*: These define the schema of the table. The Syntax
  used is precisely the same as the syntax used when defining a table
  (see [.create table](../management/tables.md#create-table)).
* *DataFileUri*: The URI (including authentication option, if any) for the file
  holding the data.
* *Prop1*, *Value1*, ...: Additional properties to describe how the data in the raw file
  is to be interpreted. Similar to ingestion properties.

**Returns**

This operator returns a data table of the given schema, whose data was parsed
from the specified URI.

**Example**

The following example shows how to parse at query time a raw CSV data file 
in Azure Storage Blob. (Please note that in reality the `data.csv` file will
be appended by a SAS token to authorize the request.)

```kusto
externaldata (Date:datetime, Event:string)
[h@"https://storageaccount.blob.core.windows.net/storagecontainer/data.csv"]
| where strlen(Event) > 4
```