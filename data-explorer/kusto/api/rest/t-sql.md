---
title: Send T-SQL queries over RESTful web API - Azure Data Explorer
description: This article describes how to use T-SQL queries with the RESTful web API for Azure Data Explorer.
ms.topic: reference
ms.date: 02/05/2023
---

# Send T-SQL queries over the REST API

Azure Data Explorer supports a [subset of the T-SQL language](../tds/sqlknownissues.md). For users who are more comfortable with SQL or have applications that are compatible with SQL, using T-SQL over [Kusto Query Language (KQL)](../../query/index.md) can be a useful way to interact with the data stored in Azure Data Explorer. In this article, we'll dive into the specifics of how to send T-SQL queries over the REST API, including examples to illustrate the process.

## Send a T-SQL query

1. Send the request to the query endpoint with the **csl** property set to the text of the T-SQL query.
1. Set **[request property](../netfx/request-properties.md)** **OptionQueryLanguage** to **sql**.
