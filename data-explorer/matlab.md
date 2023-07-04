---
title: Integrate MATLAB with Azure Data Explorer
description: This article describes how to integrate MATLAB with Azure Data Explorer.
ms.reviewer: ramacg
ms.topic: how-to
ms.date: 07/04/2023
---

# Integrate MATLAB with Azure Data Explorer

This article explains how to integrate MATLAB with Azure Data Explorer. To establish authentication in MATLAB for Azure Data Explorer, the Azure Identity APIs are used to obtain Azure Active Directory (Azure AD) authentication tokens. These tokens are then employed to interact with Azure Data Explorer using the [Azure Data Explorer REST API](kusto/api/rest/index.md).

## How to authenticate a user

To obtain an authentication token for a user, an interactive authentication flow prompts the user to sign-in through a browser window.

The Azure Identity library provides solutions for user authentication. In this section, learn how to authenticate users using MSAL.NET for .NET-based applications and MSAL4J or Matlab-Azure for Java-based applications. If you're running MATLAB on a Windows OS, we recommend using MSAL.NET. However, if you're running MATLAB on Linux, you must use MSAL4J or Matlab-Azure.

## How to authenticate an application

## Next steps