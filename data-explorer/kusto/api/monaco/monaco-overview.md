---
title: Integrate the Azure Data Explorer web UI into your app.
description: Learn about the different ways you can integrate the Azure Data Explorer web UI into your apps.
ms.reviewer: gikoifma
ms.topic: conceptual
ms.date: 11/22/2022
---
# Integrate the Azure Data Explorer web UI into your app

You can integrate the Azure Data Explorer web UI into your app and customize the features it provides to suit your needs. Integrating the web UI into your apps enables you to:

- Edit queries (including all language features such as colorization and intellisense)
- Explore table schemas visually
- Authenticate to Azure AD
- Execute queries
- Display query execution results
- Create multiple tabs
- Save queries locally
- Share queries by email

:::image type="content" source="../images/host-web-ux-in-iframe/web-ux.png" alt-text="Screenshot of the Azure Data Explorer web U I.":::

All functionality is tested for accessibility and supports dark and light on-screen themes.

This article describes the different ways you can integrate the Azure Data Explorer web UI into your app.

## Ways to integrate the web UI in you apps

You can integrate the Azure Data Explorer web UI into your apps in the following ways:

- [Integrate the web UI directly in your app](monaco-kusto.md)

    Integrating the web UI into your app offers you an editing experience such as completion, colorization, refactoring, renaming, and go-to-definition. It requires you to build a solution for authentication, query execution, result display, and schema exploration, but offers you full flexibility to fashion the user experience that fits your needs.

- [Embed the web UI in an iframe](host-web-ux-in-iframe.md)

    Embedding the Azure Data Explorer web UI offers you extensive functionality with little effort, but contains limited flexibility for the user experience. There's a fixed set of query parameters that enable limited control over the system's look and behavior.

## Next steps

- [Kusto Query Language (KQL) overview](../../query/index.md)
- [Use Kusto queries](../../query/tutorial.md)
