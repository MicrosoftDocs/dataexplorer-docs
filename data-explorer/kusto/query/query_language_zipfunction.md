# zip()

The `zip` function accepts any number of `dynamic` arrays, and returns an
array whose elements are each an array holding the elements of the input
arrays of the same index.

**Syntax**

`zip(`*array1*`,` *array2*`, ... )`

**Arguments**

Between 2 and 16 dynamic arrays.

**Examples**

The following example returns `[[1,2],[3,4],[5,6]]`:

<!-- csl -->
```
T 
|  zip([1,3,5], [2,4,6])
```

The following example returns `[["A",{}], [1,"B"], [1.5, null]]`:

<!-- csl -->
```
T 
| zip(["A", 1, 1.5], [{}, "B"])
```
