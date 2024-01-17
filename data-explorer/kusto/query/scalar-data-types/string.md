---
title:  The string data type
description: Learn about the string data type in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 10/15/2023
---
# The string data type

The `string` data type represents a sequence of zero or more [Unicode](https://home.unicode.org/)
characters.

For information on string query operators, see [String operators](../datatypes-string-operators.md).

> [!NOTE]
>
> * Internally, strings are encoded in [UTF-8](https://en.wikipedia.org/wiki/UTF-8). Invalid (non-UTF8) characters are replaced with [U+FFFD](https://codepoints.net/U+FFFD) Unicode replacement characters at ingestion time.
> * Kusto has no data type that is equivalent to a single character. A single character is represented as a string of length 1.
> * When ingesting the `string` data type, if a single string value in a record exceeds 1MB (measured using UTF-8 encoding), the value is truncated and ingestion succeeds. If a single string value in a record, or the entire record, exceeds the allowed data limit of 64MB, ingestion fails.

## `string` literals

You can use double quotes or single quotes to encode string literals in query text. With double quotes, you must escape nested double quote characters with a backslash (`\`). With single quotes, you must escape nested single quote characters, and you don't need to escape double quotes.

Use the backslash character to escape the enclosing quote characters, tab characters (`\t`), newline characters (`\n`), and the backslash itself (`\\`).

> [!NOTE]
> The newline character (`\n`) and the return character (`\r`) must be enclosed in quotes unless using [multi-line string literals](#multi-line-string-literals).

## Verbatim string literals

Verbatim string literals are also supported. In this form, the backslash character (`\`) stands for itself and isn't an escape character. Prepending the `@` character to string literals serves as a verbatim identifier. In verbatim string literals, double quotes are escaped with double quotes and single quotes are escaped with single quotes.

For an example, see [Verbatim string](#verbatim-string-literal).

> [!NOTE]
> The newline character (`\n`) and the return character (`\r`) must be enclosed in quotes unless using [multi-line string literals](#multi-line-string-literals).

## Multi-line string literals

Indicate a multi-line string literals by a "triple-backtick chord" (`\``) at the beginning and end of the literal.

For an example, see [Multi-line string literal](#multi-line-string-literal).

> [!NOTE]
> * Multi-line string literals support newline (`\n`) and return (`\r`) characters.
> * Multi-line string literals do not support escaped characters. Similar to [verbatim string literals](#verbatim-string-literals).
> * Multi-line string literals don't support [obfuscation](#obfuscated-string-literals).

## Concatenation of separated string literals

In a Kusto query, when two or more adjacent string literals have no separation between them, they're automatically combined to form a new string literal. Similarly, if the string literals are separated only by whitespace or comments, they're also combined to form a new string literal.

For an example, see [Concatenated string literals](#concatenated-string-literals).

## Obfuscated string literals

Queries are stored for telemetry and analysis. To safeguard sensitive information like passwords and secrets, you can mark a string as an *obfuscated string literal*. These marked strings are replaced with asterisks (`*`) in the query text.

An obfuscated string literal is created by prepending an `h` or an `H` character in front of a standard or verbatim [string literal](#string-literals).

For an example, see [Obfuscated string literal](#obfuscated-string-literal).

> [!IMPORTANT]
> Mark all string literals that contain secret information as obfuscated string literals.

> [!TIP]
> In some situations, only a portion of the string literal contains secret information. In such cases, divide the literal into a non-secret part and a secret portion. Then, label only the secret part as obfuscated.

## Examples

### String literal with quotes

The following example demonstrates how to use quotes within string literals encompassed by single quotes and double quotes. For more information, see [String literals](#string-literals).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswr4VIAgmJDBVsF9eISoEC6QnlmSYaCUkp+aVJOqkJhaX5JarGSug5EnRFQnRKyOvViIBOuTl0JAJviYe9UAAAA" target="_blank">Run the query</a>

```kusto
print
    s1 = 'string with "double quotes"',
    s2 = "string with 'single quotes'"
```

**Output**

|s1|s2|
|--|--|
|string with "double quotes"|string with 'single quotes'|

### String literal with backslash escaping

The following example creates a regular expression pattern using backslashes to escape special characters. For more information, see [String literals](#string-literals).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShILClJLcpTsFVQj4nJ09PSsKuJUa+xrYlR0oxO1K1y1I0y0LXU146ttjCrtbVVBwA/QC+dNQAAAA==" target="_blank">Run the query</a>

```kusto
print pattern = '\\n.*(>|\'|=|\")[a-zA-Z0-9/+]{86}=='
```

**Output**

|pattern|
|--|
|\n.*(>\|'\|=\|")[a-zA-Z0-9/+]{86}==|

### String literal with Unicode

The following example shows that a backslash is needed in order to include a Unicode character in a string literal.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc9rf7q4d68qcw5sk2d6f.northeurope/databases/MyDatabase?query=H4sIAAAAAAAAAysoyswrUSguSExOVbBVUPJIzcnJjyk1MHA0CM8vyklRAgCRNap/IAAAAA==" target="_blank">Run the query</a>

```kusto
print space = "Hello\u00A0World"
```

**Output**

|space|
|--|
|Hello World|

### Verbatim string literal

The following example creates a path in which the backslashes are part of the path instead of escape characters. To do this, the string `@` sign is prepended to the string, creating a [verbatim string literal](#verbatim-string-literals).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcitDEgsyVCwVXBQd7aKccvPSUktiknLzEnNS8xN1SupKFEHAGc6ZBYoAAAA" target="_blank">Run the query</a>

```kusto
print myPath = @'C:\Folder\filename.txt'
```

**Output**

|myPath|
|--|
|C:\Folder\filename.txt|

### Multi-line string literal

The following example shows the syntax for a multi-line string literal, which uses newlines and tabs to style a code block. For more information, see [Multi-line string literals](#multi-line-string-literals).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSgoyk8vSsxVsFVISEjgUlAoKE3KyUxWSM5JLC5WCIBKVgMl4FLFJYklQKosPzNFwTcxM09DEyqvoBBcWVySmqvnnJ9XnJ+TqhdelFmS6pOZl6qh5JGak5OvqKRpDVZZywXCQAsBPUXdJYQAAAA=" target="_blank">Run the query</a>

```kusto
print program = ```
  public class Program {
    public static void Main() {
      System.Console.WriteLine("Hello!");
    }
  }```
```
**Output**

|program|
|--|
|public class Program { public static void Main() { System.Console.WriteLine("Hello!"); } }|

### Concatenated string literals

The following expressions all yield a string of length 13. For more information, see [Concatenation of separated string literals](#concatenation-of-separated-string-literals).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc9rf7q4d68qcw5sk2d6f.northeurope/databases/MyDatabase?query=H4sIAAAAAAAAAysoyswrUeBSAIK8/LxUBVuF4pKinNQ8DSWP1JycfCV1HQV1B6Xy/KKcFEUlTR2wwvKMzJLU4oLEZEzlCiD1Crg1OOalOOfn5qYC7cTQClYKAvr6ClBFcCEUZ4BFNa0BnYL1CrsAAAA=" target="_blank">Run the query</a>

```kusto
print 
    none = strlen("Hello"', '@"world!"),
    whitespace = strlen("Hello" ', ' @"world!"),
    whitespaceAndComment = strlen("Hello" 
        // Comment
        ', '@"world!"
    );
```

**Output**

|none|whitespace|whitespaceAndComment|
|--|--|--|
|13|13|13|

### Obfuscated string literal

In the following query output, the `h` string is visible. However, in tracing or telemetry, the `h` string is substituted with asterisks. For more information, see [Obfuscated string literals](#obfuscated-string-literals).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAx2JSQqAMAwA775CPNhT00VPgvgJP+BSaEESaYL1+S5zm5kzJ5R6PWgdmyhy8mDMRijEBF+FjXKAknCnwoBB/rskDNn8X26Zmqp+iYqv0VvntfXa+ZbDZ522vXbdbAFAPQD1rLluAAAA" target="_blank">Run the query</a>

```kusto
print blob="https://contoso.blob.core.windows.net/container/blob.txt?"
    h'sv=2012-02-12&se=2013-04-13T0...'
```

**Output**

|blob|
|--|
|https://contoso.blob.core.windows.net/container/blob.txt?sv=2012-02-12&se=2013-04-13T0...|

## Related content

* [String operators](../datatypes-string-operators.md)
