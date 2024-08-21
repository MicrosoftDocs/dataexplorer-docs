---
title: Share Azure Data Explorer dashboards
description: Learn how to share Azure Data Explorer dashboards
ms.reviewer: gabil
ms.topic: how-to
ms.date: 08/21/2024
---
# Share dashboards

A dashboard is a collection of tiles, optionally organized in pages, where each tile has an underlying query and a visual representation. For more information on creating dashboards, see [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md).

In this document, you will learn how to share a dashboard with other users, grant permissions, and manage permissions. Use the share menu to [grant permissions](#grant-permissions) for a Microsoft Entra user or Microsoft Entra group to access the dashboard, [change a user's permission level](#change-a-user-permission-level), and [share the dashboard link](#share-the-dashboard-link).

> [!IMPORTANT]
> To access the dashboard, a dashboard viewer needs the following:
>
> * Dashboard link for access
> * Dashboard permissions
> * Access to the underlying database in the Azure Data Explorer cluster

## Manage permissions

1. Select the **Share** menu item in the top bar of the dashboard.
1. Select **Manage permissions** from the drop-down.

    :::image type="content" source="media/adx-dashboards/share-dashboard.png" alt-text="Share dashboard drop-down.":::

## Grant permissions

Permissions can be granted to users within your tenant or to [users in a different tenant](#grant-permissions-to-users-in-a-different-tenant).

To grant permissions to a user in the **Dashboard permissions** pane:

### Grant permissions to users within your tenant

1. Enter the Microsoft Entra user or Microsoft Entra group in **Add new members**.
1. In the **Permission** level, select one of the following values: **Can view** or **Can edit**.
1. Select **Add**.

:::image type="content" source="media/adx-dashboards/dashboard-permissions.png" alt-text="Manage dashboard permissions.":::

### Grant permissions to users in a different tenant

Cross-tenant sharing is disabled by default. To enable cross-tenant sharing, a tenant admin must enable it in the Azure Data Explorer WebUI [settings](web-customize-settings.md#enable-cross-tenant-dashboard-sharing).

> [!IMPORTANT]
> If a tenant admin enables cross-tenant sharing and later disables cross-tenant sharing, all dashboards shared while the feature was active will remain accessible.

1. Select the **Share** menu item in the top bar of the dashboard.
1. Under **Share with external user**, enter the user's email address. 

    > [!NOTE]
    > * You can share with security groups.
    > * You can share with Microsoft accounts (MSA).
    > * You can't share with distribution groups.

1. Choose if you want to allow the user to edit the dashboard. If so, check the **Allow edit permission** box.

    > [!NOTE]
    > An invitee with edit permissions can share the dashboard with users from their own tenant, or use this invitation flow to to invite users from other tenants.

1. Select **Create invitation**.

    :::image type="content" source="media/dashboard-explore-data/share-external-user.png" alt-text="Screenshot of sharing an Azure Data Explorer dashboard to an external tenant.":::

1. Send the invitation link to the user. The user must accept the invitation to access the dashboard.


After sharing the dashboard, you can see who you've shared with in the **Dashboard permissions** pane.

## Change a user permission level

To change a user permission level in the **Dashboard permissions** pane:

1. Either use the search box or scroll the user list to find the user.
1. Change the **Permission** level as needed.

## Share the dashboard link

To share the dashboard link, do one of the following:

* Select **Share** and then select **Copy link**
* In the **Dashboard permissions** window, select **Copy link**.

## Related content

* [Explore data in dashboard tiles](dashboard-explore-data.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
* [Quickstart: Visualize sample data dashboards](web-ui-samples-dashboards.md)