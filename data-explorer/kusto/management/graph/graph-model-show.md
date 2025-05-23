---
title: .show graph_model command
description: Learn how to display specific graph model versions
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/27/2025
---

# .show graph_model (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Shows the details of a specific graph model, including its versions.

## Syntax

`.show` `graph_model` *GraphModelName* [`with` `(`*Property* `=` *Value* [`,` ...]`)`]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|Yes|The name of the graph model to show.|
|*Property*|String|No|A property to control which version(s) to show. See [Properties](#properties).|
|*Value*|String|No|The value of the corresponding property.|

### Properties

|Name|Type|Required|Description|
|--|--|--|--|
|`id`|String|No|The specific version identifier of the graph model to show. Use `*` to show all versions. If not specified, the latest version is shown.|

## Returns

This command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|Name|String|The name of the graph model.|
|Version|String|The version identifier of the graph model.|
|DatabaseName|String|The name of the database containing the graph model.|
|Folder|String|The folder path where the graph model is stored, if any.|
|DocString|String|The documentation string associated with the graph model, if any.|
|Definition|String|The JSON definition of the graph model.|
|NodeCount|Long|The approximate number of nodes in the graph model version.|
|EdgeCount|Long|The approximate number of edges in the graph model version.|
|Properties|Dynamic|A JSON object containing additional properties of the graph model version.|
|Created|DateTime|The date and time when the graph model version was created.|
|LastModified|DateTime|The date and time when the graph model version was last modified.|

## Examples

### Show the latest version of a graph model

```kusto
.show graph_model SocialNetwork
```

**Output**

|Name|Version|DatabaseName|Folder|DocString|Definition|NodeCount|EdgeCount|Properties|Created|LastModified|
|---|---|---|---|---|---|---|---|---|---|---|
|SocialNetwork|v3|MyDatabase|Social|A graph model representing user interactions|{...}|15426|67845|{"autoRefresh":"Weekly"}|2025-04-23T14:32:18Z|2025-04-23T14:32:18Z|

### Show a specific version of a graph model

```kusto
.show graph_model ProductRecommendations with (id = "v2.0")
```

**Output**

|Name|Version|DatabaseName|Folder|DocString|Definition|NodeCount|EdgeCount|Properties|Created|LastModified|
|---|---|---|---|---|---|---|---|---|---|---|
|ProductRecommendations|v2.0|MyDatabase|Recommendations|Product purchase relationships|{...}|7254|35281|{"autoRefresh":"Daily"}|2025-04-15T09:45:12Z|2025-04-15T09:45:12Z|

### Show all versions of a graph model

```kusto
.show graph_model NetworkTraffic with (id = "*")
```

**Output**

|Name|Version|DatabaseName|Folder|DocString|Definition|NodeCount|EdgeCount|Properties|Created|LastModified|
|---|---|---|---|---|---|---|---|---|---|---|
|NetworkTraffic|v1|MyDatabase|Security|Network traffic analysis graph|{...}|1542|8947|{"autoRefresh":"Hourly"}|2025-03-10T13:24:56Z|2025-03-10T13:24:56Z|
|NetworkTraffic|v2|MyDatabase|Security|Network traffic analysis graph|{...}|2354|12458|{"autoRefresh":"Hourly"}|2025-03-25T10:15:22Z|2025-03-25T10:15:22Z|
|NetworkTraffic|v3|MyDatabase|Security/NetworkAnalysis|Enhanced network traffic analysis|{...}|3128|18754|{"autoRefresh":"Hourly"}|2025-04-12T15:42:18Z|2025-04-12T15:42:18Z|

## Notes

- The `.show graph_model` command is useful for examining the history and evolution of a specific graph model.
- When showing all versions of a graph model, the results are ordered by creation date, with the oldest version first.
- The Definition column contains the complete JSON definition of the graph model, which might be large for complex models.

## Required permissions

To run this command, the user needs [Database Viewer permissions](../../management/access-control/role-based-access-control.md).

## Related content

* [Graph model overview](graph-model-overview.md)
* [.create-or-alter graph_model](graph-model-create-or-alter.md)
* [.show graph_models](graph-models-show.md)
* [.drop graph_model](graph-model-drop.md)