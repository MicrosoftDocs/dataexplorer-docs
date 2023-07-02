---
ms.topic: include
ms.date: 07/02/2023
---

To create a free cluster:

1. Go to [My Cluster](https://aka.ms/kustofree) and select **Create cluster**.

    :::image type="content" source="media/start-for-free-web-ui/start-for-free-create-cluster.png" alt-text="Screenshot of My Cluster page, showing the Create cluster option." lightbox="media/start-for-free-web-ui/start-for-free-create-cluster.png":::

1. In the **Create a free cluster** dialog, fill out the cluster details using the following information.

    :::image type="content" source="media/start-for-free-web-ui/start-for-free-create-cluster-dialog.png" alt-text="Screenshot of Create a free cluster dialog, showing the details for creating the cluster." lightbox="media/start-for-free-web-ui/start-for-free-create-cluster-dialog.png":::

    | Setting | Suggested value | Description |
    |--|--|--|
    | *Cluster display name* | MyFreeCluster | The display name for your cluster. A unique cluster name will be generated as part of the deployment and the domain name [region].kusto.windows.net is appended to it. |
    | *Database name* | MyDatabase | The name of database to create. The name must be unique within the cluster. |
    | *Select location* | Europe | The location where the cluster will be created. |

1. Review the terms of service and accept them by selecting the corresponding checkbox.

1. Select **Create** to provision the cluster. Provisioning typically takes a few minutes.
