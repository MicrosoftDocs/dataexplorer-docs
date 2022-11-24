---
title: Manage cluster permissions in Azure Data Explorer
description: Learn how to manage role-based access controls for clusters in Azure Data Explorer.
ms.topic: how-to
ms.date: 11/23/2022
---

# Manage Azure Data Explorer cluster permissions

Azure Data Explorer enables you to control access to resources in your cluster using a *role-based access control* model. Under this model, *principals* are mapped to *roles*. Principals are users, groups, and apps, and can access cluster resources according to the roles they're assigned.

This article describes the available cluster level roles and how to assign principals to those roles using the Azure portal.

## Cluster level permissions

|Role |Permissions |
|---|---|
|All Databases admin |Can do anything in the scope of any database. Includes all lower level `All Databases` permissions. Can show and alter certain cluster-level policies. |
|All Databases viewer |Can read all data and metadata of any database. |
|All Databases monitor |Can execute `.show` commands in the context of any database and its child entities. |

## Manage cluster permissions in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to your Azure Data Explorer cluster.

1. In the left-hand menu, scroll down to **Security + networking** and select **Permissions**.

:::image type="content" source="media/manage-cluster-permissions/left-hand-menu.png" alt-text="Image of the left settings menu containing the permissions tab.":::

1. Select **Add**, and pick the role you wish to assign from the dropdown.

:::image type="content" source="media/manage-cluster-permissions/add-widget.png" alt-text="Image of the add widget for adding permissions.":::

1. In the **New principals** window, search for and select the desired principal. Add as many as you want.At the bottom of the window, choose **Select** to finish.

:::image type="content" source="media/manage-cluster-permissions/new-principals-window.png" alt-text="Image of new principals window for adding new permissions.":::

## See also

* To configure database or table specific access, see [Manage Azure Data Explorer database permissions](manage-database-permissions.md)
* For a list of available roles, see [Role-based Authorization](./kusto/management/access-control/role-based-authorization.md)
