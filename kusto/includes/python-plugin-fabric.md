---
ms.topic: include
ms.date: 05/23/2024
---

The Python plugin runs a user-defined function (UDF) using a Python script. The Python script gets tabular data as its input, and produces tabular output.

## Syntax

*T* `|` `evaluate` [`hint.distribution` `=` (`single` | `per_node`)] [`hint.remote` `=` (`auto` | `local`)] `python(`*output_schema*`,` *script* [`,` *script_parameters*] [`,` *spill_to_disk*]`)`

[!INCLUDE [syntax-conventions-note](syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*output_schema*| `string` | :heavy_check_mark:|A `type` literal that defines the output schema of the tabular data, returned by the Python code. The format is: `typeof(`*ColumnName*`:` *ColumnType*[, ...]`)`. For example, `typeof(col1:string, col2:long)`. To extend the input schema, use the following syntax: `typeof(*, col1:string, col2:long)`.|
|*script*| `string` | :heavy_check_mark:|The valid Python script to execute. To generate multi-line strings, see [Usage tips](#usage-tips).|
|*script_parameters*| `dynamic` ||A property bag of name value pairs to be passed to the Python script as the reserved `kargs` dictionary. For more information, see [Reserved Python variables](#reserved-python-variables).|
|*hint.distribution*| `string` ||A hint for the plugin's execution to be distributed across multiple cluster nodes. The default value is `single`. `single` means a single instance of the script will run over the entire query data. `per_node` means that if the query before the Python block is distributed, an instance of the script will run on each node, on the data that it contains.|
|*hint.remote*| `string` ||This hint is only relevant for cross cluster queries. The default value is `auto`. `auto` means the server decides automatically in which cluster the Python code is executed. Setting the value to `local` forces executing the Python code on the local cluster. Use it in case the Python plugin is disabled on the remote cluster.|
|*spill_to_disk*| `bool` ||Specifies an alternative method for serializing the input table to the Python sandbox. For serializing big tables set it to `true` to speed up the serialization and significantly reduce the sandbox memory consumption. Default is `true`.|

## Reserved Python variables

The following variables are reserved for interaction between Kusto Query Language and the Python code.

* `df`: The input tabular data (the values of `T` above), as a `pandas` DataFrame.
* `kargs`: The value of the *script_parameters* argument, as a Python dictionary.
* `result`: A `pandas` DataFrame created by the Python script, whose value becomes the tabular data that gets sent to the Kusto query operator that follows the plugin.

## Enable the plugin

The plugin is disabled by default. Before you start, [enable the Python plugin](/fabric/real-time-analytics/python-plugin) in your KQL database.

## Python sandbox image

To see the list of packages for the different Python images, see [Python package reference](../python-package-reference.md).

> [!NOTE]
>
> * By default, the plugin imports *numpy* as **np** and *pandas* as **pd**. Optionally, you can import other modules as needed.
> * Some packages might be incompatible with the limitations enforced by the sandbox where the plugin is run.

## Use ingestion from query and update policy

* Use the plugin in queries that are:
  * Defined as part of an [update policy](../management/update-policy.md), whose source table is ingested to using *non-streaming* ingestion.
  * Run as part of a command that [ingests from a query](../management/data-ingestion/ingest-from-query.md), such as `.set-or-append`.
* You can't use the plugin in a query that is defined as part of an update policy, whose source table is ingested using [streaming ingestion](/azure/data-explorer/ingest-data-streaming.md).

## Examples

~~~kusto
range x from 1 to 360 step 1
| evaluate python(
//
typeof(*, fx:double),               //  Output schema: append a new fx column to original table 
```
result = df
n = df.shape[0]
g = kargs["gain"]
f = kargs["cycles"]
result["fx"] = g * np.sin(df["x"]/n*2*np.pi*f)
```
, bag_pack('gain', 100, 'cycles', 4)    //  dictionary of parameters
)
| render linechart 
~~~

:::image type="content" source="../query/media/plugin/sine-demo.png" alt-text="Screenshot of sine demo showing query result." border="false":::

## Performance tips

* Reduce the plugin's input dataset to the minimum amount required (columns/rows).
  * Use filters on the source dataset, when possible, with Kusto's query language.
  * To do a calculation on a subset of the source columns, project only those columns before invoking the plugin.
* Use `hint.distribution = per_node` whenever the logic in your script is distributable.
  * You can also use the [partition operator](../query/partition-operator.md) for partitioning the input dataset.
* Use Kusto's query language whenever possible, to implement the logic of your Python script.

## Usage tips

* To generate multi-line strings containing the Python script in your query editor, copy your Python script from your favorite
  Python editor (*Jupyter*, *Visual Studio Code*, *PyCharm*, and so on), paste it in your query editor, and then enclose the full script between lines containing three consecutive backticks. For example:  

    ` ``` `  
    ` python code`  
    ` ``` `
* Use the [`externaldata` operator](../query/externaldata-operator.md) to obtain the content of a script that you've stored in an external location, such as Azure Blob storage.
  
### Example

```kusto
    let script = 
        externaldata(script:string)
        [h'https://kustoscriptsamples.blob.core.windows.net/samples/python/sample_script.py']
        with(format = raw);
    range x from 1 to 360 step 1
    | evaluate python(
        typeof(*, fx:double),
        toscalar(script), 
        bag_pack('gain', 100, 'cycles', 4))
    | render linechart 
 ```

## Related content

For more examples of UDF functions that use the Python plugin, see the [Functions library](../functions-library/functions-library.md).
