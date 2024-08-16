---
title: .create function command
description: Learn how to use the `.create function` command to create a stored function.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# .create function command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Creates a stored function, which is a reusable KQL query,  with the given name. The function definition is persisted with the database metadata.

Functions can call other functions (recursiveness isn't supported). Besides, [`let`](../query/let-statement.md) statements are allowed as part of the *Function Body*. See [`let` statements](../query/let-statement.md).

Rules for parameter types and CSL statements are the same as for [`let` statements](../query/let-statement.md).

## Permissions

You must have at least [Database User](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.create` `function` [ `ifnotexists` ] [ `with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)` ]
*functionName* `(`*parameters*`)` `{` *body* `}`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| `ifnotexists` | `string` | | If specified, the function will only be created if the function doesn't yet exist.|
|*functionName* | `string` |  :heavy_check_mark: | The name of the function to create or alter.|
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|
|*parameters*  | `string` | | A comma-separated list of parameters required by the function. The format for each parameter must be *ParameterName*`:`*ParameterDataType*.|
|*body*| `string` |  :heavy_check_mark: | A user defined function expression.|

### Supported properties

|Name|Type|Description|
|--|--|--|
|`docstring`| `string` |A description of the function for UI purposes.|
|`folder`| `string` |The name of a folder used for UI functions categorization.|
|`view`| `bool` |Designates this function as a stored view. Stored views can participate in [search](../query/search-operator.md) and [union *](../query/union-operator.md) scenarios. For more information, see [Views](../query/schema-entities/views.md).|
|`skipvalidation`| `bool` |Determines whether or not to run validation logic on the function and fail the process if the function isn't valid. The default is `false`.|

::: moniker range="azure-data-explorer"
> [!TIP]
> If a function involves [cross-cluster queries](../query/cross-cluster-or-database-queries.md) and you plan to recreate the function using a [Kusto Query Language script](/azure/data-explorer/database-script.md), set `skipvalidation` to `true`.
:::moniker-end

## Returns

|Output parameter |Type |Description|
|---|---|---|
|Name | `string` |The name of the function.
|Parameters  | `string` |The parameters required by the function.
|Body  | `string` |(Zero or more) `let` statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder| `string` |A folder used for UI functions categorization. This parameter doesn't change the way function is invoked.
|DocString| `string` |A description of the function for UI purposes.

> [!NOTE]
>
> * If the function already exists:
>   * If `ifnotexists` flag is specified, the command is ignored (no change applied).
>   * If `ifnotexists` flag is NOT specified, an error is returned.
>   * For altering an existing function, see [`.alter function`](alter-function.md)
> * Not all data types are supported in `let` statements. Supported types are: boolean, string, long, datetime, timespan, double, and dynamic.
> * Use `skipvalidation` to skip semantic validation of the function. This is useful when functions are created in an incorrect order and F1 that uses F2 is created earlier.

## Examples

### Simple demo function

The following example creates the `MyFunction1` function with a description (`docstring`), a folder named `Demo`, and defines the function.

```kusto
.create function 
with (docstring = 'Simple demo function', folder='Demo')
MyFunction1()
{StormEvents | take 100}
```

|Name|Parameters|Body|Folder|DocString|
|---|---|---|---|---|
|MyFunction1|()|{StormEvents &#124; take 100}|Demo|Simple demo function|

### Demo function with parameter

The following example creates the *MyFunction2* function with a description (`docstring`), folder named `Demo`, and defines the `MyLimit` parameter.

```kusto
.create function
with (docstring = 'Demo function with parameter', folder='Demo')
 MyFunction2(myLimit: long)
{StormEvents | take myLimit}
```

|Name|Parameters|Body|Folder|DocString|
|---|---|---|---|---|
|MyFunction2|(myLimit:long)|{StormEvents &#124; take myLimit}|Demo|Demo function with parameter|
