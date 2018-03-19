# row_number()

Returns a row's number in the serialized row set - consecutive numbers starting from a given index or from 1 by default.
The row set is considered as serialized if it's a result of: sort / top / serialize / range operators 
optionally followed by project / project-away / extend / where / parse / mvexpand / take operators.

**Syntax**

`row_number()`

`row_number(start index)`

**Examples**
<!-- csl -->
```
Table | serialize | extend rn = row_number()
Table | serialize | extend rn = row_number(0)
Table | serialize rn = row_number()
```
