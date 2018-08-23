# string-size()

Returns the size, in bytes, of the input string.
		
**Syntax**

`string-size(`*source*`)`

**Arguments**

* *source*: The source string that will be measured for string size.

**Returns**

Returns the length, in bytes, of the input string.

**Examples**

<!-- csl -->
```
print string-size("hello")
```

|print-0|
|---|
|5|

<!-- csl -->
```
print string-size("⒦⒰⒮⒯⒪")
```

|print-0|
|---|
|15|
