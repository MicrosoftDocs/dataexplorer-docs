# isnan()

Returns whether input is Not-a-Number (NaN) value.  

**Syntax**

`isnan(`*x*`)`

**Arguments**

* *x*: A real number.

**Returns**

A non-zero value (true) if x is NaN; and zero (false) otherwise.

**See also**

* For checking if value is null, see [isnull()](query_language_isnullfunction.md).
* For checking if value is finite, see [isfinite()](query_language_isfinitefunction.md).
* For checking if value is infinite, see [isinf()](query_language_isinffunction.md).

**Example**

<!-- csl -->
```
range x from -1 to 1 step 1
| extend y = (-1*x) 
| extend div = 1.0*x/y
| extend isnan=isnan(div)
```

|x|y|div|isnan|
|---|---|---|---|
|-1|1|-1|0|
|0|0|NaN|1|
|1|-1|-1|0|
