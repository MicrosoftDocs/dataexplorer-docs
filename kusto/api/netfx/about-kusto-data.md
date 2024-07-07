---
title:  Kusto Data library overview
description: This article describes the Kusto Data library.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 09/13/2023
adobe-target: true
---
# Kusto Data library overview

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

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

The Kusto Data library provides a Kusto client object to help you connect to your cluster. This object accepts a Kusto connection string builder object as input, which is used to define the cluster URI and authentication mode. For an example, see [Create your first Kusto client app](../../api/get-started/app-hello-kusto.md).

## Run queries and commands

The Kusto Data library can be used to run [Kusto Query Language (KQL)](../../query/index.md) queries or [T-SQL](../../query/t-sql.md) queries from your own client application. For an example, see [Create an app to run basic queries](../../api/get-started/app-basic-query.md).

You can also run [management commands](../../management/index.md). These commands are requests made to the service to retrieve or modify information that may not necessarily reside within the database tables, such as policies or security roles. For an example, see [Create an app to run management commands](../../api/get-started/app-management-commands.md).

## Related content

* [Kusto Data best practices](kusto-data-best-practices.md)
* [ClientRequestProperties class](client-request-properties.md)
