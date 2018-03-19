# Working with Strings
#### (10 min to read)

<br/>
> [!Note]
> Before you start...<br/>
> If you haven't completed the [Date and time operations](~/learn/tutorials/datetime_operations.md) tutorial yet, we recommend that you do so. 

Strings are basically text values. This guide explains how to edit, compare, search inside and perform many other operations on strings.<br/>
Each character in a string has an "index" number, according to its location - the first character is at index 0, the following is 1 etc.
Different string functions use index numbers, as shown in the following sections.

Note that many of the following examples use *"print*" for convenience - that way we demonstrate string manipulation, regardless of the data source.


## Strings and escaping them
Azure Log Analytics String values are wrapped with quotes. They may be wrapped either with single or double quote characters.
Backslash (\) is used to escape characters to the character following it, such as \t (tab), \n (newline) and the quote character itself.
```OQL
print "this is a 'string' literal in double \" quotes"
```

To prevent "\\" from acting as an escape character, add "@" as a prefix to the string:
```OQL
print @"C:\backslash\not\escaped\with @ prefix"
```


## String comparisons

Operator       |Description                         |Case-Sensitive|Example (yields `true`)
---------------|------------------------------------|--------------|-----------------------
`==`           |Equals                              |Yes           |`"aBc" == "aBc"`
`!=`           |Not equals                          |Yes           |`"abc" != "ABC"`
`=~`           |Equals                              |No            |`"abc" =~ "ABC"`
`!~`           |Not equals                          |No            |`"aBc" !~ "xyz"`
`has`          |Right-hand-side is a whole term in left-hand-side |No|`"North America" has "america"`
`!has`         |Right-hand-side is not a full term in left-hand-side       |No            |`"North America" !has "amer"` 
`has_cs`       |Right-hand-side is a whole term in left-hand-side |Yes|`"North America" has_cs "America"`
`!has_cs`      |Right-hand-side is not a full term in left-hand-side       |Yes            |`"North America" !has_cs "amer"` 
`hasprefix`    |Right-hand-side is a term prefix in left-hand-side         |No            |`"North America" hasprefix "ame"`
`!hasprefix`   |Right-hand-side is not a term prefix in left-hand-side     |No            |`"North America" !hasprefix "mer"` 
`hasprefix_cs`    |Right-hand-side is a term prefix in left-hand-side         |Yes            |`"North America" hasprefix_cs "Ame"`
`!hasprefix_cs`   |Right-hand-side is not a term prefix in left-hand-side     |Yes            |`"North America" !hasprefix_cs "CA"` 
`hassuffix`    |Right-hand-side is a term suffix in left-hand-side         |No            |`"North America" hassuffix "ica"`
`!hassuffix`   |Right-hand-side is not a term suffix in left-hand-side     |No            |`"North America" !hassuffix "americ"
`hassuffix_cs`    |Right-hand-side is a term suffix in left-hand-side         |Yes            |`"North America" hassuffix_cs "ica"`
`!hassuffix_cs`   |Right-hand-side is not a term suffix in left-hand-side     |Yes            |`"North America" !hassuffix_cs "icA"
`contains`     |Right-hand-side occurs as a subsequence of left-hand-side  |No            |`"FabriKam" contains "BRik"`
`!contains`    |Right-hand-side does not occur in left-hand-side           |No            |`"Fabrikam" !contains "xyz"`
`contains_cs`   |Right-hand-side occurs as a subsequence of left-hand-side  |Yes           |`"FabriKam" contains_cs "Kam"`
`!contains_cs`  |Right-hand-side does not occur in left-hand-side           |Yes           |`"Fabrikam" !contains_cs "Kam"`
`startswith`   |Right-hand-side is an initial subsequence of left-hand-side|No            |`"Fabrikam" startswith "fab"`
`!startswith`  |Right-hand-side is not an initial subsequence of left-hand-side|No        |`"Fabrikam" !startswith "kam"`
`startswith_cs`   |Right-hand-side is an initial subsequence of left-hand-side|Yes            |`"Fabrikam" startswith_cs "Fab"`
`!startswith_cs`  |Right-hand-side is not an initial subsequence of left-hand-side|Yes        |`"Fabrikam" !startswith_cs "fab"`
`endswith`     |Right-hand-side is a closing subsequence of left-hand-side|No             |`"Fabrikam" endswith "Kam"`
`!endswith`    |Right-hand-side is not a closing subsequence of left-hand-side|No         |`"Fabrikam" !endswith "brik"`
`endswith_cs`     |Right-hand-side is a closing subsequence of left-hand-side|Yes             |`"Fabrikam" endswith "Kam"`
`!endswith_cs`    |Right-hand-side is not a closing subsequence of left-hand-side|Yes         |`"Fabrikam" !endswith "brik"`
`matches regex`|left-hand-side contains a match for Right-hand-side        |Yes           |`"Fabrikam" matches regex "b.*k"`
`in`           |Equals to one of the elements       |Yes           |`"abc" in ("123", "345", "abc")`
`!in`          |Not equals to any of the elements   |Yes           |`"bca" !in ("123", "345", "abc")`


