---
title:  trim_start()
description: Learn how to use the trim_start() function to remove the leading match of the specified regular expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 06/18/2024
---
# trim_start()

Removes leading match of the specified regular expression.

## Syntax

`trim_start(`*regex*`,` *source*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *regex* | `string` |  :heavy_check_mark: | The string or [regular expression](regex.md) to be trimmed from the beginning of *source*.|
| *source* | `string` |  :heavy_check_mark: | The source string from which to trim *regex*.|

## Returns

*source* after trimming match of *regex* found in the beginning of *source*.

## Examples

### Trim specific substring

The following example trims *substring* from the start of *string_to_trim*.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEoLinKzEuPL8mPBzJyFWwVHJQySkoKiq309ZOAEnrJ+blK1rxcOSClpUkQ1UBVcEUgyQKgIBaTUAV0QERuako83AyQAJCXWFSiATdaB1WTJgD3gw1dowAAAA==" target="_blank">Run the query</a>

```kusto
let string_to_trim = @"https://bing.com";
let substring = "https://";
print string_to_trim = string_to_trim,trimmed_string = trim_start(substring,string_to_trim)
```

**Output**

|string_to_trim|trimmed_string|
|---|---|
|<https://bing.com>|bing.com|

### Trim non-alphanumeric characters

The following example trims all non-word characters from the beginning of the string.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzBVKC5JLVAw5OWqUSgoys9KTS4BihQp2ILI5MQSDSVdBQUlHaWQVKCAkk6FjoOSvr6CipImSENqRUlqXopCSVFmbm5qSjxEH4gHZCYWlWg4KEXHxZTHaivpAKU0AZNZAoR9AAAA" target="_blank">Run the query</a>

```kusto
range x from 1 to 5 step 1
| project str = strcat("-  ","Te st",x,@"// $")
| extend trimmed_str = trim_start(@"[^\w]+",str)
```

**Output**

|str|trimmed_str|
|---|---|
|-  Te st1// $|Te st1// $|
|-  Te st2// $|Te st2// $|
|-  Te st3// $|Te st3// $|
|-  Te st4// $|Te st4// $|
|-  Te st5// $|Te st5// $|

### Trim whitespace

The following example trims all spaces from the start of the string.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/FindMyPartner?query=H4sIAAAAAAAAA8tJLVEoLinKzEuPL8mPBzJyFWwVHJQUgMAjNScnX0ehPL8oJ0URJKBkzZUDUl6aBNEBVhlTrA0ULwDyS7hAijAMQxXQASsCsXJTU%2BKLSxKLSoBqQHwIRwNuug6aTk0AHsDgWqsAAAA%3D" target="_blank">Run the query</a>

```kusto
let string_to_trim = @"    Hello, world!    ";
let substring = @"\s+";
print
    string_to_trim = string_to_trim,
    trimmed_start = trim_start(substring, string_to_trim)
```

**Output**

|string_to_trim|trimmed_start|
|---|---|
|    Hello, world!    	|Hello, world!    |