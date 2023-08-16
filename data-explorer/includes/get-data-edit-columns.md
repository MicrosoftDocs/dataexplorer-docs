---
ms.service: azure
ms.topic: include
ms.date: 08/07/2023
---
### Edit columns

> [!NOTE]
>
> * For tabular formats (CSV, TSV, PSV), you can't map a column twice. To map to an existing column, first delete the new column.
> * You can't change an existing column type. If you try to map to a column having a different format, you may end up with empty columns.

:::image type="content" source="../media/get-data-file/edit-columns.png" alt-text="Screenshot of columns open for editing." lightbox="../media/get-data-file/edit-columns.png":::

The changes you can make in a table depend on the following parameters:

* **Table** type is new or existing
* **Mapping** type is new or existing

Table type | Mapping type | Available adjustments|
|---|---|---|
| New table | New mapping |Rename column, change data type, change data source, [mapping transformation](#mapping-transformations), add column, delete column |
| Existing table | New mapping | Add column (on which you can then change data type, rename, and update) |
| Existing table | Existing mapping | none