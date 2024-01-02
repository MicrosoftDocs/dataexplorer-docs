---
title:  quantize_fl()
description: This article describes the quantize_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/05/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# quantize_fl()

::: zone pivot="azuredataexplorer, fabric"

The function `quantize_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that bins metric columns. It quantizes metric columns to categorical labels, based on the K-Means algorithm.

[!INCLUDE [python-zone-pivot-fabric](../../includes/python-zone-pivot-fabric.md)]

## Syntax

`T | invoke quantize_fl(`*num_bins*`,` *in_cols*`,` *out_cols* [`,` *labels* ]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*num_bins*|int|&check;| The required number of bins.|
|*in_cols*|dynamic|&check;|An array containing the names of the columns to quantize.|
|*out_cols*|dynamic|&check;|An array containing the names of the respective output columns for the binned values.|
|*labels*|dynamic||An array containing the label names. If unspecified, bin ranges will be used.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabularexpressionstatements.md). To run a working example of `quantize_fl()`, see [Example](#example).

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
// Write your query to use the function here.
~~~

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

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

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

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

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

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

**Output**

| x | x_label | x_bin |
|---|---|---|
| 1 | Low | 1.0-7.75 |
| 2 | Low | 1.0-7.75 |
| 3 | Low | 1.0-7.75 |
| 4 | Low | 1.0-7.75 |
| 5 | Low | 1.0-7.75 |
| 20 | High | 17.5-25.0 |
| 21 | High | 17.5-25.0 |
| 22 | High | 17.5-25.0 |
| 23 | High | 17.5-25.0 |
| 24 | High | 17.5-25.0 |
| 25 | High | 17.5-25.0 |
| 10 | Med | 7.75-17.5 |
| 11 | Med | 7.75-17.5 |
| 12 | Med | 7.75-17.5 |
| 13 | Med | 7.75-17.5 |
| 14 | Med | 7.75-17.5 |
| 15 | Med | 7.75-17.5 |

::: zone-end

::: zone pivot="azuremonitor"

This feature isn't supported.

::: zone-end
