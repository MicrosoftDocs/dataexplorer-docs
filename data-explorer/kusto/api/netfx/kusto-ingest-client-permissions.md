---
title: 'Kusto.Ingest reference, permissions - Azure Data Explorer'
description: This article describes Kusto.Ingest Reference - Ingestion Permissions in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# Kusto.Ingest Reference - Ingestion Permissions
This article explains what permissions to set up on your service, for `Native` ingestion to work.


## Prerequisites
* To view and modify authorization settings on Kusto services and databases, see [Kusto control commands](../../management/security-roles.md) 

## References
* The following AAD applications are used as sample principals in the examples below:
    * Test AAD App (2a904276-1234-5678-9012-66fc53add60b; microsoft.com)
    * Kusto Internal Ingestion AAD App (76263cdb-1234-5678-9012-545644e9c404; microsoft.com)

## Ingestion permission model for queued ingestion
This mode, defined in [IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient), limits the client code dependency on the Azure Data Explorer service. Ingestion is done by posting a Kusto ingestion message to an Azure queue. The queue is acquired from the Azure Data Explorer service. It'ss also known as the Ingestion service.  Any intermediate storage artifacts will be created by the ingest client using the resources allocated by the Azure Data Explorer service.

The following diagram outlines the queued ingestion client interaction with Kusto:<BR>

:::image type="content" source="../images/queued-ingest.jpg" alt-text="queued-ingest":::

### Permissions on the Engine Service
To qualify for data ingestion into table `T1` on database `DB1`, the principal doing the ingest operation must have authorization.
Minimal required permission levels are `Database Ingestor` and `Table Ingestor` that can ingest data into all existing tables in a database or into a specific existing table.
If table creation is required, `Database User` or a higher access role must also be assigned.


|Role |PrincipalType	|PrincipalDisplayName
|--------|------------|------------
|`Database Ingestor` |AAD Application |`Test App (app id: 2a904276-1234-5678-9012-66fc53add60b)`
|`Table Ingestor` |AAD Application |`Test App (app id: 2a904276-1234-5678-9012-66fc53add60b)`

>`Kusto Internal Ingestion AAD App (76263cdb-1234-5678-9012-545644e9c404)` principal, the Kusto internal Ingestion App, is immutably mapped to the `Cluster Admin` role and thus authorized to ingest data to any table. This is what's happening on the Kusto-managed ingestion pipelines.

Granting required permissions on database `DB1` or table `T1` to AAD App `Test App (2a904276-1234-5678-9012-66fc53add60b in AAD tenant microsoft.com)` would look like this:
```kusto
.add database DB1 ingestors ('aadapp=2a904276-1234-5678-9012-66fc53add60b;microsoft.com') 'Test AAD App'
.add table T1 ingestors ('aadapp=2a904276-1234-5678-9012-66fc53add60b;microsoft.com') 'Test AAD App'
```
