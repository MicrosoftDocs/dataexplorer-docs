# getyear()

Returns the year part of the `datetime` argument.

**Example**

```kusto
T
| extend year = getyear(datetime(2015-10-12))
// year == 2015
```


