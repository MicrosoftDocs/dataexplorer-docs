---
title: Use managed identities in Azure Data Explorer
description: Learn how to configure managed identities for Azure Data Explorer scenarios.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 11/25/2020
---
# Managed identities overview

A [managed identity from Azure Active Directory](/azure/active-directory/managed-identities-azure-resources/overview) allows your cluster to easily access other Azure AD-protected resources such as Azure Storage. The identity is managed by the Azure platform and doesn't require you to provision or rotate any secrets. 

Your Azure Data Explorer cluster can be granted two types of identities:

* **System-assigned identity**: Tied to your cluster and deleted if your resource is deleted. A cluster can only have one system-assigned identity.
* **User-assigned identity**: A standalone Azure resource that can be assigned to 
your cluster. A cluster can have multiple user-assigned identities.

Managed identity authentication can be used in Azure Data Explorer for various supported flows. To authenticate with managed identities, follow these steps:

1. [Configure a managed identity for your cluster](#configure-a-managed-identity-for-your-cluster)
1. [Configure the managed identity policy](#configure-the-managed-identity-policy)
1. [Use managed identity in supported workflows](#use-in-supported-workflows)

## Configure a managed identity for your cluster

Your cluster needs permissions to act on behalf of the given managed identity. This assignment can be given for both system-assigned and user-assigned managed identities. For instructions, see [Configure managed identities for your Azure Data Explorer cluster](configure-managed-identities-cluster.md#configure-managed-identities-for-your-azure-data-explorer-cluster).

## Configure the managed identity policy

To use the managed identity, you need to configure the managed identity policy to allow this identity. For instructions, see [Managed Identity policy](kusto/management/managed-identity-policy.md).

The managed identity policy control commands are:
* [.alter managed_identity policy](kusto/management/alter-managed-identity-policy-command.md)
* [.alter-merge managed_identity policy](kusto/management/alter-merge-managed-identity-policy-command.md)
* [.delete managed_identity policy](kusto/management/delete-managed-identity-policy-command.md)
* [.show managed_identity policy](kusto/management/show-managed-identity-policy-command.md)

## Use in supported workflows

After assigning the managed identity to your cluster and configuring the relevant managed identity policy usage, you can start using managed identity authentication in the following workflows:

* **External Tables**: Create an external table with managed identity authentication. The authentication is stated as part of the connection string. (see [storage connection string](./kusto/api/connection-strings/storage-connection-strings.md) for example). For instructions for using external tables with managed identity authentication, see [Authenticate external tables with managed identities](external-tables-managed-identities.md)
* **Event Hub Native Ingestion**: Use a managed identity with event hub native ingestion. For more information, see [Ingest data from event hub into Azure Data Explorer](ingest-data-event-hub.md).

> [!NOTE]
> Attempting to use managed identities in any other flow will result in the following error message: `"Authentication with a Managed Identity is disabled for this flow"`