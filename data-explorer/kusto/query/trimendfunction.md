# trim-end()

Removes trailing match of the specified regular expression.

**Syntax**

`trim-end(`*regex*`,` *text*`)`

**Arguments**

* *regex*: String or [regular expression](re2.md) to be trimmed from the end of *text*.  
* *text*: A string.

**Returns**

*text* after trimming matches of *regex* found in the end of *text*.

**Example**

Statement bellow trims *substring*  from the end of *string-to-trim*:

<!-- csl -->
```
let string-to-trim = @"bing.com";
let substring = ".com";
range x from 1 to 1 step 1
| project string-to-trim = string-to-trim,trimmed-string = trim-end(substring,string-to-trim)
```

|string-to-trim|trimmed-string|
|---|---|
|bing.com|bing|

Next statement trims all non-word characters from the end of the string:

<!-- csl -->
```
range x from 1 to 5 step 1
| project str = strcat("-  ","Te st",x,@"// $")
| extend trimmed-str = trim-end(@"[^\w]+",str)
```

|str|trimmed-str|
|---|---|
|-  Te st1// $|-  Te st1|
|-  Te st2// $|-  Te st2|
|-  Te st3// $|-  Te st3|
|-  Te st4// $|-  Te st4|
|-  Te st5// $|-  Te st5|

 
