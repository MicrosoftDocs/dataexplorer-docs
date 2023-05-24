---
title:  Enable plugin command
description: This article describes plugins management command .enable plugin in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 04/25/2023
---
# .enable plugin

Enables a plugin.

> [!NOTE]
> To enable the `R` or `Python` language extensions, see [Enable language extensions on your cluster](../../language-extensions.md#enable-language-extensions-on-your-cluster).

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.enable` `plugin` *PluginName*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*PluginName*|string|&check;|The name of the plugin to enable.|

## Example

The following command enables the autocluster plugin on the cluster.

```kusto
.enable plugin autocluster
```

## See also

* [`.disable plugin`](disable-plugin.md)
* [`.show plugins`](show-plugins.md)
