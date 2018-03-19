# hash_sha256()

Returns a sha256 hash value for the input value.

**Syntax**

`hash_sha256(`*source*`)`

**Arguments**

* *source*: The value to be hashed.

**Returns**

The sha256 hash value of the given scalar.

**Examples**

<!-- csl -->
```
hash_sha256("World")                   // 78ae647dc5544d227130a0682a51e30bc7777fbb6d8a8f17007463a3ecd1d524
hash_sha256(datetime("2015-01-01"))    // e7ef5635e188f5a36fafd3557d382bbd00f699bd22c671c3dea6d071eb59fbf8

```

The following example uses the hash_sha256 function to run a query on StartTime column of the data


```
StormEvents 
| where hash_sha256(StartTime) == 0
| summarize StormCount = count(), TypeOfStorms = dcount(EventType) by State 
| top 5 by StormCount desc
```
