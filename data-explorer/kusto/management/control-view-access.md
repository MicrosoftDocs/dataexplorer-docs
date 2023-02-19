---
title: Control view access to tables - Azure Data Explorer
description: This article describes how to grant access to view only some tables in a database in Azure Data Explorer.
ms.topic: reference
ms.date: 02/19/2023
---

# Control view access to tables in Azure Data Explorer

This article explains how you can give a principal view access to a subset of tables within a database.

Azure Data Explorer provides different [security roles](security-roles.md#security-roles) at various levels. The `viewer` role is available at the database level, but not at the table level. If you assign a principal the `viewer` role on a database, they can access all tables in the database unless you take measures to limit or modify their table access.

In this article, you'll learn a few methods to restrict a principal's access on the table level.

## Restricted View Access policy

If you want to restrict access to certain tables, turn on the [Restricted View Access policy](restrictedviewaccesspolicy.md) for those tables. Then, grant the `unrestrictedViewer` role to the principals who should have access to those tables and the regular `viewer` role to the principals that shouldn't have access to those tables.

This method works since a principal with the `viewer` role on a database can only view tables that don't have the [Restricted View Access policy](restrictedviewaccesspolicy.md) turned on.

## Row Level Security policy

By using a [Row Level Security (RLS) policy](rowlevelsecuritypolicy.md), you can apply restrictions on data row access in your application, granting access only to rows that meet certain criteria. For example, you could use RLS to allow users to view data only for specific geographic regions, or only for a certain time period.

When you create an RLS policy on a table, the access restriction applies to all users, including database administrators and the RLS creator.

> [!NOTE]
> A Row Level Security policy can't be set on a table for which the Restricted View Access policy is turned on.

## Architecture changes

In some cases, the best approach may be to split the tables into different databases.

## Next steps

* Use management commands to assign [security roles](security-roles.md)
* Learn more about [role-based access control in Azure Data Explorer](access-control/role-based-access-control.md)
