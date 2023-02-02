---
title: Enable plugin command - Azure Data Explorer
description: This article describes plugins management command .enable plugin in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/02/2020
---
# .enable plugin

Enables a plugin.

> [!NOTE]
> To enable language extensions (`R`, `python`) follow [these instructions](../../language-extensions.md#enable-language-extensions-on-your-cluster).

## Permissions

This command requires [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions.

## Syntax

`.enable` `plugin` *PluginName*

## Example

<!-- csl -->
```kusto
.enable plugin autocluster
``` 

## Next steps

* [`.disable plugin`](disable-plugin.md)
* [`.show plugins`](show-plugins.md)