## countof

Counts occurrences of a substring in a string. Can match plain strings or use regex.
Note: Plain string matches may overlap; regex matches do not.

#### Syntax
```
countof(text, search [, kind])
```

Arguments:<br/>
- `text` - The input string to
- `search` - The plain string or regular expression to match inside text.
- `kind` - "normal"|"regex" (default: normal).

Returns:<br/>
The number of times that the search string can be matched in the container. Plain string matches may overlap; regex matches do not.

#### Examples

Plain string matches
```OQL
print countof("The cat sat on the mat", "at");  //result: 3
print countof("aaa", "a");  //result: 3
print countof("aaaa", "aa");  //result: 3 (not 2!)
print countof("ababa", "ab", "normal");  //result: 2
print countof("ababa", "aba");  //result: 2
```

Regex matches
```OQL
print countof("The cat sat on the mat", @"\b.at\b", "regex");  //result: 3
print countof("ababa", "aba", "regex");  //result: 1
print countof("abcabc", "a.c", "regex");  // result: 2
```


## extract

Gets a match for a regular expression from a given string. Optionally also converts the extracted substring the specified type.

#### Syntax
```
extract(regex, captureGroup, text [, typeLiteral])
```

Arguments:<br/>
- `regex` - A regular expression.
- `captureGroup` - A positive int constant indicating the capture group to extract. 0 stands for the entire match, 1 for the value matched by the first '('parenthesis')' in the regular expression, 2 or more for subsequent parentheses.
- `text` - A string to search.
- `typeLiteral` - An optional type literal (e.g., typeof(long)). If provided, the extracted substring is converted to this type.

Returns:<br/>
The substring matched against the indicated capture group captureGroup, optionally converted to typeLiteral.
If there's no match, or the type conversion fails, return null.

#### Examples

The following example extracts the last octet of *ComputerIP* from a heartbeat record:
```OQL
Heartbeat
| where ComputerIP != "" 
| take 1
| project ComputerIP, last_octet=extract("([0-9]*$)", 1, ComputerIP) 
```

The following example extracts the last octet, casts it to a *real* type (number) and calculates the next IP value
```OQL
Heartbeat
| where ComputerIP != "" 
| take 1
| extend last_octet=extract("([0-9]*$)", 1, ComputerIP, typeof(real)) 
| extend next_ip=(last_octet+1)%255
| project ComputerIP, last_octet, next_ip
```

In the example below, the string *Trace* is searched for a definition of "Duration". The match is cast to *real* and multiplied by a time constant (1s) *which casts Duration to type timespan*.
```OQL
let Trace="A=12, B=34, Duration=567, ...";
print Duration = extract("Duration=([0-9.]+)", 1, Trace, typeof(real));  //result: 567
print Duration_seconds =  extract("Duration=([0-9.]+)", 1, Trace, typeof(real)) * time(1s);  //result: 00:09:27
```


## isempty, isnotempty, notempty

*isempty* returns true if the argument is an empty string or null (see also *isnull*).<br/>
*isnotempty* returns true if the argument is not an empty string or not null (see also *isnotnull*). alias: *notempty*.

#### Syntax
```
isempty(value)
isnotempty(value)
```

#### Examples

```OQL
print isempty("");  // result: true

print isempty("0");  // result: false

print isempty(0);  // result: false

print isempty(5);  // result: false

Heartbeat | where isnotempty(ComputerIP) | take 1  // return 1 Heartbeat record in which ComputerIP is not empty
```


