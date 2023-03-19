---
ms.topic: include
ms.date: 03/05/2023
---

## Limitations

* **Changes not supported:**
  * Changing column type isn't supported.
  * Renaming columns isn't supported. For example, altering a view of `T | summarize count() by Id` to `T | summarize Count=count() by Id` drops column `count_` and creates a new column `Count`, which initially contains nulls only.
  * Changes to the materialized view group by expressions aren't supported.

* **Impact on existing data:**
  * Altering the materialized view has no impact on existing data.
  * New columns receive nulls for all existing records until records ingested after the alter command modify the null values.
    * For example: if a view of `T | summarize count() by bin(Timestamp, 1d)` is altered to `T | summarize count(), sum(Value) by bin(Timestamp, 1d)`, then for a particular `Timestamp=T` for which records have already been processed before altering the view, the `sum` column contains partial data. This view only includes records processed after the alter execution.
  * Adding filters to the query doesn't change records that have already been materialized. The filter will only apply to newly ingested records.
