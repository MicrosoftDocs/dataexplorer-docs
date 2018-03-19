# prev()

For the serialized row set, returns a value of a specified column from the earlier row according to the offset. 
The row set is considered as serialized if it's a result of: sort / top / serialize / range operators 
optionally followed by project / project-away / extend / where / parse / mvexpand / take operators.

**Syntax**

`prev(column)`

`prev(column, offset)`

`prev(column, offset, default_value)`

**Arguments**

* `column`: the column to get the values from.

* `offset`: the offset to go back in rows. When no offset is specified a default offset 1 is used.

* `default_value`: the default value to be used when there is no previous rows to take the value from. When no default value is specified, null is used.


**Examples**
<!-- csl -->
```
Table | serialize | extend prevA = prev(A,1)
| extend diff = A - prevA
| where diff > 1

Table | serialize prevA = prev(A,1,10)
| extend diff = A - prevA
| where diff <= 10
```
