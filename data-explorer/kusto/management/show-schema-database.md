---
title: .show databases schema - Azure Data Explorer | Microsoft Docs
description: This article describes .show databases schema in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# .show database schema commands

The following commands show database schema as a table, JSON object, or CSL script.

## .show databases schema

**Syntax**

`.show` `database` *DatabaseName* `schema` [`details`] [`if_later_than` *"Version"*] 

`.show` `databases` `(` *DatabaseName1*`,` ...`)` `schema` `details` 
 
`.show` `databases` `(` *DatabaseName1* if_later_than *"Version"*`,` ...`)` `schema` `details`

**Returns**

Returns a flat list of the structure of the selected databases with all their tables and columns in a single table or JSON object.
When used with a version, the database is only returned if it's a later version than the version provided.

> [!NOTE]
> The version should only be provided in "vMM.mm" format. MM represents the major version and mm represent the minor version.

**Example** 
 
The database 'TestDB' has one table called 'Events'.

```kusto
.show database TestDB schema 
```

**Output**

|DatabaseName|TableName|ColumnName|ColumnType|IsDefaultTable|IsDefaultColumn|PrettyName|Version
|---|---|---|---|---|---|---|--- 
|TestDB||||False|False||v.1.1		
|TestDB|Events|||True|False||		
|TestDB|Events|	Name|System.String|True|False||		
|TestDB|Events|	StartTime|	System.DateTime|True|False||	
|TestDB|Events|	EndTime|	System.DateTime|True|False||		
|TestDB|Events|	City|	System.String|True|	False||		
|TestDB|Events|	SessionId|	System.Int32|True|	True|| 

**Example** 

In the following example, the database is only returned if it's a later version than the version provided.
 
```kusto
.show database TestDB schema if_later_than "v1.0" 
```

**Output**

|DatabaseName|TableName|ColumnName|ColumnType|IsDefaultTable|IsDefaultColumn|PrettyName|Version
|---|---|---|---|---|---|---|--- 
|TestDB||||False|False||v.1.1		
|TestDB|Events|||True|False||		
|TestDB|Events|	Name|System.String|True|False||		
|TestDB|Events|	StartTime|	System.DateTime|True|False||	
|TestDB|Events|	EndTime|	System.DateTime|True|False||		
|TestDB|Events|	City|	System.String|True|	False||		
|TestDB|Events|	SessionId|	System.Int32|True|	True||  

Because a version lower than the current database version was provided, the 'TestDB' schema was returned. Providing an equal or higher version would have generated an empty result.

## .show database schema as json

**Syntax**

`.show` `database` *DatabaseName* `schema` [`if_later_than` *"Version"*]  `as` `json`
 
`.show` `databases` `(` *DatabaseName1*`,` ...`)` `schema` `as` `json`
 
`.show` `databases` `(` *DatabaseName1* if_later_than *"Version"*`,` ...`)` `schema` `as` `json`

**Returns**

Returns a flat list of the structure of the selected databases with all their tables and columns as a JSON object.
When used with a version, the database is only returned if it's a later version than the version provided.

**Example** 
 
```kusto
.show database TestDB schema as json
```

**Output**

```json
"{""Databases"":{""TestDB"":{""Name"":""TestDB"",""Tables"":{""Events"":{""Name"":""Events"",""DefaultColumn"":null,""OrderedColumns"":[{""Name"":""Name"",""Type"":""System.String""},{""Name"":""StartTime"",""Type"":""System.DateTime""},{""Name"":""EndTime"",""Type"":""System.DateTime""},{""Name"":""City"",""Type"":""System.String""},{""Name"":""SessionId"",""Type"":""System.Int32""}]}},""PrettyName"":null,""MajorVersion"":1,""MinorVersion"":1,""Functions"":{}}}}"
```

## .show database schema as csl script

Generates a CSL script with all the required commands to create a copy of the given (or current) database schema.

**Syntax**

`.show` `database` *DatabaseName* `schema` `as` `csl` `script` [`with(`*Options*`)`]

**Arguments**

The following *Options* are all optional:

* `IncludeEncodingPolicies`: (`true` | `false`) - If `true`, encoding policies at the database/table/column level will be included. Defaults to `false`. 
* `IncludeSecuritySettings`: (`true` | `false`) - Defaults to `false`. If `true`, the following options would be included:
  * Authorized principals at the database/table level.
  * Row level security policies at the table level.
  * Restricted view access policies at the table level.
* `IncludeIngestionMappings`: (`true` | `false`) - If `true`, ingestion mappings at the table level will be included. Defaults to `false`. 

**Returns**

The script, returned as a string, will contain:

* Commands to create the database and set its pretty name, if any.
  * The generated command will create a volatile database, and will be commented-out when added to the script.
* Commands to create all the tables in the database.
* Commands to set all database/tables/columns policies to match the original policies.
* Commands to create or alter all user-defined functions in the database.

**Example** 
 
```kusto
.show database TestDB schema as csl script

.show database TestDB schema as csl script with(IncludeSecuritySettings = true)
```
