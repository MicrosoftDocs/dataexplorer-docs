---
ms.topic: include
ms.date: 05/27/2024
---

## Partitions formatting

The partitions list is any combination of partition columns, specified using one of the forms shown in the following table.

|Partition Type|Syntax|Notes|
|--|--|--|
|Virtual column|*PartitionName* `:` (`datetime` \| `string`)|Read more on [virtual columns](#virtual-columns).|
|String column value|*PartitionName* `:` `string` `=` *ColumnName*||
|String column value [hash](../query/hash-function.md)|*PartitionName* `:` `long` `=` `hash(`*ColumnName*`,` *Number*`)`|The hash is modulo *Number*.|
|Truncated datetime column (value)|*PartitionName* `:` `datetime` `=` (`startofyear` \| `startofmonth` \| `startofweek` \| `startofday`) `(` *ColumnName* `)`|See documentation on [startofyear](../query/startofyear-function.md), [startofmonth](../query/startofmonth-function.md), [startofweek](../query/startofweek-function.md), or [startofday](../query/startofday-function.md) functions.|
|Truncated Datetime Column Value (bin)|*PartitionName* `:` `datetime` `=` `bin` `(` *ColumnName* `,` *TimeSpan* `)`|Read more about the [bin](../query/bin-function.md) function.|
