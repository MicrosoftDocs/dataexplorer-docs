---
title: .create-or-alter graph_model command
description: Learn how to create or alter a graph model
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/27/2025
---

# .create-or-alter graph_model (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Creates a new graph model or alters an existing one using the provided model definition payload.

## Syntax

`.create-or-alter` `graph_model` *GraphModelName* [`with` `(`*Property* `=` *Value* [`,` ...]`)`] *GraphModelDefinitionPayload*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|Yes|The name of the graph model to create or alter. The name must be unique within the database and follow the [entity naming rules](../../query/schema-entities/entity-names.md).|
|*Property*|String|No|A property of the graph model. See [Properties](#properties).|
|*Value*|String|No|The value of the corresponding property.|
|*GraphModelDefinitionPayload*|String|Yes|A valid JSON document that defines the graph model. The payload should be prefixed with the `@` symbol. See [Graph model definition payload](#graph-model-definition-payload).|

### Properties

|Name|Type|Required|Description|
|--|--|--|--|
|`folder`|String|No|The folder that the graph model will be placed in. This property is useful for organizing graph models.|
|`docstring`|String|No|A string documenting the graph model.|
|`version`|String|No|A version identifier for the graph model. If not specified, a system-generated version will be assigned.|

### Graph model definition payload

The graph model definition payload follows the same format as described in the [.create graph model](graph-model-create.md#graph-model-definition) command documentation.

## Returns

This command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|*GraphModelName*|String|The name of the graph model that was created or altered.|
|*Version*|String|The version identifier of the created or altered graph model.|
|*Result*|String|The result of the operation. If successful, the message indicates the graph model was created or altered.|

## Examples

### Create a new graph model

```kusto
.create-or-alter graph_model SocialNetwork @'
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
}'
```

**Output**

|GraphModelName|Version|Result|
|---|---|---|
|SocialNetwork|v1|Graph model 'SocialNetwork' (version 'v1') was created successfully|

### Create a specific version of a graph model

```kusto
.create-or-alter graph_model ProductRecommendations with (version = "v2.0") @'
{
    "Schema": {
        "Nodes": {
            "Customer": {
                "CustomerId": "string",
                "CustomerName": "string",
                "CustomerSegment": "string"
            },
            "Product": {
                "ProductId": "string",
                "ProductName": "string",
                "Category": "string"
            }
        },
        "Edges": {
            "Purchases": {
                "TransactionId": "string",
                "PurchaseDate": "datetime",
                "Quantity": "int"
            }
        }
    },
    "Definition": {
        "Steps": [
            {
                "Kind": "AddNodes",
                "Query": "Customers | project CustomerId, CustomerName, CustomerSegment",
                "NodeIdColumn": "CustomerId",
                "Labels": ["Customer"]
            },
            {
                "Kind": "AddNodes",
                "Query": "Products | project ProductId, ProductName, Category",
                "NodeIdColumn": "ProductId",
                "Labels": ["Product"]
            },
            {
                "Kind": "AddEdges",
                "Query": "Transactions | project CustomerId, ProductId, TransactionId, PurchaseDate, Quantity",
                "SourceColumn": "CustomerId",
                "TargetColumn": "ProductId",
                "Labels": ["Purchases"]
            }
        ]
    }
}'
```

**Output**

|GraphModelName|Version|Result|
|---|---|---|
|ProductRecommendations|v2.0|Graph model 'ProductRecommendations' (version 'v2.0') was created successfully|

## Notes

- When using `.create-or-alter graph_model`, if a graph model with the specified name doesn't exist, a new one is created. If one already exists, it's updated with the new definition.
- Each time a graph model is altered, a new version is created, allowing you to track changes over time and revert to previous versions if needed.
- To generate a graph snapshot from the model, use the [.make graph_snapshot](graph-snapshot-make.md) command.

## Required permissions

To run this command, the user needs [Database Admin permissions](../../management/access-control/role-based-access-control.md).

## Related content

* [Graph model overview](graph-model-overview.md)
* [.show graph_model](graph-model-show.md)
* [.show graph_models](graph-models-show.md)
* [.drop graph_model](graph-model-drop.md)
* [.make graph_snapshot](graph-snapshot-make.md)