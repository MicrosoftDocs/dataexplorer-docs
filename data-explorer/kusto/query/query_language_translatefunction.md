# translate()

Replaces a set of characters ('searchList') with another set of characters ('replacementList') in a given a string.
The function searches for characters in the 'searchList' and replaces them with the corresponding characters in 'replacementList'

**Syntax**

`translate(`*searchList*`,` *replacementList*,` *text*`)`

**Arguments**

* *searchList*: The list of characters that should be replaced
* *replacementList*: The list of characters that should replace the characters in 'searchList'
* *text*: A string to search

**Returns**

*text* after replacing all ocurrences of characters in 'replacementList' with the corresponding characters in 'searchList'

**Examples**

```
let a=translate("kasp", "euAz", "spark");
print a
// a == Azure
```

```
let a=translate("abc", "v", "abc");
print a
// a == vvv
```

```
let a=translate("abc", "", "ab");
print a
// a == ""
```