---
title: .alter function command
description: Learn how to use the `.alter function` command to alter an existing function.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 07/29/2024
---
# .alter function command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Alters an existing function and stores it inside the database metadata.
Rules for parameter types and CSL statements are the same as for [`let` statements](../query/let-statement.md).

## Permissions

You must have at least [Function Admin](../access-control/role-based-access-control.md) permissions to run this command. The principal that creates the function is automatically made a Function Admin.

## Syntax

`.alter` `function` [ `with` `(` *propertyName* `=` *propertyValue* [`,` ...]`)`] *functionName*`(`*parameters*`)` `{` *body* `}`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*functionName* | `string` |  :heavy_check_mark: | The name of the function to alter.|
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|
|*parameters*  | `string` | | A comma-separated list of parameters required by the function. The format for each parameter must be *ParameterName*`:`*ParameterDataType*.|
|*body*| `string` |  :heavy_check_mark: | Zero or more `let` statements followed by a valid CSL expression that is evaluated upon function invocation.|

> [!NOTE]
>
> * If the function doesn't exist, an error is returned. For creating a new function, see [`.create function`](create-function.md)
> * Not all Kusto types are supported in `let` statements. Supported types are: string, long, datetime, timespan, and double.

### Supported properties

|Name|Type|Description|
|--|--|--|
|`docstring`| `string` |A description of the function for UI purposes.|
|`folder`| `string` |The name of a folder used for UI functions categorization.|
|`view`| `bool` |Designates this function as a stored view. Stored views can participate in [search](../query/search-operator.md) and [union *](../query/union-operator.md) scenarios. For more information, see [Views](../query/schema-entities/views.md).|
|`skipvalidation`| `bool` |Determines whether to run validation logic on the function and fails the process if the function isn't valid. The default is `false`.|

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAz3LMQ6CQBBG4X5P8XcLibGgNKFTK604wQYGnLg7Y5ZRQtS7Swixe8X39iEaZfRPaY1V3MR2Q9FpO1pmGVDDHynpH2AFj5BDomX0O%2FQaO8q1v87ntXzpltx4VaT5wontgKgylIB7N6Y5nV4kNuIDC3fChr4%2FBJIIio4AAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
.alter function
with (docstring = 'Demo function with parameter', folder='MyFolder')
MyFunction2(myLimit: long)  
{StormEvents | take myLimit}
```

|Name |Parameters |Body|Folder|DocString|
|---|---|---|---|---|
|MyFunction2 |(myLimit: long)| {StormEvents &#124; take myLimit}|MyFolder|Demo function with parameter|
