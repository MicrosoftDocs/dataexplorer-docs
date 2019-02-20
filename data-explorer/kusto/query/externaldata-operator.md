---
title: externaldata operator - Azure Data Explorer | Microsoft Docs
description: This article describes externaldata operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/16/2019
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
  is to be interpreted, as listed under [ingestion properties](../management/data-ingestion/index.md).
  Currently, the only property that is supported is the `format` property.

**Returns**

This operator returns a data table of the given schema, whose data was parsed
from the specified URI.

**Example**

The following example shows how to find all records in a table whose
`UserID` column falls into a known set of IDs, held (one per line)
in an external blob. Because the set is indirectly referenced by the
query, it can be very large.

```kusto
Users
| where UserID in (externaldata (UserID:string) [
    @"https://storageaccount.blob.core.windows.net/storagecontainer/users.txt"
      h@"?...SAS..."
    ])
| ...
```