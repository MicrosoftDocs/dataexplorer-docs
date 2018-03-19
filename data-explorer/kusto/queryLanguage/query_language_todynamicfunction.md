# todynamic(), toobject()

Interprets a `string` as a [JSON value](http://json.org/)) and returns the value as `dynamic`. 

It is superior to using [extractjson() function](./query_language_extractjsonfunction.md)
when you need to extract more than one element of a JSON compound object.

Aliases to [parsejson()](./query_language_parsejsonfunction.md) function.

**Syntax**

`todynamic(`*json*`)`
`toobject(`*json*`)`

**Arguments**

* *json*: A JSON document.

**Returns**

An object of type `dynamic` specified by *json*.

*Note*: Prefer using [dynamic()](../concepts/concepts_datatypes_dynamic.md) when possible.