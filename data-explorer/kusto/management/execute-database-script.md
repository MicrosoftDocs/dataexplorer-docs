---
title: .execute database script command
description: Learn how to use the `.execute database script` command to execute a batch of management commands in the scope of a single database.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/26/2024
---
# .execute database script command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Executes a batch of management commands in the scope of a single database.

> [!NOTE]
> Select the full command text before running it. Otherwise, it will stop at the first empty line in the script.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.execute` `database` `script`  
[`with` `(` *PropertyName* `=` *PropertyValue* [`,` ...]`)`] `<|` *ControlCommandsScript*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*ControlCommandsScript*| `string` | :heavy_check_mark:| Text with one or more management commands.|
|*PropertyName*, *PropertyValue*| `string` || Optional properties. See [Supported properties](#supported-properties).|

### Supported properties

| PropertyName | Type | Description |
|--|--|--|
| `ContinueOnErrors` | `bool` | If set to `false` - the script stops on the first error. If set to `true` - the script execution continues. Default: `false`. |
| `ThrowOnErrors` | `bool` | If set to `true` - the script throws an error (fail) on the first error. Doesn't work together with `ContinueOnErrors`, only one is allowed. Default: `false`. |

## Returns

Each command appearing in the script is reported as a separate record in the output table. Each record has the following fields:

|Output parameter |Type |Description|
|---|---|--- |
|OperationId  | `guid` |Identifier of the command.|
|CommandType  | `string` |The type of the command.|
|CommandText  | `string` |Text of the specific command.|
|Result| `string` |Outcome of the specific command execution.|
|Reason| `string` |Detailed information about command execution outcome.|

>[!NOTE]
>
>* The script text may include empty lines and comments between the commands.
>* Commands are executed sequentially, in the order they appear in the input script.
>* Script execution is sequential, but non-transactional, and no rollback is performed upon error. It's advised to use the idempotent form of commands when using `.execute database script`.
>* Execution of the command requires Database Admin permissions, in addition to permissions that may be required by each specific command.
>* Default behavior of the command - fail on the first error, it can be changed using property argument.
>* Read-only management commands (`.show` commands) aren't executed and are reported with status `Skipped`.

:::moniker range="azure-data-explorer"
>[!Tip]
>
>* This command is useful if you want to "clone"/"duplicate" an existing database. You can use the [`.show database schema command`](show-schema-database.md) on the existing database (the source database), and use its output as the *Control-commands-script* of ".execute database script".
>* If you want to "clone"/"duplicate" the cluster, you can use its [ARM template](/azure/azure-resource-manager/templates/export-template-portal#export-template-from-a-resource) and recreate the resource.
::: moniker-end
:::moniker range="microsoft-fabric"
>[!Tip]
>
>* This command is useful if you want to "clone"/"duplicate" an existing database. You can use the [`.show database schema command`](show-schema-database.md) on the existing database (the source database), and use its output as the *Control-commands-script* of ".execute database script".
::: moniker-end

## Example

The following example executes a script with multiple operations, continuing to execute even if a command fails. The script creates or merges table `T` with columns `a` and `b` of type string. It then sets a retention policy on table `T` to soft-delete data after 10 days. Finally, it creates or alters the `SampleT1` function, which takes a parameter `myLimit` of type long and returns the first `myLimit` rows from table `T1`. The function is created without validating it during creation.

```kusto
.execute database script with (ContinueOnErrors=true)
<|
//
// Create tables
.create-merge table T(a:string, b:string)
//
// Apply policies
.alter-merge table T policy retention softdelete = 10d 
//
// Create functions
.create-or-alter function
  with (skipvalidation = "true") 
  SampleT1(myLimit: long) { 
    T1 | take myLimit
}
```

|OperationId|CommandType|CommandText|Result|Reason|
|---|---|---|---|---|
|1d28531b-58c8-4023-a5d3-16fa73c06cfa|TableCreate|.create-merge table T(a:string, b:string)|Completed||
|67d0ea69-baa4-419a-93d3-234c03834360|RetentionPolicyAlter|.alter-merge table T policy retention softdelete = 10d|Completed||
|0b0e8769-d4e8-4ff9-adae-071e52a650c7|FunctionCreateOrAlter|.create-or-alter function  with (skipvalidation = "true")SampleT1(myLimit: long) {T1 \| take myLimit}|Completed||
