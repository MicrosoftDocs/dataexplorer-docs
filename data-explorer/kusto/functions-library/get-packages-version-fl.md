---
title: get_packages_version_fl() - Azure Data Explorer
description: Learn how to use the get_packages_version_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 12/27/2022
---
# get_packages_version_fl()

Retrieves the versions of the Python engine and packages of the [inline python() plugin](../query/pythonplugin.md).
The function accepts a dynamic array containing the names of the packages to check, and returns their respective versions and the Python engine version.

> [!NOTE]
>
> * `get_packages_version_fl()` is a [user-defined function](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.

## Syntax

`T | invoke get_packages_version_fl(`*packages*`)`
  
## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *packages* | dynamic | | A dynamic array containing the names of the packages. Default is empty list to retrieve only the engine version |

## Usage

`get_packages_version_fl()` is a user-defined function [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

### [Ad hoc](#tab/adhoc)

For ad hoc usage, embed its code using [let statement](../query/letstatement.md). No permission is required.

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
}
;
get_packages_version_fl(pack_array('numpy', 'scipy', 'pandas', 'statsmodels', 'sklearn', 'onnxruntime', 'plotly'))
```

### [Persistent](#tab/persistent)

For persistent usage, use [`.create function`](../management/create-function.md).  Creating a function requires [database user permission](../management/access-control/role-based-access-control.md).

### One time installation

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

### Usage

```kusto
get_packages_version_fl(pack_array('numpy', 'scipy', 'pandas', 'statsmodels', 'sklearn', 'onnxruntime', 'plotly'))
```

---

```kusto
name	    ver
numpy	    1.23.4
onnxruntime	1.13.1
pandas	    1.5.1
plotly	    5.11.0
Python	    3.10.8 (tags/v3.10.8:aaaf517, Oct 11 2022, 16:50:30) [MSC v.1933 64 bit (AMD64)]
scipy	    1.9.3
sklearn	    1.1.3
statsmodels	0.13.2
```