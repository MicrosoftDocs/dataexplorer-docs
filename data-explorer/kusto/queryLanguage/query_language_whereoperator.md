# where operator (has, contains, startswith, endswith, matches regex)

Filters a table to the subset of rows that satisfy a predicate.

     T | where fruit=="apple"

**Alias** `filter`

**Syntax**

*T* `| where` *Predicate*

**Arguments**

* *T*: The tabular input whose records are to be filtered.
* *Predicate*: A `boolean` expression over the columns of *T*. It is evaluated for each row in *T*.

**Returns**

Rows in *T* for which *Predicate* is `true`.

**Notes**
Null values: all filtering functions return false when compared with null values. 
You can use special null-aware functions to write queries that take null values into account:
[isnull()](./query_language_isnullfunction.md),
[isnotnull()](./query_language_isnotnullfunction.md),
[isempty()](./query_language_isemptyfunction.md),
[isnotempty()](./query_language_isnotemptyfunction.md). 

**Tips**

To get the fastest performance:

* **Use simple comparisons** between column names and constants. ('Constant' means constant over the table - so `now()` and `ago()` are OK, and so are scalar values assigned using a [`let` statement](./query_language_letstatement.md).)

    For example, prefer `where Timestamp >= ago(1d)` to `where floor(Timestamp, 1d) == ago(1d)`.

* **Simplest terms first**: If you have multiple clauses conjoined with `and`, put first the clauses that involve just one column. So `Timestamp > ago(1d) and OpId == EventId` is better than the other way around.

[See here](./concepts_datatypes_string_operators.md) for a summary of available string operators.

[See here](./concepts_numoperators.md) for a summary of available numeric operators.

**Example**

<!-- csl -->
```
Traces
| where Timestamp > ago(1h)
    and Source == "Kuskus"
    and ActivityId == SubActivityId 
```

Records that are no older than 1 hour,
and come from the Source called "Kuskus", and have two columns of the same value. 

Notice that we put the comparison between two columns last, as it can't utilize the index and forces a scan.

**Example**

<!-- csl -->
```
Traces | where * has "Azure"
```

All the rows in which the word "Azure" appears in any column.
