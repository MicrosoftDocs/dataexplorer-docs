# base64_decodestring()

Decodes a base64 string to a UTF-8 string

**Syntax**

`base64_decodestring(`*String*`)`

**Arguments**

* *String*: Input string to be decoded from base64 to UTF8-8 string.

**Returns**

Returns UTF-8 string decoded from base64 string.

**Example**


```
range x from 1 to 1 step 1
| project base64_decodestring("QXp1cmU=")
```

|Column1|
|---|
|Azure|

Trying to decode a base64 string which was generated from invalid UTF-8 encoding will return null:


```
range x from 1 to 1 step 1
| project base64_decodestring("U3RyaW5n0KHR0tGA0L7Rh9C60LA=")
```

|Column1|
|---|
||
