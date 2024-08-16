---
title:  The dynamic data type
description: This article describes The dynamic data type in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/29/2024
---
# The dynamic data type

The `dynamic` scalar data type can be any of the following values:

* An array of `dynamic` values, holding zero or more values with zero-based indexing.
* A property bag that maps unique `string` values to `dynamic` values. The property bag has zero or more such mappings (called "slots"), indexed by the unique `string` values. The slots are unordered.
* A value of any of the primitive scalar data types: `bool`, `datetime`, `guid`, `int`, `long`, `real`, `string`, and `timespan`.
* Null. For more information, see [Null values](null-values.md).

> [!NOTE]
>
> * Values of type `dynamic` are limited to 1MB (2^20), uncompressed. If a cell value in a record exceeds 1MB, the value is dropped and ingestion succeeds. You can increase the `MaxValueSize` of the column by changing its [encoding policy](../../management/alter-encoding-policy.md).
> * Although the `dynamic` type appears JSON-like, it can hold values that the JSON model doesn't represent because they don't exist in JSON (e.g. `long`, `real`, `datetime`, `timespan`, and `guid`). Therefore, in serializing `dynamic` values into a JSON representation, values that JSON can't represent are serialized into `string` values. Conversely, Kusto will parse strings as strongly-typed values if they can be parsed as such. This applies to `datetime`, `real`, `long`, and `guid` types. For more information on the JSON object model, see [json.org](https://json.org/).
> * Kusto doesn't attempt to preserve the order of name-to-value mappings in a property bag, and so you can't assume the order to be preserved. It's entirely possible for two property bags with the same set of mappings to yield different results when they are represented as `string` values, for example.

## Dynamic literals

To specify a `dynamic` literal, use one of the following syntax options:

|Syntax|Description|Example|
|--|--|--|
|`dynamic([`*value* [`,` ...]`])`|An array of dynamic or other scalar literals.|`dynamic([1, 2, "hello"])`|
|`dynamic({`*key* `=` *value* [`,` ...]`})`|A property bag, or object. The value for a key can be a nested property bag.|`dynamic({"a":1, "b":{"a":2}})`|
|`dynamic(`*value*`)`|A dynamic value holding the value of the inner scalar data type.|`dynamic(4)`|
|`dynamic(null)`|Represents the [null value](null-values.md). | |

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Dynamic object accessors

To subscript a dictionary, use either the dot notation (`dict.key`) or the brackets notation (`dict["key"]`). When the subscript is a string constant, both options are equivalent.

> [!NOTE]
> To use an expression as the subscript, use the brackets notation. When using arithmetic expressions, the expression inside the brackets must be wrapped in parentheses.

In the examples below `dict` and `arr` are columns of dynamic type:

|Expression                        | Accessor expression type | Meaning                                                                              | Comments                                      |
|----------------------------------|--------------------------|--------------------------------------------------------------------------------------|-----------------------------------------------|
|dict[col]                         | Entity name (column)     | Subscripts a dictionary using the values of the column `col` as the key              | Column must be of type string                 |
|arr[index]                        | Entity index (column)    | Subscripts an array using the values of the column `index` as the index              | Column must be of type integer or boolean     |
|arr[-index]                       | Entity index (column)    | Retrieves the 'index'-th value from the end of the array                             | Column must be of type integer or boolean     |
|arr[(-1)]                         | Entity index             | Retrieves the last value in the array                                                |                                               |
|arr[toint(indexAsString)]         | Function call            | Casts the values of column `indexAsString` to int and use them to subscript an array |                                               |
|dict[['where']]                   | Keyword used as entity name (column) | Subscripts a dictionary using the values of column `where` as the key    | Entity names that are identical to some query language keywords must be quoted |
|dict.['where'] or dict['where']   | Constant                 | Subscripts a dictionary using `where` string as the key                              |                                               |

> [!TIP]
> We recommend using constant subscripts when possible.

Accessing a sub-object of a `dynamic` value yields another `dynamic` value, even if the sub-object has a different underlying type. Use the `gettype` function to discover the actual underlying type of the value, and any of the cast function listed below to cast it to the actual type.

## Casting dynamic objects

