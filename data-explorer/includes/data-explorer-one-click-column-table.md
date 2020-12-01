---
author: orspod
ms.service: data-explorer
ms.topic: include
ms.date: 06/11/2020
ms.author: orspodek
---
The changes you can make in a table depend on the following parameters:
* **Table** type is new or existing
* **Mapping** type is new or existing

Table type | Mapping type | Available adjustments|
|---|---|---|
|New table   | New mapping |Change data type, Rename column, New column, Delete column, Update column, Sort ascending, Sort descending  |
|Existing table  | New mapping | New column (on which you can then change data type, rename, and update), <br> Update column, Sort ascending, Sort descending  |
| | Existing mapping | Sort ascending, Sort descending

> [!NOTE]
> When adding a new column or updating a column, you can change mapping transformations. For more information, see [Mapping transformations](../ingest-data-one-click.md#mapping-transformations)