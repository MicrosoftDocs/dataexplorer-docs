---
title: Use Azure Data Share to share data with Azure Data Explorer
description: Learn about how to share your data with Azure Data Explorer and Azure Data Share.
author: orspod
ms.author: orspodek
ms.reviewer: maraheja
ms.service: data-explorer
ms.topic: how-to
ms.date: 08/14/2020
---

# Use Azure Data Share to share data with Azure Data Explorer

There are many traditional ways to share data, such as through file shares, FTP, e-mail, and APIs. These methods require both parties to build and maintain a data pipeline that moves data between teams and organizations. With Azure Data Explorer, you can easily and securely share your data with people in your company or external partners. Sharing occurs in near-real-time, with no need to build or maintain a data pipeline. All database changes, including schema and data, on the provider side are instantly available on the consumer side.

[![Azure Friday Video](https://img.youtube.com/vi/Q3MJv90PegE/0.jpg)](https://www.youtube.com/watch?v=Q3MJv90PegE?&autoplay=1)

Azure Data Explorer decouples the storage and compute which allows customers to run multiple compute (read-only) instances on the same underlying storage. You can attach a database as a [follower database](follower.md), which is a read-only database on a remote cluster.

## Configure data sharing 

You can configure data sharing using one the following methods:

* Use [Azure Data Share](/azure/data-share/) to send and manage invitations and shares across the company or with external partners and customers. Azure Data Share uses a [follower database](follower.md) to create a symbolic link between the provider and consumer's Azure Data Explorer cluster. This option provides you with a single pane to view and manage all your data shares across Azure Data Explorer clusters and other data services. Azure Data Share also enables you to share data across organizations in different Azure Active Directly tenants.
* Directly configure the [follower database](follower.md) only for the scenarios where you need additional compute to scale out for reporting needs and you're admin on both the clusters.

> [!Note] 
> When the sharing relationship is established, Azure Data Share creates a symbolic link between the provider and consumer's Azure Data Explorer cluster. If the data provider revokes access, the symbolic link is deleted, and the shared database(s) are no longer available to the data consumer.

:::image type="content" source="media/data-share/adx-datashare-image.png" alt-text="Azure Data Explorer data sharing":::

The data provider can share the data at the database level or at the cluster level. The cluster sharing the database is the leader cluster and the cluster receiving the share is the follower cluster. A follower cluster can follow one or more leader cluster databases. The follower cluster periodically synchronizes to check for changes. The lag time between the leader and follower varies from a few seconds to a few minutes, depending on the overall size of the metadata and the data. Data is cached on the consumer cluster and is only available for read or query operations, with an exception to override the hot caching policy and the database permissions. The queries running on the follower cluster use local cache and don't use the resources of the leader cluster.

## Prerequisites

1. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
1. [Create provider cluster and DB](create-cluster-database-portal.md) for the leader and follower.
1. [Ingest data](ingest-sample-data.md) to leader database using one of various methods discussed in [ingestion overview](ingest-data-overview.md).

## Data provider - share data

Follow the instructions in the video to create a data share account, add a dataset, and send an invitation.

[![Data provider - share data](https://img.youtube.com/vi/QmsTnr90_5o/0.jpg)](https://youtu.be/QmsTnr90_5o?&autoplay=1)

## Data consumer - receive data

Follow the instructions in the video to accept the invitation, create a data share account, and map to the consumer cluster.

[![Data Consumer - Receiving Data](https://img.youtube.com/vi/vBq6iFaCpdA/0.jpg)](https://youtu.be/vBq6iFaCpdA?&autoplay=1)

The data consumer can now go to their Azure Data Explorer cluster to grant user permissions to the shared databases and access the data. Data ingested using batch mode into the source Azure Data Explorer cluster will show up on the target cluster within a few seconds to a few minutes.

## Limitations

* [Follower DB Limitations](follower.md#limitations)

## Next steps

* [Azure Data Share documentation](/azure/data-share/)
* For information about follower cluster, see [follower cluster](follower.md)
