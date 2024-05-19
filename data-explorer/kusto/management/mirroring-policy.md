---
title: Mirroring policy
description: Learn how to use the mirroring policy.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 05/21/2024
---
# Mirroring policy

The Mirroring policy commands allow you to view, change and partition, and delete your table mirroring policy and mirroring file partition. They also provide a way to check the mirroring latency by reviewing the operations mirroring status.

## Management commands

* Use [.show table policy mirroring command](show-table-mirroring-policy-command.md) to show the current mirroring policy of the table.
* Use [.alter-merge table policy mirroring command](alter-merge-mirroring-policy-command.md) to change the current mirroring policy.
* Use [.delete table policy mirroring command](delete-table-mirroring-policy-command.md) to soft-delete the current mirroring policy.
* Use [.show table mirroring operations command](show-table-mirroring-operations-command.md) to check operations mirroring status.

## The policy object

The mirroring policy includes the following properties:

| Property | Description | Values | Default|
|---|---|---|---|
| **Format** | The format of your mirrored files. | Valid value is `parquet`. | `parquet` |
| **MirroringMaxLatencyMinutes** | The maximum amount of time in minutes between the last and next time new data was added to your mirrored files. | A positive integer. | |
|  **IsEnabled** | Determines whether the mirroring policy is enabled. When the mirroring policy is disabled and set to `false`, the underlying mirroring data is retained in the database but is considered inactive. | `true`, `false`, `null`. | `null` |
| **"Partitions** | A comma-separated list of columns used to divide the data into smaller partitions. *PartitionName* must be a case insensitive unique string both among other partition names and the column names of the mirrored table. See [Partitions formatting](external-tables-azure-storage.md#partitions-formatting).| | |

## Example policy

```json
{
  "Format": "parquet",
  "MirroringMaxLatencyMinutes": null,
  "IsEnabled": true,
  "Partitions": null,
}

```
