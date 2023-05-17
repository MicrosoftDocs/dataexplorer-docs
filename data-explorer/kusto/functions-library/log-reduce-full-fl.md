---
title:  log_reduce_full_fl()
description: This article describes the log_reduce_full_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 05/07/2023
---
# log_reduce_full_fl()

::: zone pivot="azuredataexplorer, azuremonitor"


The function `log_reduce_full_fl()` finds common patterns in semi structured textual columns, such as log lines, and clusters the lines according to the extracted patterns. The function's algorithm and most of the parameters are identical to [log_reduce_fl()](log-reduce-fl.md). However, `log_reduce_fl()` outputs a patterns summary table, whereas this function outputs a full table containing the pattern and parameters per each line.

## Prerequisites

* The Python plugin must be [enabled on the cluster](../query/pythonplugin.md#enable-the-plugin) for the inline Python used in the function.

## Syntax
*T* `|` `invoke` `log_reduce_full_fl(`*reduce_col* [`,` *pattern_col* [`,` *parameters_col* [`,` *use_logram* [`,` *use_drain* [`,` *custom_regexes* [`,` *custom_regexes_policy* [`,` *delimiters* [`,` *similarity_th* [`,` *tree_depth* [`,` *trigram_th* [`,` *bigram_th* ]]]]]]]]]]]`)`

## Parameters

The following parameters description is a summary. For more information, see [More about the algorithm](log-reduce-fl.md#more-about-the-algorithm) section.

| Name | Type | Required | Description |
|--|--|--|--|
| *reduce_col* | string | &check; | The name of the string column the function is applied to. |
| *pattern_col* | string | &check; | The name of the string column to populate the pattern. |
| *parameters_col* | string | &check; | The name of the string column to populate the pattern's parameters. |
| *use_logram* | bool | | Enable or disable the Logram algorithm. Default value is `true`. |
| *use_drain* | bool | | Enable or disable the Drain algorithm. Default value is `true`. |
| *custom_regexes* | dynamic | | A dynamic array containing pairs of regular expression and replacement symbols to be searched in each input row, and replaced with their respective matching symbol. Default value is `dynamic([])`. The default regex table replaces numbers, IPs and GUIDs. |
| *custom_regexes_policy* | string | | Either 'prepend', 'append' or 'replace'. Controls whether custom_regexes are prepend/append/replace the default ones. Default value is 'prepend'. |
| *delimiters* | dynamic | | A dynamic array containing delimiter strings. Default value is `dynamic([" "])`, defining space as the only single character delimiter. |
| *similarity_th* | real | | Similarity threshold, used by the Drain algorithm. Increasing *similarity_th* results in more refined clusters. Default value is 0.5. If Drain is disabled, then this parameter has no effect.
| *tree_depth* | int | | Increasing *tree_depth* improves the runtime of the Drain algorithm, but might reduce its accuracy. Default value is 4. If Drain is disabled, then this parameter has no effect. |
| *trigram_th* | int | | Decreasing *trigram_th* increases the chances of Logram to replace tokens with wildcards. Default value is 10. If Logram is disabled, then this parameter has no effect. |
| *bigram_th* | int | | Decreasing *bigram_th* increases the chances of Logram to replace tokens with wildcards. Default value is 15. If Logram is disabled, then this parameter has no effect. |

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/letstatement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/letstatement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabularexpressionstatements.md). To run a working example of `log_reduce_fl()`, see [Example](#example).

~~~kusto
let log_reduce_full_fl=(tbl:(*), reduce_col:string, pattern_col:string, parameters_col:string,
                   use_logram:bool=True, use_drain:bool=True, custom_regexes: dynamic = dynamic([]), custom_regexes_policy: string = 'prepend',
                   delimiters:dynamic = dynamic(' '), similarity_th:double=0.5, tree_depth:int = 4, trigram_th:int=10, bigram_th:int=15)
{
    let default_regex_table = pack_array('(/|)([0-9]+\\.){3}[0-9]+(:[0-9]+|)(:|)', '<IP>', 
                                         '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', '<GUID>', 
                                         '(?<=[^A-Za-z0-9])(\\-?\\+?\\d+)(?=[^A-Za-z0-9])|[0-9]+$', '<NUM>');
    let kwargs = bag_pack('reduced_column', reduce_col, 'delimiters', delimiters,'output_column', pattern_col, 'parameters_column', parameters_col, 
                          'trigram_th', trigram_th, 'bigram_th', bigram_th, 'default_regexes', default_regex_table, 
                          'custom_regexes', custom_regexes, 'custom_regexes_policy', custom_regexes_policy, 'tree_depth', tree_depth, 'similarity_th', similarity_th, 
                          'use_drain', use_drain, 'use_logram', use_logram, 'save_regex_tuples_in_output', True, 'regex_tuples_column', 'RegexesColumn', 
                          'output_type', 'full');
    let code = ```if 1:
        from log_cluster import log_reduce
        result = log_reduce.log_reduce(df, kargs)
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
.create-or-alter function with (folder = 'Packages\\Text', docstring = 'Find common patterns in textual logs, output a full table')
log_reduce_full_fl(tbl:(*), reduce_col:string, pattern_col:string, parameters_col:string,
                   use_logram:bool=True, use_drain:bool=True, custom_regexes: dynamic = dynamic([]), custom_regexes_policy: string = 'prepend',
                   delimiters:dynamic = dynamic(' '), similarity_th:double=0.5, tree_depth:int = 4, trigram_th:int=10, bigram_th:int=15)
{
    let default_regex_table = pack_array('(/|)([0-9]+\\.){3}[0-9]+(:[0-9]+|)(:|)', '<IP>', 
                                         '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', '<GUID>', 
                                         '(?<=[^A-Za-z0-9])(\\-?\\+?\\d+)(?=[^A-Za-z0-9])|[0-9]+$', '<NUM>');
    let kwargs = bag_pack('reduced_column', reduce_col, 'delimiters', delimiters,'output_column', pattern_col, 'parameters_column', parameters_col, 
                          'trigram_th', trigram_th, 'bigram_th', bigram_th, 'default_regexes', default_regex_table, 
                          'custom_regexes', custom_regexes, 'custom_regexes_policy', custom_regexes_policy, 'tree_depth', tree_depth, 'similarity_th', similarity_th, 
                          'use_drain', use_drain, 'use_logram', use_logram, 'save_regex_tuples_in_output', True, 'regex_tuples_column', 'RegexesColumn', 
                          'output_type', 'full');
    let code = ```if 1:
        from log_cluster import log_reduce
        result = log_reduce.log_reduce(df, kargs)
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
}
~~~

---

## Example

The following example uses the [invoke operator](../query/invokeoperator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

~~~kusto
let log_reduce_full_fl=(tbl:(*), reduce_col:string, pattern_col:string, parameters_col:string,
                   use_logram:bool=True, use_drain:bool=True, custom_regexes: dynamic = dynamic([]), custom_regexes_policy: string = 'prepend',
                   delimiters:dynamic = dynamic(' '), similarity_th:double=0.5, tree_depth:int = 4, trigram_th:int=10, bigram_th:int=15)
{
    let default_regex_table = pack_array('(/|)([0-9]+\\.){3}[0-9]+(:[0-9]+|)(:|)', '<IP>', 
                                         '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', '<GUID>', 
                                         '(?<=[^A-Za-z0-9])(\\-?\\+?\\d+)(?=[^A-Za-z0-9])|[0-9]+$', '<NUM>');
    let kwargs = bag_pack('reduced_column', reduce_col, 'delimiters', delimiters,'output_column', pattern_col, 'parameters_column', parameters_col, 
                          'trigram_th', trigram_th, 'bigram_th', bigram_th, 'default_regexes', default_regex_table, 
                          'custom_regexes', custom_regexes, 'custom_regexes_policy', custom_regexes_policy, 'tree_depth', tree_depth, 'similarity_th', similarity_th, 
                          'use_drain', use_drain, 'use_logram', use_logram, 'save_regex_tuples_in_output', True, 'regex_tuples_column', 'RegexesColumn', 
                          'output_type', 'full');
    let code = ```if 1:
        from log_cluster import log_reduce
        result = log_reduce.log_reduce(df, kargs)
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
};
//
// Finding common patterns in HDFS logs, a commonly used benchmark for log parsing
//
HDFS_log
| take 100000
| extend Patterns="", Parameters=""
| invoke log_reduce_full_fl(reduce_col="data", pattern_col="Patterns", parameters_col="Parameters")
| take 10
~~~

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
//
// Finding common patterns in HDFS logs, a commonly used benchmark for log parsing
//
HDFS_log
| take 100000
| extend Patterns="", Parameters=""
| invoke log_reduce_full_fl(reduce_col="data", pattern_col="Patterns", parameters_col="Parameters")
| take 10
```

---

**Output**

| data | Patterns | Parameters |
|--|--|--|
| 081110 103639 19 INFO dfs.FSDataset: Deleting block blk_-8612543573008263745 file /mnt/hadoop/dfs/data/current/subdir28/blk_-8612543573008263745  | 081110 \<NUM> \<NUM> INFO dfs.FSDataset: Deleting block blk_\<NUM> file <*> | {"parameter_0": "103639", "parameter_1": "19", "parameter_2": "-8612543573008263745", "parameter_3": "/mnt/hadoop/dfs/data/current/subdir28/blk_-8612543573008263745"} |
| 081110 103639 19 INFO dfs.FSDataset: Deleting block blk_-8613903590844336898 file /mnt/hadoop/dfs/data/current/subdir16/blk_-8613903590844336898 | 081110 \<NUM> \<NUM> INFO dfs.FSDataset: Deleting block blk_\<NUM> file <*> | {"parameter_0": "103639", "parameter_1": "19", "parameter_2": "-8613903590844336898", "parameter_3": "/mnt/hadoop/dfs/data/current/subdir16/blk_-8613903590844336898"} |
|081110 103639 19 INFO dfs.FSDataset: Deleting block blk_-861615421914753290 file /mnt/hadoop/dfs/data/current/subdir38/blk_-861615421914753290| 081110 \<NUM> \<NUM> INFO dfs.FSDataset: Deleting block blk_\<NUM> file <*> |{"parameter_0": "103639", "parameter_1": "19", "parameter_2": "-861615421914753290", "parameter_3": "/mnt/hadoop/dfs/data/current/subdir38/blk_-861615421914753290"}|
| 081110 103639 19 INFO dfs.FSDataset: Deleting block blk_-8618279055399239070 file /mnt/hadoop/dfs/data/current/subdir24/blk_-8618279055399239070 | 081110 \<NUM> \<NUM> INFO dfs.FSDataset: Deleting block blk_\<NUM> file <*> | {"parameter_0": "103639", "parameter_1": "19", "parameter_2": "-8618279055399239070", "parameter_3": "/mnt/hadoop/dfs/data/current/subdir24/blk_-8618279055399239070"} |
| 081110 103639 19 INFO dfs.FSDataset: Deleting block blk_-8642708880775555455 file /mnt/hadoop/dfs/data/current/subdir23/blk_-8642708880775555455 | 081110 \<NUM> \<NUM> INFO dfs.FSDataset: Deleting block blk_\<NUM> file <*> | {"parameter_0": "103639", "parameter_1": "19", "parameter_2": "-8642708880775555455", "parameter_3": "/mnt/hadoop/dfs/data/current/subdir23/blk_-8642708880775555455"}|
| 081110 103639 19 INFO dfs.FSDataset: Deleting block blk_8643723287965289045 file /mnt/hadoop/dfs/data/current/subdir34/blk_8643723287965289045|081110 \<NUM> \<NUM> INFO dfs.FSDataset: Deleting block blk_\<NUM> file <*>|{"parameter_0": "103639", "parameter_1": "19", "parameter_2": "8643723287965289045", "parameter_3": "/mnt/hadoop/dfs/data/current/subdir34/blk_8643723287965289045"}|
|081110 103639 19 INFO dfs.FSDataset: Deleting block blk_8644505812094886071 file /mnt/hadoop/dfs/data/current/subdir36/blk_8644505812094886071|081110 \<NUM> \<NUM> INFO dfs.FSDataset: Deleting block blk_\<NUM> file <*>|{"parameter_0": "103639", "parameter_1": "19", "parameter_2": "8644505812094886071", "parameter_3": "/mnt/hadoop/dfs/data/current/subdir36/blk_8644505812094886071"}|
|081110 103639 19 INFO dfs.FSDataset: Deleting block blk_-8652622605188939751 file /mnt/hadoop/dfs/data/current/subdir12/blk_-8652622605188939751|081110 \<NUM> \<NUM> INFO dfs.FSDataset: Deleting block blk_\<NUM> file <*>|{"parameter_0": "103639", "parameter_1": "19", "parameter_2": "-8652622605188939751", "parameter_3": "/mnt/hadoop/dfs/data/current/subdir12/blk_-8652622605188939751"}|
|081110 103639 19 INFO dfs.FSDataset: Deleting block blk_-8655165676931318739 file /mnt/hadoop/dfs/data/current/subdir28/blk_-8655165676931318739|081110 \<NUM> \<NUM> INFO dfs.FSDataset: Deleting block blk_\<NUM> file <*>|{"parameter_0": "103639", "parameter_1": "19", "parameter_2": "-8655165676931318739", "parameter_3": "/mnt/hadoop/dfs/data/current/subdir28/blk_-8655165676931318739"}|
|081110 103639 19 INFO dfs.FSDataset: Deleting block blk_8660984331119557052 file /mnt/hadoop/dfs/data/current/subdir39/blk_8660984331119557052|081110 \<NUM> \<NUM> INFO dfs.FSDataset: Deleting block blk_\<NUM> file <*>|{"parameter_0": "103639", "parameter_1": "19", "parameter_2": "8660984331119557052", "parameter_3": "/mnt/hadoop/dfs/data/current/subdir39/blk_8660984331119557052"}|
