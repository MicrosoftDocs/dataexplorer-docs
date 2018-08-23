# current-principal()

Returns the current principal running this query.

**Syntax**

`current-principal()`

**Returns**

The current principal FQN as a `string`.

**Example**

<!-- csl -->
```
.show queries | where Principal == current-principal()
```
