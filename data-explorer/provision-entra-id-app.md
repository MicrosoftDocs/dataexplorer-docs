---
title: Create a Microsoft Entra application in Azure Data Explorer
description: Learn how to create a Microsoft Entra application in Azure Data Explorer.
ms.reviewer: herauch
ms.topic: how-to
ms.date: 01/11/2024
---

# Create a Microsoft Entra application registration in Azure Data Explorer

[Microsoft Entra application authentication](/entra/identity-platform/howto-create-service-principal-portal) is used for applications, such as an unattended service or a scheduled flow, that need to access Azure Data Explorer without a user present. If you're connecting to an Azure Data Explorer database using an application, such as a web app, you should authenticate using service principal authentication. This article details how to create and register a Microsoft Entra service principal and then authorize it to access an Azure Data Explorer database.

<a name='create-azure-ad-application-registration'></a>

[!INCLUDE [provision-entra-id-app](includes/cross-repo/provision-entra-id-app.md)]