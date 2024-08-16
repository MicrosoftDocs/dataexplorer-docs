---
title:  evaluate plugin operator
description: Learn how to use the evaluate plugin operator to invoke plugins.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# evaluate plugin operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] 

Invokes a service-side query extension (plugin).

The `evaluate` operator is a tabular operator that allows you to invoke query language extensions known as **plugins**. Unlike other language constructs, plugins can be enabled or disabled. Plugins aren't "bound" by the relational nature of the language. In other words, they may not have a predefined, statically determined, output schema.

> [!NOTE]
>
> * Syntactically, `evaluate` behaves similarly to the [invoke operator](invoke-operator.md), which invokes tabular functions.
> * Plugins provided through the evaluate operator aren't bound by the regular rules of query execution or argument evaluation.
> * Specific plugins may have specific restrictions. For example, plugins whose output schema depends on the data. For example, [bag_unpack plugin](bag-unpack-plugin.md) and [pivot plugin](pivot-plugin.md) can't be used when performing cross-cluster queries.

## Syntax

[*T* `|`] `evaluate` [ *evaluateParameters* ] *PluginName* `(`[ *PluginArgs* ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *T* | `string` | | A tabular input to the plugin. Some plugins don't take any input and act as a tabular data source.|
| *evaluateParameters* | `string` | | Zero or more space-separated [evaluate parameters](#evaluate-parameters) in the form of *Name* `=` *Value* that control the behavior of the evaluate operation and execution plan. Each plugin may decide differently how to handle each parameter. Refer to each plugin's documentation for specific behavior.|
| *PluginName* | `string` |  :heavy_check_mark: | The mandatory name of the plugin being invoked. |
| *PluginArgs* | `string` | | Zero or more comma-separated arguments to provide to the plugin.|

### Evaluate parameters

The following parameters are supported:

  |Name                |Values                           |Description                                |
  |--------------------|---------------------------------|-------------------------------------------|
  |`hint.distribution` |`single`, `per_node`, `per_shard`| [Distribution hints](#distribution-hints) |
  |`hint.pass_filters` |`true`, `false`| Allow `evaluate` operator to passthrough any matching filters before the plugin. Filter is considered as 'matched' if it refers to a column existing before the `evaluate` operator. Default: `false` |
  |`hint.pass_filters_column` |*column_name*| Allow plugin operator to passthrough filters referring to *column_name* before the plugin. Parameter can be used multiple times with different column names. |

## Plugins

The following plugins are supported:

* [autocluster plugin](autocluster-plugin.md)
* [azure-digital-twins-query-request plugin](azure-digital-twins-query-request-plugin.md)
* [bag-unpack plugin](bag-unpack-plugin.md)
* [basket plugin](basket-plugin.md)
* [cosmosdb-sql-request plugin](cosmosdb-plugin.md)
* [dcount-intersect plugin](dcount-intersect-plugin.md)
* [diffpatterns plugin](diffpatterns-plugin.md)
* [diffpatterns-text plugin](diffpatterns-text-plugin.md)
* [infer-storage-schema plugin](infer-storage-schema-plugin.md)
* [ipv4-lookup plugin](ipv4-lookup-plugin.md)
* [ipv6-lookup plugin](ipv6-lookup-plugin.md)
* [mysql-request-plugin](mysql-request-plugin.md)
* [narrow plugin](narrow-plugin.md)
* [pivot plugin](pivot-plugin.md)
* [preview plugin](preview-plugin.md)
* [R plugin](r-plugin.md)
* [rolling-percentile plugin](rolling-percentile-plugin.md)
* [rows-near plugin](rows-near-plugin.md)
* [schema-merge plugin](schema-merge-plugin.md)
* [sql-request plugin](sql-request-plugin.md)
* [sequence-detect plugin](sequence-detect-plugin.md)

## Distribution hints

Distribution hints specify how the plugin execution will be distributed across multiple cluster nodes. Each plugin may implement a different support for the distribution. The plugin's documentation specifies the distribution options supported by the plugin.

Possible values:

* `single`: A single instance of the plugin will run over the entire query data.
* `per_node`: If the query before the plugin call is distributed across nodes, then an instance of the plugin will run on each node over the data that it contains.
* `per_shard`: If the data before the plugin call is distributed across shards, then an instance of the plugin will run over each shard of the data.
