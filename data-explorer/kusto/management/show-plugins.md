---
title: Plugins command show plugins - Azure Data Explorer
description: This article describes plugins management commands in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/02/2020
---
# .show plugins

Lists all plugins of the cluster.

## Permissions

You must have Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `plugins`

## Returns

Returns a table containing the following fields:

* **PluginName**: Name of the plugin
* **IsEnabled**: A boolean value that indicates if the plugin is enabled

## Example

<!-- csl -->
```kusto
.show plugins
```

| PluginName | IsEnabled |
|---|---|
| autocluster | false |
| basket      | true  |

## Next steps

* [.disable plugin](disable-plugin.md)
* [.enable plugin](enable-plugin.md)
