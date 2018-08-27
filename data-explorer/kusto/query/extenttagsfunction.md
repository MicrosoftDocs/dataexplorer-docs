---
title: extent-tags() (Azure Kusto)
description: This article describes extent-tags() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# extent-tags()

Returns a dynamic array with the [tags](https://kusdoc2.azurewebsites.net/docs/concepts/concepts_extents.html#extent-tagging) of the data shard ("extent") that the current record resides in. 

Applying this function to calculated data which is not attached to a data shard returns an empty value.

**Syntax**

`extent-tags()`

**Returns**

A value of type `dynamic` that is an array holding the current record's extent tags,
or an empty value.

**Examples**

The following example shows how to get a list the tags of all the data shards
that have records from an hour ago with a specific value for the
column `ActivityId`. It demonstrates that some query operators (here,
the `where` operator, but this is also true for `extend` and `project`)
preserve the information about the data shard hosting the record.

```kusto
T
| where Timestamp > ago(1h)
| where ActivityId == 'dd0595d4-183e-494e-b88e-54c52fe90e5a'
| extend tags = extent-tags()
| summarize by tostring(tags)
```

The following example shows how to obtain a count of all records from the 
last hour, which are stored in extents which are tagged with the tag `MyTag`
(and potentially other tags), but not tagged with the tag `drop-by:MyOtherTag`.

```kusto
T
| where Timestamp > ago(1h)
| extend Tags = extent-tags()
| where Tags has-cs 'MyTag' and Tags !has-cs 'drop-by:MyOtherTag'
| count
```