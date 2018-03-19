# Null Values

All data types in Azure Log Analytics have a special value that represents a missing value.
This value is called the **null value**, or simply **null**.

## Comparing null to something

The null value does not compare equal to any other value of the data type,
including itself. (That is, `null == null` is false.) To determine if some
value is the null value, use the [isnull()](../queryLanguage/query_language_isnullfunction.md) function
and the [isnotnull()](../queryLanguage/query_language_isnotnullfunction.md) function.

## Binary operations on null

In general, null behaves in a "sticky" way around binary operators; a binary
operation between a null value and any other value (including another null value)
produces a null value.

## Data ingestion and null values

For most data types, a missing value in the data source produces a null value
in the corresponding table cell. An exception to that are columns of type
`string` and CSV-like ingestion, where a missing value produces an empty string.
So, for example, if we have: 

<!-- csl -->
```
.create table T [a:string, b:int]

.ingest inline into table T
[,]
[ , ]
[a,1]
```

Then:

|a     |b     |isnull(a)|isempty(a)|strlen(a)|isnull(b)|
|------|------|---------|----------|---------|---------|
|&nbsp;|&nbsp;|false    |true      |0        |true     |
|&nbsp;|&nbsp;|false    |false     |1        |true     |
|a     |1     |false    |false     |1        |false    |


> Azure Log Analytics does not offer a way to constrain a table's column from having null
  values (in other words, there's no equivalent to SQL's `NOT NULL` constraint).
