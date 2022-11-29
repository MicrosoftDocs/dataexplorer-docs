---
title: log_reduce_full_fl() - Azure Data Explorer
description: This article describes the log_reduce_full_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 24/10/2022
---
# log_reduce_full_fl()

The function `log_reduce_full_fl()` finds common patterns in semi structured textual columns, such as log lines, and clusters the lines according to the extracted patterns. The function algorithm and most of the parameters are identical to [log_reduce_fl()](log-reduce-fl.md), but unlike log_reduce_fl() that output a patterns summary table, this function outputs a full table containing the pattern and parameters per each line.

> [!NOTE]
> * `log_reduce_full_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.

## Syntax
`T | invoke log_reduce_full_fl(`*reduce_col*`,` *pattern_col*`,` *parameters_col*`,` *custom_regexes*`,` *custom_regexes_policy*`,` *delimiters*`,` *use_logram*`,` *use_drain*`,` *similarity_th*`,` *tree_depth*`,` *trigram_th_ratio*`,` *bigram_th_ratio*`)`

## Arguments

The argument description below is a summary, see [More about the algorithm](#more-about-the-algorithm) section for more details.

| Name | Type | Required | Description |
|--|--|--|--|
| *reduce_col* | string | &check; | The name of the string column the function is applied to. |
| *pattern_col* | string | &check; | The name of the string column to populate the pattern. |
| *parameters_col* | string | &check; | The name of the string column to populate the pattern's parameters. |
| *delimiters* | dynamic | | A dynamic array containing delimiter strings. Default value is dynamic([" "]), defining space as the only single character delimiter. |
| *custom_regexes* | dynamic | | A dynamic array containing pairs of regular expression and replacement symbols to be searched in each input row, and replaced with their respective matching symbol. Default value is dynamic([]). The default regex table replaces numbers, IPs and GUIDs. |
| *custom_regexes_policy* | string | | Either 'prepend', 'append' or 'replace'. Controls whether custom_regexes are prepend/append/replace the default ones. Default value is 'prepend'. |
| *use_logram* | boolean | | Enable/disable the Logram algorithm. Default value is True. |
| *use_drain* | boolean | | Enable/disable the Drain algorithm. Default value is True. |
| *similarity_th* | real | | Similarity threshold, used by the Drain algorithm. Increasing *similarity_th* will result in more refined clusters. Default value is 0.5. If Drain is disabled this parameter has no effect.
| *tree_depth* | integer | | Increasing *tree_depth* will improve the runtime of the Drain algorithm, but might reduce its accuracy. Default value is 4. If Drain is disabled this parameter has no effect. |
| *trigram_th_ratio* | real | | Decreasing *trigram_th_ratio* will increase the chances of Logram to replace tokens with wildcards. Default value is 0.005. If Logram is disabled this parameter has no effect. |
| *bigram_th_ratio* | real | | Decreasing *bigram_th_ratio* will increase the chances of Logram to replace tokens with wildcards. Default value is 0.075. If Logram is disabled this parameter has no effect. |

## More about the algorithm

See [More about the algorithm](log-reduce-fl.md#more-about-the-algorithm). As mentioned, this function runs the same passes over the data, just instead of summarize the patterns' frequency it outputs full table containing the pattern and its parameters per each log line.

## Usage

`log_reduce_full_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function) to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

# [Ad hoc](#tab/adhoc)

For ad hoc usage, embed the code using the [let statement](../query/letstatement.md). No permission is required.

<!-- csl: https://help.kusto.windows.net/Samples -->
~~~kusto
let tbl2dynamic=(tbl:(*))
{
    toscalar(tbl
    | extend pa = pack_all()
    | summarize make_list(pa))
};
let log_reduce_full_fl=(tbl:(*), reduce_col:string, pattern_col:string, parameters_col:string,                                                               //required parameters
                   custom_regexes:string="", append_custom_regexes: bool = True, delimiters:dynamic = dynamic(" "), use_logram:bool=True, use_drain:bool=True,    //joint optional parameters
                   st:double=0.5, tree_depth:int = 4,                                                                                                   //Drain optional parameters
                   trigram_th_ratio:double=0.005, bigram_th_ratio:double=0.0075)                                                                        //Logram optional parameters
{
    let effective_delimiters = dynamic_to_json(delimiters);
    let default_regex_table = dynamic_to_json(tbl2dynamic(datatable(regex:string, symbol:string) [
    '(/|)([0-9]+\\.){3}[0-9]+(:[0-9]+|)(:|)', '<IP>',
    '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', '<GUID>',
    '(?<=[^A-Za-z0-9])(\\-?\\+?\\d+)(?=[^A-Za-z0-9])|[0-9]+$', '<NUM>'
    ]))
    ;
    let kwargs = bag_pack('reduced_column', reduce_col, 'delimiters', effective_delimiters,'output_column', pattern_col, 'parameters_column', parameters_col, 'tri_threshold', trigram_th_ratio, 'double_threshold', bigram_th_ratio, "default_regexes", default_regex_table, "custom_regexes", custom_regexes, "append_custom_regexes", append_custom_regexes, 'tree_depth', tree_depth, "st", st, "use_drain", use_drain, "use_logram", use_logram, "save_regex_tuples_in_output", True, "regex_tuples_column", "RegexesColumn", "output_type", "Full");
    let code = ```
if 1:
    from sandbox_utils import Zipackage
    Zipackage.install('LogReduceFilter.zip')
    from LogReduceFilter import LogReduce
    result = LogReduce.log_reduce(df, kargs)
```;
    tbl
    | evaluate python(typeof(*), code, kwargs, external_artifacts =
    bag_pack('LogReduceFilter.zip', 'https://adiwesteurope.blob.core.windows.net/python-we/LogReduceFilter/LogReduceFilter-0.2.39-py3-none-any.zip'))
};
// Finds common patterns in BGL_logs, a commonly used benchmark for log parsing (as the name suggests, the benchmark contains logs of the BGL system).
BGL_logs
| take 100000 
| extend Patterns="", Parameters=""
| invoke log_reduce_full_fl(reduce_col="data", pattern_col="Patterns", parameters_col="Parameters")
~~~

