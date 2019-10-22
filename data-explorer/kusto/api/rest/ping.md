---
title: Kusto Ping REST API - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto Ping REST API in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018

---
# Kusto Ping REST API

The ping REST API is provided to allow network devices such as load balancers
to verify simple network responsiveness of the cluster's stateless front-end
components. When a GET verb is applied to this endpoint the cluster responds
by returning a 200 OK HTTP response. The REST API is unauthenticated (the caller
does not need to send an HTTP `Authorization` header).

- Path: `/v1/rest/ping`
- Verb: `GET`
- Actions: Respond with a `200 OK` message
- Arguments: None