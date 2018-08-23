# isnull()

Evaluates its sole argument and returns a `bool` value indicating if the argument evaluates to a null value.

    isnull(parsejson("")) == true

**Syntax**

`isnull(`*Expr*`)`

**Returns**

True or false depending on the whether the value is null or not null.

**Comments**

* `string` values cannot be null. Use [isempty](./isemptyfunction.md)
  to determine if a value of type `string` is empty or not.

|x                |`isnull(x)`|
|-----------------|-----------|
|`""`             |`false`    |
|`"x"`            |`false`    |
|`parsejson("")`  |`true`     |
|`parsejson("[]")`|`false`    |
|`parsejson("{}")`|`false`    |

**Example**

<!-- csl -->
```
T | where isnull(PossiblyNull) | count
```
