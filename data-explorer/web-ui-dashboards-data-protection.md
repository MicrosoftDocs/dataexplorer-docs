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

Microsoft helps to ensure that your data remains safe and secure, without exception. When stored in Azure Data Explorer Dashboards, your data benefits from multiple layers of security and governance technologies, operational practices, and compliance policies. We enforce data privacy and integrity both at rest and in transit.

## Built on Azure

We host Azure Data Explorer Dashboards entirely in Azure data centers. Azure Data Explorer Dashboards uses many core Azure services, including App Service, Cosmos DB, networking and identity.

Azure Data Explorer Dashboards uses Azure Cosmos DB as the primary repository for service metadata and customer data.

Azure Data Explorer Dashboards uses federated authentication of user identities via Azure Active Directory (Azure AD) and Microsoft accounts.

During authentication, the user is routed to the authentication provider, where they provide their credentials. OAuth 2.0 grant type, Authorization Code Flow with Proof Key for Code Exchange (PKCE), is used for that. 

In this way, the user's credential information is never shared directly with Azure Data Explorer Dashboards. For each dashboard's resource that the user attempts to access, permissions are validated based on the user's explicit permissions, as well as permissions inherited through group membership. Dashboards' editors can manage the permissions for their dashboards.

## Data availability

Azure Data Explorer Dashboards use Azure Cosmos DB, Azure Traffic Manager and Azure App Service features to ensure data availability in rare cases of hardware failure, service disruption, or region disaster. Also, the Azure Data Explorer Dashboards team follows procedures to protect data from accidental or malicious deletion.

### Data redundancy

To protect data during hardware or service failures, Azure Data Explorer Dashboards geo-replicates customer data between two regions in the same geography. For example, geo-replicating data between North and West Europe or between North and South United States. In each region there will be 4 copies of your data, which brings it to a total of 8 copies of the data. This enables a fail over to a separate region if there's a major outage or disaster, while also having local redundancy for hardware failures within a region.

### Backup

To protect against accidental deletion of data, Azure Data Explorer Dashboards use Azure Cosmos DB's continuous backup (a.k.a point-in-time backups) with a retention period of 30 days. 

These backups are also replicated in a paired region, helping to ensure a smooth recovery from a regional outage.

> [!IMPORTANT]
> Accidental deletion here refers to scenarios that arise as a result of an incident on our services and doesn't include accidental deletion of assets by customers. 

Additional measure of protection is that deleted dashboards are in a "soft deleted" stage for 12 weeks allowing recovery as needed. Customers can create a support ticket with Azure Data Explorer (Kusto) and have deleted dashboards recovered as long as they are still in the "soft delete" stage. Note that after 12 weeks deleted dashboards are permanently deleted and cannot be recovered.

## Data privacy

You should have confidence that your data is being handled properly and for legitimate uses. Part of that assurance involves restricting usage so that your data is used only for legitimate reasons.

### General Data Protection Regulation (GDPR)
The General Data Protection Regulation (GDPR) is the biggest change in data protection laws in Europe since the 1995 introduction of the European Union (EU) Data Protection Directive 95/46/EC. For more information about the GDPR regulation, see the [overview page in the Microsoft Trust Center](https://www.microsoft.com/TrustCenter/Privacy/gdpr/default.aspx).

### Data residency and sovereignty
Azure Data Explorer Dashboards service is available in the following seven geographies across the world: United States, Canada, Europe, United Kingdom, India, Australia, and Brazil. All tenants that were added before Azure Data Explorer Dashboards was declared as Global Available were auto-assigned to Europe geography. 

New tenants are assigned to your closest geography based on the tenant's data boundary or tenant's region. 
To choose a different geography use the assistance of Microsoft support.

Azure Data Explorer Dashboards service doesn't move or replicate customer data outside of the chosen geography. Instead, your data is geo-replicated to a second region within the same geography. 

### Transferring your data
We don't transfer customer data outside of your tenant's geography. However, we will transfer your data if we need to do any of the following actions:

* Provide customer support
* Troubleshoot the service
* Comply with legal requirements

Microsoft doesn't control or limit the geographies from which you or your users may access your data. If a user navigates to https://dataexplorer.azure.com while not in the tenant's geography, the request will not get blocked. Instead the user will see a warning in the website.