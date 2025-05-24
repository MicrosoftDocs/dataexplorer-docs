---
title: .create graph model command
description: Learn how to create a graph model in Kusto using the .create graph model command with syntax, parameters, and examples.
ms.reviewer: herauch
ms.topic: reference
ms.date: 05/24/2025
---

# .create graph model (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Creates a new graph model in the database.

## Syntax

`.create` [`or` `alter`] `graph` `model` *GraphModelName* *GraphModelDefinition*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|✅|The name of the graph model to create. The name must be unique within the database and follow the [entity naming rules](../../query/schema-entities/entity-names.md).|
|*GraphModelDefinition*|String|✅|A valid JSON document that defines the graph model. See [Graph model definition](#graph-model-definition).|

## Returns

This command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|*Name*|String|The name of the graph model that was created or altered.|
|*CreationTime*|DateTime|The timestamp when the graph model was created or altered.|
|*Id*|String|The unique identifier of the graph model.|
|*SnapshotsCount*|Int|The number of snapshots created from this graph model.|
|*Model*|String (JSON)|The JSON definition of the graph model, including schema and processing steps.|
|*AuthorizedPrincipals*|String (JSON)|Array of principals that have access to the graph model, including their identifiers and role assignments.|
|*RetentionPolicy*|String (JSON)|The retention policy configured for the graph model.|

### Graph model definition

For details about the graph model definition and structure, see [Graph model in Kusto - Overview](graph-model-overview.md).

## Examples

### Create a simple social network graph model

```kusto
.create graph model SocialNetwork
{
    "Schema": {
        "Nodes": {
            "User": {
                "UserId": "string",
                "Username": "string",
                "JoinDate": "datetime",
                "IsActive": "bool"
            }
        },
        "Edges": {
            "Follows": {
                "Since": "datetime"
            },
            "Likes": {
                "Timestamp": "datetime",
                "Rating": "int"
            }
        }
    },
    "Definition": {
        "Steps": [
            {
                "Kind": "AddNodes",
                "Query": "Users | project UserId, Username, JoinDate, IsActive",
                "NodeIdColumn": "UserId",
                "Labels": ["User"]
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
            }
        ]
    }
}
```

### Create a graph model with dynamic labels and without explicit schema

```kusto
.create graph model DynamicLabelGraph
{
    "Definition": {
        "Steps": [
            {
                "Kind": "AddNodes",
                "Query": "Entities | project EntityId, EntityType, Properties",
                "NodeIdColumn": "EntityId",
                "LabelsColumn": "EntityType"
            },
            {
                "Kind": "AddNodes",
                "Query": "MultiLabelEntities | project Id, Labels=todynamic(['Person', 'Customer'])",
                "NodeIdColumn": "Id",
                "LabelsColumn": "Labels"
            },
            {
                "Kind": "AddEdges",
                "Query": "Relationships | project SourceId, TargetId, RelationshipType",
                "SourceColumn": "SourceId",
                "TargetColumn": "TargetId",
                "LabelsColumn": "RelationshipType"
            }
        ]
    }
}
```

## Related content

- [Graph model overview](graph-model-overview.md)
- [.alter graph model](graph-model-alter.md)
- [.show graph models](graph-model-show.md)
- [.drop graph model](graph-model-drop.md)
