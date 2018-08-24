# ago()

Subtracts the given timespan from the current UTC clock time.

    ago(1h)
    ago(1d)

Like `now()`, this function can be used multiple times
in a statement and the UTC clock time being referenced will be the same
for all instantiations.

**Syntax**

`ago(`*a-timespan*`)`

**Arguments**

* *a-timespan*: Interval to subtract from the current UTC clock time
(`now()`).

**Returns**

`now() - a-timespan`

**Example**

All rows with a timestamp in the past hour:

```kusto
T | where Timestamp > ago(1h)
```


