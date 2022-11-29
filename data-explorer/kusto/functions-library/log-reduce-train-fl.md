---
title: log_reduce_train_fl() - Azure Data Explorer
description: This article describes the log_reduce_train_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 24/10/2022
---
# log_reduce_train_fl()

The function `log_reduce_train_fl()` generates a model of patterns in semi-structured text, such as log lines. The generated model is returned in the form of a single row table, containng a timestamp, the model name, and the serialzied model data.

> [!NOTE]
> * `log_reduce_train_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.

## Syntax

`T | invoke log_reduce_train_fl(`*reduce_col*`,` *model_name*`,` *custom_regexes*`,` *append_custom_regexes*`,` *delimiters*`,` *use_logram*`,` *use_drain*`,` *st*`,` *tree_depth*`,` *trigram_th_ratio*`,` *bigram_th_ratio*`)`

## Arguments

The argument description below is a summary - see *Argument Details* section for a detailed explanation of each argument.\
We expect the average user to use the default settings, and the advanced user to use *delimiters*, *custom_regexes*, *append_custom_regexes*, *use_logram*, *use_drain* and *st*. While we allow changing the default values of other parameters, we expect this to be a rare occurenece.

* *reduce_col*: The name of the column the algorithm is applied to.
* *model_name*: The name of the model. Will be saved as the model name in the output table.
* *delimiters*: A dynamic of either a single string delimiter, or of an array of delimiters. The delimiters are used for tokenization of the log line. Delimiters can be arbitrary strings (including multi character delimiters).
  * Default value is dynamic(" "), which means that whitespace will be the only delimiter.
* *custom_regexes*: Custom regular expressions that will be searched in each row of the input, and replaced with a matching symbol. Note that if *append_custom_regexes* is True, the custom_regexes are appended after the default regexes, and that if *append_custom_regexes* is False, the custom_regexes replace the default regexes.
  * Default value is "". The default table replaces numbers, IPs and GUIDs.
* *append_custom_regexes*: Controls the relations between the default regexes table and the *custom_regexes*. If True, *custom_regexes* are appended to the default regexes table. If False, the *custom_regexes* replace the default regexes.
  * Default value is True.
* *use_logram*: If true, the Logram algorithm is used.
  * Default value is True.
* *use_drain*: If true, the Drain algorithm is used.
  * Default value is True.
* *st*: Similarity threshold, used by the Drain algorithm. Higher *st* will result in more clusters of increased refinement. If *use_drain* is False, the *st* parameter will have no effect.
  * Default value is 0.5 .
* *tree_depth*: Increased *tree_depth* will improve the runtime of the Drain algorithm, but might reduce its accuracy. If *use_drain* is False, the *tree_depth* parameter will have no effect. Minimal tree_depth is 4.
  * Default value is 4 .
* *trigram_th_ratio*: Lowering *trigram_th_ratio* will increase the frequency with which Logram replaces tokens with wildcards.
  * Default value is 0.005 .
* *bigram_th_ratio*: Lowering *trigram_th_ratio* will increase the frequency with which Logram replaces tokens with wildcards.
  * Default value is 0.075 .

## Argument Details

* *reduce_col*: The name of the column the algorithm is applied to.
* *model_name*: The name of the model. Will be saved as the model name in the output table.
* *delimiters*: A dynamic of either a single string delimiter, or of an array of delimiters. The delimiters are used for tokenization of the log line. Delimiters can be arbitrary strings (including multi character delimiters).
* *custom_regexes*: Custom regular expressions that will be searched in the input, before the algorithm is applied. If a regex match is found, the match for the regex is replaced with the value specified in the matching entry of the custom_regexes.
  * For example, the entry '(/|)([0-9]+\\.){3}[0-9]+(:[0-9]+|)(:|)', '\<IP\>' will replace all the IP addresses with '\<IP\>' before applying the algorithm.
  * Format:
    * The required format of custom_regexes is a two column datatable (a column for regexes, and a column for replacement values), to which the tbl2dynamic function is applied.
    * The regexes column must be called "regex", and the replacement values column must be called "symbol".
    * For example, to replace all IP addresses and numbers with '\<IP\>' and '\<NUM\>', respectively:
      * tbl2dynamic(datatable(regex:string, symbol:string) [
       '(/|)([0-9]+\\.){3}[0-9]+(:[0-9]+|)(:|)', '\<IP\>',
       '(?<=[^A-Za-z0-9])(\\-?\\+?\\d+)(?=[^A-Za-z0-9])|[0-9]+$', '\<NUM\>'
      ])
    * tbl2dynamic():
      * The function turns a table into a JSON list of dictionaries, where every internal dictionary matches a single row. The keys of the dictionary are the column names, and the values are the values of the row at these columns.
  * Special values:
    * The value "~" will cause the default custom_regexes table to be used. The default table replaces IP addresses, GUIDs, and numbers.
    * The value "" (empty string) will generate an empty table.
  * Error handling:
    * If the format of the table is invalid, an empty table will be used.
* *use_logram*: If true, the Logram algorithm is used. If use_drain is also true, then Drain algorithm is applied to the results of the Logram algorithm. It is recommended to use Logarm when large scale is required, and when parameters can appear in the first tokens of the log entry. It is not recommended to use Logram when the log entries are very short, as the algorithm tends to replace tokens with wildcards too much in these cases.\
The Logram algorithm considers 3-tuples and 2-tuples of tokens. If a 3-tuple of tokens is common in the log corpus, then it is likely that all 3 tokens are part of the pattern. If the 3-tuple is rare, then it is likely that it contains a variable that should be replaced by a wildcard. For rare 3-tuples, we consider the frequency with which 2-tuples contained in the 3-tuple appear. If a 2-tuple is common, then the remaining token is likely to be a parameter, and not part of the pattern.\
The Logram algorithm is very easy to parallelize. It requires two passes on the log corpus - the first to count the frequency of each 3-tuple and 2-tuple, and the second to apply the logic described above to each entry. To parallelize the algoirthm, we only need to partition the log entries, and unify the frequency counts of different workers.
* *use_drain*: If true, the Drain algorithm is used. If use_logram is also true, Logram algorithm is used first, and Drain is used on the results of Logram. In most cases, it is recommended to use Drain.\
Drain is a log parsing algorithm based on a truncated depth prefix tree. Log messages are split according to their length, and then according to the first tokens of the log message. If no match for the prefix was found, the tree structure is updated. If a match for the prefix was found, we search for the most similar pattern among the patterns contained in the tree leaf. Pattern similarity is measured by the number of non-wildcard tokens that match. If the similarity of the most similar pattern is above the similarity threshold (the parameter *st*), then the log entry is matched to the pattern. All conflicts are resolved by replacing non-matching tokens in the pattern by wildcards. Otherwise, if the similarity of the most similar pattern is not sufficiently high, a new pattern containing the log entry is generated.\
Usually, Drain produces good parsing results, with relatively good speed compared to other single threaded algorithms. The weaknesses of Drain can be traced to its reliance on a prefix-tree. The algorithm is very hard to parallelize, and might have some trouble in log entries which contain parameters in the first tokens.\
As will be discussed in the use_logram section, the weakensses of Drain are largely covered by applying Logram first.
* *st*: The similarity threshold that is used by the Drain algorithm. a floating point number in the range [0.0, 1.0] is expected. Higher st will increase the number of clusters, and cause each cluster to be more refined. For more detailed explanation regarding the role of *st*, see the description of the Drain algorithm in the discussion of the "use_drain" parameter.
* *tree_depth*: The depth of the prefix tree used by the Drain algorithm. If the number of patterns is sufficiently small to be contained in the leaves of the prefix tree, then greater depth will result in less accurate clustering but improved runtime.\
Note that each tree leaf can contain up to 100 distinct patterns, so a large number of patterns required increased *tree_depth*.\
To avoid a situation in which the clustering will be bad simply because we ran out of possible clusters, we limit the minimal *tree_depth* to 4.
* *trigram_th_ratio*: In the Logram algorithm, the ratio of the entries that a 3-tuple should appear in to be considered common. See discussion of the Logram algorithm in the "use_logram" section for more details.
* *bigram_th_ratio*: In the Logram algorithm, the ratio of the entries that a 2-tuple should appear in to be considered common. See discssion of the Logram algorithm in the "use_logram" section for more details.

## Usage

`log_reduce_train_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function) to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

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
let log_reduce_train_fl=(tbl:(*), reduce_col:string, model_name:string,                                                                                    //required parameters
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
    let kwargs = bag_pack('reduced_column', reduce_col, 'delimiters', effective_delimiters,'output_column', "LogReduce", 'parameters_column', "", 'tri_threshold', trigram_th_ratio, 'double_threshold', bigram_th_ratio, "default_regexes", default_regex_table, "custom_regexes", custom_regexes, "append_custom_regexes", append_custom_regexes, 'tree_depth', tree_depth, "st", st, "use_drain", use_drain, "use_logram", use_logram, "save_regex_tuples_in_output", True, "regex_tuples_column", "RegexesColumn", "output_type", "Model");
    let code = ```
if 1:
    from sandbox_utils import Zipackage
    Zipackage.install('LogReduceFilter.zip')
    from LogReduceFilter import LogReduce
    result = LogReduce.log_reduce(df, kargs)
```;
    tbl
    | extend LogReduce=""
    | evaluate python(typeof(model:string), code, kwargs, external_artifacts =
    bag_pack('LogReduceFilter.zip', 'https://adiwesteurope.blob.core.windows.net/python-we/LogReduceFilter/LogReduceFilter-0.2.39-py3-none-any.zip'))
    | project name=model_name, timestamp=now(), model
};
// Finds common patterns in BGL_logs, a commonly used benchmark for log parsing (as the name suggests, the benchmark contains logs of the BGL system).
BGL_logs
| take 100000 
| invoke log_reduce_train_fl(reduce_col="data", model_name="BGL")
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

