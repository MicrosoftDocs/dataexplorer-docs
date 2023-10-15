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

## String literals

You can use double quotes or single quotes to encode `string` literals in query text. With double quotes, you must escape nested double quote characters with a backslash (`\`). With single quotes, you must escape nested single quote characters, and you don't need to escape double quotes.

Use the backslash character to escape the enclosing quote characters, tab characters (`\t`), newline characters (`\n`), and the backslash itself (`\\`).

> [!NOTE]
> The newline character (`\n`) and the return character (`\r`) must be enclosed in quotes unless using [multi-line string literals](#multi-line-string-literals).

## Verbatim string literals

Verbatim string literals are also supported. In this form, the backslash character (`\`) stands for itself, and not as an escape character. Prepending the `@` special character to string literals serves as a verbatim identifier.

Instead of using a backslash as an escape character, double quotes are escaped with double quotes and single quotes are escaped with single quotes.

> [!NOTE]
> The newline character (`\n`) and the return character (`\r`) must be enclosed in quotes unless using [multi-line string literals](#multi-line-string-literals).

## Concatenation of separated string literals

In a KQL query, when two or more adjacent string literals have no separation between them, they're automatically combined to form a new string literal. Similarly, if the string literals are separated only by whitespace or comments, they're also combined to form a new string literal.

For example, the following expressions all yield a string of length 13:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3XOMQoCMRSE4T6nGNOsgrAHsBFsrGw8QXYzmEDyErIPwt5eFztZyym+n6ktimLRlihHe2dKxQ5nDFfbS0v+YE8XjCMeRUOUFyZqJwUamI2pOxibxg9/srrmlB7Tih6icqluJoqkdT9jsLlbyZmin7Hz6V/UiYfD/KVv7+yEm+AAAAA=" target="_blank">Run the query</a>

```kusto
print strlen("Hello"', '@"world!"); // Nothing between them

print strlen("Hello" ', ' @"world!"); // Separated by whitespace only

print strlen("Hello"
  // Comment
  ', '@"world!"); // Separated by whitespace and a comment
```

## Multi-line string literals

Indicate a multi-line string literals by a "triple-backtick chord" (`\``) at the beginning and end of the literal.

Multi-line string literals support newline (`\n`) and return (`\r`) characters, which means they don't require escaping.

> [!NOTE]
> * Multi-line string literals do not support escaped characters. Similar to 
> [verbatim string literals](#verbatim-string-literals).
> * Multi-line string literals don't support [obfuscation](#obfuscated-string-literals).

## Obfuscated string literals

The system tracks queries and stores them for telemetry and analysis purposes.
For example, the query text might be made available to the cluster owner. If the
query text includes secret information, such as passwords, it might leak
information that should be kept private. To prevent such a leak from happening, the
query author may mark specific string literals as **obfuscated string literals**.
Such literals in the query text are automatically replaced by a number of
star (`*`) characters, so that they aren't available for later analysis.

> [!IMPORTANT]
> Mark all string literals that contain secret information, as obfuscated string literals.

An obfuscated string literal can be formed by taking a "regular" string literal,
and prepending an `h` or an `H` character in front of it. 

For example:

```kusto
h'hello'
h@'world'
h"hello"
```

> [!NOTE]
> In many cases, only a part of the string literal is secret. 
> In those cases, split the literal into a non-secret part and a secret
> part. Then, only mark the secret part as obfuscated.

For example:

```kusto
print x="https://contoso.blob.core.windows.net/container/blob.txt?"
  h'sv=2012-02-12&se=2013-04-13T0...'
```

## Examples

### Simple string notation

```kusto
print s1 = 'some string', s2 = "some other string"
```

### Strings that include quotes

```
print s1 = 'string with " (double quotes)',
          s2 = "string with ' (single quotes)"
```

### Verbatim strings

```
print myPath1 = @'C:\Folder\filename.txt'
```

### Unicode notation within strings

```
print nonbreaking_space = "Hello\u00A0World"
```

### Escape with backslashes

print s = '\\n.*(>|\'|=|\")[a-zA-Z0-9/+]{86}=='

### Multi-line string

```
print program=```
  public class Program {
    public static void Main() {
      System.Console.WriteLine("Hello!");
    }
  }```

```

## See also

* [String operators](../datatypes-string-operators.md)