# [Persistent](#tab/persistent)

For persistent usage, use [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One-time installation

First, create the `tbl2dynamic()` function:
~~~kusto
.create-or-alter function with (folder = "Packages\\Utils", docstring = "Convert a small table to dynamic array")
tbl2dynamic(tbl:(*))
{
    toscalar(tbl
    | extend pa = pack_all()
    | summarize make_list(pa))
}
~~~

Then, create the `log_reduce_full_fl()` function:

~~~kusto
.create-or-alter function with (folder = "Packages\\Text", docstring = "Find common patterns in textual logs")
log_reduce_full_fl(tbl:(*), reduce_col:string, pattern_col:string, parameters_col:string,                                                               //required parameters
                   custom_regexes:string="", append_custom_regexes: bool = True, delimiters:dynamic = dynamic(" "), use_logram:bool=True, use_drain:bool=True,    //joint optional parameters
                   st:double=0.5, tree_depth:int = 4,                                                                                                   //Drain optional parameters
                   trigram_th_ratio:double=0.005, bigram_th_ratio:double=0.0075)                                                                        //Logram optional parameters
{
    let effective_delimiters = dynamic_to_json(delimiters);
    let default_regex_table = dynamic_to_json(tbl2dynamic(datatable(regex:string, symbol:string) [
    '(/|)([0-9]+\\.){3}[0-9]+(:[0-9]+|)(:|)', '<IP>',
    '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', '<GUID>',
    '(?<=[^A-Za-z0-9])(\\-?\\+?\\d+)(?=[^A-Za-z0-9])|[0-9]+$', '<NUM>'
    ]))
    ;
    let kwargs = bag_pack('reduced_column', reduce_col, 'delimiters', effective_delimiters,'output_column', pattern_col, 'parameters_column', parameters_col, 'tri_threshold', trigram_th_ratio, 'double_threshold', bigram_th_ratio, "default_regexes", default_regex_table, "custom_regexes", custom_regexes, "append_custom_regexes", append_custom_regexes, 'tree_depth', tree_depth, "st", st, "use_drain", use_drain, "use_logram", use_logram, "save_regex_tuples_in_output", True, "regex_tuples_column", "RegexesColumn", "output_type", "Full");
    let code = ```
if 1:
    from sandbox_utils import Zipackage
    Zipackage.install('LogReduceFilter.zip')
    from LogReduceFilter import LogReduce
    result = LogReduce.log_reduce(df, kargs)
```;
    tbl
    | evaluate python(typeof(*), code, kwargs, external_artifacts =
    bag_pack('LogReduceFilter.zip', 'https://adiwesteurope.blob.core.windows.net/python-we/LogReduceFilter/LogReduceFilter-0.2.39-py3-none-any.zip'))
}
~~~

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
// Finds common patterns in HDFS_log, a commonly used benchmark for log parsing.
HDFS_log
| take 100000
| extend Patterns="", Parameters=""
| invoke log_reduce_full_fl(reduce_col="data", pattern_col="Patterns", parameters_col="Parameters")
| take 10
```

---

Result:
<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
data	Patterns	Parameters
081110 215858 15485 INFO dfs.DataNode$PacketResponder: Received block blk_5080254298708411681 of size 67108864 from /10.251.43.21	081110 <NUM> <NUM> INFO dfs.DataNode$PacketResponder: Received block blk_<NUM> of size <NUM> from <IP>	"{""parameter_0"": ""215858"", ""parameter_1"": ""15485"", ""parameter_2"": ""5080254298708411681"", ""parameter_3"": ""67108864"", ""parameter_4"": ""/10.251.43.21""}"
081110 215858 15494 INFO dfs.DataNode$DataXceiver: Receiving block blk_-7037346755429293022 src: /10.251.43.21:45933 dest: /10.251.43.21:50010	081110 <NUM> <NUM> INFO dfs.DataNode$DataXceiver: Receiving block blk_<NUM> src: <IP> dest: <IP>	"{""parameter_0"": ""215858"", ""parameter_1"": ""15494"", ""parameter_2"": ""-7037346755429293022"", ""parameter_3"": ""/10.251.43.21:45933"", ""parameter_4"": ""/10.251.43.21:50010""}"
081110 215858 15496 INFO dfs.DataNode$PacketResponder: PacketResponder 2 for block blk_-7746692545918257727 terminating	081110 <NUM> <NUM> INFO dfs.DataNode$PacketResponder: PacketResponder <NUM> for block blk_<NUM> terminating	"{""parameter_0"": ""215858"", ""parameter_1"": ""15496"", ""parameter_2"": ""2"", ""parameter_3"": ""-7746692545918257727""}"
081110 215858 15496 INFO dfs.DataNode$PacketResponder: Received block blk_-7746692545918257727 of size 67108864 from /10.251.107.227	081110 <NUM> <NUM> INFO dfs.DataNode$PacketResponder: Received block blk_<NUM> of size <NUM> from <IP>	"{""parameter_0"": ""215858"", ""parameter_1"": ""15496"", ""parameter_2"": ""-7746692545918257727"", ""parameter_3"": ""67108864"", ""parameter_4"": ""/10.251.107.227""}"
081110 215858 15511 INFO dfs.DataNode$DataXceiver: Receiving block blk_-8578644687709935034 src: /10.251.107.227:39600 dest: /10.251.107.227:50010	081110 <NUM> <NUM> INFO dfs.DataNode$DataXceiver: Receiving block blk_<NUM> src: <IP> dest: <IP>	"{""parameter_0"": ""215858"", ""parameter_1"": ""15511"", ""parameter_2"": ""-8578644687709935034"", ""parameter_3"": ""/10.251.107.227:39600"", ""parameter_4"": ""/10.251.107.227:50010""}"
081110 215858 15514 INFO dfs.DataNode$DataXceiver: Receiving block blk_722881101738646364 src: /10.251.75.79:58213 dest: /10.251.75.79:50010	081110 <NUM> <NUM> INFO dfs.DataNode$DataXceiver: Receiving block blk_<NUM> src: <IP> dest: <IP>	"{""parameter_0"": ""215858"", ""parameter_1"": ""15514"", ""parameter_2"": ""722881101738646364"", ""parameter_3"": ""/10.251.75.79:58213"", ""parameter_4"": ""/10.251.75.79:50010""}"
081110 215858 15517 INFO dfs.DataNode$PacketResponder: PacketResponder 2 for block blk_-7110736255599716271 terminating	081110 <NUM> <NUM> INFO dfs.DataNode$PacketResponder: PacketResponder <NUM> for block blk_<NUM> terminating	"{""parameter_0"": ""215858"", ""parameter_1"": ""15517"", ""parameter_2"": ""2"", ""parameter_3"": ""-7110736255599716271""}"
081110 215858 15517 INFO dfs.DataNode$PacketResponder: Received block blk_-7110736255599716271 of size 67108864 from /10.251.42.246	081110 <NUM> <NUM> INFO dfs.DataNode$PacketResponder: Received block blk_<NUM> of size <NUM> from <IP>	"{""parameter_0"": ""215858"", ""parameter_1"": ""15517"", ""parameter_2"": ""-7110736255599716271"", ""parameter_3"": ""67108864"", ""parameter_4"": ""/10.251.42.246""}"
081110 215858 15533 INFO dfs.DataNode$DataXceiver: Receiving block blk_7257432994295824826 src: /10.251.26.8:41803 dest: /10.251.26.8:50010	081110 <NUM> <NUM> INFO dfs.DataNode$DataXceiver: Receiving block blk_<NUM> src: <IP> dest: <IP>	"{""parameter_0"": ""215858"", ""parameter_1"": ""15533"", ""parameter_2"": ""7257432994295824826"", ""parameter_3"": ""/10.251.26.8:41803"", ""parameter_4"": ""/10.251.26.8:50010""}"
081110 215858 15533 INFO dfs.DataNode$DataXceiver: Receiving block blk_-7771332301119265281 src: /10.251.43.210:34258 dest: /10.251.43.210:50010	081110 <NUM> <NUM> INFO dfs.DataNode$DataXceiver: Receiving block blk_<NUM> src: <IP> dest: <IP>	"{""parameter_0"": ""215858"", ""parameter_1"": ""15533"", ""parameter_2"": ""-7771332301119265281"", ""parameter_3"": ""/10.251.43.210:34258"", ""parameter_4"": ""/10.251.43.210:50010""}"
```
