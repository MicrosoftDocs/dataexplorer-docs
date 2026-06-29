---
ms.service: azure
ms.topic: include
ms.date: 02/08/2026
---
### Advanced options based on data type

**Tabular (CSV, TSV, PSV)**:

* If you're ingesting tabular formats in an *existing table*, you can select the table mapping drop-down and select **Use exixting mapping**. Tabular data doesn't necessarily include the column names that are used to map source data to the existing columns. When this option is checked, mapping is done by-order, and the table schema remains the same. 
* Otherwise, create a new mapping.
* To use the first row as column names, select **First row header**.

    :::image type="content" source="../media/get-data-file/add-mapping.png" alt-text="Screenshot of mapping options.":::

**JSON**:

* To determine column division of JSON data, select **Nested levels**, from 1 to 100.
