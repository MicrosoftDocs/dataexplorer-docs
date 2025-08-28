---
title: Manage Azure Data Explorer Cluster Permissions
description: Learn how to configure Azure Data Explorer cluster permissions through role-based access control. Discover how to assign security roles to users, groups, and apps for optimal database access management.
#customer intent: As a database administrator, I want to assign cluster-level permissions to users and groups so that I can control who has access to my Azure Data Explorer cluster resources.
ms.topic: how-to
ms.date: 08/27/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:08/27/2025
  - ai-gen-description
---

# Manage Azure Data Explorer cluster permissions

Azure Data Explorer uses role-based access control (RBAC) to manage who can access cluster resources. This security model maps [principals](/kusto/management/reference-security-principals?view=azure-data-explorer&preserve-view=true)—such as users, groups, and applications—to specific [security roles](/kusto/management/security-roles?view=azure-data-explorer&preserve-view=true) that determine their level of access.

Use cluster-level permissions to control access across all databases in your cluster. You can assign three types of cluster roles: **AllDatabasesAdmin** for full administrative access, **AllDatabasesViewer** for read-only access to all data and metadata, and **AllDatabasesMonitor** for monitoring capabilities.

This article shows you how to assign cluster-level permissions to principals using the Azure portal.

> [!NOTE]
> * To configure cluster level permissions with C#, Python, and ARM templates, see [Add cluster principals](add-cluster-principal.md).
> * To configure cluster level permissions with the Azure CLI, see [az kusto](/cli/azure/kusto#commands).

## Cluster level permissions

|Role |Permissions |
|---|---|
|`AllDatabasesAdmin` | Full access in the scope of any database. Might show and alter certain cluster-level policies. Includes all lower level `All Databases` permissions. |
|`AllDatabasesViewer` | Read all data and metadata of any database. |
|`AllDatabasesMonitor` | Execute `.show` commands in the context of any database and its child entities. |

## Manage cluster permissions in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to your Azure Data Explorer cluster.

1. In the left-hand menu, under **Security + networking**, select **Permissions**.

    :::image type="content" source="media/manage-cluster-permissions/left-hand-menu.png" alt-text="Screenshot of the left settings menu containing the permissions tab.":::

1. Select **Add**, and select the role you want to assign.

    :::image type="content" source="media/manage-cluster-permissions/add-widget.png" alt-text="Screenshot of the Add widget for adding permissions.":::

1. In the **New principals** window, search for and select one or more principals.

    :::image type="content" source="media/manage-cluster-permissions/new-principals-window.png" alt-text="Screenshot of new principals window for adding new permissions.":::

1. Select **Select** to complete the assignment.

## Related content

* [Manage database permissions](manage-database-permissions.md)
* [Role-based access control](/kusto/access-control/role-based-access-control?view=azure-data-explorer&preserve-view=true)