Then, create the `log_reduce_train_fl()` function:

~~~kusto
.create-or-alter function with (folder = "Packages\\Text", docstring = "Find common patterns in textual logs")
log_reduce_train_fl(tbl:(*), reduce_col:string, model_name:string,                                                                                    //required parameters
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
    let kwargs = bag_pack('reduced_column', reduce_col, 'delimiters', effective_delimiters,'output_column', "LogReduce", 'parameters_column', "", 'tri_threshold', trigram_th_ratio, 'double_threshold', bigram_th_ratio, "default_regexes", default_regex_table, "custom_regexes", custom_regexes, "append_custom_regexes", append_custom_regexes, 'tree_depth', tree_depth, "st", st, "use_drain", use_drain, "use_logram", use_logram, "save_regex_tuples_in_output", True, "regex_tuples_column", "RegexesColumn", "output_type", "Model");
    let code = ```
if 1:
    from sandbox_utils import Zipackage
    Zipackage.install('LogReduceFilter.zip')
    from LogReduceFilter import LogReduce
    result = LogReduce.log_reduce(df, kargs)
```;
    tbl
    | extend LogReduce=""
    | evaluate python(typeof(model:string), code, kwargs, external_artifacts =
    bag_pack('LogReduceFilter.zip', 'https://adiwesteurope.blob.core.windows.net/python-we/LogReduceFilter/LogReduceFilter-0.2.39-py3-none-any.zip'))
    | project name=model_name, timestamp=now(), model
}
~~~

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
// Creates a model named "HDFS_model", for the HDFS log, a commonly used benchmark for log parsing.
HDFS_log
| take 100000
| invoke log_reduce_train_fl(reduce_col="data", model_name="HDFS_model")
```

---

Result:
<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
name	timestamp	model
HDFS_model	2022-11-23 12:38:52.8445035	80036370616e6461732e636f72652e6672616d650a446174614672616d650a7100298171017d71022858050000005f6461746171036370616e6461732e636f72652e696e7465726e616c732e6d616e61676572730a426c6f636b4d616e616765720a710429817105285d7106286370616e6461732e636f72652e696e64657865732e626173650a5f6e65775f496e6465780a71076370616e6461732e636f72652e696e64657865732e626173650a496e6465780a71087d710928580400000064617461710a636e756d70792e636f72652e6d756c746961727261790a5f7265636f6e7374727563740a710b636e756d70790a6e6461727261790a710c4b0085710d430162710e87710f527110284b014b03857111636e756d70790a64747970650a711258020000004f3871138988877114527115284b0358010000007c71164e4e4e4affffffff4affffffff4b3f74711762895d7118285805000000436f756e74711958090000004c6f67526564756365711a58070000006578616d706c65711b6574711c6258040000006e616d65711d4e7586711e52711f68076370616e6461732e636f72652e696e64657865732e72616e67650a52616e6765496e6465780a71207d712128681d4e5805000000737461727471224b00580400000073746f7071234b1058040000007374657071244b0175867125527126655d712728680b680c4b00857128680e87712952712a284b014b014b1086712b681258020000006938712c898887712d52712e284b0358010000003c712f4e4e4e4affffffff4affffffff4b00747130628943803cd8000000000000262800000000000010280000000000001028000000000000b423000000000000e70b0000000000007a05000000000000b10000000000000024000000000000000c000000000000000c000000000000000c000000000000000600000000000000060000000000000003000000000000000100000000000000713174713262680b680c4b00857133680e877134527135284b014b014b108671366815895d713728586c000000303831313130203c4e554d3e203c4e554d3e20494e464f206466732e46534e616d6573797374656d3a20424c4f434b2a204e616d6553797374656d2e64656c6574653a20626c6b5f3c4e554d3e20697320616464656420746f20696e76616c6964536574206f66203c49503e71385883000000303831313130203c4e554d3e203c4e554d3e20494e464f206466732e46534e616d6573797374656d3a20424c4f434b2a204e616d6553797374656d2e61646453746f726564426c6f636b3a20626c6f636b4d617020757064617465643a203c49503e20697320616464656420746f20626c6b5f3c4e554d3e2073697a65203c4e554d3e71395866000000303831313130203c4e554d3e203c4e554d3e20494e464f206466732e446174614e6f6465245061636b6574526573706f6e6465723a20526563656976656420626c6f636b20626c6b5f3c4e554d3e206f662073697a65203c4e554d3e2066726f6d203c49503e713a586b000000303831313130203c4e554d3e203c4e554d3e20494e464f206466732e446174614e6f6465245061636b6574526573706f6e6465723a205061636b6574526573706f6e646572203c4e554d3e20666f7220626c6f636b20626c6b5f3c4e554d3e207465726d696e6174696e67713b5860000000303831313130203c4e554d3e203c4e554d3e20494e464f206466732e446174614e6f64652444617461586365697665723a20526563656976696e6720626c6f636b20626c6b5f3c4e554d3e207372633a203c49503e20646573743a203c49503e713c5896000000303831313130203c4e554d3e203c4e554d3e20494e464f206466732e46534e616d6573797374656d3a20424c4f434b2a204e616d6553797374656d2e616c6c6f63617465426c6f636b3a202f757365722f726f6f742f72616e64332f5f74656d706f726172792f5f7461736b5f3c4e554d3e5f3c4e554d3e5f6d5f3c4e554d3e5f3c4e554d3e2f706172742d3c4e554d3e2e203c2a3e713d5838000000303831313130203c4e554d3e203c4e554d3e20494e464f203c2a3e3a203c2a3e20626c6f636b20626c6b5f3c4e554d3e203c2a3e203c2a3e713e582c000000303831313130203c4e554d3e203c4e554d3e20494e464f203c2a3e3a203c2a3e203c2a3e203c2a3e203c2a3e713f5836000000303831313130203c4e554d3e203c4e554d3e20494e464f203c2a3e3a203c2a3e203c2a3e203c2a3e20666f7220626c6f636b203c2a3e71405848000000303831313130203c4e554d3e203c4e554d3e20494e464f203c2a3e3a203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e20626c6f636b20626c6b5f3c4e554d3e203c2a3e203c2a3e71415850000000303831313130203c4e554d3e203c4e554d3e20494e464f206466732e46534e616d6573797374656d3a20424c4f434b2a203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e7142586d000000303831313130203c4e554d3e203c4e554d3e20494e464f206466732e446174614e6f64652444617461586365697665723a20526563656976656420626c6f636b20626c6b5f3c4e554d3e207372633a203c49503e20646573743a203c49503e206f662073697a65203c4e554d3e71435875000000303831313130203c4e554d3e203c4e554d3e203c2a3e206466732e46534e616d6573797374656d3a20424c4f434b2a204e616d6553797374656d2e61646453746f726564426c6f636b3a203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e2073697a65203c4e554d3e7144585a000000303831313130203c4e554d3e203c4e554d3e20494e464f206466732e446174614e6f64652444617461586365697665723a203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e3a203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e71455893000000303831313130203c4e554d3e203c4e554d3e20494e464f206466732e46534e616d6573797374656d3a20424c4f434b2a204e616d6553797374656d2e61646453746f726564426c6f636b3a203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e2073697a65203c4e554d3e203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e2e7146584d000000303831313130203c4e554d3e203c4e554d3e203c2a3e203c2a3e3a203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e2e203c2a3e203c2a3e203c2a3e203c2a3e203c2a3e2e71476574714862680b680c4b00857149680e87714a52714b284b014b014b1086714c6815895d714d2858880000003038313131302032323036323320323620494e464f206466732e46534e616d6573797374656d3a20424c4f434b2a204e616d6553797374656d2e64656c6574653a20626c6b5f3132333930313635383235303931333830343520697320616464656420746f20696e76616c6964536574206f662031302e3235312e3132332e3139353a3530303130714e58a00000003038313131302032313538353820323720494e464f206466732e46534e616d6573797374656d3a20424c4f434b2a204e616d6553797374656d2e61646453746f726564426c6f636b3a20626c6f636b4d617020757064617465643a2031302e3235302e31312e38353a353030313020697320616464656420746f20626c6b5f353038303235343239383730383431313638312073697a65203637313038383634714f58810000003038313131302032313538353820313534383520494e464f206466732e446174614e6f6465245061636b6574526573706f6e6465723a20526563656976656420626c6f636b20626c6b5f35303830323534323938373038343131363831206f662073697a652036373130383836342066726f6d202f31302e3235312e34332e3231715058770000003038313131302032313538353820313534393620494e464f206466732e446174614e6f6465245061636b6574526573706f6e6465723a205061636b6574526573706f6e646572203220666f7220626c6f636b20626c6b5f2d37373436363932353435393138323537373237207465726d696e6174696e677151588e0000003038313131302032313538353820313534393420494e464f206466732e446174614e6f64652444617461586365697665723a20526563656976696e6720626c6f636b20626c6b5f2d37303337333436373535343239323933303232207372633a202f31302e3235312e34332e32313a343539333320646573743a202f31302e3235312e34332e32313a3530303130715258ac0000003038313131302032313538353820323620494e464f206466732e46534e616d6573797374656d3a20424c4f434b2a204e616d6553797374656d2e616c6c6f63617465426c6f636b3a202f757365722f726f6f742f72616e64332f5f74656d706f726172792f5f7461736b5f3230303831313130313032345f303030355f6d5f3030313830355f302f706172742d30313830352e20626c6b5f2d373033373334363735353432393239333032327153588b0000003038313131302032313539353720313535353620494e464f206466732e446174614e6f646524446174615472616e736665723a2031302e3235302e31352e3139383a35303031303a5472616e736d697474656420626c6f636b20626c6b5f2d3337383235363931323037313435333934343620746f202f31302e3235312e3230332e3132393a35303031307154585f0000003038313131302032313538353920313320494e464f206466732e44617461426c6f636b5363616e6e65723a20566572696669636174696f6e2073756363656564656420666f7220626c6b5f2d373234343932363831363038343632373437347155586d0000003038313131302032313539323420313536333620494e464f206466732e446174614e6f646524426c6f636b52656365697665723a20526563656976696e6720656d707479207061636b657420666f7220626c6f636b20626c6b5f333939313238383635343236353330313933397156588a0000003038313131302032313539353520313820494e464f206466732e446174614e6f64653a2031302e3235302e31352e3139383a3530303130205374617274696e672074687265616420746f207472616e7366657220626c6f636b20626c6b5f2d3337383235363931323037313435333934343620746f2031302e3235312e3230332e3132393a3530303130715758900000003038313131302032313539353320313920494e464f206466732e46534e616d6573797374656d3a20424c4f434b2a2061736b2031302e3235302e31352e3139383a353030313020746f207265706c696361746520626c6b5f2d3337383235363931323037313435333934343620746f20646174616e6f64652873292031302e3235312e3230332e3132393a3530303130715858a00000003038313131302032313539353720313532323620494e464f206466732e446174614e6f64652444617461586365697665723a20526563656976656420626c6f636b20626c6b5f2d33373832353639313230373134353339343436207372633a202f31302e3235302e31352e3139383a353130313320646573743a202f31302e3235302e31352e3139383a3530303130206f662073697a65203134343734373035715958b500000030383131313020323135393234203237205741524e206466732e46534e616d6573797374656d3a20424c4f434b2a204e616d6553797374656d2e61646453746f726564426c6f636b3a20526564756e64616e742061646453746f726564426c6f636b207265717565737420726563656976656420666f7220626c6b5f32353232353533373831373430353134303033206f6e2031302e3235312e3230322e3133343a35303031302073697a65203637313038383634715a58970000003038313131302032313539333620313537313420494e464f206466732e446174614e6f64652444617461586365697665723a207772697465426c6f636b20626c6b5f37323039333938393738363130363133323820726563656976656420657863657074696f6e206a6176612e696f2e494f457863657074696f6e3a20436f756c64206e6f7420726561642066726f6d2073747265616d715b58cd0000003038313131302032323036333520323820494e464f206466732e46534e616d6573797374656d3a20424c4f434b2a204e616d6553797374656d2e61646453746f726564426c6f636b3a2061646453746f726564426c6f636b207265717565737420726563656976656420666f7220626c6b5f2d3831313936343739363636333036333130206f6e2031302e3235302e31372e3137373a35303031302073697a652035333435373831312042757420697420646f6573206e6f742062656c6f6e6720746f20616e792066696c652e715c588800000030383131313020323230363331203139205741524e206466732e4653446174617365743a20556e6578706563746564206572726f7220747279696e6720746f2064656c65746520626c6f636b20626c6b5f2d323031323135343035323732353236313333372e20426c6f636b496e666f206e6f7420666f756e6420696e20766f6c756d654d61702e715d6574715e62655d715f28680768087d716028680a680b680c4b00857161680e877162527163284b014b018571646815895d716568196174716662681d4e75867167527168680768087d716928680a680b680c4b0085716a680e87716b52716c284b014b0185716d6815895d716e681a6174716f62681d4e75867170527171680768087d717228680a680b680c4b00857173680e877174527175284b014b018571766815895d7177681b6174717862681d4e7586717952717a657d717b5806000000302e31342e31717c7d717d28580400000061786573717e68065806000000626c6f636b73717f5d7180287d718128580600000076616c7565737182682a58080000006d67725f6c6f63737183636275696c74696e730a736c6963650a71844b004b014b01877185527186757d71872868826835688368844b014b024b01877188527189757d718a286882684b688368844b024b034b0187718b52718c7565757374718d6258040000005f747970718e5809000000646174616672616d65718f58090000005f6d6574616461746171905d7191756258050000005b2220225d719258d70000005b5b22282f7c29285b302d395d2b5c5c2e297b337d5b302d395d2b283a5b302d395d2b7c29283a7c29222c20223c49503e225d2c205b22285b302d39612d66412d465d7b387d2d5b302d39612d66412d465d7b347d2d5b302d39612d66412d465d7b347d2d5b302d39612d66412d465d7b347d2d5b302d39612d66412d465d7b31327d29222c20223c475549443e225d2c205b22283f3c3d5b5e412d5a612d7a302d395d29285c5c2d3f5c5c2b3f5c5c642b29283f3d5b5e412d5a612d7a302d395d297c5b302d395d2b24222c20223c4e554d3e225d5d71938771942e
```
