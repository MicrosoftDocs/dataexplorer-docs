---
title: Dashboards business continuity and disaster recovery overview
description: This article outlines the business continuity and disaster recovery capabilities within Azure Data Explorer Dashboards.
ms.reviewer: izlisbon
ms.topic: conceptual
ms.date: 04/26/2023
ms.custom: mode-portal
---

# Dashboards business continuity and disaster recovery overview

Azure Data Explorer Dashboards' business continuity and disaster recovery allows your business to view and edit dashboards during disruptions. This article covers the topics of availability and disaster recovery for Azure Data Explorer Dashboards.

## Human error

### Accidental dashboard deletion

Mistakes are bound to happen, and it's possible for users to unintentionally delete a dashboard. If you find yourself in this situation, use the assistance of Microsoft support to restore your dashboard. Twelve weeks from the deletion date, the dashboard can no longer be restored.

### Improper dashboard modification

If a dashboard has been improperly modified, such as inadvertently deleting a tile and saving the alterations, it should be noted that Kusto Dashboard doesn't offer rollback.

## High availability

High availability refers to the fault-tolerance of Azure Data Explorer Dashboards. This fault tolerance avoids single points of failure (SPOF) in the implementation. In Azure Data Explorer Dashboards, high availability includes the persistence layer and the compute layer.

### Persistence layer

Azure Data Explorer Dashboards uses Azure Cosmos DB as its durable persistence layer.

Azure Cosmos DB is used with a Geo-zone-redundant configuration. Azure Data Explorer Dashboards service is available in seven geographies across the world. Every geography has an Azure Cosmos DB with at least one replica in a pair region. Additionally, availability Zones are utilized in every Azure region that supports them.

### Compute layer

Azure Data Explorer Dashboards utilizes Azure App Service as its computational layer.

Within a geography, Azure App Services are deployed in paired regions.

## Disaster Recovery

To protect against accidental deletion of data, Azure Data Explorer Dashboards use Azure Cosmos DB's continuous backup (a.k.a point-in-time backups) with a retention period of 30 days.

These backups are also replicated in a paired region, helping to ensure a smooth recovery from a regional outage.

> [!IMPORTANT]
> Accidental deletion here refers to scenarios that arise as a result of an incident on our services and doesn't include accidental deletion of assets by customers.
