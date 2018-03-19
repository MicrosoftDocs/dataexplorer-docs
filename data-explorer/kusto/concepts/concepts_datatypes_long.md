# The long data type

The `long` data type represents a signed, 64-bit wide, integer.

## long literals

Literals of the `long` data type are simply sequences of digits
with an optional sign prefix. Thus, `0`, `1024`, and `-398` are
all literals of type `long`.

The special form `long(null)` is the [null value](./concepts_datatypes_null.md).

Azure Log Analytics also supports hex literals (prefixed with '0x') - those are translated into long values:
0x0 (0), 0x1234 (4660), 0xfffffffffffffffe (-2)

* For converting long into hex string - see [tohex() function](../queryLanguage/query_language_tohexfunction.md).
