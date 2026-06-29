---
title: Integrate Capabilities in Your App
description: Learn about the different ways you can integrate capabilities in your apps.
ms.reviewer: izlisbon
ms.topic: integration
ms.date: 03/15/2026
---

# Integrate query capabilities in your app overview

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

You can integrate query capabilities in your app by adding features that suit your needs. When you integrate these capabilities, your app can:

- Edit queries (including all language features such as colorization and IntelliSense)
- Explore table schemas visually
- Authenticate to Microsoft Entra ID
- Execute queries
- Display query execution results
- Create multiple tabs
- Save queries locally
- Share queries by email

## Integration methods

You can integrate these capabilities into your apps in the following ways:

- [Integrate the Monaco Editor with Kusto Query Language support in your app](monaco-kusto.md)

    By integrating the [Monaco Editor](https://microsoft.github.io/monaco-editor/) in your app, you get an editing experience that includes features such as completion, colorization, refactoring, renaming, and go-to-definition. You need to build a solution for authentication, query execution, result display, and schema exploration. This approach gives you full flexibility to design the user experience that fits your needs.

::: moniker range="azure-data-explorer"
- [Embed the web UI in an IFrame](host-web-ux-in-iframe.md)

    By embedding the web UI, you get extensive functionality with little effort, but it offers limited flexibility for the user experience. There's a fixed set of query parameters that provide limited control over the system's look and behavior.
::: moniker-end

## Related content

- [Kusto Query Language (KQL) overview](../../query/index.md)
- [Write Kusto queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
