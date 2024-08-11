---
title: .enable plugin command
description: Learn how to use the `.enable plugin` command to enable a plugin.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "azure-data-explorer"
---
# .enable plugin command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Enables a plugin.

> [!NOTE]
> To enable the `R` or `Python` language extensions, see [Enable language extensions on your cluster](/azure/data-explorer/language-extensions#enable-language-extensions-on-your-cluster).

## Permissions

You must have [AllDatabasesAdmin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.enable` `plugin` *PluginName*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*PluginName*| `string` | :heavy_check_mark:|The name of the plugin to enable.|

## Example

The following command enables the autocluster plugin on the cluster.

```kusto
.enable plugin autocluster
```

## Related content

* [`.disable plugin`](disable-plugin.md)
* [`.show plugins`](show-plugins.md)
