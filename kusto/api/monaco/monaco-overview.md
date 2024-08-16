---
title: Integrate capabilities in your app.
description: Learn about the different ways you can integrate capabilities in your apps.
ms.reviewer: izlisbon
ms.topic: conceptual
ms.date: 08/11/2024
---
# Integrate query capabilities in your app overview

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

You can integrate query capabilities in your app with features to suit your needs. Integrating capabilities in your app enables you to:

- Edit queries (including all language features such as colorization and intellisense)
- Explore table schemas visually
- Authenticate to Microsoft Entra ID
- Execute queries
- Display query execution results
- Create multiple tabs
- Save queries locally
- Share queries by email

## Integration methods

You can integrate capabilities in your apps in the following ways:

- [Integrate the Monaco Editor with Kusto Query Language support in your app](monaco-kusto.md)

    Integrating the [Monaco Editor](https://microsoft.github.io/monaco-editor/) in your app offers you an editing experience such as completion, colorization, refactoring, renaming, and go-to-definition. It requires you to build a solution for authentication, query execution, result display, and schema exploration. It offers you full flexibility to fashion the user experience that fits your needs.

::: moniker range="azure-data-explorer"
- [Embed the web UI in an IFrame](host-web-ux-in-iframe.md)

    Embedding the web UI offers you extensive functionality with little effort, but contains limited flexibility for the user experience. There's a fixed set of query parameters that enable limited control over the system's look and behavior.
::: moniker-end

## Related content

- [Kusto Query Language (KQL) overview](../../query/index.md)
- [Write Kusto queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
