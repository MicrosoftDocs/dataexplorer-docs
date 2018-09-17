---
title: Kusto2Mdm - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto2Mdm in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto2Mdm

Kusto2Mdm (formally, "Kusto to MDM Bridge") is a production service operated
by the Geneva Diagnostics team. The service allows one to set up a periodic
job that queries any Kusto database, and imports the query results as MDM
metrics. It is then possible to monitor the metrics, generate alerts based
on them, etc. 

Note that the service requires on-boarding to Geneva MDM.

See [here](https://jarvis.dc.ad.msft.net/?page=documents&section=35825bbb-09d7-4734-934f-658802a93d39&id=6117d983-f7ff-4356-812f-1ef87d632fea#/)
for details.

> [!WARNING]
> While basing monitoring on logs data is doable, Geneva recommends customers to
> use this path only if other monitoring options have been exhausted.

Please see
[here](https://jarvis.dc.ad.msft.net/?page=documents&section=f787c5ad-c22e-48aa-898a-1a042632f9d1&id=f6de9cfb-0e6b-4a65-8232-7959d338eabc)
for the Geneva alerting options recommendations, which state the following
preferred order:
* Invest some time in metric based alerting. Logs based alerting is convenient but is only the right path for a small set of alerts.
* **Local Derived Events-&gt;Metrics**: Generate metrics from logs on your local machines.
* **Logs-&gt;Metrics**: The Geneva backends will do logs to metrics conversation. This is recommended only if the former 2 options don't work.
* The **Kusto-&gt;MDM** pipe also exists. Further improvements in the Kusto->MDM pipe are planned for Scandium. However, you shouldn't need to wait as multiple options exist (and have existed) for years.