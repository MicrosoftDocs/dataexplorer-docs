---
title: Kusto ManagedIdentity policy - Azure Data Explorer
description: This article describes ManagedIdentity policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: slneimer
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 10/24/2021
---
# Managed Identity policy

*ManagedIdentity* is a policy that controls which managed identities can be used for what purposes. For example, one can configure that a specific managed identity can be used in order to access a storage account for ingestion purposes.

This policy can be enabled on the cluster level, and on the database level. The policy is additive, meaning that for every operation that involves a managed identity, Azure Data Explorer will allow the operation if the usage is allowed on the cluster level, or the database level (and not necessarily both).

## The Managed Identity policy object

A cluster or database may have zero, one, or more Managed Identity policy objects associated with it.
Each such object is represented as a JSON property bag, with the following properties defined.

| Property      | Type     | Description                                                                   |
|---------------|----------|-------------------------------------------------------------------------------|
| ObjectId      | `string` | ObjectId of the managed identity                                              |
| ClientId      | `string` | ClientId of the managed identity, displayed for convenience only              |
| TenantId      | `string` | TenantId of the managed identity, displayed for convenience only              |
| DisplayName   | `string` | DisplayName of the managed identity, displayed for convenience only           |
| IsSystem      | `bool`   | An indicator whether the managed identity is a System Managed Identity or not |
| AllowedUsages | `string` | A comma-separated list of allowed usages for the managed identity             |

> [!NOTE]
> When providing a managed identity object to `.alter` command, only the `ObjectId` and `AllowedUsages` properties have to be provided. The other properties should not be provided, and will be automatically filled by Azure Data Explorer, based on the actual properties of the managed identity, with the specified `ObjectId`.
