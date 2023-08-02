---
title: .disable plugin command
description: Learn how to use the `.disable plugin` command to disable a plugin. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 05/24/2023
---
# .disable plugin command

Disables a plugin.

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.disable` `plugin` *PluginName*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*PluginName*|string|&check;|The name of the plugin to disable.|

## Example

The following command disables the autocluster plugin on the cluster.

```kusto
.disable plugin autocluster
```

## See also

* [`.show plugins`](show-plugins.md)
* [`.enable plugin`](enable-plugin.md)
