# parse-urlquery()

Parses a url query `string` and returns a [`dynamic`](./scalar-data-types/dynamic.md) object contains the Query parameters.

**Syntax**

`parse-urlquery(`*query*`)`

**Arguments**

* *query*: A string represents a url query.

**Returns**

An object of type `dynamic` that includes the query parameters.

**Example**

<!-- csl -->
```
parse-urlquery("k1=v1&k2=v2&k3=v3")
```

will result:

```
 {
 	"Query Parameters":"{"k1":"v1", "k2":"v2", "k3":"v3"}",
 }
```

**Notes**

* Input format should follow URL query standards (key=value& ...)
 
