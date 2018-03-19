# The string data type

The `string` data type represents a Unicode string. (Azure Log Analytics strings are encoded in UTF-8 and by default are limited to 1MB.)

## string literals

There are several ways to encode literals of the `string` data type:
* By enclosing the string in double-quotes (`"`): `"This is a string literal. Single quote characters (') do not require escaping. Double quote characters (\") are escaped by a backslash (\\)"`
* By enclosing the string in single-quotes (`'`): `'Another string literal. Single quote characters (\') require escaping by a backslash (\\). Double quote characters (") do not require escaping.'`

In the two representations above, the backslash (`\`) character indicates escaping.
It is used to escapte the encloding quote characters, tab characters (`\t`),
newline characters (`\n`), and itself (`\\`).

Verbatim string literals are also supported. In this form, the backslash character (`\`) stands for itself,
not as an escape character:

* Enclosed in double-quotes (`"`): `@"This is a verbatim string literal that ends with a backslash\"`
* Enclosed in single-quotes (`'`): `@'This is a verbatim string literal that ends with a backslash\'`

String literals that follow each other in the query text are automatically
concatenated together. For example, the following yields `13`:

<!-- csl -->
```
print strlen("Hello" ', ' @"world!")
```

## Examples

<!-- csl -->
```
// Simple string notation
range x from 1 to 1 step 1 
| project s1 = 'some string', s2 = "some other string"

// Strings that include singl- or double-quotes can be defined as next 
range x from 1 to 1 step 1 
| project s1 = 'string with " (double quotes)', 
          s2 = "string with ' (single quotes)"
          
// Strings with '\' can be prefixed with '@' (as in c#)
range x from 1 to 1 step 1
| project myPath1 = @'C:\Folder\filename.txt'

// Escaping using '\' notation
range x from 1 to 1 step 1 | project s = '\\n.*(>|\'|=|\")[a-zA-Z0-9/+]{86}=='
```

As can be seen, when a string is enclosed in double-quotes (`"`), the single-quote (`'`)
character does not require escaping and vice-versa. This makes it easier to quote strings
according to context.

## Obfuscated string literals

Obfuscated string literals are strings that Azure Log Analytics will remove when outputting the string (for example, when tracing).
The obfuscation process replaces all obfuscated characters by a star (`*`) character.

To form an obfuscated string literal, prepend `h` or 'H'. For example:
<!-- csl -->
```
h'hello'
h@'world' 
h"hello"
```

