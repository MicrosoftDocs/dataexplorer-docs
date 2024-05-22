---
title: graph-to-table operator
description: Learn how to use the graph-to-table operator to export nodes or edges from a graph to tables.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/30/2023
---
# graph-to-table operator

The `graph-to-table` operator exports nodes or edges from a graph to tables.

> [!NOTE]
> This operator is used in conjunction with the [make-graph operator](make-graph-operator.md).

## Syntax

#### Nodes

*G* `|` `graph-to-table` `nodes` [ `with_node_id=`*ColumnName* ]

#### Edges

*G* `|` `graph-to-table` `edges` [ `with_source_id=`*ColumnName* ] [ `with_target_id=`*ColumnName* ] [ `as` *TableName* ]

#### Nodes and edges

*G* `|` `graph-to-table` `nodes` `as` *NodesTableName* [ `with_node_id=`*ColumnName* ]`,` `edges` `as` *EdgesTableName* [ `with_source_id=`*ColumnName* ] [ `with_target_id=`*ColumnName* ]

## Parameters

|Name|Type|Required | Description |
|---|---|---|---|
|*G*| `string` | :heavy_check_mark:|The input graph source.|
|*NodesTableName*| `string` ||The name of the exported nodes table.|
|*EdgesTableName*| `string` ||The name of the exported edges table.|
|*ColumnName*| `string` ||Export the node hash ID, source node hash ID, or target node hash ID with the given column name.|

## Returns

#### Nodes

The `graph-to-table` operator returns a tabular result, in which each row corresponds to a node in the source graph. The returned columns are the node's properties. When `with_node_id` is provided, the node hash column is of `long` type.

#### Edges

The `graph-to-table` operator returns a tabular result, in which each row corresponds to an edge in the source graph. The returned columns are the node's properties. When `with_source_id` or `with_target_id` are provided, the node hash column is of `long` type.

#### Nodes and edges

The `graph-to-table` operator returns two tabular results, matching the previous descriptions.  

## Examples

The following examples use the `make-graph` operator to build a graph from edges and nodes tables. The nodes represent people and systems, and the edges are different relations between nodes. Then, each example shows a different usage of `graph-to-table`.

### Get edges

In this example, the `graph-to-table` operator exports the edges from a graph to a table. The `with_source_id` and `with_target_id` parameters export the node hash for source and target nodes of each edge.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA42STUvDQBCG74X+hyEnheZQe5BUKih46EEQWvAgEqbJkCzdj7I7UQL+eDebbZpIDxISZuedmcz7sJIYtCnJwQZKZP8cJN1oVLR2bIWuFsDt6XLAitbS6OoW5rMP/0LyJEVByQKSN7LOaB/drRYQpGdzmAirZRRevqYdy/sovKKUxrbTcVkU95Y0d9KudUzKR1nmhc8H/5HeB5XVHx/ONLa4LO9tstDIwugh1zXlI4tXjEUbhVGq0aJAJvcuuE7iWkPdsB/bxrFLphQGtUbnvSnhnAj+xkSGWciMxXGYMeLyj5L4x3MBnCH1gOazH1B4pLSyeKqhZwRp+jjmA9/eYbwZ/tRdiK4vtKRs0sA3Eu9K835MLsrNLkTbss8z2oq4y+9DtC1/AWyal7VzAgAA" target="_blank">Run the query</a>

```kusto
let nodes = datatable(name:string, type:string, age:long) 
[ 
	"Alice", "Person", 23,  
	"Bob", "Person", 31,  
	"Eve", "Person", 17,  
	"Mallory", "Person", 29,  
	"Trent", "System", 99 
]; 
let edges = datatable(source:string, destination:string, edge_type:string) 
[ 
	"Alice", "Bob", "communicatesWith",  
	"Alice", "Trent", "trusts",  
	"Bob", "Trent", "hasPermission",  
	"Eve", "Alice", "attacks",  
	"Mallory", "Alice", "attacks",  
	"Mallory", "Bob", "attacks"  
]; 
edges 
| make-graph source --> destination with nodes on name
| graph-to-table edges with_source_id=SourceId with_target_id=TargetId
```

**Output**

|SourceId|TargetId|source|destination|edge_type|
|---|---|---|---|---|
|-3122868243544336885|-7133945255344544237|Alice|Bob|communicatesWith|
|-3122868243544336885|2533909231875758225|Alice|Trent|trusts|
|-7133945255344544237|2533909231875758225|Bob|Trent|hasPermission|
|4363395278938690453|-3122868243544336885|Eve|Alice|attacks|
|3855580634910899594|-3122868243544336885|Mallory|Alice|attacks|
|3855580634910899594|-7133945255344544237|Mallory|Bob|attacks|

### Get nodes

