# sample operator

Returns up to the specified number of random rows from the input table.

     T | sample 5

**Syntax**

*T* `| sample`  *NumberOfRows*

**Arguments**
* *NumberOfRows*: The number of rows of *T* to return. You can specify any numeric expression.

**Tips**

* if you want to sample a certain percentage of your data (rather than a specified number of rows), you can use 


```
StormEvents | where rand() < 0.1

```

* If you want to sample keys rather than rows (for example - sample 100 user ids and get all rows for these user IDS) you can use [`sample-distinct`](./query_language_sampledistinctoperator.md) in combination with the `in` operator.

**Examples**  


```
StormEvents | sample 10

```
