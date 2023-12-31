---
title: Manage view access to tables
description: Learn how to grant view access to tables in a database.
ms.topic: reference
ms.date: 05/24/2023
---

# Manage view access to tables within the same database

Principals gain access to resources, such as databases and tables, based on their assigned [security roles](security-roles.md#security-roles). The `viewer` security role is only available at the database level, and assigning a principal this role gives them view access to all tables in the database.

In this article, you learn methods for controlling a principal's table view access.

## Structure data for controlled access

To control access more effectively, we recommend that you separate tables into different databases based on access privileges. For instance, create a distinct database for sensitive data and restrict access to specific principals by assigning them the relevant [security roles](security-roles.md).

## Restricted View Access policy

To restrict access to specific tables, you can turn on the [Restricted View Access policy](restricted-view-access-policy.md) for those tables. This policy ensures that only principals with the `unrestrictedViewer` role can access the table. Meanwhile, principals with the regular `viewer` role can't view the table.

## Row Level Security policy

The [Row Level Security (RLS) policy](rowlevelsecuritypolicy.md) allows you to restrict access to rows of data based on specific criteria and allows masking data in columns. When you create an RLS policy on a table, the restriction applies to all users, including database administrators and the RLS creator.

## Create a follower database

Create a [follower database](../../follower.md) and follow only the relevant tables that you'd like to share with the specific principal or set of principals.

## Related content

* Learn more about [role-based access control](access-control/role-based-access-control.md)
* Use management commands to assign [security roles](security-roles.md)
