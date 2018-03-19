# table() (scope function)

References specific table using an query-time evaluated string-expression. 

    table('StormEvent')

**Syntax**

`table(`*stringExpression* [`,` *query_data_scope* ]`)`

**Arguments**

* *stringExpression*: Name of the table that is referenced.
* *query_data_scope*: An optional parameter that controls the tables's datascope -- whether the query applies to all data or just part of it. Possible values:
    - `"hotcache"`: Table scope is data that is covered by cache policy
    - `"all"`: Table scope is all data, hot or cold.
    - `"default"`: Table scope is default (cluster default policy)

## Examples

### Use table() to access table of the current database. 


```
table('StormEvent') | count
```

|Count|
|---|
|59066|

### Use table() inside let statements 

The same query as above can be rewritten to use inline function (let statement) that 
receives a parameter `tableName` - which is passed into the table() function.


```
let foo = (tableName:string)
{
    table(tableName) | count
};
foo('help')
```

|Count|
|---|
|59066|

### Use table() inside Functions 

The same query as above can be rewritten to be used in a function that 
receives a parameter `tableName` - which is passed into the table() function.

<!-- csl -->
```
.create function foo(tableName:string)
{
    table(tableName) | count
};
```


