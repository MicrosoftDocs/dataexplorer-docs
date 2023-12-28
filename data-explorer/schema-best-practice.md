---
title: Schema optimization best practices
description: This article discusses best practices for schema design in Azure Data Explorer
ms.reviewer: avnera
ms.topic: conceptual
ms.date: 12/25/2023
---
# Schema optimization best practices

A table schema defines the names and data types of all the columns in the table. The table schema can be set during table creation, or as a part of the data ingestion process. The way a table schema is defined can affect your query performance. The ideal schema for your data depends on many factors, including use case, data access patterns, and the specific data you plan to store. This article describes best practices for optimizing performance by designing efficient schemas.

## Indexing

Fields that are never queried on can disable indexing. Use the [encoding policy](/azure/data-explorer/kusto/management/encoding-policy) with profile 'BigObject' to disable indexing on string or dynamic typed columns.

## Data types

For general information on data types, see [scalar data types](/azure/data-explorer/kusto/query/scalar-data-types/).

* Commonly used fields should be typed columns. Don't use the [dynamic](/azure/data-explorer/kusto/query/scalar-data-types/dynamic) type.
* Fields that are likely to get added, removed or retyped, and aren't queried often, should be grouped into a [dynamic](/azure/data-explorer/kusto/query/scalar-data-types/dynamic) column.
* Use the [dynamic](/azure/data-explorer/kusto/query/scalar-data-types/dynamic) type for sparse columns that aren't commonly used for filter and aggregation.

* All time columns should be typed as [datetime](/azure/data-explorer/kusto/query/scalar-data-types/datetime), and not [long](/azure/data-explorer/kusto/query/scalar-data-types/long) or other data types.
    * For examples, see `DateTimeFromUnixMilliseconds` and similar [transformation mappings](/azure/data-explorer/kusto/management/mappings#mapping-transformations).

* Only use the [Decimal](/azure/data-explorer/kusto/query/scalar-data-types/decimal) type if high accuracy is required. Otherwise, use [real](/azure/data-explorer/kusto/query/scalar-data-types/real) type.

* For better indexing, all ID (identification) columns should be typed as [string](/azure/data-explorer/kusto/query/scalar-data-types/string), not numeric. If you only query for specific values in this column, you can use the encoding profile `Identifier`. For more information, see [encoding policy](/azure/data-explorer/kusto/management/encoding-policy).

## Tables

* Only move data to a dimension table if the values there often updated and you want to always use the latest value. If not, embed the values as a column in the fact table to avoid joins.

* Optimize for narrow tables, which are preferred over wide tables with hundreds of columns.

## Related content

* [.show table schema command](/azure/data-explorer/kusto/management/show-table-schema-command)