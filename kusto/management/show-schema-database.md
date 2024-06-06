---
title: .show database schema command
description: Learn how to use the `.show database schema` command to show the database schema as a table, JSON object, or CSL script.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# .show database schema command

The following commands show database schema as a table, JSON object, or CSL script.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run these commands. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## .show database schema

### Syntax

`.show` `database` *DatabaseName* `schema` [`details`] [`if_later_than` *"Version"*]

`.show` `databases` `(`*DatabaseName* [`,` ...]`)` `schema` `details`

`.show` `databases` `(`*DatabaseName* `if_later_than` *"Version"* [`,` ...]`)` `schema` `details`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database for which to show the schema.|
|*Version*| `string` ||The version in "vMM.mm" format. MM represents the major version and mm represents the minor version.|

### Returns

Returns a flat list of the structure of the selected databases with all their tables and columns in a single table or JSON object.
When used with a version, the database is only returned if it's a later version than the version provided.

### Examples

#### Show database schema

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

#### Show database schema based on version

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

### Syntax

`.show` `database` *DatabaseName* `schema` [`if_later_than` *"Version"*]  `as` `json`

`.show` `databases` `(`*DatabaseName* [`,` ...]`)` `schema` `as` `json` [`with` `(`*Options*`)`]

`.show` `databases` `(`*DatabaseName* `if_later_than` *"Version"* [`,` ...]`)` `schema` `as` `json` [`with` `(`*Options*`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database for which to show the schema.|
|*Version*| `string` ||The version in "vMM.mm" format. MM represents the major version and mm represents the minor version.|
|*Options*| `string` ||A list of comma-separated key-value pairs used to determine which database entity schemas to return. If none are specified, then all entities are returned. See [supported entity options](#supported-entity-options).|

#### Supported entity options

The following table describes the values to provide for the *Options* parameter.

|Key|Value|Description|
|--|--|--|
|`Tables`| `bool` | If `true`, tables are returned.|
|`ExternalTables`| `bool` | If `true`, external tables are returned.|
|`MaterializedViews`| `bool` | If `true`, materialized views are returned.|
|`Functions`| `bool` | If `true`, functions are returned.|

### Returns

Returns a flat list of the structure of the selected databases with all their tables and columns as a JSON object.
When used with a version, the database is only returned if it's a later version than the version provided.

### Examples
 
```kusto
.show database TestDB schema as json

.show databases (TestDB, TestDB2) schema as json with(Tables=True, Functions=True)
```

**Output**

```json
"{""Databases"":{""TestDB"":{""Name"":""TestDB"",""Tables"":{""Events"":{""Name"":""Events"",""DefaultColumn"":null,""OrderedColumns"":[{""Name"":""Name"",""Type"":""System.String""},{""Name"":""StartTime"",""Type"":""System.DateTime""},{""Name"":""EndTime"",""Type"":""System.DateTime""},{""Name"":""City"",""Type"":""System.String""},{""Name"":""SessionId"",""Type"":""System.Int32""}]}},""PrettyName"":null,""MajorVersion"":1,""MinorVersion"":1,""Functions"":{}}}}"
```

## .show database schema as csl script

Generates a CSL script with all the required commands to create a copy of the given (or current) database schema.

### Syntax

`.show` `database` *DatabaseName* `schema` `as` `csl` `script` [`with` `(`*Options*`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database for which to show the schema.|
|*Options*| `string` ||A list of comma-separated key-value pairs used to determine what to return. See [supported options](#supported-options).|

#### Supported options

|Key|Value|Description|
|--|--|--|
|`IncludeEncodingPolicies`| `bool` | Defaults to `true`. If `true`, encoding policies at the database/table/column level are included.|
|`IncludeSecuritySettings`| `bool` | Defaults to `true`. If `true`, the following options are included:<br/>- Authorized principals at the database/table level.<br/>- Row level security policies at the table level.<br/>- Restricted view access policies at the table level.|
|`IncludeIngestionMappings`| `bool` | Defaults to `true`. If `true`, ingestion mappings at the table level are included.|
|`ShowObfuscatedStrings`| `bool` | Defaults to `false`. If `true`, credentials persisted in Kusto configurations are returned. To use this option, you must either be a database admin or entity creator. If you don't have these permissions, the command fails.|

### Returns

The script, returned as a string, will contain:

* Commands to create all the tables in the database.
* Commands to set all database/tables/columns policies to match the original policies.
* Commands to create or alter all user-defined functions in the database.

### Examples

```kusto
.show database TestDB schema as csl script

.show database TestDB schema as csl script with (ShowObfuscatedStrings = true)
```
