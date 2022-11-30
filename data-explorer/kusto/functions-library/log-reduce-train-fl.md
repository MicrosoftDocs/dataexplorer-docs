---
title: log_reduce_train_fl() - Azure Data Explorer
description: This article describes the log_reduce_train_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 24/10/2022
---
# log_reduce_train_fl()

The function `log_reduce_train_fl()` finds common patterns in semi structured textual columns, such as log lines, and clusters the lines according to the extracted patterns. The function's algorithm and most of the parameters are identical to [log_reduce_fl()](log-reduce-fl.md), but unlike log_reduce_fl() that output a patterns summary table, this function outputs the serialized model. The model can be used by the function [log_reduce_predict_fl()](log-reduce-predict-fl.md)/[log_reduce_predict_full_fl()](log-reduce-predict-full-fl.md) to predict the matched pattern for new log lines.

> [!NOTE]
> * `log_reduce_train_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.

## Syntax

`T | invoke log_reduce_train_fl(`*reduce_col*`,` *model_name*`,` *use_logram*`,` *use_drain*`,` *custom_regexes*`,` *custom_regexes_policy*`,` *delimiters*`,` *similarity_th*`,` *tree_depth*`,` *trigram_th*`,` *bigram_th*`)`

## Arguments

The argument description below is a summary, see [More about the algorithm](#more-about-the-algorithm) section for more details.

| Name | Type | Required | Description |
|--|--|--|--|
| *reduce_col* | string | &check; | The name of the string column the function is applied to. |
| *model_name* | string | &check; | The name of the output model. |
| *use_logram* | boolean | | Enable/disable the Logram algorithm. Default value is True. |
| *use_drain* | boolean | | Enable/disable the Drain algorithm. Default value is True. |
| *custom_regexes* | dynamic | | A dynamic array containing pairs of regular expression and replacement symbols to be searched in each input row, and replaced with their respective matching symbol. Default value is dynamic([]). The default regex table replaces numbers, IPs and GUIDs. |
| *custom_regexes_policy* | string | | Either 'prepend', 'append' or 'replace'. Controls whether custom_regexes are prepend/append/replace the default ones. Default value is 'prepend'. |
| *delimiters* | dynamic | | A dynamic array containing delimiter strings. Default value is dynamic([" "]), defining space as the only single character delimiter. |
| *similarity_th* | real | | Similarity threshold, used by the Drain algorithm. Increasing *similarity_th* will result in more refined clusters. Default value is 0.5. If Drain is disabled this parameter has no effect.
| *tree_depth* | integer | | Increasing *tree_depth* will improve the runtime of the Drain algorithm, but might reduce its accuracy. Default value is 4. If Drain is disabled this parameter has no effect. |
| *trigram_th* | integer | | Decreasing *trigram_th* will increase the chances of Logram to replace tokens with wildcards. Default value is 10. If Logram is disabled this parameter has no effect. |
| *bigram_th* | int | | Decreasing *bigram_th* will increase the chances of Logram to replace tokens with wildcards. Default value is 15. If Logram is disabled this parameter has no effect. |

## More about the algorithm

See [More about the algorithm of log_reduce_fl()](log-reduce-fl.md#more-about-the-algorithm). As mentioned, this function runs the same passes over the data, just instead of summarizing the patterns' frequency it outputs a single record containing the *model_name*, the training timestamp and the serialized model. This record can be stored in a models table to be used by log_reduce_predict_fl()/log_reduce_predict_full_fl().

## Usage

`log_reduce_train_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function) to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

# [Ad hoc](#tab/adhoc)

For ad hoc usage, embed the code using the [let statement](../query/letstatement.md). No permission is required.

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
        from sandbox_utils import Zipackage
        Zipackage.install('LogReduceFilter.zip')
        from LogReduceFilter import LogReduce
        result = LogReduce.log_reduce(df, kargs)
    ```;
    tbl
    | extend LogReduce=''
    | evaluate python(typeof(model:string), code, kwargs, external_artifacts =
    bag_pack('LogReduceFilter.zip', 'https://adiwesteurope.blob.core.windows.net/python-we/LogReduceFilter/LogReduceFilter-1.0.1.zip'))
    | project name=model_name, timestamp=now(), model
}
;
// Creates a model named "HDFS_model", for the HDFS log, a commonly used benchmark for log parsing.
HDFS_log
| take 100000
| invoke log_reduce_train_fl(reduce_col="data", model_name="HDFS_model")
~~~

# [Persistent](#tab/persistent)

For persistent usage, use [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One-time installation

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
        from sandbox_utils import Zipackage
        Zipackage.install('LogReduceFilter.zip')
        from LogReduceFilter import LogReduce
        result = LogReduce.log_reduce(df, kargs)
    ```;
    tbl
    | extend LogReduce=''
    | evaluate python(typeof(model:string), code, kwargs, external_artifacts =
    bag_pack('LogReduceFilter.zip', 'https://adiwesteurope.blob.core.windows.net/python-we/LogReduceFilter/LogReduceFilter-1.0.1.zip'))
    | project name=model_name, timestamp=now(), model
}
~~~

### Usage

```kusto
// Creates a model named "HDFS_model", for the HDFS log, a commonly used benchmark for log parsing.
HDFS_log
| take 100000
| invoke log_reduce_train_fl(reduce_col="data", model_name="HDFS_model")
```

---

Result:

```kusto
name	timestamp	model
HDFS_model	2022-11-23 12:38:52.8445035	80036370616e646...
```

To store the model in models table you can use [.set-or-append](../management/data-ingestion/ingest-from-query.md) command:

```kusto
.set-or-append ML_models <|
HDFS_log
| take 100000
| invoke log_reduce_train_fl(reduce_col="data", model_name="HDFS_model")
```
