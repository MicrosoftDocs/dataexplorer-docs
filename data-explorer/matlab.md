---
title: Integrate MATLAB with Azure Data Explorer
description: This article describes how to integrate MATLAB with Azure Data Explorer.
ms.reviewer: ramacg
ms.topic: how-to
ms.date: 07/04/2023
---

# Integrate MATLAB with Azure Data Explorer

This article explains how to integrate MATLAB with Azure Data Explorer. To establish authentication in MATLAB for Azure Data Explorer, the Azure Identity APIs are used to obtain Azure Active Directory (Azure AD) authentication tokens. These tokens are then employed to interact with Azure Data Explorer using the [Azure Data Explorer REST API](kusto/api/rest/index.md).
