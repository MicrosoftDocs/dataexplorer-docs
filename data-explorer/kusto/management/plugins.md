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

Kusto offers command to
[list the available plugins](#show-plugins),
[disable a plugin](#disable-plugin), or
[enable a plugin](#enable-plugin).

## Show plugins

List all the plugins of this cluster.

**Syntax**

`.show` `plugins`


**Output**

|PluginName |IsEnabled
|---|---
|autocluster |false 
|busket |true

## Disable plugin

Disable a plugin. 

The permission required to run this command is `All Databases admin`.

**Syntax**

`.disable` `plugin` *PluginName*

## Enable plugin

Enable a plugin. 

The permission required to run this command is `All Databases admin`.

**Syntax**

`.enable` `plugin` *PluginName*

**Examples**

Show plugins list
 
<!-- csl -->
```kusto
.show plugins
``` 

Enable plugin autocluster
 
<!-- csl -->
```kusto
.enable plugin autocluster
``` 

Disable plugin autocluster
 
<!-- csl -->
```kusto
.disable plugin autocluster
``` 