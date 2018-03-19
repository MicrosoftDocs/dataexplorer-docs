# Data types

In Azure Log Analytics, each column, expression, and parameter has a related data type.
A data type is an attribute that specifies the type of the data that the
object can hold: integer data, text (string) data, date and time data, and so on.

Azure Log Analytics supplies a set of system data types that define all valid types of data.

> User-defined data types are not supported in Azure Log Analytics.

The following table lists the data types supported by Azure Log Analytics, alongside
additional aliases one can use to refer to them and a roughly equivalent
.NET Framework type.

| Type       | Additional name(s)   | Equivalent .NET type | gettype()   |Storage Type (internal name)|
| ---------- | -------------------- | -------------------- | ----------- |------------|
| `bool`     | `boolean`            | `System.Boolean`     | `int8`      |`I8`|
| `datetime` | `date`               | `System.DateTime`    | `datetime`  |`DateTime`|
| `dynamic`  |                      | `System.Object`      | `array` or `dictionary` or any of the other values |`Dynamic`|
| `guid`     | `uuid`, `uniqueid`   | `System.Guid`        | `guid`      |`UniqueId`|
| `int`      |                      | `System.Int32`       | `int`       |`I32`|
| `long`     |                      | `System.Int64`       | `long`      |`I64`|
| `real`     | `double`             | `System.Double`      | `real`      |`R64`|
| `string`   |                      | `System.String`      | `string`    |`StringBuffer`|
| `timespan` | `time`               | `System.TimeSpan`    | `timespan`  |`TimeSpan`|

All data types include a special "null" value, which represents the lack of data
or a mismatch of data. (For example, attempting to ingest the string `"abc"`
into an `int` column results in this value.)
It is not possible to materialize this value explicitly, but one can detect
whether an expression evaluates to this value by using the `isnull()` function. 

<div class="warning">As of this writing, support for the `guid` type is
incomplete. We strongly recommend that teams use values of type `string`
instead.</div>
