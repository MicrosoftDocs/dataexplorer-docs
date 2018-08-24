# series-seasonal()

Calculates the seasonal component of a series inputs according to the given seasonal period.

**Syntax**

`series-seasonal(`*series*`,` *period*`)`

**Arguments**

* *series*: Input numeric dynamic array.
* *period*: Integer number of bins in each seasonal period.

**Returns**

Dynamic array of the same length as the *series* input containing the calculated seasonal component of the series. The seasonal component is calculated as the *median* of all the values corresponding to the location of the bin across the periods.

**See also:**

* [series-periods-detect()](series-periods-detectfunction.md)
* [series-periods-validate()](series-periods-validatefunction.md)

**Example**

```kusto
print s=dynamic([1,3,5,1,3,5,2,4,6]) 
| union (print s=dynamic([1,3,5,2,4,6,1,3,5,2,4,6]))
| extend s-seasonal = series-seasonal(s,3)
```
|s|s-seasonal|
|---|---|
|[1,3,5,1,3,5,2,4,6]|[1.0,3.0,5.0,1.0,3.0,5.0,1.0,3.0,5.0]|
|[1,3,5,2,4,6,1,3,5,2,4,6]|[1.5,3.5,5.5,1.5,3.5,5.5,1.5,3.5,5.5,1.5,3.5,5.5]|


