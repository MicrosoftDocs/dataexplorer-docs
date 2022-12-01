---
ms.topic: include
ms.date: 12/01/2022
---

> [!IMPORTANT]
> The command will fail if the query generates an column name with the `$` character. For example, the `search` operator generates a column `$table`. This is because the rules for [entity names](../kusto/query/schema-entities/entity-names.md#identifier-naming-rules) must be met when creating stored entities. Use [project-rename](../kusto/query/projectrenameoperator.md) to rename the column.
