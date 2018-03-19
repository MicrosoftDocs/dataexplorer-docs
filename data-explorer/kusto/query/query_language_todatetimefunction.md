# todatetime()

Converts input to datetime scalar.

    todatetime("2015-12-24") == datetime(2015-12-24)

**Syntax**

`todatetime(`*Expr*`)`

**Arguments**

* *Expr*: Expression that will be converted to datetime. 

**Returns**

If conversion is successful, result will be a datetime value.
If conversion is not successful, result will be null.
 
*Note*: Prefer using [datetime()](../concepts/concepts_datatypes_datetime.md) when possible.