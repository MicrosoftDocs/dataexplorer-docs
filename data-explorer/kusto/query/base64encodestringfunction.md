# base64-encodestring()

Encodes a string as base64 string

**Syntax**

`base64-encodestring(`*String*`)`

**Arguments**

* *String*: Input string to be encoded as base64 string.


**Returns**

Returns the string encoded as base64 string.

**Example**

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```
range x from 1 to 1 step 1
| project base64-encodestring("Kusto")
```

|Column1|
|---|
|S3VzdG8=|

