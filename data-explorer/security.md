---
title: Secure Azure Data Explorer clusters in Azure
description: Learn about how to secure clusters in Azure Data Explorer.
author: shsagir
ms.author: shsagir
ms.reviewer: itsagui
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/04/2021
---

# Security in Azure Data Explorer

This article provides an introduction to security in Azure Data Explorer to help you protect your data and resources in the cloud and meet the security needs of your business. It's important to keep your clusters secure. Securing your clusters includes one or more Azure features that include secure access and storage. This article provides information to help you keep your cluster secure.

## Network security

Network security is a requirement shared by many of our security-conscious enterprise customers. The intent is to isolate the network traffic and limit the attack surface for Azure Data Explorer and corresponding communications. You can therefore block traffic originating from non Azure Data Explorer network segments and assure that only traffic from known sources reach Azure Data Explorer end points. This includes traffic originating on-premises or outside of Azure, with an Azure destination and vice versa.

Azure Data Explorer supports [virtual network injection](vnet-deployment.md) to directly deploy into your virtual network. Both the engine and data management endpoints can be privately accessed. This allows Azure Data Explorer to be accessible through non-internet routed addresses.

For more information, see the following topics.

* [Create an Azure Data Explorer cluster in your virtual network](vnet-create-cluster-portal.md)
* [Deploy Azure Data Explorer cluster into your Virtual Network](vnet-deployment.md)
* [Troubleshoot access, ingestion, and operation of your Azure Data Explorer cluster in your virtual network](vnet-deploy-troubleshoot.md)
* [Create a Private Endpoint in your Azure Data Explorer cluster in your virtual network (preview)](vnet-create-private-endpoint.md)
* [Create a private or service endpoint to Event Hub and Azure Storage](vnet-endpoint-storage-event-hub.md)

## Identity and access control

### Role-based access control

Use [role-based access control (RBAC)](/azure/role-based-access-control/overview) to segregate duties and grant only the required access to cluster users. Instead of giving everybody unrestricted permissions on the cluster, you can allow only users assigned to specific roles to perform certain actions. You can configure [access control for the databases](manage-database-permissions.md) in the [Azure portal](/azure/role-based-access-control/role-assignments-portal), using the [Azure CLI](/azure/role-based-access-control/role-assignments-cli), or [Azure PowerShell](/azure/role-based-access-control/role-assignments-powershell).

### Managed identities for Azure resources

A common challenge when building cloud applications is credentials management in your code for authenticating to cloud services. Keeping the credentials secure is an important task. The credentials shouldn't be stored in developer workstations or checked into source control. Azure Key Vault provides a way to securely store credentials, secrets, and other keys, but your code has to authenticate to Key Vault to retrieve them.

The Azure Active Directory (Azure AD) managed identities for Azure resources feature solves this problem. The feature provides Azure services with an automatically managed identity in Azure AD. You can use the identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code. For more information about this service, see [managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/overview) overview page.

## Data protection

### Azure disk encryption

[Azure Disk Encryption](/azure/security/azure-security-disk-encryption-overview) helps protect and safeguard your data to meet your organizational security and compliance commitments. It provides volume encryption for the OS and data disks of your cluster's virtual machines. Azure Disk Encryption also integrates with [Azure Key Vault](/azure/key-vault/), which allows us to control and manage the disk encryption keys and secrets, and ensure all data on the VM disks is encrypted.

### Customer-managed keys with Azure Key Vault

By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys to use for data encryption. You can manage encryption of your data at the storage level with your own keys. A customer-managed key is used to protect and control access to the root encryption key, which is used to encrypt and decrypt all data. Customer-managed keys offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data.

Use Azure Key Vault to store your customer-managed keys. You can create your own keys and store them in a key vault, or you can use an Azure Key Vault API to generate keys. The Azure Data Explorer cluster and the Azure Key Vault must be in the same region, but they can be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](/azure/key-vault/key-vault-overview). For a detailed explanation on customer-managed keys, see [Customer-managed keys with Azure Key Vault](/azure/storage/common/storage-service-encryption). Configure customer-managed keys in your Azure Data Explorer cluster using [C#](customer-managed-keys-csharp.md) or the [Azure Resource Manager template](customer-managed-keys-resource-manager.md)

> [!Note]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Azure Active Directory (Azure AD). To configure customer-managed keys in the Azure portal, you need to configure a **SystemAssigned** managed identity to your cluster as detailed in [Configure managed identities for your Azure Data Explorer cluster](managed-identities.md).

#### Store customer-managed keys in Azure Key Vault

To enable customer-managed keys on a cluster, use an Azure Key Vault to store your keys. You must enable both the **Soft Delete** and **Do Not Purge** properties on the key vault. The key vault must be located in the same subscription as the cluster. Azure Data Explorer uses managed identities for Azure resources to authenticate to the key vault for encryption and decryption operations. Managed identities don't support cross-directory scenarios.

#### Rotate customer-managed keys

You can rotate a customer-managed key in Azure Key Vault according to your compliance policies. When the key is rotated, you must update the cluster to use the new key URI. Rotating the key doesn't trigger re-encryption of data in the cluster.

#### Revoke access to customer-managed keys

To revoke access to customer-managed keys, use PowerShell or Azure CLI. For more information, see [Azure Key Vault PowerShell](/powershell/module/az.keyvault/) or [Azure Key Vault CLI](/cli/azure/keyvault). Revoking access blocks access to all data in the cluster's storage level, since the encryption key is consequently inaccessible by Azure Data Explorer.

> [!Note]
> When Azure Data Explorer identifies that access to a customer-managed key is revoked, it will automatically suspend the cluster to delete any cached data. Once access to the key is returned, the cluster needs to be resumed manually.

## Next steps

* [Secure your cluster using Disk Encryption in Azure Data Explorer - Portal](cluster-disk-encryption.md) by enabling encryption at rest.
* [Configure managed identities for your Azure Data Explorer cluster](managed-identities.md)
* [Configure customer-managed-keys using the Azure Resource Manager template](customer-managed-keys-resource-manager.md)
* [Configure customer-managed-keys using C#](customer-managed-keys-csharp.md)
