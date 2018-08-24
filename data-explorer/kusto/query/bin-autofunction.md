# bin-auto()

Rounds values down to a fixed-size "bin", with control over the bin size and starting point provided by a query property.

**Syntax**

`bin-auto` `(` *Expression* `)`

**Arguments**

* *Expression*: A scalar expression of a numeric type indicating the value to round.

**Client Request Properties**

* `query-bin-auto-size`: A numeric literal indicating the size of each bin.
* `query-bin-auto-at`: A numeric literal indicating one value of *Expression* which is a "fixed point" (that is, a value `fixed-point`
  for which `bin-auto(fixed-point)` == `fixed-point`.)

**Returns**

The nearest multiple of `query-bin-auto-at` below *Expression*, shifted so that `query-bin-auto-at`
will be translated into itself.

**Examples**

```kusto
set query-bin-auto-size=1h;
set query-bin-auto-at=datetime(2017-01-01 00:05);
range Timestamp from datetime(2017-01-01 00:05) to datetime(2017-01-01 02:00) step 1m
| summarize count() by bin-auto(Timestamp)
```

|Timestamp                    | count-|
|-----------------------------|-------|
|2017-01-01 00:05:00.0000000  | 60    |
|2017-01-01 01:05:00.0000000  | 56    |


