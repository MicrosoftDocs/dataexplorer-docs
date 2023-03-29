---
title: include file
description: include file
ms.topic: include
ms.date: 09/07/2022
ms.reviewer: orhasban
ms.custom: include file
---
## Azure Data Explorer data connection authentication mechanisms

- [Managed Identity](../managed-identities-overview.md) based data connection (recommended): Using a managed identity-based data connection is the most secure way to connect to data sources. It provides full control over the ability to fetch data from a data source.
Setup of a data connection using managed identity requires the following steps:
  1. [Add a managed identity to your cluster](../configure-managed-identities-cluster.md).
  1. [Grant permissions to the managed identity on the data source](../ingest-data-managed-identity.md#grant-permissions-to-the-managed-identity).
  1. Set a [managed identity policy](../kusto/management/managed-identity-policy.md) on the target databases.
  1. Create a data connection using the managed identity authentication to fetch data.

> [!CAUTION]
> If the managed identity permissions are removed from the data source, the data connection is disabled and can't fetch data from the data source.

- Key-based data connection: If a managed identity is not specified in the data connection, the connection automatically defaults to key-based authentication. Key-based connections fetch data using a resource connection string, such as the [Azure Event Hubs connection string](/azure/event-hubs/event-hubs-get-connection-string). Azure Data Explorer generates the resource connection string for the specified resource and securely saves it in the data connection. The connection string is then used to fetch data from the data source.

> [!CAUTION]
> If the key is rotated, the data connection is disabled and can't fetch data from the data source. To fix the issue, update or recreate the data connection.
