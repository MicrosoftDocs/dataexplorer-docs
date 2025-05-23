---
title: .create graph model command
description: Learn how to create a graph model
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/27/2025
---

# .create graph model (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Creates a new graph model in the database.

## Syntax

`.create` [`or` `alter`] `graph` `model` *GraphModelName* [`with` `(`*Property* `=` *Value* [`,` ...]`)`] *GraphModelDefinition*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|Yes|The name of the graph model to create. The name must be unique within the database and follow the [entity naming rules](../../query/schema-entities/entity-names.md).|
|*Property*|String|No|A property of the graph model. See [Properties](#properties).|
|*Value*|String|No|The value of the corresponding property.|
|*GraphModelDefinition*|String|Yes|A valid JSON document that defines the graph model. See [Graph model definition](#graph-model-definition).|

### Properties

|Name|Type|Required|Description|
|--|--|--|--|
|`folder`|String|No|The folder that the graph model will be placed in. This property is useful for organizing graph models.|
|`docstring`|String|No|A string documenting the graph model.|

### Graph model definition

The graph model definition is a JSON document that describes the structure and data sources of the graph. It contains two main sections:

1. **Schema**: Defines the node and edge types with their properties
2. **Definition**: Specifies the steps to build the graph from tabular data sources

#### Schema section

The schema section contains two subsections:

* **Nodes**: A dictionary mapping node type names to their property definitions
* **Edges**: A dictionary mapping edge type names to their property definitions

Each property definition is a dictionary mapping property names to their Kusto data types.

#### Definition section

The definition section contains an array of steps that define how to build the graph:

* **AddNodes** steps: Define how to create nodes from tabular data
* **AddEdges** steps: Define how to create edges between existing nodes

Each step contains:

* **Kind**: Either "AddNodes" or "AddEdges"
* **Query**: A KQL query that produces the data for nodes or edges
* For AddNodes steps:
  * **NodeIdColumn**: The column that provides the unique identifier for each node
  * **Labels**: An array of node types that apply to the nodes created by this step
* For AddEdges steps:
  * **SourceColumn**: The column that identifies the source node
  * **TargetColumn**: The column that identifies the target node
  * **Labels**: An array of edge types that apply to the edges created by this step

## Examples

### Create a simple social network graph model

```kusto
.create graph model SocialNetwork with (docstring = "A graph model representing user interactions") 
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

### Create or alter a product recommendation graph model

```kusto
.create or alter graph model ProductRecommendations with (folder = "Recommendations", docstring = "Product purchase relationships for recommendation engine") 
{
    "Schema": {
        "Nodes": {
            "Customer": {
                "CustomerId": "string",
                "CustomerName": "string",
                "CustomerSegment": "string",
                "RegisteredDate": "datetime"
            },
            "Product": {
                "ProductId": "string",
                "ProductName": "string",
                "Category": "string",
                "Price": "decimal"
            }
        },
        "Edges": {
            "Purchases": {
                "TransactionId": "string",
                "PurchaseDate": "datetime",
                "Quantity": "int",
                "TotalAmount": "decimal"
            }
        }
    },
    "Definition": {
        "Steps": [
            {
                "Kind": "AddNodes",
                "Query": "Customers | project CustomerId, CustomerName, CustomerSegment, RegisteredDate",
                "NodeIdColumn": "CustomerId",
                "Labels": ["Customer"]
            },
            {
                "Kind": "AddNodes",
                "Query": "Products | project ProductId, ProductName, Category, Price",
                "NodeIdColumn": "ProductId",
                "Labels": ["Product"]
            },
            {
                "Kind": "AddEdges",
                "Query": "Transactions | project CustomerId, ProductId, TransactionId, PurchaseDate, Quantity, TotalAmount",
                "SourceColumn": "CustomerId",
                "TargetColumn": "ProductId",
                "Labels": ["Purchases"]
            }
        ]
    }
}
```

## Related content

* [Graph model overview](graph-model-overview.md)
* [.alter graph model](graph-model-alter.md)
* [.show graph models](graph-model-show.md)
* [.drop graph model](graph-model-drop.md)