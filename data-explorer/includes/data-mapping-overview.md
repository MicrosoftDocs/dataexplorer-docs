---
ms.topic: include
ms.date: 11/17/2022
---

Each element in the mapping list describes a mapping for a specific column and is constructed from three properties: `column`, `datatype` (optional), and `properties` (optional). Learn more about these properties in the [data mapping overview](mappings.md).

> [!NOTE]
> If the table does not yet exist in the database, then a valid datatype must be specified for all the columns in the mapping. Similarly, if the columns in the mapping do not exist in the table, then a datatype must be specified for all of the non-existing columns.
