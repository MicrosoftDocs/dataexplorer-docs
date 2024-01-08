---
ms.topic: include
ms.date: 12/02/2022
---

## Character limitation

The command will fail if the query generates an entity name with the `$` character. The [entity names](../kusto/query/schema-entities/entity-names.md) must comply with the naming rules, so the `$` character must be removed for the ingest command to succeed.

For example, in the following query, the `search` operator generates a column `$table`. To store the query results, use [project-rename](../kusto/query/project-rename-operator.md) to rename the column.

<a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAx3JzQpAYBAF0Fe5C/WteADxCjbsJA1uSX5nRlEenuxOncToMN+UQ3uc1LtV2jk7UPESQ/bAKNqPqEPp4gxNGv4KeLDrNrH3WLnKQrh0M4tPefTzBbhw1LVdAAAA" target="_blank">Run the query</a>

```kusto
.set stored_query_result Texas <| search ['State']:'Texas' | project-rename tableName=$table
```