## parseurl

Splits a URL into its parts (protocol, host, port, etc.), and returns a dictionary object containing the parts as strings.

#### Syntax
```
parseurl(urlstring)
```

#### Examples

```OQL
print parseurl("http://user:pass@contoso.com/icecream/buy.aspx?a=1&b=2#tag")
```

The outcome will be:
```
{
	"Scheme" : "http",
	"Host" : "contoso.com",
	"Port" : "80",
	"Path" : "/icecream/buy.aspx",
	"Username" : "user",
	"Password" : "pass",
	"Query Parameters" : {"a":"1","b":"2"},
	"Fragment" : "tag"
}
```


## replace

Replaces all regex matches with another string. 

#### Syntax
```
replace(regex, rewrite, input_text)
```

Arguments:<br/>
- `regex` - The regular expression to match by. It can contain capture groups in '('parentheses')'.
- `rewrite` - The replacement regex for any match made by matching regex. Use \0 to refer to the whole match, \1 for the first capture group, \2 and so on for subsequent capture groups.
- `input_text` - The input string to search in.

Returns:<br/>
The text after replacing all matches of regex with evaluations of rewrite. Matches do not overlap.

#### Examples
```OQL
SecurityEvent
| take 1
| project Activity 
| extend replaced = replace(@"(\d+) -", @"Activity ID \1: ", Activity) 
```

Can have the following results:
Activity                                        |replaced
------------------------------------------------|----------------------------------------------------------
4663 - An attempt was made to access an object  |Activity ID 4663: An attempt was made to access an object.


## split

Splits a given string according to a specified delimiter, and returns an array of the resulting substrings.

#### Syntax
```
split(source, delimiter [, requestedIndex])
```

Arguments:<br/>
- `source` - The string to be split according to the specified delimiter.
- `delimiter` - The delimiter that will be used in order to split the source string.
- `requestedIndex` - An optional zero-based index. If provided, the returned string array will hold only that item (if exists).


#### Examples
```OQL
print split("aaa_bbb_ccc", "_");    // result: ["aaa","bbb","ccc"]
print split("aa_bb", "_");          // result: ["aa","bb"]
print split("aaa_bbb_ccc", "_", 1);	// result: ["bbb"]
print split("", "_");              	// result: [""]
print split("a__b", "_");           // result: ["a","","b"]
print split("aabbcc", "bb");        // result: ["aa","cc"]
```

## strcat

Concatenates string arguments (supports 1-16 arguments).

#### Syntax
```
strcat("string1", "string2", "string3")
```

#### Examples
```OQL
print strcat("hello", " ", "world")	// result: "hello world"
```


## strlen

Returns the length of a string.

#### Syntax
```
strlen("text_to_evaluate")
```

#### Examples
```OQL
print strlen("hello")	// result: 5
```


## substring

Extracts a substring from a given source string, starting at the specified index. Optionally, the length of the requested substring can be specified.

#### Syntax
```
substring(source, startingIndex [, length])
```

Arguments:<br/>
- `source` - The source string that the substring will be taken from.
- `startingIndex` - The zero-based starting character position of the requested substring.
- `length` - An optional parameter that can be used to specify the requested length of the returned substring.

#### Examples
```OQL
print substring("abcdefg", 1, 2);	// result: "bc"
print substring("123456", 1);		// result: "23456"
print substring("123456", 2, 2);	// result: "34"
print substring("ABCD", 0, 2);	// result: "AB"
```


## tolower, toupper

Converts a given string to all lower\upper case.

#### Syntax
```
tolower("value")
toupper("value")
```

#### Examples
```OQL
print tolower("HELLO");	// result: "hello"
print toupper("hello");	// result: "HELLO"
```



## Next steps
Continue with our advanced tutorials:
* [Aggregation functions](~/learn/tutorials/aggregations.md)
* [Advanced aggregations](~/learn/tutorials/advanced_aggregations.md)
* [Charts and diagrams](~/learn/tutorials/charts.md)
* [Working with JSON and data structures](~/learn/tutorials/json_and_data_structures.md)
* [Advanced query writing](~/learn/tutorials/advanced_query_writing.md)
* [Joins - cross analysis](~/learn/tutorials/joins.md)