---
title: How to authenticate using managed identities in Azure Data Explorer
description: Learn how to configure managed identities for Azure Data Explorer cluster.
author: orspod
ms.author: orspodek
ms.reviewer: itsagui
ms.service: data-explorer
ms.topic: reference
ms.date: 11/25/2020
---
# Managed identities overview

A [managed identity from Azure Active Directory](/azure/active-directory/configure-configure-managed-identities-cluster-cluster-azure-resources/overview) allows your cluster to easily access other Azure AD-protected resources such as Azure Storage. The identity is managed by the Azure platform and doesn't require you to provision or rotate any secrets. 

Your Azure Data Explorer cluster can be granted two types of identities:

* **System-assigned identity**: Tied to your cluster and deleted if your resource is deleted. A cluster can only have one system-assigned identity.
* **User-assigned identity**: Standalone Azure resource that can be assigned to 
your cluster. A cluster can have multiple user-assigned identities.

Managed identity authentication can be used in Azure Data Explorer for various supported flows.

## Authenticate with managed identities

In order to authentication with managed identities, follow these steps:
1. [Configure managed identities for your cluster](#configure-managed-identity-for-your-cluster)
1. [Configure managed identity policy](#configure-managed-identity-policy)
1. [Use in supported flows](#use-in-supported-flows)

## Configure managed identity for your cluster

Your cluster needs permissions to act on behalf of the given managed identity. This can be used for both system-assigned and user-assigned managed identities. See full guide [here](azure/data-explorer/configure-configure-managed-identities-cluster-cluster.md).

## Configure managed identity policy

In order to use managed identity in various flows it needs to be permitted by the managed identity policy. In order to configure a managed identity usage in the managed identity policy follow instructions [here](azure/data-explorer/kusto/management/managed-identity-policy).

## Use in supported flows

After assigning the managed identity to your cluster and configuring the relevant managed identity policy usage, you can start using managed identity authentication in the following flows:
* External Tables - create an external table with managed identity authentication.The authentication is stated as part of the connection string (see [storage connection string](/azure/data-explorer/kusto/api/connection-strings/storage#azure-blob-storage) for example). For a step-by-step instructions on using external tables with managed identity authentication please follow this [guide](data-explorer\external-tables-with-configure-configure-managed-identities-cluster-cluster.md).
* Native Ingestion - Event Hub native ingestion can be done using managed identity authentication. See [the official docs](azure/data-explorer/ingest-data-event-hub)