# current-principal()

Returns the current principal running this query.

**Syntax**

`current-principal()`

**Returns**

The current principal FQN as a `string`.

**Example**

```kusto
.show queries | where Principal == current-principal()
```


