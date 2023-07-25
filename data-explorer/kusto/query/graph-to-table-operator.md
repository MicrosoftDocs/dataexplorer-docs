---
title: graph-to-table operator (Preview)
description: Learn how to use the graph-to-table operator to export nodes or edges from a graph to tables.
ms.author: rocohen
ms.service: data-explorer
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/25/2023
---
# graph-to-table operator (Preview)

The `graph-to-table` operator exports nodes or edges from a graph to tables.

## Syntax

#### Nodes:

*G* `|` `graph-to-table` `nodes` [ `with_node_id=`*ColumnName* ]

#### Edges:

*G* `|` `graph-to-table` `edges` [ `with_source_id=`*ColumnName* ] [ `with_target_id=`*ColumnName* ] [ `as` *TableName* ]

#### Nodes and edges:

*G* `|` `graph-to-table` `nodes` `as` *NodesTableName* [ `with_node_id=`*ColumnName* ]`,` `edges` `as` *EdgesTableName* [ `with_source_id=`*ColumnName* ] [ `with_target_id=`*ColumnName* ]

## Parameters

|Name|Type|Required | Description |
|---|---|---|---|
|*G*|string|&check;|The input graph source.|
|*NodesTableName*|string||The name of the exported nodes table.|
|*EdgesTableName*|string||The name of the exported edges table.|
|*ColumnName*|string||Export the node hash id, source node hash id, or target node hash id with the given column name.|

## Returns

#### Nodes:

The `graph-to-table` operator returns a tabular result, in which each row corresponds to a node in the source graph. The returned columns are the node's properties. When `with_node_id` is provided, the node hash column will be of `long` type.

#### Edges:

The `graph-to-table` operator returns a tabular result, in which each row corresponds to an edge in the source graph. The returned columns are the node's properties. When `with_source_id` or `with_target_id` are provided, the node hash column will be of `long` type.

#### Nodes and edges:

The `graph-to-table` operator returns two tabular results, matching the descriptions above.  

## Examples

### Get edges

The following example builds a graph from edges and nodes tables. The nodes represent people and systems, and the edges are different relations between nodes. The `make-graph` operator builds the graph. Then, there's a call to `graph-to-table` with graph edges and with `with_source_id` and `with_target_id` parameters that export node hash for source and target nodes of each edge.

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

The following example builds a graph from edges and nodes tables, the nodes represent people and systems and the edges are different relations between nodes. Following the `make-graph` operator that builds the graph is a call to `graph-to-table` with a graph nodes and `with_node_id` parameter that export node hash. 

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

The following example builds a graph from edges and nodes tables, the nodes represent people and systems and the edges are different relations between nodes. Following the `make-graph` operator that builds the graph is a call to `graph-to-table` with nodes and edges. 

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

## Next steps

* [Graph operators](graph-operators.md)
* [make-graph operator](make-graph-operator.md)
* [graph-merge operator](graph-merge-operator.md)
