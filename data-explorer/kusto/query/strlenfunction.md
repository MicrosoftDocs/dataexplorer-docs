# strlen()

Returns the length, in characters, of the input string.
	
**Syntax**

`strlen(`*source*`)`

**Arguments**

* *source*: The source string that will be measured for string length.

**Returns**

Returns the length, in characters, of the input string.

**Remarks**

Each Unicode character in the string is equal to `1`, including surrogates.
(e.g: Chinese charachters will be counted once despite the fact that it requires more than one value in UTF-8 encoding).


**Examples**

```kusto
print strlen("hello")
```

|print-0|
|---|
|5|

```kusto
print strlen("⒦⒰⒮⒯⒪")
```

|print-0|
|---|
|5|


