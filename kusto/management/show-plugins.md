---
title: .show plugins command
description: Learn how to use the `.show plugins` command to list all plugins of the cluster.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/01/2024
monikerRange: "azure-data-explorer"
---
# .show plugins command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]


Lists all plugins of the cluster.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `plugins`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

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

## Related content

* [.disable plugin](disable-plugin.md)
* [.enable plugin](enable-plugin.md)
