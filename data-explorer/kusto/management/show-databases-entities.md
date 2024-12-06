---
title: .show databases entities command
description: Learn how to use the `.show databases entities` command to show databases' entities.
ms.reviewer: mispecto
ms.topic: reference
ms.date: 08/11/2024
---
# .show databases entities command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The following command shows databases' entities, such as tables, materialized views, external tables, etc.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run these commands. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `databases` `entities` [`with` `(`*Options*`)`]

### Supported options

|Key|Value|Description|
|--|--|--|
|`showObfuscatedStrings`| `bool` | Defaults to `false`. If `true`, [obfuscated strings](../query/scalar-data-types/string.md#obfuscated-string-literals) in database entity bodies are shown. To use this option, you must either be a database admin or entity creator. If you don't have these permissions, the obfuscated strings are **not** shown.|
|`resolveFunctionsSchema`| `bool` | Defaults to `false`. If `true`, returned stored functions have output schema resolved.|

## Returns

:::moniker range="azure-data-explorer"
Returns a list of entities of all cluster databases visible to the user. Database entities are: tables, materialized views, external tables, etc.
::: moniker-end
:::moniker range="microsoft-fabric"
Returns a list of entities of all eventhouse databases visible to the user. Database entities are: tables, materialized views, external tables, etc.
::: moniker-end

> [!IMPORTANT]
> By default, all databases' entites are returned. To make the command execution more optimal, add a `where` condition that filters by specific databases and/or entity types or names (see examples section in this article).

### Returns

|Output parameter |Type |Description|
|--|--|--|
|DatabaseName|`string`|Name of the database where the entity is defined.|
|EntityType|`string`|One of `Table`, `MaterialiedView`, `ExternalTable`, `Function`, or `EntityGroup`.|
|EntityName|`string`|The name of the entity.|
|DocString|`string`|Entity documentation, if exists.|
|Folder|`string`|Folder name under which the entity is located.|
|CslInputSchema|`string`|Entity input schema in CSL schema format, if applicable. For functions, the schema is for the function parameters.|
|Content|`string`|Entity content, if applicable. For functions, it's a body of the function.|
|CslOutputSchema|`string`|Entity output schema in CSL schema format.|
|Properties|`dynamic`|Dynamic structure that provides more details on the entity (currently unused.)|

## Examples

### Show databases entities

The following example returns a list of entities from the `TestDB` database with obfuscated strings shown.

```kusto
.show databases entities with (showObfuscatedStrings=true)
| where DatabaseName == "TestDB"
```

**Output**

|DatabaseName|EntityType|EntityName|DocString|Folder|CslInputSchema|Content|CslOutputSchema|Properties|
|---|---|---|---|---|---|---|---|---|
|TestDB|Table|GeoIP|Table containing Geolocation info per IP network|My tables|||['network']:string, locale_code:string, continent_code:string, continent_name:string, country_iso_code:string,country_name:string|{}|
|TestDB|MaterializedView|MV1|My first materialized view||||a:long, b:string, c:long|{}|
|TestDB|Function|MeaningLessFn|My first function|Functions|(T:(s:string,a:long,b:long), k:long)|{T \| extend substring(s, a, b) \| take k}||{}|

### Resolving functions schema

The following example uses the `.show databases entities` command with the function schema resolved to return information about the *MeaningLessFn* function in the `TestDB` database. The output includes function schema.

```kusto
.show databases entities with (resolveFunctionsSchema=true)
| where DatabaseName == "TestDB" and EntityType == "Function" and EntityName == "MeaningLessFn"
```

**Output**

|DatabaseName|EntityType|EntityName|DocString|Folder|CslInputSchema|Content|CslOutputSchema|Properties|
|---|---|---|---|---|---|---|---|---|
|TestDB|Function|MeaningLessFn|My first function|Functions|(T:(s:string,a:long,b:long), k:long)|{T \| extend substring(s, a, b) \| take k}|s:string, a:long, b:long, Column1:string|{}|
