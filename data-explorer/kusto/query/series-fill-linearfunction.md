# series-fill-linear()

Performs linear interpolation of missing values in a series.

Takes an expression containing dynamic numerical array as input, performs linear interpolation for all instances of missing-value-placeholder and returns the resulting array. If the beginning and end of the array contains missing-value-placeholder, then it will be replaced with the nearest value other than missing-value-placeholder (can be turned off). If the whole array consists of the missing-value-placeholder then the array will be filled with constant-value or 0 if no specified.  

**Syntax**

`series-fill-linear(`*x*`[,` *missing-value-placeholder*` [,`*fill-edges*` [,`*constant-value*`]]]))`
* Will return series linear interpolation of *x* using specified parameters.
 

**Arguments**

* *x*: dynamic array scalar expression which is an array of numeric values.
* *missing-value-placeholder*: optional parameter which specifies a placeholder for the "missing values" to be replaced. Default value is `double`(*null*).
* *fill-edges*: Boolean value which indicates whether *missing-value-placeholder* at the start and end of the array should be replaced with nearest value. *True* by default. If set to *false* then *missing-value-placeholder* at the start and end of the array will be preserved.
* *constant-value*: optional parameter relevant only for arrays entirely consists of *null* values, which specifies constant value to fill the series with. Default value is *0*. Setting this parameter it to `double`(*null*) will effectively leave *null* values where they are.

**Notes**

* In order to apply any interpolation functions after [make-series](make-seriesoperator.md) it is recommended to specify *null* as a default value: 

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```
make-series num=count() default=long(null) on TimeStamp in range(ago(1d), ago(1h), 1h) by Os, Browser
```

* The *missing-value-placeholder* can be of any type which will be converted to actual element types. Therefore either `double`(*null*), `long`(*null*) or `int`(*null*) have the same meaning.
* If *missing-value-placeholder* is `double`(*null*) (or just omitted which have the same meaning) then a result may contains *null* values. Use other interpolation functions in order to fill them. Currently only [series-outliers()](series-outliersfunction.md) support *null* values in input arrays.
* The function preserves original type of array elements. If *x* contains only *int* or *long* elements then the linear interpolation will return rounded interpolated values rather than exact ones.

**Example**

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```
let data = datatable(arr: dynamic)
[
    dynamic([null, 111.0, null, 36.0, 41.0, null, null, 16.0, 61.0, 33.0, null, null]), // Array of double    
    dynamic([null, 111,   null, 36,   41,   null, null, 16,   61,   33,   null, null]), // Similar array of int
    dynamic([null, null, null, null])                                                   // Array with missing values only
];
data
| project arr, 
          without-args = series-fill-linear(arr),
          with-edges = series-fill-linear(arr, double(null), true),
          wo-edges = series-fill-linear(arr, double(null), false),
          with-const = series-fill-linear(arr, double(null), true, 3.14159)  

```

|arr|without-args|with-edges|wo-edges|with-const|
|---|---|---|---|---|
|[null,111.0,null,36.0,41.0,null,null,16.0,61.0,33.0,null,null]|[111.0,111.0,73.5,36.0,41.0,32.667,24.333,16.0,61.0,33.0,33.0,33.0]|[111.0,111.0,73.5,36.0,41.0,32.667,24.333,16.0,61.0,33.0,33.0,33.0]|[null,111.0,73.5,36.0,41.0,32.667,24.333,16.0,61.0,33.0,null,null]|[111.0,111.0,73.5,36.0,41.0,32.667,24.333,16.0,61.0,33.0,33.0,33.0]|
|[null,111,null,36,41,null,null,16,61,33,null,null]|[111,111,73,36,41,32,24,16,61,33,33,33]|[111,111,73,36,41,32,24,16,61,33,33,33]|[null,111,73,36,41,32,24,16,61,33,null,null]|[111,111,74,38,  41,32,24,16,61,33,33,33]|
|[null,null,null,null]|[0.0,0.0,0.0,0.0]|[0.0,0.0,0.0,0.0]|[0.0,0.0,0.0,0.0]|[3.14159,3.14159,3.14159,3.14159]|
