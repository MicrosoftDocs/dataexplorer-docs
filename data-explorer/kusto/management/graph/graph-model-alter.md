---
title: .alter graph model command
description: Learn how to modify an existing graph model using the .alter graph model command with syntax, parameters, and examples.
ms.reviewer: herauch
ms.topic: reference
ms.date: 05/24/2025
---

# .alter graph model (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Modifies an existing graph model in the database.

## Syntax

`.alter` `graph` `model` *GraphModelName* *GraphModelDefinition*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|✅|The name of the existing graph model to modify.|
|*GraphModelDefinition*|String|✅|A valid JSON document that defines the updated graph model. See [Graph model definition](#graph-model-definition).|

### Graph model definition

The graph model definition follows the same format as in the [.create graph model](graph-model-create.md#graph-model-definition) command.

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

### Update a social network graph model

```kusto
.alter graph model SocialNetwork
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

**Output**

|Name|CreationTime|ID|SnapshotsCount|Model|AuthorizedPrincipals|RetentionPolicy|
|---|---|---|---|---|---|---|
|SocialNetwork|2025-05-23 14:42:37.5128901|b709fec8-d821-45ab-9312-55e82c4f9203|0|model from above|[</br>  {</br>    "Type": "AAD User",</br>    "DisplayName": "Alex Johnson (upn: alex.johnson@contoso.com)",</br>    "ObjectId": "83a7b95c-e0fd-4278-9ab9-c21435ea2673",</br>    "FQN": "aaduser=83a7b95c-e0fd-4278-9ab9-c21435ea2673;f5d01e3b-9a77-4970-b372-e38a3761c3c0",</br>    "Notes": "",</br>    "RoleAssignmentIdentifier": "ca831e09-f37d-48bf-9f6c-25038372019a"</br>  }</br>]|{</br>  "SoftDeletePeriod": "3650.00:00:00"</br>}|

## Notes

- When you alter a graph model, you need to provide the complete graph model definition, not just the parts you want to change. The entire definition replaces the existing one.

## Related content

- [Graph model overview](graph-model-overview.md)
- [.create graph model](graph-model-create.md)
- [.show graph models](graph-model-show.md)
- [.drop graph model](graph-model-drop.md)
