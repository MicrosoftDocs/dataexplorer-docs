---
ms.topic: include
ms.date: 05/23/2024
---

## Limitations

* **Changes not supported:**
  * Changes to the materialized view group by expressions.
  * Changing column type.
  * Renaming columns. For example, altering a view of `T | summarize count() by Id` to `T | summarize Count=count() by Id` drops column `count_` and creates a new column `Count`, which initially contains nulls only.

* **Impact on existing data:**
  * Altering the materialized view has no impact on existing data.
  * Adding filters to the query applies only to newly ingested records, and doesn't change records that have already been materialized. 
    * New columns receive nulls for all existing records until records ingested after the alter command modify the null values.
    * For example: A view of `T | summarize count() by bin(Timestamp, 1d)` is altered to `T | summarize count(), sum(Value) by bin(Timestamp, 1d)`. For a particular `Timestamp=T` for which records have already been processed before altering the view, the `sum` column contains partial data. This view only includes records processed after the alter execution.
