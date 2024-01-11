---
ms.topic: include
ms.date: 01/01/2024
---
A table schema defines the names and [data types](/azure/data-explorer/kusto/query/scalar-data-types/) of all the columns in the table. The table schema can be set during [table creation](/azure/data-explorer/kusto/management/create-table-command), or as a part of the data ingestion process by modifying the applicable [ingestion mapping](/azure/data-explorer/kusto/management/create-ingestion-mapping-command). The way a table schema is defined can significantly affect your query performance. The ideal schema for your data depends on many factors, including use case, data access patterns, and the specific data you plan to store. This article describes best practices for optimizing performance by designing efficient schemas.

## Data types

For general information on data types, see [scalar data types](/azure/data-explorer/kusto/query/scalar-data-types/).

* Commonly used fields should be typed columns, not [dynamic](/azure/data-explorer/kusto/query/scalar-data-types/dynamic) type.
* Frequently searched for or aggregated JSON properties in a [dynamic](/azure/data-explorer/kusto/query/scalar-data-types/dynamic) column should be converted to a regular column in the table with a more specific type such as [string](/azure/data-explorer/kusto/query/scalar-data-types/string), [long](/azure/data-explorer/kusto/query/scalar-data-types/long), or [real](/azure/data-explorer/kusto/query/scalar-data-types/real).
* Sparse columns that aren't commonly used for filter and aggregation should be collected as a property bag in a [dynamic](/azure/data-explorer/kusto/query/scalar-data-types/dynamic) column using the `DropMappedFields` [mapping transformation](/azure/data-explorer/kusto/management/mappings#dropmappedfields-transformation).

* Date time columns should be typed as [datetime](/azure/data-explorer/kusto/query/scalar-data-types/datetime), and not [long](/azure/data-explorer/kusto/query/scalar-data-types/long) or other data types.
    * Use the DateTime from unix [transformation mappings](/azure/data-explorer/kusto/management/mappings#mapping-transformations), for example `DateTimeFromUnixMilliseconds`. .

* The [decimal](/azure/data-explorer/kusto/query/scalar-data-types/decimal) type provides exact precision, which makes it most suitable to financial and other applications that require exact accuracy. However, it's much slower than the [real](/azure/data-explorer/kusto/query/scalar-data-types/real) type. Only use the decimal type when required.

* All ID (identification) columns should be typed as [string](/azure/data-explorer/kusto/query/scalar-data-types/string), not numeric. This type will make the index much more effective and can significantly improve search time. It will also enable [partitioning](/azure/data-explorer/kusto/management/partitioningpolicy), since partitioning can only be defined on string columns. If the query filters used on this column are only equality, for example if the column has guids, you can use the encoding profile `Identifier`. For more information, see [encoding policy](/azure/data-explorer/kusto/management/encoding-policy).

## Tables

* Optimize for narrow tables, which are preferred over wide tables with hundreds of columns.
* To avoid expensive joins during query time, denormalize dimension data by enriching it during ingestion. If the dimension table used for enrichment is updated and the scenario requires the latest value, use [materialize views](/azure/data-explorer/kusto/management/materialized-views/materialized-view-overview) to keep only the latest value.
* If there are more than 20 columns that are sparse, meaning that many values are nulls, and these columns are rarely used for searches or aggregation, then group the columns as a JSON property bag in a [dynamic](/azure/data-explorer/kusto/query/scalar-data-types/dynamic) column using the `DropMappedFields` [transformation mapping](/azure/data-explorer/kusto/management/mappings#dropmappedfields-transformation).

## Indexing

Fields that are never searched on can disable indexing. Use the [encoding policy](/azure/data-explorer/kusto/management/encoding-policy) with profile `BigObject` to disable indexing on string or dynamic typed columns.

## Related content

* [.show table schema command](/azure/data-explorer/kusto/management/show-table-schema-command)