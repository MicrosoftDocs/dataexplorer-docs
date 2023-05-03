---
title:  Kusto.Ingest permissions
description: This article describes Kusto.Ingest - Ingestion Permissions in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/19/2023
---
# Kusto.Ingest ingestion permissions

This article explains what permissions to set up on your service for `Native` ingestion to work.

## Prerequisites

* To view and modify authorization settings, see [Security roles overview](../../management/security-roles.md).

* Azure Active Directory (Azure AD) applications used as sample principals in the following examples:
    * Test Azure AD App (2a904276-1234-5678-9012-66fc53add60b; microsoft.com)
    * Kusto Internal Ingestion Azure AD App (76263cdb-1234-5678-9012-545644e9c404; microsoft.com)
 
## Ingestion permission mode for queued ingestion

Ingestion permission mode is defined in [IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient). This mode limits the client code dependency on the engine service. In this mode, an ingestion message is sent to an Azure queue. The queue, also known as the ingestion service, is received from the engine service.  The ingest client generates intermediate storage artifacts utilizing the resources allocated by the engine service.

The diagram outlines the queued ingestion client interaction with Kusto.

:::image type="content" source="../images/kusto-ingest-client-permissions/queued-ingest.png" alt-text="Queued ingestion.":::

### Permissions on the Engine Service

To qualify for data ingestion into table `T1` on database `DB1`, the principal doing the ingest operation must have authorization.
Minimal required permission levels are `Database Ingestor` and `Table Ingestor` that can ingest data into all existing tables in a database or into a specific existing table.
If table creation is required, `Database User` or a higher access role must also be assigned.


> [!NOTE]
> `Ingestor` roles only grant permissions to ingest data into an existing table. They do not allow creating tables or modifying the schema of an existing table. If table schema changes are required, the relevant identity needs to be granted the `Database Admin` or `Table Admin` role.


|Role                 |PrincipalType        |PrincipalDisplayName
|---------------------|---------------------|------------
|`Database Ingestor`  |Azure AD Application |`Test App (app id: 2a904276-1234-5678-9012-66fc53add60b)`
|`Table Ingestor`     |Azure AD Application |`Test App (app id: 2a904276-1234-5678-9012-66fc53add60b)`

>`KustoIngestion` service principal, the Kusto internal ingestion app, is immutably mapped to the `Cluster Admin` role. It is thus authorized to ingest data into any table. This is what's happening on the Kusto-managed ingestion pipelines.

Granting required permissions on database `DB1` or table `T1` to Azure AD App `Test App (2a904276-1234-5678-9012-66fc53add60b in Azure AD tenant microsoft.com)` would look like this:

```kusto
.add database DB1 ingestors ('aadapp=2a904276-1234-5678-9012-66fc53add60b;microsoft.com') 'Test Azure AD App'
.add table T1 ingestors ('aadapp=2a904276-1234-5678-9012-66fc53add60b;microsoft.com') 'Test Azure AD App'
```
 
