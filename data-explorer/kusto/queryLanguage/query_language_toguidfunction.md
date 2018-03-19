# toguid()

Converts input to `guid` representation.

    toguid("70fc66f7-8279-44fc-9092-d364d70fce44") == guid("70fc66f7-8279-44fc-9092-d364d70fce44")

**Syntax**

`toguid(`*Expr*`)`

**Arguments**

* *Expr*: Expression that will be converted to `guid` scalar. 

**Returns**

If conversion is successful, result will be a `guid` scalar.
If conversion is not successful, result will be `null`.

*Note*: Prefer using [guid()](../concepts/concepts_datatypes_guid.md) when possible.