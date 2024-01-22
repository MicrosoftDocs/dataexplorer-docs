---
title:  .show operation details command
description: Learn how to use the `.show operation details` command to view the details of an operation.
ms.topic: reference
ms.date: 11/30/2023
---
# .show operation details command

The `.show operation details` command retrieves the results of operations that persist their results.

> [!NOTE]
> * Only some management commands persist their results. The commands that do usually do so by default on asynchronous executions only, using the `async` keyword. See the documentation for the specific command. For example, see [data export](data-export/index.md).
> * This command can only be invoked after the operation completed successfully. To check the state of the operation before running this command, use the [.show operations command](show-operations.md).

## Syntax

`.show` `operation` *OperationId* `details`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *OperationId* | `guid` | | The operation ID for which to show details.|

## Returns

The result is different per type of operation, and matches the schema of the operation result, when executed synchronously.

## Examples

The *OperationId* in the example returns from an asynchronous execution of one
of the [data export](../management/data-export/index.md) commands.

```kusto
.export 
  async 
  to csv ( 
    h@"https://storage1.blob.core.windows.net/containerName;secretKey", 
    h@"https://storage1.blob.core.windows.net/containerName2;secretKey" 
  ) 
  <| myLogs 
```

The async export command returned the following operation ID:

|OperationId|
|---|
|56e51622-eb49-4d1a-b896-06a03178efcd|

This operation ID can be used when the command finished querying the exported blobs.

```kusto
.show operation 56e51622-eb49-4d1a-b896-06a03178efcd details 
```

|Path|NumRecords |
|---|---|
|http://storage1.blob.core.windows.net/containerName/1_d08afcae2f044c1092b279412dcb571b.csv|10|
|http://storage1.blob.core.windows.net/containerName/2_454c0f1359e24795b6529da8a0101330.csv|15|

## Related content

* [.show operations](show-operations.md)
