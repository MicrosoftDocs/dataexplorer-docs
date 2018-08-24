# project-rename operator

Renames columns in the result output.

    T | project-rename new-column-name = column-name

**Syntax**

*T* `| project-rename` *NewColumnName* = *ExistingColumnName* [`,` ...]

**Arguments**

* *T*: The input table.
* *NewColumnName:* The new name of a column. 
* *ExistingColumnName:* The existing name of a column. 

**Returns**

A table that has the columns in the same order as in an existing table, with columns renamed.


**Examples**

```kusto
print a='a', b='b', c='c'
|  project-rename new-b=b, new-a=a
```

|new-a|new-b|c|
|---|---|---|
|a|b|c|


