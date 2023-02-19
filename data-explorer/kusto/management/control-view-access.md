---
title: Control view access to tables - Azure Data Explorer
description: This article describes how to grant access to view only some tables in a database in Azure Data Explorer.
ms.topic: reference
ms.date: 02/19/2023
---

# Control view access to tables in Azure Data Explorer

This article provides methods for granting a principal view access to a subset of tables in a database.

In Azure Data Explorer, the standard approach is to grant the `viewer` [security role](security-roles.md#security-roles) on the database level. However, assigning the `viewer` role to specific tables isn't possible.

If you grant a principal the `viewer` role on a database, they gain access to all tables in the database except for the tables with the [Restricted View Access policy](restrictedviewaccesspolicy.md) turned on. This article explores alternative policies and approaches to restrict a principal's access to specific tables.

## Restricted View Access policy

If you want to restrict access to certain tables, turn on the [Restricted View Access policy](restrictedviewaccesspolicy.md) for those tables. Then, grant the `unrestrictedViewer` role to the principals who should have access to those tables and the regular `viewer` role to the principals that shouldn't have access to those tables.

This method works since a principal with the `viewer` role on a database can only view tables that don't have the [Restricted View Access policy](restrictedviewaccesspolicy.md) turned on.

## Row Level Security policy



## Architecture changes

In some cases, the best approach may be to split the tables into different databases.
