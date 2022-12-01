---
ms.topic: include
ms.date: 12/01/2022
---

> [!IMPORTANT]
> The command will fail if the query generates a column name with the `$` character. For example, the `search` operator generates a column `$table`. This is because the rules for [entity names](../../query/schema-entities/entity-names.md) must be met. Use [project-rename](../kusto/query/projectrenameoperator.md) to rename the column.
