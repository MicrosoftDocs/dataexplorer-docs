# parse_url()

Parses an absolute URL `string` and returns a `dynamic` object contains all parts of the URL (Scheme, Host, Port, Path, Username, Password, Query Parameters, Fragment).

**Syntax**

`parse_url(`*url*`)`

**Arguments**

* *url*: A string represents a URL or the query part of the URL.

**Returns**

An object of type `dynamic` that inculded the URL components as listed above.

**Example**

<!-- csl -->
```
T | extend Result = parse_url("scheme://username:password@host:1234/this/is/a/path?k1=v1&k2=v2#fragment")
```

will result

```
 {
 	"Scheme":"scheme",
 	"Host":"host",
 	"Port":"1234",
 	"Path":"this/is/a/path",
 	"Username":"username",
 	"Password":"password",
 	"Query Parameters":"{"k1":"v1", "k2":"v2"}",
 	"Fragment":"fragment"
 }
```