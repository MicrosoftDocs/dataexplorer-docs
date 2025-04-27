---
title: .show graph_models command
description: Learn how to list all graph models in a database
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/27/2025
---

# .show graph_models (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Lists all graph models in the database, showing the latest version for each model by default.

## Syntax

`.show` `graph_models` [`with` `(`*Property* `=` *Value* [`,` ...]`)`]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*Property*|String|No|A property to control which versions to show. See [Properties](#properties).|
|*Value*|String|No|The value of the corresponding property.|

### Properties

|Name|Type|Required|Description|
|--|--|--|--|
|`showAll`|Boolean|No|If set to `true`, returns all versions of every graph model. If set to `false` or not specified, returns only the latest version of each graph model.|

## Returns

This command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|Name|String|The name of the graph model.|
|Version|String|The version identifier of the graph model.|
|DatabaseName|String|The name of the database containing the graph model.|
|Folder|String|The folder path where the graph model is stored, if any.|
|DocString|String|The documentation string associated with the graph model, if any.|
|NodeCount|Long|The approximate number of nodes in the graph model version.|
|EdgeCount|Long|The approximate number of edges in the graph model version.|
|Properties|Dynamic|A JSON object containing additional properties of the graph model version.|
|Created|DateTime|The date and time when the graph model version was created.|
|LastModified|DateTime|The date and time when the graph model version was last modified.|

## Examples

### Show the latest version of all graph models

```kusto
.show graph_models
```

**Output**

|Name|Version|DatabaseName|Folder|DocString|NodeCount|EdgeCount|Properties|Created|LastModified|
|---|---|---|---|---|---|---|---|---|---|
|SocialNetwork|v3|MyDatabase|Social|A graph model representing user interactions|15426|67845|{"autoRefresh":"Weekly"}|2025-04-23T14:32:18Z|2025-04-23T14:32:18Z|
|ProductRecommendations|v2.0|MyDatabase|Recommendations|Product purchase relationships|7254|35281|{"autoRefresh":"Daily"}|2025-04-15T09:45:12Z|2025-04-15T09:45:12Z|
|NetworkTraffic|v3|MyDatabase|Security/NetworkAnalysis|Enhanced network traffic analysis|3128|18754|{"autoRefresh":"Hourly"}|2025-04-12T15:42:18Z|2025-04-12T15:42:18Z|

### Show all versions of all graph models

```kusto
.show graph_models with (showAll = true)
```

**Output**

|Name|Version|DatabaseName|Folder|DocString|NodeCount|EdgeCount|Properties|Created|LastModified|
|---|---|---|---|---|---|---|---|---|---|
|SocialNetwork|v1|MyDatabase|Social|A graph model for social connections|8945|42365|{"autoRefresh":"Weekly"}|2025-03-05T11:23:45Z|2025-03-05T11:23:45Z|
|SocialNetwork|v2|MyDatabase|Social|A graph model representing user interactions|12352|54781|{"autoRefresh":"Weekly"}|2025-03-28T09:18:32Z|2025-03-28T09:18:32Z|
|SocialNetwork|v3|MyDatabase|Social|A graph model representing user interactions|15426|67845|{"autoRefresh":"Weekly"}|2025-04-23T14:32:18Z|2025-04-23T14:32:18Z|
|ProductRecommendations|v1.0|MyDatabase|Recommendations|Product recommendation system|5132|25471|{"autoRefresh":"Daily"}|2025-03-10T14:25:38Z|2025-03-10T14:25:38Z|
|ProductRecommendations|v2.0|MyDatabase|Recommendations|Product purchase relationships|7254|35281|{"autoRefresh":"Daily"}|2025-04-15T09:45:12Z|2025-04-15T09:45:12Z|
|NetworkTraffic|v1|MyDatabase|Security|Network traffic analysis graph|1542|8947|{"autoRefresh":"Hourly"}|2025-03-10T13:24:56Z|2025-03-10T13:24:56Z|
|NetworkTraffic|v2|MyDatabase|Security|Network traffic analysis graph|2354|12458|{"autoRefresh":"Hourly"}|2025-03-25T10:15:22Z|2025-03-25T10:15:22Z|
|NetworkTraffic|v3|MyDatabase|Security/NetworkAnalysis|Enhanced network traffic analysis|3128|18754|{"autoRefresh":"Hourly"}|2025-04-12T15:42:18Z|2025-04-12T15:42:18Z|

## Notes

- By default, this command returns only the latest version of each graph model.
- When using the `showAll` parameter set to `true`, you can see the complete version history of all graph models in your database.
- The results are ordered alphabetically by graph model name, and then by creation date within each model when showing all versions.

## Required permissions

To run this command, the user needs [Database Viewer permissions](../../management/access-control/role-based-access-control.md).

## Related content

* [Graph model overview](graph-model-overview.md)
* [.show graph_model](graph-model-show.md)
* [.create-or-alter graph_model](graph-model-create-or-alter.md)
* [.drop graph_model](graph-model-drop.md)