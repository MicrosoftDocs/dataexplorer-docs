# todecimal()

Converts input to decimal number representation.

    todecimal("123.45678") == decimal(123.45678)

**Syntax**

`todecimal(`*Expr*`)`

**Arguments**

* *Expr*: Expression that will be converted to decimal. 

**Returns**

If conversion is successful, result will be a decimal number.
If conversion is not successful, result will be `null`.
 
*Note*: Prefer using [real()](../concepts/concepts_datatypes_real.md) when possible.

<div class="warning">As of this writing, support for the `decimal` type is in beta testing mode.</div>