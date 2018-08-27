---
title: series-fill-backward() (Azure Kusto)
description: This article describes series-fill-backward() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# series-fill-backward()

Performs backward fill interpolation of missing values in a series.

Takes an expression containing dynamic numerical array as input, replaces all instances of missing-value-placeholder with the nearest value from its right side other than missing-value-placeholder and returns the resulting array. The rightmost instances of missing-value-placeholder are preserved.

**Syntax**

`series-fill-backward(`*x*`[, `*missing-value-placeholder*`])`
* Will return series *x* with all instances of *missing-value-placeholder* filled backward.

**Arguments**

* *x*: dynamic array scalar expression which is an array of numeric values.
* *missing-value-placeholder*: optional parameter which specifies a placeholder for a missing values to be replaced. Default value is `double`(*null*).

**Notes**

* In order to apply any interpolation functions after [make-series](make-seriesoperator.md) it is recommended to specify *null* as a default value: 

```kusto
make-series num=count() default=long(null) on TimeStamp in range(ago(1d), ago(1h), 1h) by Os, Browser
```

* The *missing-value-placeholder* can be of any type which will be converted to actual element types. Therefore either `double`(*null*), `long`(*null*) or `int`(*null*) have the same meaning.
* If *missing-value-placeholder* is `double`(*null*) (or just omitted which have the same meaning) then a result may contains *null* values. Use other interpolation functions in order to fill them. Currently only [series-outliers()](series-outliersfunction.md) support *null* values in input arrays.
* The functions preserves original type of array elements.

**Example**

```kusto
let data = datatable(arr: dynamic)
[
    dynamic([111,null,36,41,null,null,16,61,33,null,null])   
];
data 
| project arr, 
          fill-forward = series-fill-backward(arr)

```

|arr|fill-forward|
|---|---|
|[111,null,36,41,null,null,16,61,33,null,null]|[111,36,36,41,16, 16,16,61,33,null,null]|

  
One can use [series-fill-forward](series-fill-forwardfunction.md) or [series-fill-const](series-fill-constfunction.md) in order to complete interpolation of the above array.