## getmonth

Get the month number (1-12) from a datetime.

**Example**

```kusto
T 
| extend month = getmonth(datetime(2015-10-12))
// month == 10
```
   


