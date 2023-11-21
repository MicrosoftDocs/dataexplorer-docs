---
title:  Extent tags retention policy
description: This article describes extent tags retention policies in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 07/01/2021
---
# Extent tags retention policy

The extent tags retention policy controls the mechanism that automatically removes [extent tags](extent-tags.md) from tables, based on the age of the extents.

It's recommended to remove any tags that are no longer helpful, or were used temporarily as part of an ingestion pipeline, and may limit the system from reaching optimal performance. For example: old `drop-by:` tags, which prevent merging extents together.

The policy can be set at the table-level, or at the database-level. A database-level policy applies to all tables in the database that don't override the policy.

> [!NOTE]
> The deletion time is imprecise. The system guarantees that tags won't be deleted before the limit is exceeded, but deletion isn't immediate following that point.

## The policy object

The extent tags retention policy is an array of policy objects. Each object includes the following properties:

Property name | Type | Description | Example
|---|---|---|---|
| **TagPrefix**|  `string` | The prefix of the tags to be automatically deleted, once `RetentionPeriod` is exceeded. The prefix must include a colon (`:`) as its final character, and may only include one colon. | `drop-by:`, `ingest-by:`, `custom_prefix:`|
| **RetentionPeriod** | `timespan`| The duration for which it's guaranteed that the tags aren't dropped. This period is measured starting from the extent's creation time. | `1.00:00:00` |

### Example

The following policy will have any `drop-by:` tags older than three days and any `ingest-by:` tags older than two hours automatically dropped:

```json
[
    {
        "TagPrefix": "drop-by:",
        "RetentionPeriod": "3.00:00:00"
    },
    {
        "TagPrefix": "ingest-by:",
        "RetentionPeriod": "02:00:00"
    }
]
```

## Defaults

By default, when the policy isn't defined, extent tags of any kind are retained as long as the extent isn't dropped.

## Management commands

The following management commands can be used to manage the extent tags retention policy:

* [.show extent tags retention policy](show-extent-tags-retention-policy.md)
* [.alter extent tags retention policy](alter-extent-tags-retention-policy.md)
* [.delete extent tags retention policy](delete-extent-tags-retention-policy.md)