After subscripting a dynamic object, you must cast the value to a simple type.

|Expression | Value | Type|
|---|---|---|
| X | parse_json('[100,101,102]')| array|
|X[0]|parse_json('100')| `dynamic` |
|toint(X[1])|101| `int` |
| Y | parse_json('{"a1":100, "a b c":"2015-01-01"}')| dictionary|
|Y.a1|parse_json('100')| `dynamic` |
|Y["a b c"]| parse_json("2015-01-01")| `dynamic` |
|todate(Y["a b c"])|datetime(2015-01-01)| `datetime` |

Cast functions are:

* `tolong()`
* `todouble()`
* `todatetime()`
* `totimespan()`
* `tostring()`
* `toguid()`
* `parse_json()`

## Building dynamic objects

Several functions enable you to create new `dynamic` objects:

* [bag_pack()](../packfunction.md) creates a property bag from name/value pairs.
* [pack_array()](../pack-array-function.md) creates an array from list of values (can be list of columns, for each row it will create an array from the specified columns).
* [range()](../range-function.md) creates an array with an arithmetic series of numbers.
* [zip()](../zip-function.md) pairs "parallel" values from two arrays into a single array.
* [repeat()](../repeat-function.md) creates an array with a repeated value.

Additionally, there are several aggregate functions which create `dynamic`
arrays to hold aggregated values:

* [buildschema()](../buildschema-aggregation-function.md) returns the aggregate schema of multiple `dynamic` values.
* [make_bag()](../make-bag-aggregation-function.md) returns a property bag of dynamic values within the group.
* [make_bag_if()](../make-bag-if-aggregation-function.md) returns a property bag of dynamic values within the group (with a predicate).
* [make_list()](../make-list-aggregation-function.md) returns an array holding all values, in sequence.
* [make_list_if()](../make-list-if-aggregation-function.md) returns an array holding all values, in sequence (with a predicate).
* [make_list_with_nulls()](../make-list-with-nulls-aggregation-function.md) returns an array holding all values, in sequence, including null values.
* [make_set()](../make-set-aggregation-function.md) returns an array holding all unique values.
* [make_set_if()](../make-set-if-aggregation-function.md) returns an array holding all unique values (with a predicate).

## Operators and functions over dynamic types

