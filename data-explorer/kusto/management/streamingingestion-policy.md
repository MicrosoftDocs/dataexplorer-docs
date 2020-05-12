---
title: Kusto streaming ingestion policy management - Azure Data Explorer
description: This article describes Streaming ingestion policy management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/24/2020
---
# Streaming ingestion policy management

Streaming ingestion policy can be set on a table to allow streaming ingestion into this table. The policy can also be set on a database to apply the same setting to all its present and future tables.

For more information on streaming ingestion see [Streaming ingestion (preview)](../../ingest-data-streaming.md). To learn more about the streaming ingestion policy, see [Streaming ingestion policy](streamingingestionpolicy.md).

## Displaying the policy

The `.show policy streamingingestion` command shows the streaming ingestion policy of the database or table.

**Syntax**

`.show` `{database|table}` &lt;entity name&gt; `policy` `streamingingestion`

**Returns**

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|PolicyName|`string`|The policy name - StreamingIngestionPolicy
|EntityName|`string`|Database or table name
|Policy    |`string`|[streaming ingestion policy object](#streaming-ingestion-policy-object)

**Examples**

```kusto
.show database DB1 policy streamingingestion

.show table T1 policy streamingingestion
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|StreamingIngestionPolicy|DB1|{"IsEnabled": true, "HintAllocatedRate": null}

## Changing the policy

The `.alter[-merge] policy streamingingestion` family of commands provides means for modifying streaming ingestion policy of the database or table.

**Syntax**

1. `.alter` `{database|table}` &lt;entity name&gt; `policy` `streamingingestion` `[enable|disable]`

2. `.alter` `{database|table}` &lt;entity name&gt; `policy` `streamingingestion` &lt;[streaming ingestion policy object](#streaming-ingestion-policy-object)&gt;

3. `.alter-merge` `{database|table}` &lt;entity name&gt; `policy` `streamingingestion` &lt;[streaming ingestion policy object](#streaming-ingestion-policy-object)&gt;

### Remarks

1. Allows changing enabled/disabled state of streaming ingestion without modifying other properties of the policy (or setting them to default values if the policy was not previously defined on the entity).

2. Allows replacing the entire streaming ingestion policy on the entity. &lt;[streaming ingestion policy object](#streaming-ingestion-policy-object)&gt; must include all mandatory properties.

3. Allows replacing only specified properties of the streaming ingestion policy on the entity. &lt;[streaming ingestion policy object](#streaming-ingestion-policy-object)&gt; can include some or none of the mandatory properties.

**Returns**

The command modifies the table or database streamingingestion policy object and then returns the output of the corresponding [.show policy streamingingestion](#Displaying-the-policy)
command.

**Examples**

```kusto
.alter database DB1 policy streamingingestion enable

.alter table T1 policy streamingingestion disable

.alter database DB1 policy streamingingestion '{"IsEnabled": true, "HintAllocatedRate": 2.1}'

.alter table T1 streamingingestion '{"IsEnabled": true}'

.alter-merge database DB1 policy streamingingestion '{"IsEnabled": false}'

.alter-merge table T1 policy streamingingestion '{"HintAllocatedRate": 1.5}'
```

## Deleting the policy

The `.delete policy streamingingestion` command deletes the streamingingestion policy from the database or table.

**Syntax**

`.delete` `{database|table}` &lt;entity name&gt; `policy` `streamingingestion`

**Returns**

The command deletes the table or database streamingingestion policy object and then returns the output of the corresponding [.show policy streamingingestion](#Displaying-the-policy)
command.

**Examples**

```kusto
.delete database DB1 policy streamingingestion

.delete table T1 policy streamingingestion
```

### Streaming ingestion policy object
In input and output of management commands streaming ingestion policy object is a JSON-formatted string that includes the following properties
|Property  |Type    |Description                                                       |
|----------|--------|------------------------------------------------------------------|
|IsEnabled |`bool`  |Mandatory: Is streaming ingestion enabled for the entity|
|HintAllocatedRate|`double?`|Optional: estimated rate of data ingress in Gb/hour|
