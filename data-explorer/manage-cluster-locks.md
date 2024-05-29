---
title: Manage cluster locks in Azure Data Explorer
description: Learn how to manage Azure Data Explorer cluster locks to prevent accidental deletion of data using the Azure portal.
ms.reviewer: orhasban
ms.topic: how-to
ms.date: 02/26/2023
---

# Manage Azure Data Explorer cluster locks to prevent accidental deletion in your cluster

As an administrator, you can lock your cluster to prevent accidental deletion of data. The lock overrides any user permissions set using [Azure Data Explorer role-based access control](kusto/access-control/role-based-access-control.md).

In the Azure portal, you can set **Delete** or **Read-only** locks that prevent either deletions or modifications. The following table describes the permissions that each lock provides:

| Lock level | Description |
| --- | --- |
| **Delete** | Authorized users can read and modify a cluster, but they can't delete it. |
| **Read-only** | Authorized users can read a cluster, but they can't delete or update it. Applying this lock is similar to restricting all authorized users to the permissions that the Reader role provides. |

This article describes how to lock and unlock your cluster using the Azure portal. For more information about locking Azure resources using the portal, see [Lock your resources to protect your infrastructure](/azure/azure-resource-manager/management/lock-resources). For information about how to lock your cluster programmatically, see [Management Locks - Create Or Update At Resource Level](/rest/api/resources/management-locks/create-or-update-at-resource-level).

## Lock your cluster in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to your Azure Data Explorer cluster.
1. In the left-hand menu, under **Settings**, select **Locks**.
1. Select **Add**.
1. Give the lock a name and lock level. Optionally, you can add notes that describe the lock.

    :::image type="content" source="media/manage-cluster-locks/add-cluster-lock.png" alt-text="Screenshot showing add a cluster lock to prevent accidental deletion.":::

## Unlock your cluster in the Azure portal

To delete a lock, in the row where the lock appears, select the **Delete** button.

:::image type="content" source="media/manage-cluster-locks/delete-cluster-lock.png" alt-text="Screenshot showing delete a cluster lock.":::

## Related content

- [Manage cluster horizontal scaling (scale out)](manage-cluster-horizontal-scaling.md)
