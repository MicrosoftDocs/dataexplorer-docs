---
ms.topic: include
ms.date: 05/27/2024
---

## Partitions formatting

The partitions list is any combination of partition columns, specified using one of the forms shown in the following table.

|Partition Type|Syntax|Notes|
|--|--|--|
|Virtual column|*PartitionName* `:` (`datetime` \| `string`)|Read more on [Virtual columns](../kusto/management/external-tables-azure-storage.md#virtual-columns).|
|String column value|*PartitionName* `:` `string` `=` *ColumnName*||
|String column value [hash()](../kusto/query/hash-function.md)|*PartitionName* `:` `long` `=` `hash(`*ColumnName*`,` *Number*`)`|The hash is modulo *Number*.|
|Truncated datetime column (value)|*PartitionName* `:` `datetime` `=` (`startofyear` \| `startofmonth` \| `startofweek` \| `startofday`) `(` *ColumnName* `)`|See documentation on [startofyear](../kusto/query/startofyear-function.md), [startofmonth](../kusto/query/startofmonth-function.md), [startofweek](../kusto/query/startofweek-function.md), or [startofday](../kusto/query/startofday-function.md) functions.|
|Truncated Datetime Column Value `=` `bin` `(` *ColumnName* `,` *TimeSpan* `)`|Read more about the [bin](../kusto/query/bin-function.md) function.|
