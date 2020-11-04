---
title: Enable plugin command - Azure Data Explorer
description: This article describes plugins management command .enable plugin in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 11/02/2020
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# .enable plugin

::: zone pivot="azuredataexplorer"

Enables a plugin.

This command requires `All Databases admin` permission.

## Syntax

`.enable` `plugin` *PluginName*

## Example

<!-- csl -->
```kusto
.enable plugin autocluster
``` 

## Next steps

* [.disable plugin](disable-plugin.md)
* [.show plugins](show-plugins.md)

::: zone-end

::: zone pivot="azuremonitor"

This capability isn't supported in Azure Monitor.

::: zone-end