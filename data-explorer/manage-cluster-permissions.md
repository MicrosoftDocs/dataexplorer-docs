---
title: Manage cluster permissions in Azure Data Explorer
description: Learn how to manage role-based access controls for clusters in Azure Data Explorer.
ms.topic: how-to
ms.date: 11/23/2022
---

# Manage Azure Data Explorer cluster permissions

Azure Data Explorer enables you to control access to resources in your cluster using a role-based access control model. Under this model, [principals](./kusto/management/access-control/referencing-security-principals.md)—users, groups, and apps—are mapped to [security roles](kusto/management/security-roles.md). Principals are granted access to cluster resources according to the roles they're assigned.

This article describes the available cluster level roles and how to assign principals to those roles using the Azure portal.

To manage cluster permissions in the CLI, see [Kusto commands](/cli/azure/kusto#commands).

## Cluster level permissions

|Role |Permissions |
|---|---|
|`AllDatabasesAdmin` | Full access in the scope of any database. May show and alter certain cluster-level policies. Includes all lower level `All Databases` permissions. |
|`AllDatabasesViewer` | Read all data and metadata of any database. |
|`AllDatabasesMonitor` | Execute `.show` commands in the context of any database and its child entities. |

## Manage cluster permissions in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to your Azure Data Explorer cluster.

1. In the left-hand menu, under **Security + networking**, select **Permissions**.

    :::image type="content" source="media/manage-cluster-permissions/left-hand-menu.png" alt-text="Screenshot of the left settings menu containing the permissions tab.":::

1. Select **Add**, and select the role you want to assign.

    :::image type="content" source="media/manage-cluster-permissions/add-widget.png" alt-text="Screenshot of the add widget for adding permissions.":::

1. In the **New principals** window, search for and select one or more principals.

    :::image type="content" source="media/manage-cluster-permissions/new-principals-window.png" alt-text="Screenshot of new principals window for adding new permissions.":::

1. Select **Select** to complete the assignment.

## Related content

* [Add cluster principals](add-cluster-principal.md)
* [Manage database permissions](manage-database-permissions.md)
* [Role-based access control](/kusto/management/access-control/role-based-access-control.md)
