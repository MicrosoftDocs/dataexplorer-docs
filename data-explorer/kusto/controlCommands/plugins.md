---
title: Plugins - Azure Kusto | Microsoft Docs
description: This article describes Plugins in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
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

**Syntax**

`.disable` `plugin` *PluginName*

## Enable plugin

Enable a plugin. 

**Syntax**

`.enable` `plugin` *PluginName*

**Examples**

Show plugins list
 
```kusto
.show plugins
``` 

Enable plugin autocluster
 
```kusto
.enable plugin autocluster
``` 

Disable plugin autocluster
 
```kusto
.disable plugin autocluster
``` 