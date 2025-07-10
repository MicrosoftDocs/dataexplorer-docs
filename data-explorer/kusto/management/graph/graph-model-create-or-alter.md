---
title: .create-or-alter graph_model command
description: Learn how to create or alter a graph model using the create-or-alter graph_model command with syntax, parameters, and examples.
ms.reviewer: herauch
ms.topic: reference
ms.date: 05/24/2025
---

# .create-or-alter graph_model (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in public preview. Functionality and syntax are subject to change before General Availability.

Creates a new graph model or alters an existing one using the provided model definition payload.

## Permissions

To run this command, the user needs [Database User permissions](../../access-control/role-based-access-control.md).

## Syntax

`.create-or-alter` `graph_model` *GraphModelName* *GraphModelDefinitionPayload*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|✅|The name of the graph model to create or alter. The name must be unique within the database and follow the [entity naming rules](../../query/schema-entities/entity-names.md).|
|*GraphModelDefinitionPayload*|String|✅|A valid JSON document that defines the graph model. See [Graph model definition payload](#graph-model-definition-payload).|

### Graph model definition payload

The graph model definition payload is a JSON document that defines the structure and processing steps for the graph model. For detailed information about the graph model definition format, see [Graph model overview](graph-model-overview.md).

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

## Examples

### Create a new graph model

````kusto
.create-or-alter graph_model SocialNetwork ```
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
````

**Output**

|Name|CreationTime|ID|SnapshotsCount|Model|AuthorizedPrincipals|RetentionPolicy|
|---|---|---|---|---|---|---|
|SocialNetwork|2025-05-23 14:42:37.5128901|aaaaaaaa-0b0b-1c1c-2d2d-333333333333|0|model from above|[</br>  {</br>    "Type": "Microsoft Entra ID User",</br>    "DisplayName": "Alex Johnson (upn: alex.johnson@contoso.com)",</br>    "ObjectId": "aaaaaaaa-bbbb-cccc-1111-22222222222",</br>    "FQN": "aaduser=aaaaaaaa-bbbb-cccc-1111-22222222222;aaaabbbb-0000-cccc-1111-dddd2222eeee",</br>    "Notes": "",</br>    "RoleAssignmentIdentifier": "a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1"</br>  }</br>]|{</br>  "SoftDeletePeriod": "3650.00:00:00"</br>}|

## Notes

* If a graph model with the specified name doesn't exist, a new one is created when using `.create-or-alter graph_model`. If one already exists, it's updated with the new definition.
* Each time a graph model is altered, a new version is created, allowing you to track changes over time and revert to previous versions if needed.
* To generate a graph snapshot from the model, use the [`.make graph_snapshot`](graph-snapshot-make.md) command.

## Related content

- [Graph model overview](graph-model-overview.md)
- [.show graph_model](graph-model-show.md)
- [.show graph_models](graph-models-show.md)
- [.drop graph_model](graph-model-drop.md)
- [.make graph_snapshot](graph-snapshot-make.md)
