---
title: Time series anomaly detection & forecasting in Azure Data Explorer
description: Learn how to analyze time series data for anomaly detection and forecasting using Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: adieldar
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/24/2019
---

Azure Data Explorer dashboards

# Visualize data with Azure Data Explorer dashboards

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data explorer provides a web application that enables you to run queries and build dashboards. Dashboards are available in the stand-alone web application.

Azure Data Explorer is integrated with other dashboard services like Power BI and Grafana – see docs. When making a decision about the BI service of choice for data in Azure Data Explorer, one should consider the specifics of each BI service and the specifics of the integration with Azure Data Explorer.

Azure Data Explorer dashboards provides 2 main advantages:

1. Natively export queries from the WEB UI to dashboards and in addition allowing users explore the data in a visual in the WEB UI.
2. Dashboard rendering performance optimization.

# Creating dashboards

The new navigation bar allows moving from Query to Dashboards and back. Use it to navigate to the dashboard area.

| Open bar | Closed bar |
| --- | --- |
| ![](RackMultipart20200507-4-jfp3et_html_3c046bd329a5b651.png) | ![](RackMultipart20200507-4-jfp3et_html_9e33869c11361df9.png) |

Click the dashboard button and select a &quot;New dashboard&quot;.

![](RackMultipart20200507-4-jfp3et_html_6e05a12abf2f7338.gif)

Select a dashboard name and click the &quot;Create&quot; button.

![](RackMultipart20200507-4-jfp3et_html_9ebfdd7316cfb79.png)

## Data source

Start with adding the required data sources for the dashboards.

Click the &quot;Data sources&quot; menu item on the top bar and click the &quot;+ New data source&quot; button on the right pane that opened.

![](RackMultipart20200507-4-jfp3et_html_98d1c80139664e3b.gif)

Enter the cluster full url or partial name (including region) and click the &quot;Connect&quot; button.

![](RackMultipart20200507-4-jfp3et_html_6dabc8441da1bae3.gif)

Select the data source from the drop-down list, modify the data source name if needed and click the &quot;Apply&quot;.

![](RackMultipart20200507-4-jfp3et_html_6e1d36a48369604f.gif)

## Parameters

Parameters are used to improve filtering performance. It allows using filter values just in the right place (optimally as early as possible in the query).

Click the &quot;Parameters&quot; menu item on the top bar and click the &quot;+ New parameter&quot; button on the right pane that opened.

![](RackMultipart20200507-4-jfp3et_html_6834f549494ef94f.gif)

Enter values to all the mandatory fields and click the &quot;Done&quot; button at the bottom.

For more details on using parameters please visit - url.

![](RackMultipart20200507-4-jfp3et_html_297f1d443d14708f.png)

## Query

Queries are leveraging KQL snippets to retrieve the data to be displayed in the visuals.

Each query can support a single visual.

You start by selecting the new query either from the dashboard empty canvas or from the top menu bar.

![](RackMultipart20200507-4-jfp3et_html_b7629961ad16f8b3.gif)

In The query screen select the data source, enter the query and execute it.

![](RackMultipart20200507-4-jfp3et_html_6df66845f78c3039.gif)

Select &quot;+ Add visual&quot; and select the visual type (&quot;Query Card&quot;).

![](RackMultipart20200507-4-jfp3et_html_31eb2c7803495141.gif)

Provide the visual with a name and click the &quot;Done editing&quot; button to pin the visual to the dashboard.

![](RackMultipart20200507-4-jfp3et_html_54c0bb42d992c2eb.gif)

You can resize the visual and save the dashboard.

![](RackMultipart20200507-4-jfp3et_html_1008fae8eaded7ed.gif)