# strrep()

Repeates given string provided amount of times (default - 1).

* In case if first argument is not of string type, it will be forcibly converted to string.

**Syntax**

`strrep(`*value*,*multiplier*`)`

**Arguments**

* *value*: input expression
* *multiplier*: an optional constant positive integer value (from 1 to 64)

**Returns**

Value repeated for a specified number of times.
 
**Example**

<!-- csl -->
```
print from_str = strrep('ABC', 2), from_int = strrep(123,3), from_time = strrep(3s,2)
```

|from_str|from_int|from_time|
|---|---|---|
|ABCABC|123123123|00:00:0300:00:03|