For a complete list of scalar dynamic/array functions, see [dynamic/array functions](../scalar-functions.md#dynamicarray-functions).

|Operator or function|Usage with dynamic data types|
|---|---|
| *value* `in` *array*| True if there's an element of *array* that == *value* <br/> `where City in ('London', 'Paris', 'Rome')`|
| *value* `!in` *array*| True if there's no element of *array* that == *value*|
|[`array_length(`array`)`](../array-length-function.md)| Null if it isn't an array|
|[`bag_has_key(`bag`,`key`)`](../bag-has-key-function.md)| Checks whether a dynamic bag column contains a given key. |
|[`bag_keys(`bag`)`](../bag-keys-function.md)| Enumerates all the root keys in a dynamic property-bag object. |
|[`bag_merge(`bag1,...,bagN`)`](../bag-merge-function.md)| Merges dynamic property-bags into a dynamic property-bag with all properties merged. |
|[`bag_set_key(`bag,key,value`)`](../bag-set-key-function.md)| Sets a given key to a given value in a dynamic property-bag. |
|[`extract_json`(path,object), `extract_json(`path,object`)`](../extract-json-function.md)|Use path to navigate into object. |
|[`parse_json(`source`)`](../parse-json-function.md)| Turns a JSON string into a dynamic object. |
|[`range(`from,to,step`)`](../range-function.md)| An array of values. |
|[`mv-expand` listColumn](../mv-expand-operator.md) | Replicates a row for each value in a list in a specified cell. |
|[`summarize buildschema(`column`)`](../buildschema-aggregation-function.md) |Infers the type schema from column content. |
|[`summarize make_bag(`column`)`](../make-bag-aggregation-function.md) | Merges the property bag (dictionary) values in the column into one property bag, without key duplication. |
|[`summarize make_bag_if(`column,predicate`)`](../make-bag-if-aggregation-function.md) | Merges the property bag (dictionary) values in the column into one property bag, without key duplication (with predicate). |
|[`summarize make_list(`column`)`](../make-list-aggregation-function.md)| Flattens groups of rows and puts the values of the column in an array. |
|[`summarize make_list_if(`column,predicate`)`](../make-list-if-aggregation-function.md)| Flattens groups of rows and puts the values of the column in an array (with predicate). |
|[`summarize make_list_with_nulls(`column`)`](../make-list-with-nulls-aggregation-function.md)| Flattens groups of rows and puts the values of the column in an array, including null values. |
|[`summarize make_set(`column`)`](../make-set-aggregation-function.md) | Flattens groups of rows and puts the values of the column in an array, without duplication. |

## Indexing for dynamic data

Every field is indexed during data ingestion. The scope of the index is a single data shard.

To index dynamic columns, the ingestion process enumerates all “atomic” elements within the dynamic value (property names, values, array elements) and forwards them to the index builder. Otherwise, dynamic fields have the same inverted term index as string fields.

## Examples

### Dynamic property bag

The following query creates a dynamic property bag.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc9rf7q4d68qcw5sk2d6f.northeurope/databases/MyDatabase?query=H4sIAAAAAAAAAw3HsQqAIBAA0D3oH46bCo4g3QS%2FJBrUExJMIxoK69%2B76fGOM5ULquWnuD2FoaFDMytNgB4NbjHnipKAZplJkV4ljKZ939h3L8T7ioXB2To5Ai94giAEAhb4B3199sBhAAAA" target="_blank">Run the query</a>

```kusto
print o=dynamic({"a":123, "b":"hello", "c":[1,2,3], "d":{}})
| extend a=o.a, b=o.b, c=o.c, d=o.d
```

For convenience, `dynamic` literals that appear in the query text itself may also include other Kusto literals with types: `datetime`, `timespan`, `real`, `long`, `guid`, `bool`, and `dynamic`.
This extension over JSON isn't available when parsing strings (such as when using the `parse_json` function or when ingesting data), but it enables you to do the following:

```kusto
print d=dynamic({"a": datetime(1970-05-11)})
```

To parse a `string` value that follows the JSON encoding rules into a `dynamic`
value, use the `parse_json` function. For example:

* `parse_json('[43, 21, 65]')` - an array of numbers
* `parse_json('{"name":"Alan", "age":21, "address":{"street":432,"postcode":"JLK32P"}}')` - a dictionary
* `parse_json('21')` - a single value of dynamic type containing a number
* `parse_json('"21"')` - a single value of dynamic type containing a string
* `parse_json('{"a":123, "b":"hello", "c":[1,2,3], "d":{}}')` - gives the same value as `o` in the example above.

> [!NOTE]
> Unlike JavaScript, JSON requires the use of double-quote (`"`) characters around strings and property-bag property names. Therefore, it is generally easier to quote a JSON-encoded string literal by using a single-quote (`'`) character.

### Ingest data into dynamic columns

The following example shows how you can define a table that holds a `dynamic` column (as well as a `datetime` column) and then ingest single record into it. It also demonstrates how you can encode JSON strings in CSV files.

```kusto
// dynamic is just like any other type:
.create table Logs (Timestamp:datetime, Trace:dynamic)

// Everything between the "[" and "]" is parsed as a CSV line would be:
// 1. Since the JSON string includes double-quotes and commas (two characters
//    that have a special meaning in CSV), we must CSV-quote the entire second field.
// 2. CSV-quoting means adding double-quotes (") at the immediate beginning and end
//    of the field (no spaces allowed before the first double-quote or after the second
//    double-quote!)
// 3. CSV-quoting also means doubling-up every instance of a double-quotes within
//    the contents.

.ingest inline into table Logs
  [2015-01-01,"{""EventType"":""Demo"", ""EventValue"":""Double-quote love!""}"]
```

**Output**

|Timestamp                   | Trace                                                 |
|----------------------------|-------------------------------------------------------|
|2015-01-01 00:00:00.0000000 | {"EventType":"Demo","EventValue":"Double-quote love!"}|

## Related content

* For an example on how to query using dynamic objects and object accessors, see [Map values from one set to another](../tutorials/learn-common-operators.md#map-values-from-one-set-to-another).
