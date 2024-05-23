---
title: .execute cluster script command
description: Learn how to use the `.execute cluster script` command to execute a batch of management commands in the scope of a single cluster in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 04/24/2024
---
# .execute cluster script command

Executes a batch of management commands in the scope is a cluster. 

> [!NOTE]
> Database-level commands are not supported by `.execute cluster script` command. Use `.execute database script` command instead.
> Select the full command text before running it. Otherwise, it will stop at the first empty line in the script.

## Permissions

You must have at least [Cluster Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.execute` `cluster` `script`  
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
>* Script execution is sequential, but non-transactional, and no rollback is performed upon error. It's advised to use the idempotent form of commands when using `.execute cluster script`.
>* Execution of the command requires Cluster Admin permissions, in addition to permissions that may be required by each specific command.
>* Default behavior of the command - fail on the first error, it can be changed using property argument.
>* Read-only management commands (`.show` commands) aren't executed and are reported with status `Skipped`.

