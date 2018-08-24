# ingestion-time()

Retrieves the record's `$IngestionTime` hidden `datetime` column, or null.

The `$IngestionTime` column is automatically defined when the table's
[IngestionTime policy](https://kusdoc2.azurewebsites.net/docs/concepts/concepts_ingestiontimepolicy.html) is set (enabled).
If the table does not have this policy defined, a null value is returned.

This function must be used in the context of an actual table in order
to return the relevant data. (For example, it will return null for all records
if it is invoked following a `summarize` operator).

**Syntax**

 `ingestion-time()`

**Returns**

A `datetime` value specifying the approximate time of ingestion into a table.

**Example**

```kusto
T 
| extend ingestionTime = ingestion-time() | top 10 by ingestionTime
```


