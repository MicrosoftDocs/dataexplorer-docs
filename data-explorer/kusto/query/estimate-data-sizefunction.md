# estimate-data-size()

Returns an estimated data size of the selected columns of the tabular expression.

    estimate-data-size(*)
    estimate-data-size(Col1, Col2, Col3)

**Syntax**

`estimate-data-size(*)`

`estimate-data-size(`*col1*`, `*col2*`, `...`)`

**Arguments**

* *col1*, *col2*: Selection of column refereces in the source tabular expression that are used for data size estimation. To include all columns, use `*` (asterisk) syntax.

**Returns**

* The estimated data size of the record size. Estimation is based on data types and values lengths.

**Examples**

Calculating total data size using `estimated-data-size()`:

```kusto
range x from 1 to 10 step 1                    // x (long) is 8 
| extend Text = '1234567890'                   // Text length is 10  
| summarize Total=sum(estimate-data-size(*))   // (8+10)x10 = 180
```

|Total|
|---|
|180|


