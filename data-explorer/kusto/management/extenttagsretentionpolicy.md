---
title: Kusto extent tags retention policy - Azure Data Explorer
description: This article describes extent tags retention policies in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 07/01/2021
---
# Extent tags retention policy

The extent tags retention policy controls the mechanism that automatically removes [extent tags](extents-overview.md#extent-tagging) from tables, based on the age of the extents.

It's recommended to remove any tags that are no longer helpful, were used temporarily as part of an ingestion pipeline, and may limit the system from reaching optimal performance
  * For example: old `drop-by:` tags, which prevent merging extents together.

The policy can be set at the table-level, or at the database-level. A database-level policy applies to all tables in the database that don't override it.

> [!NOTE]
> * The deletion time is imprecise. The system guarantees that tags won't be deleted before the limit is exceeded, but deletion isn't immediate following that point.

## The policy object

The extent tags retention policy is an array of policy objects, each includes the following properties:

* **TagPrefix**: `string`
    * The prefix of the tags to be automatically deleted, once `RetentionPeriod` is exceeded.
	* The prefix must include a colon (`:`) as its final character, and may only include one colon.
    * Examples: `drop-by:`, `ingest-by:`, `custom_prefix:`.
* **RetentionPeriod**: `timespan`
    * The duration for which it's guaranteed that the tags aren't dropped.
	* Measured starting from the extent's creation time.

### Example

The following policy will have any `drop-by:` tags older than one week and any `ingest-by:` tags older than one day automatically dropped:

```json
[
    {
        "TaxPrefix": "drop-by:",
        "RetentionPeriod": "7.00:00:00"
    },
    {
        "TaxPrefix": "ingest-by:",
        "RetentionPeriod": "1.00:00:00"
    }
]
```

## Defaults

By default, when the policy isn't defined, extent tags of any kind are retained as long as the extent isn't dropped.

## Control commands

Commands for managing the extent tags retention policy can be found [here](extent-tags-retention-policy.md).

