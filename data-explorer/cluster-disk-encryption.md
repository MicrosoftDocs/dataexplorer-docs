---
title: Secure your cluster using Disk Encryption in Azure Data Explorer - Azure portal
description: This article describes how to secure your cluster using Disk Encryption in Azure Data Explorer within the Azure portal.
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: how-to
ms.date: 02/08/2022
---

# Securing your cluster with encryption in Azure Data Explorer

Azure Data Explorer uses two types of storage - persistent storage where data at rest is encrypted, and cache storage that is deleted when the compute ends.

[Azure Disk Encryption](/azure/security/azure-security-disk-encryption-overview) helps protect and safeguard your data to meet your organizational security and compliance commitments. It provides volume encryption for the OS and data disks of your cluster virtual machines. When you create a cluster, its data storage is [automatically encrypted at the service level](/azure/storage/common/storage-service-encryption). Data storage integrates with [Azure Key Vault](/azure/key-vault/), which allows us to control and manage the disk encryption keys and secrets, and ensure all data on the VM disks is encrypted. Storage encryption is automatically applied using a Microsoft managed key or customer managed key stored in the Azure Key Vault.

If you require a higher level of assurance that your data is secure, you can enable [double encryption](/azure/storage/common/infrastructure-encryption-enable). When double encryption is enabled, data in the storage account is encrypted twice at the storage level, using two different encryption algorithms and two different keys. Double encryption of Azure Storage data protects against a scenario where one of the encryption algorithms or keys may be compromised. In this scenario, the additional layer of encryption continues to protect your data.

See:
* [Automatic storage encryption](setting-cluster-storage-encryption.md)
* [Enabling double encryption](double-encryption.md)

## Azure Data Explorer stores data within a region

Every Azure Data Explorer cluster runs on dedicated resources in a single region. All data is stored within the region.

## Next steps

[Check cluster health](check-cluster-health.md)
