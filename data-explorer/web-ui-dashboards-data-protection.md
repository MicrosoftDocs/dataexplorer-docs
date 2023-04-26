---
title: Dashboards data protection overview
description: This article describes how the Dashboard Service handled customer's content  
ms.reviewer: izlisbon
ms.topic: conceptual
ms.date: 04/26/2023
ms.custom: mode-portal
---

## Dashboards data protection Overview

Azure Data Explorer Dashboards tell a story through visualizations, and is an excellent way to view your data and see all of your most important insights at a glance. Azure Data Explorer dashboards in the web UI natively support the Kusto Query Language over data hosted in Azure Data Explorer.

This article discusses the steps that Microsoft takes to help keep your dashboards secure and private.

This information will be particularly valuable for those who have prior experience with the Azure Data Explorer Web UI and are interested in learning about Microsoft's approach to safeguarding stored assets associated with [Azure Data Explorer Dashboards](https://dataexplorer.azure.com/dashboards).

## Our commitment

Microsoft is committed to keeping your data safe and secure without compromise. With Azure Data Explorer Dashboards, your data enjoys high availability, robust security measures, and stringent data privacy and integrity enforcement, both at rest and in transit.

## Built on Azure

Azure Data Explorer Dashboards is hosted entirely on Azure. Azure Data Explorer Dashboards uses many core Azure services, including App Service, Cosmos DB, networking and identity.

Azure Data Explorer Dashboards uses Azure Cosmos DB as the primary repository for service metadata and customer data.

Azure Data Explorer Dashboards uses AAD based authentication via Azure Active Directory and Microsoft accounts.

Authorization is validated based on the user's explicit permissions, as well as permissions inherited through group membership. Dashboards' editors can manage the permissions for their dashboards.

## Data privacy

As a Microsoft Service, Azure Data Explorer adheres to [Microsoft's Data protection and privacy guidelines](https://www.microsoft.com/en-us/trust-center/privacy).

### General Data Protection Regulation (GDPR)

Azure Data Explorer Dashboards adheres to The General Data Protection Regulation (GDPR) regulations.

For more information about the GDPR regulation, see the [overview page in the Microsoft Trust Center](https://www.microsoft.com/en-us/trust-center/privacy/gdpr-overview).

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

Microsoft doesn't control or limit the geographies from which you or your users may access your data. If a user navigates to <https://dataexplorer.azure.com/dashboards> while not in the tenant's geography, the request will not get blocked. Instead the user will see a warning.
