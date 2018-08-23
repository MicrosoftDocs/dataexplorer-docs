# mvexpand operator

Expands multi-value collection(s) from a [dynamic](./scalar-data-types/dynamic.md)-typed column so that each value in the collection gets a separate row.
All the other column in an expanded row are duplicated. 

    T | mvexpand listColumn [, listColumn2 ...] 

(See also [`summarize makelist`](makelist-aggfunction.md) which performs the opposite function.)

**Example**

Assume the input table is:

|A:int|B:string|D:dynamic|D2:dynamic|
|---|---|---|---|
|1|"hello"|{"key":"value"}|{"key1":"value1", "key2":"value2"}|
|2|"world"|[0,1,"k","v"]|[2,3,"q"]|

<!-- csl -->
```
mvexpand D, D2
```

Result is:

|A:int|B:string|D:dynamic|D2:dynamic|
|---|---|---|---|
|1|"hello"|{"key":"value"}|{"key1":"value1"}|
|1|"hello"||{"key2":"value2"}|
|2|"world"|0|2|
|2|"world"|1|3|
|2|"world"|"k"|"q"|
|2|"world"|"v"||


**Syntax**

*T* `| mvexpand ` [`bagexpansion=`(`bag` | `array`)] *ColumnName* [`,` *ColumnName* ...] [`limit` *Rowlimit*]

*T* `| mvexpand ` [`bagexpansion=`(`bag` | `array`)] [*Name* `=`] *ArrayExpression* [`to typeof(`*Typename*`)`] [, [*Name* `=`] *ArrayExpression* [`to typeof(`*Typename*`)`] ...] [`limit` *Rowlimit*]

**Arguments**

* *ColumnName:* In the result, arrays in the named column are expanded to multiple rows. 
* *ArrayExpression:* An expression yielding an array. If this form is used, a new column is added and the existing one is preserved.
* *Name:* A name for the new column.
* *Typename:* Indicates the underlying type of the array's elements,
    which becomes the type of the column produced by the operator.
    Note that values in the array that do not conform to this type will
    not be converted; rather, they will take on a `null` value.
* *RowLimit:* The maximum number of rows generated from each original row. The default is 128.

**Returns**

Multiple rows for each of the values in any array in the named column or in the array expression.
If several columns or expressions are specified they are expanded in parallel so for each input row there will be as many output rows as there are elements in the longest expanded expression (shorter lists are padded with null's). If the value in a row is an empty array, the row expands to nothing (will not show in the result set). If the value in a row is not an array, the row is kept as is in the result set. 

The expanded column always has dynamic type. Use a cast such as `todatetime()` or `toint()` if you want to compute or aggregate values.

Two modes of property-bag expansions are supported:
* `bagexpansion=bag`: Property bags are expanded into single-entry property bags. This is the default expansion.
* `bagexpansion=array`: Property bags are expanded into two-element `[`*key*`,`*value*`]` array structures,
  allowing uniform access to keys and values (as well as, for example, running a distinct-count aggregation
  over property names). 

**See also**

See [bag-unpack()](/queryLanguage/bag-unpackplugin.md) plugin for expanding dynamic JSON objects into columns using property bag keys.

**Examples**

See [Chart count of live activites over time](./samples.md#concurrent-activities).
