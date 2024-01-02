---
title:  log_reduce_train_fl()
description: This article describes the log_reduce_train_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 04/18/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# log_reduce_train_fl()

::: zone pivot="azuredataexplorer, fabric"

The function `log_reduce_train_fl()` finds common patterns in semi structured textual columns, such as log lines, and clusters the lines according to the extracted patterns. The function's algorithm and most of the parameters are identical to [log_reduce_fl()](log-reduce-fl.md), but unlike log_reduce_fl() that outputs a patterns summary table, this function outputs the serialized model. The model can be used by the function [log_reduce_predict_fl()](log-reduce-predict-fl.md)/[log_reduce_predict_full_fl()](log-reduce-predict-full-fl.md) to predict the matched pattern for new log lines.

[!INCLUDE [python-zone-pivot-fabric](../../includes/python-zone-pivot-fabric.md)]

## Syntax

*T* `|` `invoke` `log_reduce_train_fl(`*reduce_col*`,` *model_name* [`,` *use_logram* [`,` *use_drain* [`,` *custom_regexes* [`,` *custom_regexes_policy* [`,` *delimiters* [`,` *similarity_th* [`,` *tree_depth* [`,` *trigram_th* [`,` *bigram_th* ]]]]]]]]]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

The following parameters description is a summary. For more information, see [More about the algorithm](log-reduce-fl.md#more-about-the-algorithm) section.

| Name | Type | Required | Description |
|--|--|--|--|
| *reduce_col* | string | &check; | The name of the string column the function is applied to. |
| *model_name* | string | &check; | The name of the output model. |
| *use_logram* | bool | | Enable or disable the Logram algorithm. Default value is `true`. |
| *use_drain* | bool | | Enable or disable the Drain algorithm. Default value is `true`. |
| *custom_regexes* | dynamic | | A dynamic array containing pairs of regular expression and replacement symbols to be searched in each input row, and replaced with their respective matching symbol. Default value is `dynamic([])`. The default regex table replaces numbers, IPs and GUIDs. |
| *custom_regexes_policy* | string | | Either 'prepend', 'append' or 'replace'. Controls whether custom_regexes are prepend/append/replace the default ones. Default value is 'prepend'. |
| *delimiters* | dynamic | | A dynamic array containing delimiter strings. Default value is `dynamic([" "])`, defining space as the only single character delimiter. |
| *similarity_th* | real | | Similarity threshold, used by the Drain algorithm. Increasing *similarity_th* results in more refined clusters. Default value is 0.5. If Drain is disabled, then this parameter has no effect.
| *tree_depth* | int | | Increasing *tree_depth* improves the runtime of the Drain algorithm, but might reduce its accuracy. Default value is 4. If Drain is disabled, then this parameter has no effect. |
| *trigram_th* | int | | Decreasing *trigram_th* increases the chances of Logram to replace tokens with wildcards. Default value is 10. If Logram is disabled, then this parameter has no effect. |
| *bigram_th* | int | | Decreasing *bigram_th* increases the chances of Logram to replace tokens with wildcards. Default value is 15. If Logram, then is disabled this parameter has no effect. |

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/letstatement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/letstatement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabularexpressionstatements.md). To run a working example of `log_reduce_fl()`, see [Example](#example).

~~~kusto
let log_reduce_train_fl=(tbl:(*), reduce_col:string, model_name:string,
              use_logram:bool=True, use_drain:bool=True, custom_regexes: dynamic = dynamic([]), custom_regexes_policy: string = 'prepend',
              delimiters:dynamic = dynamic(' '), similarity_th:double=0.5, tree_depth:int = 4, trigram_th:int=10, bigram_th:int=15)
{
    let default_regex_table = pack_array('(/|)([0-9]+\\.){3}[0-9]+(:[0-9]+|)(:|)', '<IP>', 
                                         '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', '<GUID>', 
                                         '(?<=[^A-Za-z0-9])(\\-?\\+?\\d+)(?=[^A-Za-z0-9])|[0-9]+$', '<NUM>');
    let kwargs = bag_pack('reduced_column', reduce_col, 'delimiters', delimiters,'output_column', 'LogReduce', 'parameters_column', '', 
                          'trigram_th', trigram_th, 'bigram_th', bigram_th, 'default_regexes', default_regex_table, 
                          'custom_regexes', custom_regexes, 'custom_regexes_policy', custom_regexes_policy, 'tree_depth', tree_depth, 'similarity_th', similarity_th, 
                          'use_drain', use_drain, 'use_logram', use_logram, 'save_regex_tuples_in_output', True, 'regex_tuples_column', 'RegexesColumn', 
                          'output_type', 'model');
    let code = ```if 1:
        from log_cluster import log_reduce
        result = log_reduce.log_reduce(df, kargs)
    ```;
    tbl
    | extend LogReduce=''
    | evaluate python(typeof(model:string), code, kwargs)
    | project name=model_name, timestamp=now(), model
};
// Write your query to use the function here.
~~~

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

~~~kusto
.create-or-alter function with (folder = 'Packages\\Text', docstring = 'Find common patterns in textual logs, output a model')
log_reduce_train_fl(tbl:(*), reduce_col:string, model_name:string,
              use_logram:bool=True, use_drain:bool=True, custom_regexes: dynamic = dynamic([]), custom_regexes_policy: string = 'prepend',
              delimiters:dynamic = dynamic(' '), similarity_th:double=0.5, tree_depth:int = 4, trigram_th:int=10, bigram_th:int=15)
{
    let default_regex_table = pack_array('(/|)([0-9]+\\.){3}[0-9]+(:[0-9]+|)(:|)', '<IP>', 
                                         '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', '<GUID>', 
                                         '(?<=[^A-Za-z0-9])(\\-?\\+?\\d+)(?=[^A-Za-z0-9])|[0-9]+$', '<NUM>');
    let kwargs = bag_pack('reduced_column', reduce_col, 'delimiters', delimiters,'output_column', 'LogReduce', 'parameters_column', '', 
                          'trigram_th', trigram_th, 'bigram_th', bigram_th, 'default_regexes', default_regex_table, 
                          'custom_regexes', custom_regexes, 'custom_regexes_policy', custom_regexes_policy, 'tree_depth', tree_depth, 'similarity_th', similarity_th, 
                          'use_drain', use_drain, 'use_logram', use_logram, 'save_regex_tuples_in_output', True, 'regex_tuples_column', 'RegexesColumn', 
                          'output_type', 'model');
    let code = ```if 1:
        from log_cluster import log_reduce
        result = log_reduce.log_reduce(df, kargs)
    ```;
    tbl
    | extend LogReduce=''
    | evaluate python(typeof(model:string), code, kwargs)
    | project name=model_name, timestamp=now(), model
}
~~~

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

~~~kusto
//
// Finding common patterns in HDFS logs, export and store the trained model in ML_Models table
//
.set-or-append ML_Models <|
//
let log_reduce_train_fl=(tbl:(*), reduce_col:string, model_name:string,
              use_logram:bool=True, use_drain:bool=True, custom_regexes: dynamic = dynamic([]), custom_regexes_policy: string = 'prepend',
              delimiters:dynamic = dynamic(' '), similarity_th:double=0.5, tree_depth:int = 4, trigram_th:int=10, bigram_th:int=15)
{
    let default_regex_table = pack_array('(/|)([0-9]+\\.){3}[0-9]+(:[0-9]+|)(:|)', '<IP>', 
                                         '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', '<GUID>', 
                                         '(?<=[^A-Za-z0-9])(\\-?\\+?\\d+)(?=[^A-Za-z0-9])|[0-9]+$', '<NUM>');
    let kwargs = bag_pack('reduced_column', reduce_col, 'delimiters', delimiters,'output_column', 'LogReduce', 'parameters_column', '', 
                          'trigram_th', trigram_th, 'bigram_th', bigram_th, 'default_regexes', default_regex_table, 
                          'custom_regexes', custom_regexes, 'custom_regexes_policy', custom_regexes_policy, 'tree_depth', tree_depth, 'similarity_th', similarity_th, 
                          'use_drain', use_drain, 'use_logram', use_logram, 'save_regex_tuples_in_output', True, 'regex_tuples_column', 'RegexesColumn', 
                          'output_type', 'model');
    let code = ```if 1:
        from log_cluster import log_reduce
        result = log_reduce.log_reduce(df, kargs)
    ```;
    tbl
    | extend LogReduce=''
    | evaluate python(typeof(model:string), code, kwargs)
    | project name=model_name, timestamp=now(), model
};
HDFS_log_100k
| take 100000
| invoke log_reduce_train_fl(reduce_col="data", model_name="HDFS_100K")
~~~

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
//
// Finding common patterns in HDFS logs, export and store the trained model in ML_Models table
//
.set-or-append ML_Models <|
//
HDFS_log_100k
| take 100000
| invoke log_reduce_train_fl(reduce_col="data", model_name="HDFS_100K")
```

---

**Output**

| ExtentId | OriginalSize | ExtentSize | CompressedSize | IndexSize | RowCount |
|--|--|--|--|--|--|
|3734a525-cc08-44b9-a992-72de97b32414 |10383 | 11546 | 10834 | 712 | 1 |

::: zone-end

::: zone pivot="azuremonitor"

This feature isn't supported.

::: zone-end
