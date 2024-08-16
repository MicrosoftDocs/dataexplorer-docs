---
title:  trim_end()
description: Learn how to use the trim_end() function to remove the trailing match of the specified regular expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 06/18/2024
---
# trim_end()

Removes trailing match of the specified regular expression.

## Syntax

`trim_end(`*regex*`,` *source*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *regex* | `string` |  :heavy_check_mark: | The string or [regular expression](regex.md) to be trimmed from the end of *source*.|
| *source* | `string` |  :heavy_check_mark: | The source string from which to trim *regex*.|

## Returns

*source* after trimming matches of *regex* found in the end of *source*.

## Examples

The following statement trims *substring* from the end of *string_to_trim*.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEoLinKzEuPL8mPBzJyFWwVHJSSgAJ6yfm5Sta8XDkgJaVJEFVAWSWYRAFQAItuVAEdEJGbmhIP1w8SiE/NS9GAG6qDqkUTAKQH9A2VAAAA" target="_blank">Run the query</a>

```kusto
let string_to_trim = @"bing.com";
let substring = ".com";
print string_to_trim = string_to_trim,trimmed_string = trim_end(substring,string_to_trim)
```

**Output**

|string_to_trim|trimmed_string|
|--------------|--------------|
|bing.com      |bing          |

### Trim non-alphanumeric characters

The following example trims all non-word characters from the end of the string.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSguKVKwBZHJiSUaSroKCko6SiGpQAElHQclfX0FFSVNXq4ahdSKktS8FIWSoszc3NSUeIguEC8eKKzhoBQdF1Meq62kA5TQBADbLZbMWQAAAA==" target="_blank">Run the query</a>

```kusto
print str = strcat("-  ","Te st",x,@"// $")
| extend trimmed_str = trim_end(@"[^\w]+",str)
```

**Output**

|str          |trimmed_str|
|-------------|-----------|
|-  Te st1// $|-  Te st1  |
|-  Te st2// $|-  Te st2  |
|-  Te st3// $|-  Te st3  |
|-  Te st4// $|-  Te st4  |
|-  Te st5// $|-  Te st5  |

### Trim whitespace

The following example trims all spaces from the end of the string.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/FindMyPartner?query=H4sIAAAAAAAAA8tJLVEoLinKzEuPL8mPBzJyFWwVHJQUgMAjNScnX0ehPL8oJ0URJKBkzZUDUl6aBNEBVhlTrA0ULwDyS7hAijAMQxXQASsCsXJTU%2BJT81KAKkA8EFMDbrIOmi5NAP6lDgenAAAA" target="_blank">Run the query</a>

```kusto
let string_to_trim = @"    Hello, world!    ";
let substring = @"\s+";
print
    string_to_trim = string_to_trim,
    trimmed_end = trim_end(substring, string_to_trim)
```

**Output**

|string_to_trim|trimmed_end|
|---|---|
|    Hello, world!    	|    Hello, world!|