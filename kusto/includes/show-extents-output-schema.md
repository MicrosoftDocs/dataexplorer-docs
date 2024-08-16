---
ms.topic: include
ms.date: 08/11/2024
---

| Name | Type | Description |
|--|--|--|
| ExtentId | `guid` | Globally unique identifier associated to the extent. |
| DatabaseName | `string` | Database that the extent belongs to. |
| TableName | `string` | Name of the table or the materialized part of the materialized view that the extent belongs to. |
| MaxCreatedOn | `datetime` | Date and time when the extent was created. For a merged extent, the maximum of creation times among source extents. |
| OriginalSize | double | Original size in bytes of the extent data. |
| ExtentSize | double | Size of the extent in memory (compressed + index). |
| CompressedSize | double | Compressed size of the extent data in memory. |
| IndexSize | double | Index size of the extent data. |
| Blocks | `long` | Number of data blocks in the extent. |
| Segments | `long` | Number of data segments in the extent. |
| ReservedSlot1 | `string` | For internal use only. |
| ReservedSlot2 | `string` | For internal use only. |
| ExtentContainerId | `string` | Identifier of the container the extent is stored in. |
| RowCount | `long` | Number of rows in the extent. |
| MinCreatedOn | `datetime` | Date and time when the extent was created. For a merged extent, the minimum of creation times among the source extents. |
| Tags | `string` | Tags, if any, defined for the extent. |
| Kind | `string` | Kind of the storage engine that created the extent |
| ReservedSlot3 | `string` | For internal use only. |
| DeletedRowCount | `long` | Number of deleted rows in the extent. |
