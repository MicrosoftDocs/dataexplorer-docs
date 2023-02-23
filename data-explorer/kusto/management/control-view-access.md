---
title: Control view access to tables - Azure Data Explorer
description: This article describes how to grant access to view only some tables in a database in Azure Data Explorer.
ms.topic: reference
ms.date: 02/23/2023
---

# Control view access to tables in Azure Data Explorer

Azure Data Explorer provides various [security roles](security-roles.md#security-roles) to control access to resources, such as databases and tables. The `viewer` role is only available at the database level, and assigning a principal this role gives them access to all tables in the database. In this article, we'll explain how you can give a principal view access to a subset of tables within a database.

## Restricted View Access policy

If you want to restrict access to specific tables, you can turn on the [Restricted View Access policy](restrictedviewaccesspolicy.md) for those tables. This policy ensures that only principals with the `unrestrictedViewer` role can access the table. Meanwhile, principals with the regular `viewer` role won't be able to view the table.

## Row Level Security policy

The [Row Level Security (RLS) policy](rowlevelsecuritypolicy.md) is another method to apply access restrictions to tables. With RLS, you can restrict access to rows of data based on specific criteria. For example, you can limit access to data for specific geographic regions or time periods.

When you create an RLS policy on a table, the restriction applies to all users, including database administrators and the RLS creator.

> [!NOTE]
> A RLS policy can't be set on a table for which the Restricted View Access policy is turned on.

## Architecture changes

In some cases, it may be necessary to split tables into different databases to control access effectively. For example, create a separate database for sensitive data and assign only specific principals the necessary roles.

## Next steps

* Use management commands to assign [security roles](security-roles.md)
* Learn more about [role-based access control in Azure Data Explorer](access-control/role-based-access-control.md)
