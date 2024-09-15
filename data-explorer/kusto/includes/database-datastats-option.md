---
ms.topic: include
ms.date: 08/26/2024
---

|Output parameter |Type |Description|
|---|---|---|
|DatabaseName  | `string` |The name of the database. Database names are case-sensitive.|
|PersistentStorage  | `string` |The persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.)|
|Version  | `string` |Database version number. This number is updated for each change operation in the database (such as adding data and changing the schema).|
|IsCurrent  |`bool` |True if the database is the one that the current connection points to.|
|DatabaseAccessMode  | `string` |How the database is attached. For example, if the database is attached in ReadOnly mode, all requests to modify the database in any way fail. Options include `ReadWrite`, `ReadOnly`, `ReadOnlyFollowing`, or `ReadWriteEphemeral`. |
|PrettyName | `string` |The database pretty name, if any.|
|DatabaseId | `guid` |The database unique ID.|
|OriginalSize | `real` | The database extents total original size`*`.|
|ExtentSize | `real` | The database extents total size (data + indices)`*`.|
|CompressedSize | `real` | The database extents total data compressed size`*`.|
|IndexSize | `real` | The database extents total index size`*`.|
|RowCount | `long` | The database extents total row count`*`.|
|HotOriginalSize | `real` | The database hot extents total original size`*`.|
|HotExtentSize | `real` | The database hot extents total size (data + indices)`*`.|
|HotCompressedSize | `real` | The database hot extents total data compressed size`*`.|
|HotIndexSize | `real` | The database hot extents total index size`*`.|
|HotRowCount | `long` | The database hot extents total row count`*`.|
|TotalExtents| `long` | The database total extents`*`.|
|HotExtents| `long` | The database total hot extents`*`.|

`*` *Values can be up to 15 minutes old, as they're taken from a cached summary of the database extents.*
