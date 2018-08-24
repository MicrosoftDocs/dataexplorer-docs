# trim()

Removes all leading and trailing matches of the specified regular expression.

**Syntax**

`trim(`*regex*`,` *text*`)`

**Arguments**

* *regex*: String or [regular expression](re2.md) to be trimmed from the beginning and/or the end of *text*.  
* *text*: A string.

**Returns**

*text* after trimming matches of *regex* found in the beginning and/or the end of *text*.

**Example**

Statement bellow trims *substring*  from the start and the end of the *string-to-trim*:

```kusto
let string-to-trim = @"--http://bing.com--";
let substring = "--";
range x from 1 to 1 step 1
| project string-to-trim = string-to-trim, trimmed-string = trim(substring,string-to-trim)
```

|string-to-trim|trimmed-string|
|---|---|
|--http://bing.com--|http://bing.com|

Next statement trims all non-word characters from start and end of the string:

```kusto
range x from 1 to 5 step 1
| project str = strcat("-  ","Te st",x,@"// $")
| extend trimmed-str = trim(@"[^\w]+",str)
```

|str|trimmed-str|
|---|---|
|-  Te st1// $|Te st1|
|-  Te st2// $|Te st2|
|-  Te st3// $|Te st3|
|-  Te st4// $|Te st4|
|-  Te st5// $|Te st5|


 


