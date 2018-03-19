# Query Language

## Latest updates

#### March 7, 2018

Breaking change: [bin()](query_language_binfunction.md) no longer defaults to 1 hour bins. Specifying a bin size is now mandatory (e.g. `bin(date_time_field, 1h)`).

### New functions & operators
* [hash_sha256()](query_language_sha256hashfunction.md)
* [parse_user_agent()](query_language_parse_useragentfunction.md)

### Other changes
* [bin_at()](query_language_binatfunction.md) documentation updated
* [User-Defined Functions](query_language_userdefinedfunctions.md) documentation updated


## Older updates

#### Feb 7, 2018
### New functions & operators
* [binary_shift_left()](query_language_binary_shift_leftfunction.md)
* [binary_shift_right()](query_language_binary_shift_rightfunction.md)

### Renamed functions & operators
* *Partitioned join* renamed [Shuffle join](query_language_shufflejoin.md)
* *Partitioned Summarize* renamed [Shuffle Summarize](query_language_shufflesummarize.md)


#### Jan 7, 2018
### New functions & operators
* [funnel_sequence_completion plugin](query_language_funnel_sequence_completion_plugin.md)
* [strcat_array()](query_language_strcat_arrayfunction.md)
* [todecimal()](query_language_todecimalfunction.md)
* [url_decode()](query_language_urldecodefunction.md)
* [url_encode()](query_language_urlencodefunction.md)
* [parse_xml()](query_language_parse_xmlfunction.md)

### Other changes
* [format_timespan()](query_language_format_timespanfunction.md) documentation updated
* [funnel_sequence plugin](query_language_funnel_sequence_plugin.md) documentation updated
* [reduce operator](query_language_reduceoperator.md) documentation updated


#### Dec 14, 2017
### New functions & operators
* [datetime_add()](query_language_datetime_addfunction.md)
* [datetime_diff()](query_language_datetime_difffunction.md)
* evaluate [bag_unpack](query_language_bag_unpackplugin.md)
* [preview plugin](query_language_previewplugin.md)
* [strcat_delim()](query_language_strcat_delimfunction.md)
* [strrep()](query_language_strrepfunction.md)

### Renamed functions & operators
* *arraylength()* renamed [array_length()](query_language_arraylengthfunction.md)
* *atn2()* renamed [atan2()](query_language_atan2function.md)
* *stdev()* renamed [stdevp()](query_language_stdevp_aggfunction.md)
* *variance()* renamed [variancep()](query_language_variancep_aggfunction.md)

### Other changes
* [datetime_part()](query_language_datetime_partfunction.md) now supports "Quarter", "WeekOfYear" and "DayOfYear"
* [pivot plugin](query_language_pivotplugin.md) documentation updated