In this example, the `graph-to-table` operator exports the nodes from a graph to a table. The `with_node_id` parameter exports the node hash.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA41RTUvEMBC9F/ofhp4U2sO6B9mVFRQ8eFAEBQ8iJdsObdh8LMmsUvDHO+nGbCseJIRM8uYl770oJDC2RQ8baAXx2Co8M0Lj2pOTpiuBhv1pIzpcK2u6c8izN55Q3CjZYFFC8YTOW8PVxbKEEbq12xmwXETg7mPOWFyW4fjFoaEAPA+eUHO1WuXZ+xVzFOvEtvul09uDa07i2AZJI0hak84CqZ5Y+EN4lNlYrQ9GNoLQv0rqiyg29SV55A6efDF3mdBeeDampfdyNDd1nO4SRKLZpTsehFLWDf9siS/+NMSIjvHk2RdoscOqc2LfwzEhqKrraTrwyf7iv/MufHfgjZSKbDWmG/HQWoeylu3mkdf79hvpFL8VNQIAAA==" target="_blank">Run the query</a>

```kusto
let nodes = datatable(name:string, type:string, age:long) 
[ 
	"Alice", "Person", 23,  
	"Bob", "Person", 31,  
	"Eve", "Person", 17,
	"Trent", "System", 99
]; 
let edges = datatable(source:string, destination:string, edge_type:string) 
[ 
	"Alice", "Bob", "communicatesWith",  
	"Alice", "Trent", "trusts",  
	"Bob", "Trent", "hasPermission",  
	"Eve", "Alice", "attacks",  
	"Mallory", "Alice", "attacks",  
	"Mallory", "Bob", "attacks"
]; 
edges 
| make-graph source --> destination with nodes on name
| graph-to-table nodes with_node_id=NodeId
```

**Output**

|NodeId|name|type|age|
|---|---|---|---|
|-3122868243544336885|Alice|Person|23|
|-7133945255344544237|Bob|Person|31|
|4363395278938690453|Eve|Person|17|
|2533909231875758225|Trent|System|99|
|3855580634910899594|Mallory|||

### Get nodes and edges

In this example, the `graph-to-table` operator exports the nodes and edges from a graph to a table.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA41RsWrDMBDdDf6Hw1ML9pBmKElIoQUPGWoKKXQoxSiWsEVkKUjnFkM/vpKsKk7JUITQnd476b07wRCkoszAFihBuw6C3UjSs7VBzWWbA46nc0JathZKtreQJu92Q/YoeMOyHLIXpo2SNrpb5uChJ3W4AJaLAJSflxWL+9xdv2om0QH70SDrbbRapcnHxtYIq5PR9o9OowbdnMVZG8glQa5kvHNF9czCFeFBZqP6fpC8IcjMG8cuC2IjL8pDPRg02aXLiHbEWGM9N4Z7c3PH8S2CSJpjfOOZCKH0+E9K+PGXEFo0tSdNvqEnR1a0mpw6mDoERfEw7w58WX9h7jZz43Z1vqRAVfjuBpwYqDy/dnnN6bay547mYR4WLyd8+ssx9j7a0U2aVE5a+QOa1VVgZwIAAA==" target="_blank">Run the query</a>

```kusto
let nodes = datatable(name:string, type:string, age:long) 
[ 
	"Alice", "Person", 23,  
	"Bob", "Person", 31,  
	"Eve", "Person", 17,
	"Trent", "System", 99
]; 
let edges = datatable(source:string, destination:string, edge_type:string) 
[ 
	"Alice", "Bob", "communicatesWith",  
	"Alice", "Trent", "trusts",  
	"Bob", "Trent", "hasPermission",  
	"Eve", "Alice", "attacks",  
	"Mallory", "Alice", "attacks",  
	"Mallory", "Bob", "attacks"
]; 
edges 
| make-graph source --> destination with nodes on name
| graph-to-table nodes as N with_node_id=NodeId, edges as E with_source_id=SourceId;
N; 
E
```

**Output table 1**

|NodeId|name|type|age|
|---|---|---|---|
|-3122868243544336885|Alice|Person|23|
|-7133945255344544237|Bob|Person|31|
|4363395278938690453|Eve|Person|17|
|2533909231875758225|Trent|System|99|
|3855580634910899594|Mallory|||

**Output table 2**

|SourceId|source|destination|edge_type|
|---|---|---|---|
|-3122868243544336885|Alice|Bob|communicatesWith|
|-3122868243544336885|Alice|Trent|trusts|
|-7133945255344544237|Bob|Trent|hasPermission|
|4363395278938690453|Eve|Alice|attacks|
|3855580634910899594|Mallory|Alice|attacks|
|3855580634910899594|Mallory|Bob|attacks|

## Related content

* [Graph operators](graph-operators.md)
* [make-graph operator](make-graph-operator.md)
