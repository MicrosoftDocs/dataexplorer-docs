---
ms.topic: include
ms.date: 02/09/2026
---

## Partitions formatting

The partitions list is any combination of partition columns, specified using one of the forms shown in the following table.

|Partition Type|Syntax|Notes|
|--|--|--|
|String column value|*PartitionName* `:` `string` `=` *ColumnName*||
|Truncated datetime column (value)|*PartitionName* `:` `datetime` `=` (`startofyear` \| `startofmonth` \| `startofweek` \| `startofday`) `(` *ColumnName* `)`|See documentation on [startofyear](../query/startofyear-function.md), [startofmonth](../query/startofmonth-function.md), [startofweek](../query/startofweek-function.md), or [startofday](../query/startofday-function.md) functions.|
|Truncated Datetime Column Value `=` `bin` `(` *ColumnName* `,` *TimeSpan* `)`|Read more about the [bin](../query/bin-function.md) function.||
