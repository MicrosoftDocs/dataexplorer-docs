---
title:  get_packages_version_fl()
description: Learn how to use the get_packages_version_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/13/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# get_packages_version_fl()

::: zone pivot="azuredataexplorer, fabric"

`get_packages_version_fl()` is a [user-defined function](../query/functions/user-defined-functions.md) that retrieves the versions of the Python engine and packages of the [inline python() plugin](../query/python-plugin.md).

The function accepts a dynamic array containing the names of the packages to check, and returns their respective versions and the Python engine version.

[!INCLUDE [python-zone-pivot-fabric](../../includes/python-zone-pivot-fabric.md)]

## Syntax

`T | invoke get_packages_version_fl(`*packages*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *packages* | dynamic | | A dynamic array containing the names of the packages. Default is empty list to retrieve only the Python engine version. |

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabularexpressionstatements.md). To run a working example of `get_packages_version_fl()`, see [Example](#example).

```kusto
let get_packages_version_fl = (packages:dynamic=dynamic([]))
{
    let kwargs = pack('packages', packages);
    let code =
    ```if 1:
        import importlib
        import sys
        
        packages = kargs["packages"]
        result = pd.DataFrame(columns=["name", "ver"])
        for i in range(len(packages)):
            result.loc[i, "name"] = packages[i]
            try:
                m = importlib.import_module(packages[i])
                result.loc[i, "ver"] = m.__version__ if hasattr(m, "__version__") else "missing __version__ attribute"
            except Exception as ex:
                result.loc[i, "ver"] = "ERROR: " + (ex.msg if hasattr(ex, "msg") else "exception, no msg")
        id = result.shape[0]
        result.loc[id, "name"] = "Python"
        result.loc[id, "ver"] = sys.version
    ```;
    print 1
    | evaluate python(typeof(name:string , ver:string), code, kwargs)
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Utils", docstring = "Returns version information of the Python engine and the specified packages")
get_packages_version_fl(packages:dynamic=dynamic([]))
{
    let kwargs = pack('packages', packages);
    let code =
    ```if 1:
        import importlib
        import sys
        
        packages = kargs["packages"]
        result = pd.DataFrame(columns=["name", "ver"])
        for i in range(len(packages)):
            result.loc[i, "name"] = packages[i]
            try:
                m = importlib.import_module(packages[i])
                result.loc[i, "ver"] = m.__version__ if hasattr(m, "__version__") else "missing __version__ attribute"
            except Exception as ex:
                result.loc[i, "ver"] = "ERROR: " + (ex.msg if hasattr(ex, "msg") else "exception, no msg")
        id = result.shape[0]
        result.loc[id, "name"] = "Python"
        result.loc[id, "ver"] = sys.version
    ```;
    print 1
    | evaluate python(typeof(name:string , ver:string), code, kwargs)
}
```

---

## Example

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

```kusto
let get_packages_version_fl = (packages:dynamic=dynamic([]))
{
    let kwargs = pack('packages', packages);
    let code =
    ```if 1:
        import importlib
        import sys
        
        packages = kargs["packages"]
        result = pd.DataFrame(columns=["name", "ver"])
        for i in range(len(packages)):
            result.loc[i, "name"] = packages[i]
            try:
                m = importlib.import_module(packages[i])
                result.loc[i, "ver"] = m.__version__ if hasattr(m, "__version__") else "missing __version__ attribute"
            except Exception as ex:
                result.loc[i, "ver"] = "ERROR: " + (ex.msg if hasattr(ex, "msg") else "exception, no msg")
        id = result.shape[0]
        result.loc[id, "name"] = "Python"
        result.loc[id, "ver"] = sys.version
    ```;
    print 1
    | evaluate python(typeof(name:string , ver:string), code, kwargs)
};
get_packages_version_fl(pack_array('numpy', 'scipy', 'pandas', 'statsmodels', 'sklearn', 'onnxruntime', 'plotly'))
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
get_packages_version_fl(pack_array('numpy', 'scipy', 'pandas', 'statsmodels', 'sklearn', 'onnxruntime', 'plotly'))
```

---

**Output**

| name | ver |
|---|---|
| numpy | 1.23.4 |
| onnxruntime | 1.13.1 |
| pandas | 1.5.1 |
| plotly | 5.11.0 |
| Python | 3.10.8 (tags/v3.10.8:aaaf517, Oct 11 2022, 16:50:30) [MSC v.1933 64 bit (AMD64)] |
| scipy | 1.9.3 |
| sklearn | 1.1.3 |
| statsmodels | 0.13.2 |

::: zone-end

::: zone pivot="azuremonitor"

This feature isn't supported.

::: zone-end
