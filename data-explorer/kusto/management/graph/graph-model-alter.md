---
title: .alter graph model command
description: Learn how to modify an existing graph model
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/27/2025
---

# .alter graph model (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Modifies an existing graph model in the database.

## Syntax

`.alter` `graph` `model` *GraphModelName* [`with` `(`*Property* `=` *Value* [`,` ...]`)`] *GraphModelDefinition*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|Yes|The name of the existing graph model to modify.|
|*Property*|String|No|A property of the graph model. See [Properties](#properties).|
|*Value*|String|No|The value of the corresponding property.|
|*GraphModelDefinition*|String|Yes|A valid JSON document that defines the updated graph model. See [Graph model definition](#graph-model-definition).|

### Properties

|Name|Type|Required|Description|
|--|--|--|--|
|`folder`|String|No|The folder that the graph model will be placed in. This property is useful for organizing graph models.|
|`docstring`|String|No|A string documenting the graph model.|

### Graph model definition

The graph model definition follows the same format as in the [.create graph model](graph-model-create.md#graph-model-definition) command.

## Examples

### Update a social network graph model

```kusto
.alter graph model SocialNetwork with (docstring = "An updated graph model representing user interactions with content") 
{
    "Schema": {
        "Nodes": {
            "User": {
                "UserId": "string",
                "Username": "string",
                "JoinDate": "datetime",
                "IsActive": "bool",
                "Country": "string"  // Added new Country property
            },
            "Content": {              // Added new Content node type
                "ContentId": "string",
                "Title": "string",
                "CreatedDate": "datetime",
                "Type": "string"
            }
        },
        "Edges": {
            "Follows": {
                "Since": "datetime"
            },
            "Likes": {
                "Timestamp": "datetime",
                "Rating": "int"
            },
            "Creates": {              // Added new Creates edge type
                "CreationDate": "datetime"
            }
        }
    },
    "Definition": {
        "Steps": [
            {
                "Kind": "AddNodes",
                "Query": "Users | project UserId, Username, JoinDate, IsActive, Country",
                "NodeIdColumn": "UserId",
                "Labels": ["User"]
            },
            {
                "Kind": "AddNodes",
                "Query": "Contents | project ContentId, Title, CreatedDate, Type",
                "NodeIdColumn": "ContentId",
                "Labels": ["Content"]
            },
            {
                "Kind": "AddEdges",
                "Query": "FollowEvents | project SourceUser, TargetUser, CreatedAt",
                "SourceColumn": "SourceUser",
                "TargetColumn": "TargetUser",
                "Labels": ["Follows"]
            },
            {
                "Kind": "AddEdges",
                "Query": "LikeEvents | project UserId, ContentId, Timestamp, Score",
                "SourceColumn": "UserId",
                "TargetColumn": "ContentId",
                "Labels": ["Likes"]
            },
            {
                "Kind": "AddEdges",
                "Query": "ContentCreation | project UserId, ContentId, CreatedAt",
                "SourceColumn": "UserId",
                "TargetColumn": "ContentId",
                "Labels": ["Creates"]
            }
        ]
    }
}
```

### Only update the folder property

```kusto
.alter graph model NetworkTraffic with (folder = "Security/NetworkAnalysis") 
{
    // Original graph model definition is kept the same
    "Schema": {
        "Nodes": {
            "Device": {
                "DeviceId": "string",
                "IpAddress": "string",
                "DeviceType": "string"
            }
        },
        "Edges": {
            "Connects": {
                "Timestamp": "datetime",
                "Protocol": "string",
                "Port": "int"
            }
        }
    },
    "Definition": {
        "Steps": [
            {
                "Kind": "AddNodes",
                "Query": "Devices | project DeviceId, IpAddress, DeviceType",
                "NodeIdColumn": "DeviceId",
                "Labels": ["Device"]
            },
            {
                "Kind": "AddEdges",
                "Query": "NetworkLogs | project SourceDeviceId, DestinationDeviceId, Timestamp, Protocol, Port",
                "SourceColumn": "SourceDeviceId",
                "TargetColumn": "DestinationDeviceId",
                "Labels": ["Connects"]
            }
        ]
    }
}
```

## Notes

- When you alter a graph model, you need to provide the complete graph model definition, not just the parts you want to change. The entire definition will replace the existing one.
- Changes to the graph model schema or definition will be applied the next time the graph model is refreshed.
- To refresh the graph model immediately after altering it, use the [.refresh graph model](graph-model-refresh.md) command.
- To modify only the properties of a graph model (like folder or docstring) without changing the definition, use the [.alter graph model properties](graph-model-alter-properties.md) command.

## Related content

* [Graph model overview](graph-model-overview.md)
* [.create graph model](graph-model-create.md)
* [.show graph models](graph-model-show.md)
* [.drop graph model](graph-model-drop.md)
* [.refresh graph model](graph-model-refresh.md)