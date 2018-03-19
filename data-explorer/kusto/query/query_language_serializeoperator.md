# serialize operator 

Makes the row set serialized to allow activating on it functions that can be performed on serilaized data only, e.g. [row_number()](query_language_rownumberfunction.md).

    T | serialize

**Alias**

`serialize`


**Example**

<!-- csl -->
```
Traces
| where ActivityId == "479671d99b7b"
| serialize

Traces
| where ActivityId == "479671d99b7b"
| serialize rn = row_number()
```

