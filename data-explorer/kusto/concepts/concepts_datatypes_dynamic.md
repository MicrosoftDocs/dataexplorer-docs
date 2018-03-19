# The dynamic data type

The `dynamic` (`object`) data type represents a JSON-like data type. A value of `dynamic`
type may hold:

* A value of any of the primitive Azure Log Analytics data types (`bool`, `datetime`, `guid`, `int`, `long`,
  `real`, `string`, and `timespan`)
* A 0-based, potentially empty, vector (array) of `dynamic` values
* A potentially empty property bag mapping unique `string` keys to `dynamic` values

> Size of dynamic object is limited to 1048576 bytes

> Unlike other Azure Log Analytics data types, queries that return values of the `dynamic` type serialize
  them as strings, as there's no standard for carrying an object of arbitrary type through
  .NET's `System.Data.IDataReader`. The serialized string is JSON-formatted. See [json.org](http://json.org/). 

## dynamic literals

The external representation of a `dynamic` value is JSON. A literal of type `dynamic`
wraps the actual JSON representation of the value by `dynamic(` and `)`:

<!-- csl -->
```
range x from 1 to 1 step 1
| project o=dynamic({"a":123, "b":"hello", "c":[1,2,3], "d":{}})
| extend a=o.a, b=o.b, c=o.c, d=o.d
```

To parse a `string` value that follows the JSON encoding rules into a `dynamic`
value, use the `parsejson` function. For example:

* `parsejson('[43, 21, 65]')` - an array of numbers
* `parsejson('{"name":"Alan", "age":21, "address":{"street":432,"postcode":"JLK32P"}}')` - a dictionary
* `parsejson('21')` - a single value of dynamic type containing a number
* `parsejson('"21"')` - a single value of dynamic type containing a string
* `parsejson('{"a":123, "b":"hello", "c":[1,2,3], "d":{}}')` - gives the same
   value as `o` in the example above.

> Note that, unlike JavaScript, JSON mandates the use of double-quotes (`"`) around
  strings. Therefore, it is generally easier to quote a JSON-encoded string literals by using
  a single-quote (`'`) character.
  
The following example shows how one might define a table that holds a `dynamic` column (as well as
a `datetime` column) and then ingest into it a single record. it also demonstrates how one
can encode JSON strings in CSV files:

<!-- csl -->
```
// dynamic is just like any other type:
.create table Logs (Timestamp:datetime, Trace:dynamic)

// Everything between the "[" and "]" is parsed as a CSV line would:
// 1. Since the JSON string includes double-quotes and commas (two characters
//    that have a special meaning in CSV), we must CSV-quote the entire second field.
// 2. CSV-quoting means adding double-quotes (") at the immediate beginning and end
//    of the field (no spaces allows before the first double-quote or after the second
//    double-quote!)
// 3. CSV-quoting also means doubling-up every instance of a double-quotes within
//    the contents
.ingest inline into table Logs
  [2015-01-01,"{""EventType"":""Demo"", ""EventValue"":""Double-quote love!""}"]
```

|Timestamp                   | Trace                                                 |
|----------------------------|-------------------------------------------------------|
|2015-01-01 00:00:00.0000000 | {"EventType":"Demo","EventValue":"Double-quote love!"}|

## Dynamic object accessors

To subscript a dictionary, use either the dot notation (`dict.key`) or the brackets notation (`dict["key"]`).
When the subscript is a string constant- both options are equivalent.

> Note: to use an expression as the subscript, use the brackets notation. When using arithmetic expressions, the expression inside the brackets must be wrapped in parenthesis.

In the examples below `dict` and `arr` are columns of dynamic type:

|Expression                        | Accessor expression type | Meaning                                                                              | Comments                                      |
|----------------------------------|--------------------------|--------------------------------------------------------------------------------------|-----------------------------------------------|
|dict[col]                         | Entity name (column)     | Subscripts a dictionary using the values of the column `col` as the key              | Column must be of type string                 | 
|arr[index]                        | Entity name (column)     | Subscripts an array using the values of the column `index` as the index              | Column must be of type integer or boolean     | 
|arr[toint(indexAsString)]         | Function call            | Casts the values of column `indexAsString` to int and use them to subscript an array |                                               |
|arr[`(`arraylength(arr) - 1`)`]   | Arithmetic operation     | Retrieves the last value in the array                                                |                                               |
|dict[['where']]                   | Keyword used as entity name (column) | Subscripts a dictionary using the values of column `where` as the key    | Entity names that are identical to some query language keywords must be quoted | 
|dict.['where'] or dict['where']   | Constant                 | Subscripts a dictionary using `where` string as the key                              |                                               |

**Performance tip:** Prefer to use constant subscripts when possible


## Casting dynamic objects

> After subscripting a dynamic object, you must cast the value to a simple type.

|Expression | Value | Type|
|---|---|---|
| X | parsejson('[100,101,102]')| array|
|X[0]|parsejson('100')|dynamic|
|toint(X[1])|101| int|
| Y | parsejson('{"a1":100, "a b c":"2015-01-01"}')| dictionary|
|Y.a1|parsejson('100')|dynamic|
|Y["a b c"]| parsejson("2015-01-01")|dynamic|
|todate(Y["a b c"])|datetime(2015-01-01)| datetime|

Cast functions are:

* `tolong()`
* `todouble()`
* `todatetime()`
* `totimespan()`
* `tostring()`
* `toguid()`
* `todynamic()`

## Operators and functions over dynamic types

|||
|---|---|
| *value* `in` *array*| True if there is an element of *array* that == *value*<br/>`where City in ('London', 'Paris', 'Rome')`
| *value* `!in` *array*| True if there is no element of *array* that == *value*
|[`arraylength(`array`)`](#arraylength)| Null if it isn't an array
|[`extractjson(`path,object`)`](#extractjson)|Uses path to navigate into object.
|[`parsejson(`source`)`](#parsejson)| Turns a JSON string into a dynamic object.
|[`range(`from,to,step`)`](#range)| An array of values
|[`mvexpand` listColumn](../queryLanguage/query_language_mvexpandoperator.md) | Replicates a row for each value in a list in a specified cell.
|[`summarize buildschema(`column`)`](../queryLanguage/query_language_buildschema_aggfunction.md) |Infers the type schema from column content
|[`summarize makelist(`column`)` ](../queryLanguage/query_language_makelist_aggfunction.md)| Flattens groups of rows and puts the values of the column in an array.
|[`summarize makeset(`column`)`](../queryLanguage/query_language_makeset_aggfunction.md) | Flattens groups of rows and puts the values of the column in an array, without duplication.

