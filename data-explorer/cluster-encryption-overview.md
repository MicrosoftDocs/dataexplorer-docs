---
title: Secure your cluster with encryption in Azure Data Explorer
description: This article describes how to secure your cluster with encryption in Azure Data Explorer.
ms.reviewer: gabil
ms.topic: how-to
ms.date: 04/12/2022
---

# Secure your cluster with encryption in Azure Data Explorer

Azure Data Explorer clusters use Azure Storage for persistent storage where data at rest is encrypted and virtual machine storage for cached data that is deleted when the compute ends. You can use encryption for both types of data to protect and safeguard your data to meet your organizational security and compliance commitments.

## Secure your Azure Storage data with encryption

When you create a cluster, its data is stored in Azure Storage and is automatically [encrypted](/azure/storage/common/storage-service-encryption) at the service level. Azure Storage integrates with [Azure Key Vault](/azure/key-vault/) to store and manage the keys that ensure that all your cluster data is encrypted. Service-level encryption supports the use of either Microsoft-managed keys or customer-managed keys with Azure Key Vault. By default, a Microsoft-managed key is used to encrypt your data.

Optionally, you can enable [double encryption](/azure/storage/common/infrastructure-encryption-enable) at the infrastructure level. When double encryption is enabled, data in the storage account is encrypted twice, once at the service level and once at the infrastructure level, using two different encryption algorithms and two different keys. Double encryption of Azure Storage data protects against a scenario where one of the encryption algorithms or keys may be compromised. In this scenario, the extra layer of encryption continues to protect your data. Infrastructure-level encryption relies on Microsoft-managed keys and always uses a separate key.

If you require a higher level of assurance that your data is secure, use the following options to configure your data at rest:

* [Use your own customer-managed key](customer-managed-keys-portal.md)
* [Enable double encryption](cluster-encryption-double.md)

## Secure your virtual machine storage with encryption

When you create a cluster, its virtual machine cache storage isn't encrypted by default. You can enable disk Encryption to encrypt hot cache stored on the data volumes and the operating system disk of the virtual machines belonging to your cluster. The data is encrypted at rest using Microsoft-managed keys.

Use the steps in [Enable disk encryption](cluster-encryption-disk.md) to secure your data stored in your cluster's virtual machines.

## Azure Data Explorer stores data within a region

Every Azure Data Explorer cluster runs on dedicated resources in a single region. All data is stored within the region.

## Related content

* [Enable double encryption for your cluster](cluster-encryption-double.md)
* [Enable disk encryption for your cluster](cluster-encryption-disk.md)
* [Check cluster health](check-cluster-health.md)
