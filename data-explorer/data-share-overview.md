---
title: Data Sharing (preview)
description: Learn about how to share your data with Azure Data Explorer and Azure Data Share.
author: maraheja
ms.author: maraheja
ms.reviewer: orspod
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/23/2020
---

# Data Sharing (preview)

There are many traditional ways to share data such as through file shares, FTP, e-mail, and APIs. This requires both parties to build and maintain the data pipeline that moves data between teams and organizations. With Azure Data Explorer, you can easily and securely share your data with others in your company or external partners in near-real-time. There is no need to build or maintain any data pipeline. All database changes (schema & data) on the provider side are instantly available on the consumer side.

![Video](https://www.youtube.com/watch?v=Q3MJv90PegE)

With Azure Data Explorer's architecture, the storage and compute are decoupled that allows customers to run multiple compute (read-only) instances on the same underline storage. Users can attach the database as [follower database](https://docs.microsoft.com/azure/data-explorer/follower), which is a read-only database on a remote cluster.

You can configure the data sharing in the following ways:

* Use [Azure Data Share](https://docs.microsoft.com/azure/data-share/) to send and manage invitations and shares across the company or with external partners and customers. [Azure Data Share](https://docs.microsoft.com/azure/data-share/) leverages [follower database](https://docs.microsoft.com/azure/data-explorer/follower) to creates a symbolic link between the provider and consumer's Azure Data Explorer cluster. This options provides you with a single pane to view and manage all your data shares across Azure Data Explorer clusters and other data services. Azure Data Share also enables you to share data across organizations in different Azure Active Directly tenants.
* Directly configuring the [follower database](https://docs.microsoft.com/azure/data-explorer/follower) only for the scenarios where you need additional compute to scale out for reporting needs and you are admin on both the clusters.

When the sharing relationship is established, Azure Data Share creates a symbolic link between the provider and consumer's Azure Data Explorer cluster. When the data provider revokes access, the symbolic link is deleted, and the shared database(s) are no longer available to the data consumer.

[Azure Data Explorer Data Sharing](https://microsoft-my.sharepoint.com/:i:/p/maraheja/EZ6ZLznSW7JEtaVsAtGmMbMBYedtFSieTaHzyNiHnFJo7g?e=lMtKVb)

The data provider can share the data at the database level or at the cluster level. The cluster sharing the database is the leader cluster and the cluster receiving the share is the follower cluster. A follower cluster can follow one or more leader cluster databases. The follower cluster periodically synchronizes to check for changes. The lag time between the leader and follower varies from a few seconds to a few minutes, depending on the overall size of the metadata and the data. The data is cached on the consumer cluster and is only available for read or query operations, with an exception to override the hot caching policy and the database permissions. The queries running on the follower cluster uses local cache and does not uses the resources of the leader cluster.

## Prerequisites

1. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
1. [Create provider cluster and DB](/azure/data-explorer/create-cluster-database-portal) for the leader and follower.
1. [Ingest data](/azure/data-explorer/ingest-sample-data) to leader database using one of various methods discussed in [ingestion overview](/azure/data-explorer/ingest-data-overview).

## Data Provider - Share Data

Follow the instructions in the below video to create data share account, add dataset, and send invitation.
![Data provider - share data](https://youtu.be/QmsTnr90_5o)

## Data Consumer - Receiving Data

Follow the instructions in the below video to accept the invitation, create data share account, and map to the consumer cluster.
![Data Consumer - Receiving Data](https://youtu.be/vBq6iFaCpdA)

Data consumer can now go to their Azure Data Explorer cluster to grant user permissions to the shared databases and access the data. Data ingested using batch mode into the source Azure Data Explorer cluster will show up on the target cluster within a few seconds to a few minutes.

## Limitations

* The follower and the leader clusters must be in the same region.
* [Streaming ingestion](/azure/data-explorer/ingest-data-streaming) can't be used on a database that is being followed.
* Data encryption using [customer managed keys](/azure/data-explorer/security#customer-managed-keys-with-azure-key-vault) is not supported on both leader and follower clusters.
* You can't delete a database that is attached to a different cluster before detaching it.
* You can't delete a cluster that has a database attached to a different cluster before detaching it.
* You can't stop a cluster that has attached follower or leader database(s).

## Next steps

* [Azure Data Share documentation](https://docs.microsoft.com/en-us/azure/data-share/)
* For information about follower cluster, see [follower cluster](/azure/data-explorer/follower)