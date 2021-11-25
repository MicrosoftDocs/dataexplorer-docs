---
title: How to authenticate using managed identities in Azure Data Explorer
description: Learn how to configure managed identities for Azure Data Explorer cluster.
author: orspod
ms.author: orspodek
ms.reviewer: itsagui
ms.service: data-explorer
ms.topic: how-to
ms.date: 11/25/2020
---

# Authenticate using managed identities in your Azure Data Explorer cluster

A [managed identity from Azure Active Directory](/azure/active-directory/managed-identities-azure-resources/overview) allows your cluster to easily access other Azure AD-protected resources such as Azure Storage. The identity is managed by the Azure platform and doesn't require you to provision or rotate any secrets. 

Your Azure Data Explorer cluster can be granted two types of identities:

* **System-assigned identity**: Tied to your cluster and deleted if your resource is deleted. A cluster can only have one system-assigned identity.
* **User-assigned identity**: Standalone Azure resource that can be assigned to 
your cluster. A cluster can have multiple user-assigned identities.

You can now use Managed Identities authentication with Kusto in various supported flows.

## Authenticate with managed identities

In order to authentication with managed identities, follow these steps:
1. [Configure managed identities for your cluster](managed-identities.md#configure-managed-identity-for-your-cluster)
1. [Configure managed identity policy](managed-identities.md#configure-managed-identity-policy)
1. [Use in supported flows](managed-identities.md#execute-queries)

---
## Configure Managed Identity for your cluster

Your cluster needs permissions to act on behalf of the given managed identity. This can be used for both system-assigned and user-assigned managed identities. See full guide [here](azure/data-explorer/managed-identities.md).

## Configure Managed Identity policy

In order to use managed identity in various flows it needs to be permitted by the managed identity policy. In order to configure a managed identity usage in the managed identity policy follow instructions [here](azure/data-explorer/kusto/management/managed-identity-policy).

## Use in supported flows

After assigning the managed identity to your cluster and configuring the relevant managed identity policy usage, you can start using managed identity authentication in the following flows:
* External Tables - create an external table with managed identity authentication.The authentication is stated as part of the connection string (see [storage connection string](/azure/data-explorer/kusto/api/connection-strings/storage#azure-blob-storage) for example). For a step-by-step instructions on using external tables with managed identity authentication please follow this [guide](data-explorer\external-tables-with-managed-identities.md).
* Native Injestion - see [here](azure/data-explorer/ingest-data-event-hub)
* Data Connection - TBD

## Next steps

* [Secure Azure Data Explorer clusters in Azure](security.md)
* [Secure your cluster using Disk Encryption in Azure Data Explorer - Azure portal](cluster-disk-encryption.md) by enabling encryption at rest.
* [Configure customer-managed-keys using C#](customer-managed-keys-csharp.md)
* [Configure customer-managed-keys using the Azure Resource Manager template](customer-managed-keys-resource-manager.md)
