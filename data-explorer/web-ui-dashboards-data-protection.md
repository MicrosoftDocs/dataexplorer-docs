---
title: Dashboards Data protection overview
description: This article describes how the Dashboard Service handled customer's content  
ms.reviewer: izlisbon
ms.topic: conceptual
ms.date: 01/12/2022
ms.custom: mode-portal
---

## Dashboards Data protection Overview

Dashboards tell a story through visualizations, and are an excellent way to view your data and see all of your most important insights at a glance. Azure Data Explorer dashboards in the web UI natively support the Kusto Query Language over data hosted in Azure Data Explorer.

This article discusses the steps that Microsoft takes to help keep your dashboards available, secure, and private.

It will be most useful to individuals who are already familiar with Azure Data Explorer Web UI and want to know more about how Microsoft protects stored assets related to [Azure Data Explorer Dashboards](https://dataexplorer.azure.com/dashboards).

## Our commitment

Microsoft is committed to keeping your data safe and secure without compromise. With Azure Data Explorer Dashboards, your data enjoys high availability, robust security measures, and stringent data privacy and integrity enforcement, both at rest and in transit.

## Built on Azure

We host Azure Data Explorer Dashboards entirely on Azure. Azure Data Explorer Dashboards uses many core Azure services, including App Service, Cosmos DB, networking and identity.

Azure Data Explorer Dashboards uses Azure Cosmos DB as the primary repository for service metadata and customer data.

Azure Data Explorer Dashboards uses AAD based authentication with federated authentication of user identities via Azure Active Directory (Azure AD) and Microsoft accounts.

Authorization is validated based on the user's explicit permissions, as well as permissions inherited through group membership. Dashboards' editors can manage the permissions for their dashboards.

## Data privacy

As a Microsoft Service, Azure Data Explorer adheres to [Microsoft's Data protection and privacy guidelines](https://www.microsoft.com/en-us/trust-center/privacy).

### General Data Protection Regulation (GDPR)

The General Data Protection Regulation (GDPR) is the biggest change in data protection laws in Europe since the 1995 introduction of the European Union (EU) Data Protection Directive 95/46/EC. For more information about the GDPR regulation, see the [overview page in the Microsoft Trust Center](https://www.microsoft.com/TrustCenter/Privacy/gdpr/default.aspx).

Azure Data Explorer adheres to GDPR regulations.

### Data residency and sovereignty

Azure Data Explorer Dashboards is available in the following seven geographies across the world: United States, Canada, Europe, United Kingdom, India, Australia, and Brazil. All tenants that were added before Azure Data Explorer Dashboards was declared as Global Available were auto-assigned to Europe geography.

New tenants are assigned a geography based on the tenant's data boundary or the tenant's country/region. If there is no matching Geography, the default one will be Europe.
To choose a different geography use the assistance of Microsoft support.

Azure Data Explorer Dashboards ensures that customer data remains within a specific geography, without moving or replicating it outside its boundaries. Data is geo-replicated to a secondary region within the same geography.

### Transferring your data

We don't transfer customer data outside of your tenant's geography. However, we will transfer your data if we need to do any of the following actions:

* Provide customer support
* Troubleshoot the service
* Comply with legal requirements

Microsoft doesn't control or limit the geographies from which you or your users may access your data. If a user navigates to https://dataexplorer.azure.com while not in the tenant's geography, the request will not get blocked. Instead the user will see a warning.

## Human error

### Accidental dashboard deletion

Mistakes are bound to happen, and it is possible for users to unintentionally delete a dashboard. If you find yourself in this situation, please use the assistance of Microsoft support to restore your dashboard.

### Improper dashboard modification

In the event that a dashboard has been improperly modified, such as inadvertently deleting a tile and saving the alterations, it should be noted that Kusto Dashboard does not offer rollback or version control capabilities.

## High availability

High availability refers to the fault-tolerance of Azure Data Explorer Dashboards. This fault tolerance avoids single points of failure (SPOF) in the implementation. In Azure Data Explorer Dashboards, high availability includes the persistence layer and the compute layer.

### Persistence layer

Azure Data Explorer Dashboards leverages Azure Cosmos DB as its durable persistence layer.

Azure Cosmos DB is used with a Geo-zone-redundant configuration. Azure Data Explorer Dashboards service is available in seven geographies across the world. Every geography will have an Azure Cosmos DB with at least one replica in a different region. Additionally, availability Zones are utilized in every Azure region that supports them.

### Compute layer

Azure Data Explorer Dashboards utilizes Azure App Service as its computational layer.

Within a geography, Azure App Services are deployed in paired regions.

## Disaster Recovery

To protect against accidental deletion of data, Azure Data Explorer Dashboards use Azure Cosmos DB's continuous backup (a.k.a point-in-time backups) with a retention period of 30 days.

These backups are also replicated in a paired region, helping to ensure a smooth recovery from a regional outage.

> [!IMPORTANT]
> Accidental deletion here refers to scenarios that arise as a result of an incident on our services and doesn't include accidental deletion of assets by customers.

Additional measure of protection is that deleted dashboards are in a "soft deleted" stage for 12 weeks allowing recovery as needed. Customers can create a support ticket with Azure Data Explorer (Kusto) and have deleted dashboards recovered as long as they are still in the "soft delete" stage. Note that after 12 weeks deleted dashboards are permanently deleted and cannot be recovered.