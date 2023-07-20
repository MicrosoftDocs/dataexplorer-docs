---
title: .show databases entities command
description: Learn how to use the `.show databases entities` command to show databases' entities.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 07/20/2023
---
# .show databases entities command

The following commands shows databases's entities, such as tables, materialized views, external tables, etc.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run these commands. For more information, see [role-based access control](access-control/role-based-access-control.md).

## .show databases entities

### Syntax

`.show` `databases` `entities` [`with` `(`*Options*`)`]

#### Supported options

|Key|Value|Description|
|--|--|--|
|`showObfuscatedStrings`| bool | Defaults to `false`. If `true`, credentials persisted in Kusto configurations are returned. To use this option, you must either be a database admin or entity creator. If you don't have these permissions, the command fails.|
|`resolveFunctionsSchema`| bool | Defaults to `false`. If `true`, returned stored functions will have output schema resolved.|

### Returns

Returns a list of entities of all cluster databases visible to the user. Database entities are: tables, materialized views, external tables, etc.

> [!IMPORTANT]
> By default, all databases' entites are returned. To make the command execution more optimal, add a `where` condition that filters by specific databases and/or entity types or names (see examples section below).

#### Returned columns

|Column|Description|
|--|--|
|DatabaseName|Name of the database where the entity is defined|
|EntityType|One of: `Table`, `MaterialiedView`, `ExternalTable`, `Function`, `EntityGroup`|
|EntityName|The name of the entity|
|DocString|Entity documentation, if exists|
|Folder|Folder name under which the entity is located|
|CslInputSchema|Entity input schema in CSL schema format, if applicable. For functions, this is the function parameters schema|
|Content|Entity content, if applicable. For functions, it's a body of the function|
|CslOutputSchema|Entity output schema in CSL schema format|

### Examples

#### Show databases entities

```kusto
.show databases entities
| where DatabaseName == "TestDB"
```

**Output**

|DatabaseName|EntityType|EntityName|DocString|Folder|CslInputSchema|Content|CslOutputSchema|
|---|---|---|---|---|---|---|---|
|TestDB|Table|GeoIP|Table containing Geolocation info per IP network|My tables|||['network']:string, locale_code:string, continent_code:string, continent_name:string, country_iso_code:string,country_name:string|
|TestDB|MaterializedView|MV1|My first materialized view||||a:long, b:string, c:long|
|TestDB|Function|MeaningLessFn|My first function|Functions|(T:(s:string,a:long,b:long), k:long)|{T \| extend substring(s, a, b) \| take k}||
