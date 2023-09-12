---
title:  Kusto Data library overview
description: This article describes the Kusto Data library for Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 09/07/2023
adobe-target: true
---
# Kusto Data library overview

The Kusto Data library provides a client for querying and managing data in your cluster.

## Get the library

Select the tab for your preferred language.

### [C\#](#tab/csharp)

Install [Microsoft.Azure.Kusto.Data](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Data/).

### [Python](#tab/python)

Install [azure-kusto-data](https://pypi.org/project/azure-kusto-data/).

### [Node.js](#tab/nodejs)

Install [azure-kusto-data](https://www.npmjs.com/package/azure-kusto-data).

### [Java](#tab/java)

Install [kusto-data](https://central.sonatype.com/artifact/com.microsoft.azure.kusto/kusto-data/).

---

## Connect to your cluster

To connect to your cluster, Kusto Data provides a Kusto client object. This object accepts a Kusto connection string builder object as input, which is used to define the cluster URI and authentication mode. For an example, see [Create your first Kusto client app](../../api/get-started/app-hello-kusto.md).

## Run queries and commands

Run [Kusto Query Language (KQL)](../../query/index.md) queries, [T-SQL](../../../t-sql.md) queries, or [management commands](../../management/index.md) by passing the query or command as a string to the relevant Kusto client provider. In response, you'll receive one or more tables containing the results of the query or command. You can customize query behavior by configuring [client request properties](request-properties.md).

## Related content

* [Create an app to run basic queries](../../api/get-started/app-basic-query.md)
* [Create an app to run management commands](../../api/get-started/app-management-commands.md)
