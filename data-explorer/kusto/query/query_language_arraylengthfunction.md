# array_length()

Calculates the number of elements in a dynamic array.

**Syntax**

`array_length(`*array*`)`

**Arguments**

* *array*: A `dynamic` value.

**Returns**

The number of elements in *array*, or `null` if *array* is not an array.

**Examples**

<!-- csl -->
```
print array_length(parsejson('[1, 2, 3, "four"]')) == 4

print array_length(parsejson('[8]')) == 1

print array_length(parsejson('[{}]')) == 1

print array_length(parsejson('[]')) == 0

print array_length(parsejson('{}')) == null

print array_length(parsejson('21')) == null
```
