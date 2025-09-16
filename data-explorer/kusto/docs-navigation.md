---
title: KQL docs navigation guide
description: Learn how to understand which version of KQL documentation you are viewing and how to switch to a different version.
ms.topic: conceptual
ms.date: 09/15/2025
---
# KQL docs navigation guide

> [!INCLUDE [applies](includes/applies-to-version/applies.md)] [!INCLUDE [fabric](includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](includes/applies-to-version/sentinel.md)] 

KQL behavior can vary across services. On Microsoft Learn, the selected service name appears above the table of contents (TOC) under the **Version** dropdown. To view behavior for another service, use the **Version** dropdown to switch services.

## Change service selection

To view documentation for another KQL version, select the expander arrow at the end of the current version moniker, then select a service. The page updates to show any differences for that version. Some services have no differences, so the content might not change.

:::image type="content" source="media/docs-navigation/version.gif" alt-text="Screenshot of selecting a different KQL version from the table of contents.":::

## HTTPS view= parameter

Articles at `https://learn.microsoft.com/kusto/` include a `?view=` parameter. The parameter value is the versioning moniker code.

The moniker code in the HTTPS address always matches the moniker name displayed in the versioning control.

## Applies to services

Most KQL articles include **Applies to** under the title. The line lists services and shows which ones the article applies to. For example, a function might apply to Microsoft Fabric and Azure Data Explorer, but not to Azure Monitor. If you don't see your service, the article likely doesn't apply. 

## Versions

This table describes KQL versions and their associated services.

| Version | Description |
|---|---|
| Microsoft Fabric | [Microsoft Fabric](/fabric/get-started/microsoft-fabric-overview) is an end-to-end analytics and data platform for enterprises that need a unified solution. It covers data movement, processing, ingestion, transformation, real-time event routing, and report building. Within the suite of experiences in Microsoft Fabric, [Real-Time Intelligence](/fabric/real-time-intelligence/overview) lets everyone in your organization extract insights and visualize streaming data. It provides an end-to-end solution for event-driven scenarios, streaming data, and data logs. <br> <br> The main query environment for KQL in Microsoft Fabric is the [KQL queryset](/fabric/real-time-intelligence/kusto-query-set). <br> <br> KQL in Microsoft Fabric supports query operators, functions, and management commands. |
| Azure Data Explorer | [Azure Data Explorer](/azure/data-explorer/data-explorer-overview) is a fully managed, high-performance analytics platform for near real-time analysis of large data volumes. Use several [query environments and integrations](/azure/data-explorer/integrate-query-overview), including the [web UI](/azure/data-explorer/web-ui-query-overview). <br> <br> KQL in Azure Data Explorer is the full native version. It supports all query operators, functions, and management commands.|
| Azure Monitor | [Log Analytics](/azure/azure-monitor/logs/log-analytics-overview) is a tool in the Azure portal you use to edit and run log queries against data in the [Azure Monitor](/azure/azure-monitor/overview) Logs store. Use Log Analytics in a [Log Analytics workspace in the Azure portal](/azure/azure-monitor/logs/log-analytics-overview#log-analytics-interface). <br> <br> KQL in Azure Monitor uses a subset of KQL operators and functions. |
| Microsoft Sentinel | [Microsoft Sentinel](/azure/sentinel/overview) is a scalable, cloud-native security information and event management (SIEM) platform with security orchestration, automation, and response (SOAR). It provides threat detection, investigation, response, and proactive hunting across your enterprise. It uses Azure Monitor Log Analytics workspaces to store its data. <br> <br> KQL in Microsoft Sentinel uses a subset of KQL operators and functions. |
