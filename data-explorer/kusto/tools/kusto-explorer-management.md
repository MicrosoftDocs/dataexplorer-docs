---
title: Use Kusto.Explorer to manage Azure Data Explorer permissions
description: Learn how to use Kusto.Explorer to manage Azure Data Explorer authorized principals
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/13/2020
---

# Use Kusto.Explorer to manage Azure Data Explorer authorized principals

Kusto.Explorer provides a convenient way to manage clusters, databases, tables, or function authorized principals.

> [!Note]
> Only [admins](../management/access-control/role-based-authorization.md) can add or drop authorized principals in their own scope.

Right-click the target entity in the [Connections panel](kusto-explorer-user-interface.md#connections-tab), and select **Manage Cluster Authorized Principals**. (You can also select this option from the Management Menu.)

![Manage authorized principals](./Images/kusto-explorer-management/right-click-manage-authorized-principals.png "right-click-manage-authorized-principals")

![Manage authorized principals window](./Images/kusto-explorer-management/manage-authorized-principals-window.png "manage-authorized-principals-window")

* To add a new authorized principal, select **Add principal**, provide the principal details, and confirm the action.

    ![Add authorized principal](./Images/kusto-explorer-management/add-authorized-principals-window.png "add-authorized-principals-window")

    ![Confirm add authorized principal](./Images/kusto-explorer-management/confirm-add-authorized-principals.png "confirm-add-authorized-principals")

* To drop an existing authorized principal, select **Drop principal** and confirm the action.

    ![Confirm drop authorized principal](./Images/kusto-explorer-management/confirm-drop-authorized-principals.png "confirm-drop-authorized-principals")

## Next steps

* Learn about [querying data in Kusto.Explorer from the command-line](kusto-explorer-command-line.md)
* Learn about [Kusto Query Language (KQL)](https://docs.microsoft.com/azure/kusto/query/)
