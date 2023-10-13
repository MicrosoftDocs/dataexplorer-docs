---
title: Use managed identities in Azure Data Explorer
description: Learn how to configure managed identities for Azure Data Explorer scenarios.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 07/17/2023
---
# Managed identities overview

A [managed identity from Microsoft Entra ID](/azure/active-directory/managed-identities-azure-resources/overview) allows your cluster to access other Microsoft Entra protected resources such as Azure Storage. The identity is managed by the Azure platform and doesn't require you to provision or rotate any secrets.

## Types of managed identities

Your Azure Data Explorer cluster can be granted two types of identities:

* **System-assigned identity**: Tied to your cluster and deleted if your resource is deleted. A cluster can only have one system-assigned identity.

* **User-assigned identity**: A standalone Azure resource that can be assigned to your cluster. A cluster can have multiple user-assigned identities.

## Authenticate with managed identities

Single-tenant Microsoft Entra resources can only use managed identities to communicate with resources in the same tenant. This limitation restricts the use of managed identities in certain authentication scenarios. For example, you can't use an Azure Data Explorer managed identity to access an event hub located in a different tenant. In such cases, use account-key based authentication.

Azure Data Explorer is multi-tenant capable, which means that you can grant access to managed identities from different tenants. To accomplish this, assign the relevant [security roles](kusto/management/security-roles.md). When assigning the roles, refer to the managed identity as described in [Referencing security principals](kusto/management/referencing-security-principals.md#referencing-azure-ad-principals-and-groups).

To authenticate with managed identities, follow these steps:

1. [Configure a managed identity for your cluster](#configure-a-managed-identity-for-your-cluster)
1. [Configure the managed identity policy](#configure-the-managed-identity-policy)
1. [Use managed identity in supported workflows](#use-the-managed-identity-in-supported-workflows)

### Configure a managed identity for your cluster

Your cluster needs permissions to act on behalf of the given managed identity. This assignment can be given for both system-assigned and user-assigned managed identities. For instructions, see [Configure managed identities for your Azure Data Explorer cluster](configure-managed-identities-cluster.md#configure-managed-identities-for-your-azure-data-explorer-cluster).

### Configure the managed identity policy

To use the managed identity, you need to configure the managed identity policy to allow this identity. For instructions, see [Managed Identity policy](kusto/management/managed-identity-policy.md).

The managed identity policy management commands are:

* [.alter managed_identity policy](kusto/management/alter-managed-identity-policy-command.md)
* [.alter-merge managed_identity policy](kusto/management/alter-merge-managed-identity-policy-command.md)
* [.delete managed_identity policy](kusto/management/delete-managed-identity-policy-command.md)
* [.show managed_identity policy](kusto/management/show-managed-identity-policy-command.md)

### Use the managed identity in supported workflows

After assigning the managed identity to your cluster and configuring the relevant managed identity policy usage, you can start using managed identity authentication in the following workflows:

* **External Tables**: Create an external table with managed identity authentication. The authentication is stated as part of the connection string. For examples, see [storage connection string](./kusto/api/connection-strings/storage-connection-strings.md). For instructions for using external tables with managed identity authentication, see [Authenticate external tables with managed identities](external-tables-managed-identities.md).

* **Continuous Export**: Run a continuous export on behalf of a managed identity.  A managed identity is required if the external table uses impersonation authentication or if the export query references tables in other databases. To use a managed identity, add the managed identity identifier in the optional parameters given in the `create-or-alter` command. For a step-by-step guide, see [Authenticate with managed identity for continuous export](kusto/management/data-export/continuous-export-with-managed-identity.md).

* **Event Hubs Native Ingestion**: Use a managed identity with event hub native ingestion. For more information, see [Ingest data from event hub into Azure Data Explorer](ingest-data-event-hub.md).

* **Python plugin**: Use a managed identity to authenticate to storage accounts of external artifacts that are used in the python plugin. Please note that the `SandboxArtifacts` usage needs to be defined on the cluster level managed identity policy. For more information, see [Python plugin](./kusto/query/pythonplugin.md).

* **SDK based ingestion**: When queuing blobs for ingestion from your own storage accounts, you can use managed identities as an alternative to shared access signature (SAS) tokens and Shared Keys authentication methods. For more information, see [Queue blobs for ingestion using managed identity authentication](ingest-data-managed-identity.md).

* **Ingest from storage**: Ingest data from files located in cloud storages into a target table using managed identity authentication. For more information, see [Ingest from storage](kusto/management/data-ingestion/ingest-from-storage.md).

## See also

* [Configure managed identities for your cluster](configure-managed-identities-cluster.md)
* [Authenticate external tables with managed identities](external-tables-managed-identities.md)
