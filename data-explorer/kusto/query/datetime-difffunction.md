# datetime-diff()

Calculates calendarian difference between two [datetime](./scalar-data-types/datetime.md) values.

**Syntax**

`datetime-diff(`*period*`,`*datetime-1*`,`*datetime-2*`)`

**Arguments**

* `period`: `string`. 
* `datetime-1`: [datetime](./scalar-data-types/datetime.md) value.
* `datetime-2`: [datetime](./scalar-data-types/datetime.md) value.

Possible values of *period*: 
- Year
- Quarter
- Month
- Week
- Day
- Hour
- Minute
- Second
- Millisecond
- Microsecond
- Nanosecond

**Returns**

An integer, which represents amount of `periods` in the result of subtraction (`datetime-1` - `datetime-2`).

**Examples**

```kusto
print
year = datetime-diff('year',datetime(2017-01-01),datetime(2000-12-31)),
quarter = datetime-diff('quarter',datetime(2017-07-01),datetime(2017-03-30)),
month = datetime-diff('month',datetime(2017-01-01),datetime(2015-12-30)),
week = datetime-diff('week',datetime(2017-10-29 00:00),datetime(2017-09-30 23:59)),
day = datetime-diff('day',datetime(2017-10-29 00:00),datetime(2017-09-30 23:59)),
hour = datetime-diff('hour',datetime(2017-10-31 01:00),datetime(2017-10-30 23:59)),
minute = datetime-diff('minute',datetime(2017-10-30 23:05:01),datetime(2017-10-30 23:00:59)),
second = datetime-diff('second',datetime(2017-10-30 23:00:10.100),datetime(2017-10-30 23:00:00.900)),
millisecond = datetime-diff('millisecond',datetime(2017-10-30 23:00:00.200100),datetime(2017-10-30 23:00:00.100900)),
microsecond = datetime-diff('microsecond',datetime(2017-10-30 23:00:00.1009001),datetime(2017-10-30 23:00:00.1008009)),
nanosecond = datetime-diff('nanosecond',datetime(2017-10-30 23:00:00.0000000),datetime(2017-10-30 23:00:00.0000007))
```

|year|quarter|month|week|day|hour|minute|second|millisecond|microsecond|nanosecond|
|---|---|---|---|---|---|---|---|---|---|---|
|17|2|13|5|29|2|5|10|100|100|-700|






