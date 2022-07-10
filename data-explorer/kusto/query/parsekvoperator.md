---
title: parse-kv operator - Azure Data Explorer
description: This article describes parse-kv operator in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/09/2022
---

# parse-kv operator

Extracts strucutured information represented in a key/value form from a string expression.

The following modes are supported:

 * Extraction based on specified delimiters that dictate how keys/values and pairs are separated from each other.

 * Extraction with no need to specify delimiters - any non-alphanumeric character is considered a delimiter.
  
 * Extraction based on [RE2](re2.md) regular expression.

## Syntax

Below is the syntax for each of the supported modes:

*T* `|` `parse-kv` [*Expression*](#arg-expr) `as` `(` [*KeysList*](#arg-keylist) `)` `with` `(` `pair_delimiter` `=` [*PairDelimiter*](#arg-pairdelim) `,` `kv_delimiter` `=` [*KvDelimiter*](#arg-kvdelim)  [`,` `quote` `=` [*QuoteChars*](#arg-quote) ... [`,` `escape` `=` [*EscapeChar*](#arg-escape) ...]] [`,` `greedy` `=` `true`] `)`

*T* `|` `parse-kv` [*Expression*](#arg-expr) `as` `(` [*KeysList*](#arg-keylist) `)` `with` `(` [`quote` `=` [*QuoteChars*](#arg-quote) ... [`,` `escape` `=` [*EscapeChar*](#arg-escape) ...]] `)`

*T* `|` `parse-kv` [*Expression*](#arg-expr) `as` `(` [*KeysList*](#arg-keylist) `)` `with` `(` `regex` `=` [*RegexPattern*](#arg-regex) `)`

## Arguments

<a name="arg-expr"></a>
*Expression*

String expression to extract key values from.

<a name="arg-keylist"></a>
*KeysList*

Comma separated list of key names and their value data types. The order of the keys does not have to match the order in which they appear in the text.

<a name="arg-pairdelim"></a>
*PairDelimiter*

String literal representing a delimiter that separates key value pairs from each other.

<a name="arg-kvdelim"></a>
*KvDelimiter*

String literal representing a delimiter that separates keys from values.

<a name="arg-quote"></a>
*QuoteChars*

One or two characters string literal representing opening and closing quotes that extracted value may be wrapped with. The parameter can be repeated to specify additional set of opening/closing quotes.

<a name="arg-escape"></a>
*EscapeChar*

One character string literal describing a character that may be used for escaping special characters in a quoted value. The parameter can be repeated if there are multiple escape characters used.

<a name="arg-regex"></a>
*RegexPattern*

A [RE2](re2.md) regular expression containing two capturing groups exactly: first one is for the key name, the second - for the key value.

## Returns

Original input tabular expression *T*, extended with columns per specified keys to extract.

> [!NOTE]
> * If a key doesn't appear in a record, the corresponding column value will be `null` or empty string depending on its type.
> 
> * Only keys listed in the operator are extracted.
> 
> * Only the first appearance of a key is extracted, other values are ignored.
> 
> * When extracting keys and values, leading and trailing white-spaces are ignored.

## Examples

**Extraction with well defined delimiters**

In the example below, keys and values are separated by well defined delimiters (comma and colon characters):

```kusto
print str="ThreadId:458745723, Machine:Node001, Text: The service is up, Level: Info"
| parse-kv str as (Text: string, ThreadId:long, Machine: string) with (pair_delimiter=',', kv_delimiter=':')
| project-away str
```

|Text|	ThreadId|	Machine|
|--|--|--|
|The service is up| 458745723|	Node001

**Extraction with value quoting**

Sometimes values are wrapped in quotes, which allows them to contain delimiter charaters. The following examples show how `quote` argument is used for extracting such values.

```kusto
print str='src=10.1.1.123 dst=10.1.1.124 bytes=125 failure="connection aborted" time=2021-01-01T10:00:54'
| parse-kv str as (['time']:datetime, src:string, dst:string, bytes:long, failure:string) with (pair_delimiter=' ', kv_delimiter='=', quote='"')
| project-away str
```

|time|	src|	dst|	bytes|	failure|
|--|--|--|--|--|
|2021-01-01 10:00:54.0000000|	10.1.1.123|	10.1.1.124|	125|	connection aborted|

A similar example with different opening and closing quotes:

```kusto
print str='src=10.1.1.123 dst=10.1.1.124 bytes=125 failure=(connection aborted) time=(2021-01-01 10:00:54)'
| parse-kv str as (['time']:datetime, src:string, dst:string, bytes:long, failure:string) with (pair_delimiter=' ', kv_delimiter='=', quote='()')
| project-away str
```

|time|	src|	dst|	bytes|	failure|
|--|--|--|--|--|
|2021-01-01 10:00:54.0000000|	10.1.1.123|	10.1.1.124|	125|	connection aborted|

Values themselves may contain properly escaped quote characters, as the following example shows:

```kusto
print str='src=10.1.1.123 dst=10.1.1.124 bytes=125 failure="the remote host sent \\"bye!\\"" time=2021-01-01T10:00:54'
| parse-kv str as (['time']:datetime, src:string, dst:string, bytes:long, failure:string) with (pair_delimiter=' ', kv_delimiter='=', quote='"', escape='\\')
| project-away str
```

|time|	src|	dst|	bytes|	failure|
|--|--|--|--|--|
|2021-01-01 10:00:54.0000000|	10.1.1.123|	10.1.1.124|	125|	the remote host sent "bye!"|

**Extraction in greedy mode**

There are cases when unquoted values may contain pair delimiters still. In this case, `greedy` mode must be used. This tells the operator to scan until the next key appearance (or end of string) when looking for value ending.

Compare how the operator works with and without `greedy` mode specified:

```kusto
print str='name=John Doe phone=555 5555 city=New York'
| parse-kv str as (name:string, phone:string, city:string) with (pair_delimiter=' ', kv_delimiter='=')
| project-away str
```

|name|	phone|	city|
|--|--|--|
|John|	555|	New


```kusto
print str='name=John Doe phone=555 5555 city=New York'
| parse-kv str as (name:string, phone:string, city:string) with (pair_delimiter=' ', kv_delimiter='=', greedy=true)
| project-away str
```

|name|	phone|	city|
|--|--|--|
|John Doe|	555 5555|	New York|

**Extraction with no well defined delimiters**

In the following example, any non-alphanumeric character is considered a valid delimiter:

```kusto
print str="2021-01-01T10:00:34 [INFO] ThreadId:458745723, Machine:Node001, Text: Started"
| parse-kv str as (Text: string, ThreadId:long, Machine: string)
| project-away str
```

|Text|	ThreadId|	Machine|
|--|--|--|
|Started|	458745723|	Node001|

Values quoting and escaping is allowed in this mode as shown in the following example:

```kusto
print str="2021-01-01T10:00:34 [INFO] ThreadId:458745723, Machine:Node001, Text: 'The service \\' is up'"
| parse-kv str as (Text: string, ThreadId:long, Machine: string) with (quote="'", escape='\\')
| project-away str
```

|Text|	ThreadId|	Machine|
|--|--|--|
|The service ' is up|	458745723|	Node001|

**Extraction using regular expression**

There are cases, when no delimiters define text structure well enough. Here's when regular expression based extraction comes in handy.

```kusto
print str=@'["referer url: https://hostname.com/redirect?dest=/?h=1234", "request url: https://hostname.com/?h=1234", "advertiser id: 24fefbca-cf27-4d62-a623-249c2ad30c73"]'
| parse-kv str as (['referer url']:string, ['request url']:string, ['advertiser id']: guid) with (regex=@'"([\w ]+)\s*:\s*([^"]*)"')
| project-away str
```

|referer url|	request url|	advertiser id|
|--|--|--|
|`https://hostname.com/redirect?dest=/?h=1234`|	`https://hostname.com/?h=1234`|	24fefbca-cf27-4d62-a623-249c2ad30c73|
