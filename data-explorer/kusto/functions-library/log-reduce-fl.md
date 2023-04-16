---
title: log_reduce_fl() - Azure Data Explorer
description: This article describes the log_reduce_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/29/2023
---
# log_reduce_fl()

The function `log_reduce_fl()` finds common patterns in semi structured textual columns, such as log lines, and clusters the lines according to the extracted patterns. It outputs a summary table containing the found patterns sorted top down by their respective frequency.

## Prerequisites

* The Python plugin must be [enabled on the cluster](../query/pythonplugin.md#enable-the-plugin). This is required for the inline Python used in the function.

## Syntax

`T | invoke log_reduce_fl(`*reduce_col*`,` *use_logram*`,` *use_drain*`,` *custom_regexes*`,` *custom_regexes_policy*`,` *delimiters*`,` *similarity_th*`,` *tree_depth*`,` *trigram_th*`,` *bigram_th*`)`

## Parameters

The parameters description below is a summary, see [More about the algorithm](#more-about-the-algorithm) section for further details.

| Name | Type | Required | Description |
|--|--|--|--|
| *reduce_col* | string | &check; | The name of the string column the function is applied to. |
| *use_logram* | bool | | Enable or disable the Logram algorithm. Default value is `True`. |
| *use_drain* | boolean | | Enable/disable the Drain algorithm. Default value is True. |
| *custom_regexes* | dynamic | | A dynamic array containing pairs of regular expression and replacement symbols to be searched in each input row, and replaced with their respective matching symbol. Default value is dynamic([]). The default regex table replaces numbers, IPs and GUIDs. |
| *custom_regexes_policy* | string | | Either 'prepend', 'append' or 'replace'. Controls whether custom_regexes are prepend/append/replace the default ones. Default value is 'prepend'. |
| *delimiters* | dynamic | | A dynamic array containing delimiter strings. Default value is dynamic([" "]), defining space as the only single character delimiter. |
| *similarity_th* | real | | Similarity threshold, used by the Drain algorithm. Increasing *similarity_th* will result in more refined clusters. Default value is 0.5. If Drain is disabled this parameter has no effect.
| *tree_depth* | integer | | Increasing *tree_depth* will improve the runtime of the Drain algorithm, but might reduce its accuracy. Default value is 4. If Drain is disabled this parameter has no effect. |
| *trigram_th* | integer | | Decreasing *trigram_th* will increase the chances of Logram to replace tokens with wildcards. Default value is 10. If Logram is disabled this parameter has no effect. |
| *bigram_th* | int | | Decreasing *bigram_th* will increase the chances of Logram to replace tokens with wildcards. Default value is 15. If Logram is disabled this parameter has no effect. |

## More about the algorithm

The function runs multiples passes over the rows to be reduced to common patterns. These are the passes:

* Regular expression replacements: in this pass each line is independently matched to a set of regular expressions, and each matched expression is replaced by a replacement symbol. The default regular expressions replace IPs, numbers and GUIDs with \<IP\>, \<GUID\> and \<NUM\>. The user can prepend/append additional regular expressions to those, or replace it with new ones or empty list by modifying *custom_regexes* and *custom_regexes_policy*. For example, to replace whole numbers with  \<WNUM\> set custom_regexes=pack_array('/^\d+$/', '\<WNUM\>'); to cancel regular expressions replacement set custom_regexes_policy='replace''. Note that for each line the function keeps list of the original expressions (before replacements) to be output as parameters of the generic replacement tokens.

* Tokenization: similar to the previous step, each line is processed independently and broken into tokens based on set of *delimiters*. For example, to define breaking to tokens by either comma, period or semicolon set *delimiters*=pack_array(',', '.', ';').

* Apply [Logram algorithm](https://arxiv.org/pdf/2001.03038.pdf): this pass is optional, pending *use_logram* is true. It is recommended to use Logram when large scale is required, and when parameters can appear in the first tokens of the log entry. OTOH, disable it when the log entries are short, as the algorithm tends to replace tokens with wildcards too often in such cases.\
The Logram algorithm considers 3-tuples and 2-tuples of tokens. If a 3-tuple of tokens is common in the log lines (it appears more than *trigram_th* times), then it is likely that all 3 tokens are part of the pattern. If the 3-tuple is rare, then it is likely that it contains a variable that should be replaced by a wildcard. For rare 3-tuples, we consider the frequency with which 2-tuples contained in the 3-tuple appear. If a 2-tuple is common (it appears more than *bigram_th* times), then the remaining token is likely to be a parameter, and not part of the pattern.\
Note that the Logram algorithm is easy to parallelize. It requires two passes on the log corpus - the first one to count the frequency of each 3-tuple and 2-tuple, and the second one to apply the logic described above to each entry. To parallelize the algorithm, we only need to partition the log entries, and unify the frequency counts of different workers.
    
* Apply [Drain algorithm](https://jiemingzhu.github.io/pub/pjhe_icws2017.pdf): this pass is optional, pending *use_drain* is true. Drain is a log parsing algorithm based on a truncated depth prefix tree. Log messages are split according to their length, and for each length the first *tree_depth* tokens of the log message are used to build a prefix tree. If no match for the prefix tokens was found, a new branch is created. If a match for the prefix was found, we search for the most similar pattern among the patterns contained in the tree leaf. Pattern similarity is measured by the ratio of matched non-wildcard tokens out of all tokens. If the similarity of the most similar pattern is above the similarity threshold (the parameter *similarity_th*), then the log entry is matched to the pattern. For that pattern, the function replaces all non-matching tokens by wildcards. If the similarity of the most similar pattern is below the similarity threshold, a new pattern containing the log entry is created.\
Note that we set default *tree_depth* to 4 based on testing various logs. Increasing this depth can improve runtime but might degrade patterns accuracy; decreasing it is more accurate but slower, as each node performs many more similarity tests.\
Usually, Drain efficiently generalizes and reduces patterns (though it is hard to be parallelize). However, as it relies on a prefix tree, it might not be optimal in log entries containing parameters in the first tokens. This can be resolved in most cases by applying Logram first.

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/letstatement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/letstatement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabularexpressionstatements.md). To run a working example of `log_reduce_fl()`, see [Example](#example).

~~~kusto
let log_reduce_fl=(tbl:(*), reduce_col:string,
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
                          'output_type', 'summary');
    let code = ```if 1:
        from log_cluster import log_reduce
        result = log_reduce.log_reduce(df, kargs)
    ```;
    tbl
    | extend LogReduce=''
    | evaluate python(typeof(Count:int, LogReduce:string, example:string), code, kwargs)
}
;
// Write your query to use the function here.
~~~

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

~~~kusto
.create-or-alter function with (folder = 'Packages\\Text', docstring = 'Find common patterns in textual logs, output a summary table')
log_reduce_fl(tbl:(*), reduce_col:string,
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
                          'output_type', 'summary');
    let code = ```if 1:
        from log_cluster import log_reduce
        result = log_reduce.log_reduce(df, kargs)
    ```;
    tbl
    | extend LogReduce=''
    | evaluate python(typeof(Count:int, LogReduce:string, example:string), code, kwargs)
}
~~~

---

## Example

The following example use the [invoke operator](../query/invokeoperator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

~~~kusto
let log_reduce_fl=(tbl:(*), reduce_col:string,
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
                          'output_type', 'summary');
    let code = ```if 1:
        from log_cluster import log_reduce
        result = log_reduce.log_reduce(df, kargs)
    ```;
    tbl
    | extend LogReduce=''
    | evaluate python(typeof(Count:int, LogReduce:string, example:string), code, kwargs)
}
;
//
// Finding common patterns in HDFS logs, a commonly used benchmark for log parsing
//
HDFS_log
| take 100000
| invoke log_reduce_fl(reduce_col="data")
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
| invoke log_reduce_fl(reduce_col="data")
```

---

**Output**

```kusto
Count	LogReduce	example
55356	081110 <NUM> <NUM> INFO dfs.FSNamesystem: BLOCK* NameSystem.delete: blk_<NUM> is added to invalidSet of <IP>	081110 220623 26 INFO dfs.FSNamesystem: BLOCK* NameSystem.delete: blk_1239016582509138045 is added to invalidSet of 10.251.123.195:50010
10278	081110 <NUM> <NUM> INFO dfs.FSNamesystem: BLOCK* NameSystem.addStoredBlock: blockMap updated: <IP> is added to blk_<NUM> size <NUM>	081110 215858 27 INFO dfs.FSNamesystem: BLOCK* NameSystem.addStoredBlock: blockMap updated: 10.250.11.85:50010 is added to blk_5080254298708411681 size 67108864
10256	081110 <NUM> <NUM> INFO dfs.DataNode$PacketResponder: PacketResponder <NUM> for block blk_<NUM> terminating	081110 215858 15496 INFO dfs.DataNode$PacketResponder: PacketResponder 2 for block blk_-7746692545918257727 terminating
10256	081110 <NUM> <NUM> INFO dfs.DataNode$PacketResponder: Received block blk_<NUM> of size <NUM> from <IP>	081110 215858 15485 INFO dfs.DataNode$PacketResponder: Received block blk_5080254298708411681 of size 67108864 from /10.251.43.21
9140	081110 <NUM> <NUM> INFO dfs.DataNode$DataXceiver: Receiving block blk_<NUM> src: <IP> dest: <IP>	081110 215858 15494 INFO dfs.DataNode$DataXceiver: Receiving block blk_-7037346755429293022 src: /10.251.43.21:45933 dest: /10.251.43.21:50010
3047	081110 <NUM> <NUM> INFO dfs.FSNamesystem: BLOCK* NameSystem.allocateBlock: /user/root/rand3/_temporary/_task_<NUM>_<NUM>_m_<NUM>_<NUM>/part-<NUM>. <*>	081110 215858 26 INFO dfs.FSNamesystem: BLOCK* NameSystem.allocateBlock: /user/root/rand3/_temporary/_task_200811101024_0005_m_001805_0/part-01805. blk_-7037346755429293022
1402	081110 <NUM> <NUM> INFO <*>: <*> block blk_<NUM> <*> <*>	081110 215957 15556 INFO dfs.DataNode$DataTransfer: 10.250.15.198:50010:Transmitted block blk_-3782569120714539446 to /10.251.203.129:50010
177	081110 <NUM> <NUM> INFO <*>: <*> <*> <*> <*>	081110 215859 13 INFO dfs.DataBlockScanner: Verification succeeded for blk_-7244926816084627474
36	081110 <NUM> <NUM> INFO <*>: <*> <*> <*> for block <*>	081110 215924 15636 INFO dfs.DataNode$BlockReceiver: Receiving empty packet for block blk_3991288654265301939
12	081110 <NUM> <NUM> INFO dfs.FSNamesystem: BLOCK* <*> <*> <*> <*> <*> <*> <*> <*>	081110 215953 19 INFO dfs.FSNamesystem: BLOCK* ask 10.250.15.198:50010 to replicate blk_-3782569120714539446 to datanode(s) 10.251.203.129:50010
12	081110 <NUM> <NUM> INFO <*>: <*> <*> <*> <*> <*> block blk_<NUM> <*> <*>	081110 215955 18 INFO dfs.DataNode: 10.250.15.198:50010 Starting thread to transfer block blk_-3782569120714539446 to 10.251.203.129:50010
12	081110 <NUM> <NUM> INFO dfs.DataNode$DataXceiver: Received block blk_<NUM> src: <IP> dest: <IP> of size <NUM>	081110 215957 15226 INFO dfs.DataNode$DataXceiver: Received block blk_-3782569120714539446 src: /10.250.15.198:51013 dest: /10.250.15.198:50010 of size 14474705
6	081110 <NUM> <NUM> <*> dfs.FSNamesystem: BLOCK* NameSystem.addStoredBlock: <*> <*> <*> <*> <*> <*> <*> <*> size <NUM>	081110 215924 27 WARN dfs.FSNamesystem: BLOCK* NameSystem.addStoredBlock: Redundant addStoredBlock request received for blk_2522553781740514003 on 10.251.202.134:50010 size 67108864
6	081110 <NUM> <NUM> INFO dfs.DataNode$DataXceiver: <*> <*> <*> <*> <*>: <*> <*> <*> <*> <*>	081110 215936 15714 INFO dfs.DataNode$DataXceiver: writeBlock blk_720939897861061328 received exception java.io.IOException: Could not read from stream
3	081110 <NUM> <NUM> INFO dfs.FSNamesystem: BLOCK* NameSystem.addStoredBlock: <*> <*> <*> <*> <*> <*> <*> size <NUM> <*> <*> <*> <*> <*> <*> <*> <*>.	081110 220635 28 INFO dfs.FSNamesystem: BLOCK* NameSystem.addStoredBlock: addStoredBlock request received for blk_-81196479666306310 on 10.250.17.177:50010 size 53457811 But it does not belong to any file.
1	081110 <NUM> <NUM> <*> <*>: <*> <*> <*> <*> <*> <*> <*>. <*> <*> <*> <*> <*>.	081110 220631 19 WARN dfs.FSDataset: Unexpected error trying to delete block blk_-2012154052725261337. BlockInfo not found in volumeMap.
```
