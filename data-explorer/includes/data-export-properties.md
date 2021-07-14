---
author: orspod
ms.service: data-explorer
ms.topic: include
ms.date: 07/14/2021
ms.author: orspodek
---
|Property        |Type    |Description                                                                                                                |
|----------------|--------|---------------------------------------------------------------------------------------------------------------------------|
|`sizeLimit`     |`long`  |The size limit in bytes of a single storage artifact being written (prior to compression). Allowed range is 100MB (default) to 1GB.|
|`parquetRowGroupSize`|`int`  |Relevant only when data format is Parquet. Controls the row group size in the exported files. Default row group size is 100000 records.|
|`distributed`   |`bool`  |Disable/enable distributed export. Setting to false is equivalent to `single` distribution hint. Default is true.