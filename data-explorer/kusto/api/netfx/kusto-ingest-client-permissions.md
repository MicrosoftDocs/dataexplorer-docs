---
title: Kusto.Ingest Reference - Ingestion Permissions - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto.Ingest Reference - Ingestion Permissions in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/13/2019

---
# Kusto.Ingest Reference - Ingestion Permissions
This article explains what permissions need to be set up on your service in order for `Native` ingestion to work.



## Prerequisites
* This article instructs how to use [Kusto control commands](../../management/security-roles.md) to view and modify authorization settings on Kusto services and databases
* The following AAD Applications are used as sample principals in examples below:
    * Test AAD App (2a904276-1234-5678-9012-66fc53add60b;microsoft.com)
    * Kusto Internal Ingestion AAD App (76263cdb-1234-5678-9012-545644e9c404;microsoft.com)

## Ingestion Permission Model for Queued Ingestion
Defined in [IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient), this mode limits the client code dependency on the Kusto service. Ingestion is performed by posting a Kusto ingestion message to an Azure queue, which, in turn is acquired from Kusto Data Management (a.k.a. Ingestion) service. Any intermediate storage artifacts will be created by the ingest client using the resources allocated by Kusto Data Management service.<BR>

The following diagram outlines the Queued ingestion client interaction with Kusto:<BR>

![alt text](../images/queued-ingest.jpg "queued-ingest")

### Permissions on the Engine Service
In order to qualify for data ingestion into table `T1` on database `DB1` the principal performing the ingest operation must be authorized for that.
Minimal required permission levels are `Database Ingestor` and `Table Ingestor` that can ingest data into all existing tables in a database or into a specific existing table, accordingly.
If table creation is required, `Database User` or a higher access role must also be assigned.


|Role |PrincipalType	|PrincipalDisplayName
|--------|------------|------------
|Database *** Ingestor |AAD Application |Test App (app id: 2a904276-1234-5678-9012-66fc53add60b)
|Table *** Ingestor |AAD Application |Test App (app id: 2a904276-1234-5678-9012-66fc53add60b)

>`Kusto Internal Ingestion AAD App (76263cdb-1234-5678-9012-545644e9c404)` principal (Kusto internal Ingestion App) is immutably mapped to the `Cluster Admin` role and thus authorized to ingest data to any table (that is what's happening on Kusto-managed ingestion pipelines).

Granting required permissions on database `DB1` or table `T1` to AAD App `Test App (2a904276-1234-5678-9012-66fc53add60b in AAD tenant microsoft.com)` would look as follows:
```kusto
.add database DB1 ingestors ('aadapp=2a904276-1234-5678-9012-66fc53add60b;microsoft.com') 'Test AAD App'
.add table T1 ingestors ('aadapp=2a904276-1234-5678-9012-66fc53add60b;microsoft.com') 'Test AAD App'
```

