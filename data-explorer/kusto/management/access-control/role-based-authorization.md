---
title: Role-based Authorization in Kusto - Azure Data Explorer
description: This article describes Role-based Authorization in Kusto in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 12/20/2021
---
# Role-based authorization

Authorization is the process of allowing or disallowing a security principal permission to carry out an action.
Azure Data Explorer uses a role-based access control model, under which authenticated principals are mapped to roles, and get access according to the roles they're assigned.

The engine service has the following roles:

|Role |Permissions |
|---|---|
|All Databases admin |Can do anything in the scope of any database. Includes all lower level `All Databases` permissions. Can show and alter certain cluster-level policies. |
|Database admin|Can do anything in the scope of a particular database. Includes all lower level permissions.  |
|Database user |Can read all data and metadata of the database. Additionally, can create tables and become the table admin for those tables, and create functions in the database.|
|All Databases viewer |Can read all data and metadata of any database. |
|Database viewer |Can read all data and metadata of a particular database. |
|Database ingestor |Can ingest data into all existing tables in the database, but can't query the data. |
|Database `unrestrictedviewer` |Can query all tables in the database that have the [RestrictedViewAccess policy](../show-table-restricted-view-access-policy-command.md) enabled. |
|All Databases monitor |Can execute `.show` commands in the context of any database and its child entities. |
|Database monitor |Can execute `.show` commands in the context of the database and its child entities.  |
|Function admin |Can alter function, delete function, or grant admin permissions to another principal. |
|Table admin |Can do anything in the scope of a particular table. |
|Table ingestor |Can ingest data in the scope of a particular table, but can't query the data. |

To assign a database role, see [managing roles and permissions](../security-roles.md#managing-database-security-roles).

> [!NOTE]
> To grant a principal from a different tenant access to your cluster, see [Allow cross-tenant queries and commands](../../../cross-tenant-query-and-commands.md).
