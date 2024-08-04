---
title: .disable plugin command
description: Learn how to use the `.disable plugin` command to disable a plugin. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/01/2024
monikerRange: "azure-data-explorer"
---
# .disable plugin command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Disables a plugin.

## Permissions

You must have [AllDatabasesAdmin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.disable` `plugin` *PluginName*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*PluginName*| `string` | :heavy_check_mark:|The name of the plugin to disable.|

## Example

The following command disables the autocluster plugin on the cluster.

```kusto
.disable plugin autocluster
```

## Related content

* [`.show plugins`](show-plugins.md)
* [`.enable plugin`](enable-plugin.md)
