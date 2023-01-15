---
title: quantize_fl() - Azure Data Explorer
description: This article describes the quantize_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 11/08/2022
---
# quantize_fl()


The function `quantize_fl()` bins metric columns. It quantizes metric columns to categorical labels, based on the K-Means algorithm.

> [!NOTE]
> * `quantize_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.

## Syntax

`T | invoke quantize_fl(`*num_bins*`,` *in_cols*`,` *out_cols*`,` *labels*`)`

## Arguments

* *num_bins*: Required number of bins.
* *in_cols*: Dynamic array containing the names of the columns to quantize.
* *out_cols*: Dynamic array containing the names of the respective output columns for the binned values.
* *labels*: Dynamic array containing the label names. This parameter is optional. If *Labels* isn't supplied, bin ranges will be used.

## Usage

`quantize_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

<!-- csl: https://help.kusto.windows.net/Samples -->
~~~kusto
let quantize_fl=(tbl:(*), num_bins:int, in_cols:dynamic, out_cols:dynamic, labels:dynamic=dynamic(null))
{
    let kwargs = bag_pack('num_bins', num_bins, 'in_cols', in_cols, 'out_cols', out_cols, 'labels', labels);
    let code = ```if 1:
        
        from sklearn.preprocessing import KBinsDiscretizer
        
        num_bins = kargs["num_bins"]
        in_cols = kargs["in_cols"]
        out_cols = kargs["out_cols"]
        labels = kargs["labels"]
        
        result = df
        binner = KBinsDiscretizer(n_bins=num_bins, encode="ordinal", strategy="kmeans")
        df_in = df[in_cols]
        bdata = binner.fit_transform(df_in)
        if labels is None:
            for i in range(len(out_cols)):    # loop on each column and convert it to binned labels
                ii = np.round(binner.bin_edges_[i], 3)
                labels = [str(ii[j-1]) + '-' + str(ii[j]) for j in range(1, num_bins+1)]
                result.loc[:,out_cols[i]] = np.take(labels, bdata[:, i].astype(int))
        else:
            result[out_cols] = np.take(labels, bdata.astype(int))
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
};
//
union 
(range x from 1 to 5 step 1),
(range x from 10 to 15 step 1),
(range x from 20 to 25 step 1)
| extend x_label='', x_bin=''
| invoke quantize_fl(3, pack_array('x'), pack_array('x_label'), pack_array('Low', 'Med', 'High'))
| invoke quantize_fl(3, pack_array('x'), pack_array('x_bin'), dynamic(null))
~~~

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-access-control.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
~~~kusto
.create function with (folder = "Packages\\ML", docstring = "Binning metric columns")
quantize_fl(tbl:(*), num_bins:int, in_cols:dynamic, out_cols:dynamic, labels:dynamic)
{
    let kwargs = bag_pack('num_bins', num_bins, 'in_cols', in_cols, 'out_cols', out_cols, 'labels', labels);
    let code = ```if 1:
        
        from sklearn.preprocessing import KBinsDiscretizer
        
        num_bins = kargs["num_bins"]
        in_cols = kargs["in_cols"]
        out_cols = kargs["out_cols"]
        labels = kargs["labels"]
        
        result = df
        binner = KBinsDiscretizer(n_bins=num_bins, encode="ordinal", strategy="kmeans")
        df_in = df[in_cols]
        bdata = binner.fit_transform(df_in)
        if labels is None:
            for i in range(len(out_cols)):    # loop on each column and convert it to binned labels
                ii = np.round(binner.bin_edges_[i], 3)
                labels = [str(ii[j-1]) + '-' + str(ii[j]) for j in range(1, num_bins+1)]
                result.loc[:,out_cols[i]] = np.take(labels, bdata[:, i].astype(int))
        else:
            result[out_cols] = np.take(labels, bdata.astype(int))
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
}
~~~

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
union 
(range x from 1 to 5 step 1),
(range x from 10 to 15 step 1),
(range x from 20 to 25 step 1)
| extend x_label='', x_bin=''
| invoke quantize_fl(3, pack_array('x'), pack_array('x_label'), pack_array('Low', 'Med', 'High'))
| invoke quantize_fl(3, pack_array('x'), pack_array('x_bin'), dynamic(null))
```

---

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
x    x_label    x_bin
1    Low        1.0-7.75
2    Low        1.0-7.75
3    Low        1.0-7.75
4    Low        1.0-7.75
5    Low        1.0-7.75
20   High       17.5-25.0
21   High       17.5-25.0
22   High       17.5-25.0
23   High       17.5-25.0
24   High       17.5-25.0
25   High       17.5-25.0
10   Med        7.75-17.5
11   Med        7.75-17.5
12   Med        7.75-17.5
13   Med        7.75-17.5
14   Med        7.75-17.5
15   Med        7.75-17.5
```
