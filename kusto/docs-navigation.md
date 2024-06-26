---
title: KQL docs navigation guide
description: Learn how to understand which version of KQL documentation you are viewing and how to switch to a different version.
ms.topic: conceptual
ms.date: 06/19/2024
---
# KQL docs navigation guide

The behavior of KQL may vary when using this language in different services. When you view any KQL documentation article by using our Learn website, the currently chosen service name is visible above the table of contents (TOC) under the **Version** dropdown. Switch between services using the version dropdown to see the KQL behavior for the selected service.

## Change service selection

If you want to see the documentation for a different version of KQL, select the expander arrow located at the end of the current version moniker. Then select any service you want. When you select a different service, the displayed documentation suddenly changes to show the differences for the newly chosen version. There might or might not be any changes, and both cases are common.

:::image type="content" source="media/docs-navigation/version.gif" alt-text="Screen capture of selecting a different version in the TOC.":::

## HTTPS parameter view=

Each article whose web address begins with `https://learn.microsoft.com/kusto/` has a parameter named `?view=` appended to its address. This parameter value is the versioning moniker code.

The moniker code in the https address always matches the moniker name that is displayed in the versioning control.

## Applies to services

Most of the KQL articles have the words **Applies to** under their title. On the same line, there follows a handy listing of services with indicators of which services are relevant for this article. For example, a certain function could be applicable to Fabric and Azure Data Explorer, but not Azure Monitor or others. If you do not see the service you are using, most likely the article is not relevant to your service. 

## Versions

The following table describes the different versions of KQL and the services they are associated with.

| Version | Description |
|---|---|
| Microsoft Fabric | [Microsoft Fabric](fabric/get-started/microsoft-fabric-overview) is an end-to-end analytics and data platform designed for enterprises that require a unified solution. It encompasses data movement, processing, ingestion, transformation, real-time event routing, and report building. Within the suite of experiences offered in Microsof Fabric, [Real-Time Intelligence](/fabric/real-time-intelligence/overview) is a powerful service that empowers everyone in your organization to extract insights and visualize their data in motion. It offers an end-to-end solution for event-driven scenarios, streaming data, and data logs. <br> <br> The main query environment for KQL in Microsoft Fabric is the [KQL queryset](/fabric/real-time-intelligence/kusto-query-set). <br> <br> KQL in Microsoft Fabric supports query operators, functions, and management commands. |
| Azure Data Explorer | [Azure Data Explorer](/azure/data-explorer/data-explorer-overview) is a fully managed, high-performance, big data analytics platform that makes it easy to analyze high volumes of data in near real time. There are several [query environments and integrations](/azure/data-explorer/integrate-query-overview) that can be used in Azure Data Explorer, including the [web UI](/azure/data-explorer/web-ui-query-overview). <br> <br> KQL in Azure Data Explorer is the full, native version, which supports all query operators, functions, and management commands.|
| Azure Monitor | [Log Analytics](azure/azure-monitor/logs/log-analytics-overview) is a tool in the Azure portal that's used to edit and run log queries against data in the [Azure Monitor](/azure/azure-monitor/overview) Logs store. You interact with Log Anlytics in a [Log Analytics workspace in the Azure portal](/azure/azure-monitor/logs/log-analytics-overview#log-analytics-interface). <br> <br> KQL in Azure Monitor uses a subset of the overall KQL operators and functions. |
| Microsoft Sentinel | [Microsoft Sentinel](/azure/sentinel/overview) is a scalable, cloud-native security information and event management (SIEM) that delivers an intelligent and comprehensive solution for SIEM and security orchestration, automation, and response (SOAR). Microsoft Sentinel provides cyberthreat detection, investigation, response, and proactive hunting, with a bird's-eye view across your enterprise. Microsoft Sentinel is built on top of the Azure Monitor service and it uses Azure Monitor’s Log Analytics workspaces to store all of its data. <br> <br> KQL in Microsoft Sentinel uses a subset of the overall KQL operators and functions. |
| Azure Resource Graph | [Azure Resource Graph](/azure/governance/resource-graph/overview) is an Azure service designed to extend Azure Resource Management by providing efficient and performant resource exploration. You can run queries in [Azure Resource Graph Explorer](/azure/governance/resource-graph/first-query-portal), which is part of Azure portal. <br> <br> [KQL in Azure Resource Graph](/azure/governance/resource-graph/concepts/query-language#supported-kql-language-elements) uses a subset of the overall KQL operators and functions. |