---
title:  trim()
description: Learn how to use the trim() function to remove the leading and trailing match of the specified regular expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 06/18/2024
adobe-target: true
---
# trim()

Removes all leading and trailing matches of the specified regular expression.

## Syntax

`trim(`*regex*`,` *source*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *regex* | `string` |  :heavy_check_mark: | The string or [regular expression](regex.md) to be trimmed from *source*.|
| *source* | `string` |  :heavy_check_mark: | The source string from which to trim *regex*.|

## Returns

*source* after trimming matches of *regex* found in the beginning and/or the end of *source*.

## Examples

### Trim specific substring

The following example trims *substring* from the start and the end of the *string_to_trim*.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEoLinKzEuPL8mPBzJyFWwVHJR0dTNKSgqKrfT1k4BSesn5ubq6Sta8XDkg5aVJEB1AlUoQ4QIgF4s5qAI6CiAyNzUlHq4dJKABN08HVb0mAHnS2GacAAAA" target="_blank">Run the query</a>

```kusto
let string_to_trim = @"--https://bing.com--";
let substring = "--";
print string_to_trim = string_to_trim, trimmed_string = trim(substring,string_to_trim)
```

**Output**

|string_to_trim|trimmed_string|
|---|---|
|`--https://bing.com--`|`https://bing.com`|

### Trim non-alphanumeric characters

The following example trims all non-word characters from start and end of the string.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzBVKC5JLVAw5OWqUSgoys9KTS4BihQp2ILI5MQSDSVdBQUlHaWQVKCAkk6FjoOSvr6CipImSENqRUlqXopCSVFmbm5qSjxEH4in4aAUHRdTHqutpAMU1AQAsu/uCXcAAAA=" target="_blank">Run the query</a>

```kusto
range x from 1 to 5 step 1
| project str = strcat("-  ","Te st",x,@"// $")
| extend trimmed_str = trim(@"[^\w]+",str)
```

**Output**

|str|trimmed_str|
|---|---|
|-  Te st1// $|Te st1|
|-  Te st2// $|Te st2|
|-  Te st3// $|Te st3|
|-  Te st4// $|Te st4|
|-  Te st5// $|Te st5|

### Trim whitespace

The following example trims all spaces from start and end of the string.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzBVKC5JLVAw5OWqUSgoys9KTS4BihQp2ILI5MQSDSVdBQUlHaWQVKCAkk6FjoOSvr6CipImSENqRUlqXopCSVFmbm5qSjxEH4in4aAUHRdTHqutpAMU1AQAsu/uCXcAAAA=" target="_blank">Run the query</a>

```kusto
let string_to_trim = @"    Hello, world!    ";
let substring = @"\s+";
print
    string_to_trim = string_to_trim,
    trimmed_string = trim(substring, string_to_trim)
```

**Output**

|string_to_trim|trimmed_string|
|---|---|
|    Hello, world!    	|Hello, world!|
