---
title: .show graph_model command
description: Learn how to display specific graph model versions using the .show graph_model command with syntax and examples.
ms.reviewer: herauch
ms.topic: reference
ms.date: 05/24/2025
---

# .show graph_model (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Shows the details of a specific graph model, including its versions.

## Permissions

To run this command, the user needs [Database admin permissions](../../access-control/role-based-access-control.md).

## Syntax

`.show` `graph_model` *GraphModelName* [`with` `(`*Property* `=` *Value* [`,` ...]`)`]

`.show` `graph_model` *GraphModelName* `details`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|✅|The name of the graph model to show.|
|*Property*|String|❌|A property to control which version(s) to show. See [Properties](#properties).|
|*Value*|String|❌|The value of the corresponding property.|
|`details`|Keyword|❌|When specified, returns more detailed information about the graph model.|

### Properties

|Name|Type|Required|Description|
|--|--|--|--|
|`id`|String|❌|The specific version identifier (GUID) of the graph model to show. Use `*` to show all versions. If not specified, the latest version is shown.|

## Returns

The command returns different output depending on which syntax is used:

### Basic command (without details)

When using the basic `.show graph_model` command (without the `details` keyword), the command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|Name|String|The name of the graph model.|
|CreationTime|DateTime|The date and time when the graph model was created.|
|Id|String|The identifier of the graph model version (a GUID).|

### Details command

When using the `.show graph_model` command with the `details` keyword, the command returns a more detailed table with the following columns:

|Column|Type|Description|
|--|--|--|
|Name|String|The name of the graph model.|
|CreationTime|DateTime|The date and time when the graph model was created.|
|Id|String|The identifier of the graph model version (a GUID).|
|SnapshotCount|Long|The number of snapshots in the graph model.|
|Model|Dynamic|A JSON object containing the complete model definition and properties.|

## Examples

### Show the latest version of a graph model

```kusto
.show graph_model SocialNetwork
```

**Output**

|Name|CreationTime|Id|
|---|---|---|
|SocialNetwork|2025-04-23T14:32:18Z|d78f3a29-3508-4d05-9c5a-16f8a5674e92|

### Show a specific version of a graph model

```kusto
.show graph_model ProductRecommendations with (id = "a1b2c3d4-e5f6-4a3b-8c7d-9e0f1a2b3c4d")
```

**Output**

|Name|CreationTime|Id|
|---|---|---|
|ProductRecommendations|2025-04-15T09:45:12Z|a1b2c3d4-e5f6-4a3b-8c7d-9e0f1a2b3c4d|

### Show all versions of a graph model

```kusto
.show graph_model NetworkTraffic with (id = "*")
```

**Output**

|Name|CreationTime|Id|
|---|---|---|
|NetworkTraffic|2025-03-10T13:24:56Z|f1e2d3c4-b5a6-4b3c-8d7e-9f0e1d2c3b4a|
|NetworkTraffic|2025-03-25T10:15:22Z|c7d8e9f0-a1b2-4c3d-9e0f-1a2b3c4d5e6f|
|NetworkTraffic|2025-04-12T15:42:18Z|b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e|

### Show detailed information about a graph model

```kusto
.show graph_model SocialNetwork details
```

**Output**

|Name|CreationTime|Id|SnapshotCount|Model|
|---|---|---|---|---|
|SocialNetwork|2025-04-23T14:32:18Z|d78f3a29-3508-4d05-9c5a-16f8a5674e92|12|{}|

## Notes

- The `.show graph_model` command is useful for examining the history and evolution of a specific graph model.
- When showing all versions of a graph model, the results are ordered by creation date, with the oldest version first.
- Use the `details` keyword when you need to see the complete model definition and additional metadata.
- The `Model` column in the detailed output contains the complete JSON definition of the graph model, which might be large for complex models.
- Use the basic command (without `details`) for a more concise overview when you don't need the full model definition.

## Related content

* [Graph model overview](graph-model-overview.md)
* [.create-or-alter graph_model](graph-model-create-or-alter.md)
* [.show graph_models](graph-models-show.md)
* [.drop graph_model](graph-model-drop.md)
