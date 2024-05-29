---
title: Manage database permissions in Azure Data Explorer
description: This article describes role-based access controls for databases and tables in Azure Data Explorer.
ms.reviewer: mblythe
ms.topic: how-to
ms.date: 05/28/2023
---

# Manage Azure Data Explorer database permissions in the Azure portal

Azure Data Explorer allows you to control access to databases and tables using a *role-based access control* model. Under this model, *principals* (users, groups, and apps) are mapped to *roles*. Principals can access resources according to the roles they're assigned. For a list of available roles, see [role-based access control](kusto/access-control/role-based-access-control.md).

This article describes the available roles and how to assign principals to those roles using the Azure portal. For information on how to set database permissions with management commands, see [Manage database security roles](kusto/management/manage-database-security-roles.md).

> [!NOTE]
> To delete a database, you need at least **Contributor** Azure Resource Manager (ARM) permissions on the cluster. To assign ARM permissions, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Add database principals

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to your Azure Data Explorer cluster.

1. In the **Overview** section, select the database where you want to manage permissions. For roles that apply to all databases, skip this phase and go directly to the next step.

    ![Select database.](media/manage-database-permissions/select-database.png)

1. Select **Permissions** then **Add**.

    ![Database permissions.](media/manage-database-permissions/database-permissions.png)

1. Look up the principal, select it, then **Select**.

    :::image type="content" source="media/manage-database-permissions/new-principals.png" alt-text="Screenshot of the Azure portal New Principals page. A principal name and image are selected and highlighted. The Select button is also highlighted." border="false":::

## Remove database principals

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to your Azure Data Explorer cluster.

1. In the **Overview** section, select the database where you want to manage permissions. For roles that apply to all databases, go directly to the next step.

    ![Screenshot of select database.](media/manage-database-permissions/select-database.png)

1. Select **Permissions**, and then select the principal to remove.

1. Select **Remove**.

## Related content

* Learn about [Azure Data Explorer role-based access control](kusto/access-control/role-based-access-control.md).
* To set cluster level permissions, see [Manage cluster permissions](manage-cluster-permissions.md).
* To set permissions for a database with management commands, see [Manage database security roles](kusto/management/manage-database-security-roles.md).
* To grant a principal view access to a subset of tables, see [Manage table view access](kusto/management/manage-table-view-access.md).
