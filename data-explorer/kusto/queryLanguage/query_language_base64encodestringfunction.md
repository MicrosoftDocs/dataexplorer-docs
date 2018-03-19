# base64_encodestring()

Encodes a string as base64 string

**Syntax**

`base64_encodestring(`*String*`)`

**Arguments**

* *String*: Input string to be encoded as base64 string.


**Returns**

Returns the string encoded as base64 string.

**Example**


```
range x from 1 to 1 step 1
| project base64_encodestring("Azure")
```

|Column1|
|---|
|QXp1cmU=|

