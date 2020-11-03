---
title: Plugins commands - Azure Data Explorer
description: This article describes plugins management commands in Azure Data Explorer.
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

# Plugins

::: zone pivot="azuredataexplorer"

Use these control commands to [list the available plugins](#show-plugins), [disable a plugin](#disable-plugin), or [enable a plugin](#enable-plugin).

## Show plugins

Lists all plugins of the cluster.

**Syntax**

`.show` `plugins`

**Output**

Returns a table containing the following fields:
* **PluginName**: Name of the plugin
* **IsEnabled**: A boolean value that indicates if the plugin is enabled

**Example**

<!-- csl -->
```kusto
.show plugins
``` 

**Output**:

| PluginName | IsEnabled |
|---|---|
| autocluster | false |
| basket      | true  |

## Disable plugin

Disables a plugin.

This command requires `All Databases admin` permission.

**Syntax**

`.disable` `plugin` *PluginName*

**Example**
 
<!-- csl -->
```kusto
.disable plugin autocluster
``` 

## Enable plugin

Enables a plugin.

This command requires `All Databases admin` permission.

**Syntax**

`.enable` `plugin` *PluginName*

**Example**

<!-- csl -->
```kusto
.enable plugin autocluster
``` 

::: zone-end

::: zone pivot="azuremonitor"

This capability isn't supported in Azure Monitor.

::: zone-end