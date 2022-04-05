---
title: Disable plugin commands- Azure Data Explorer
description: This article describes plugins management command .disable plugin in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/02/2020
---
# .disable plugin

Disables a plugin.

This command requires `All Databases admin` permission.

## Syntax

`.disable` `plugin` *PluginName*

## Example
 
<!-- csl -->
```kusto
.disable plugin autocluster
``` 

## Next steps

* [`.show plugins`](show-plugins.md)
* [`.enable plugin`](enable-plugin.md)