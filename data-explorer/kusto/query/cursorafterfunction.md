# cursor-after()

A predicate over the records of a table to compare their ingestion time
against a database cursor.

**Syntax**

`cursor-after` `(` *RHS* `)`

**Arguments**

* *RHS*: Either an empty string literal, or a valid database cursor value.

**Returns**

A scalar value of type `bool` that indicates whether the record was ingested
after the database cursor *RHS* (`true`) or not (`false`).

**Comments**

See [Database Cursor](https://kusdoc2.azurewebsites.net/docs/concepts/concepts_databasecursor.html) for a detailed
explanation of this function, the scenario in which it should be used, its
restrictions, and side-effects.

This function can only be invoked on records of a table which has the
[IngestionTime policy](https://kusdoc2.azurewebsites.net/docs/concepts/concepts_ingestiontimepolicy.html) enabled.


