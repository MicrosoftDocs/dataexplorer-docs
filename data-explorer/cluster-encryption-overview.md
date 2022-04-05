---
title: Secure your cluster with encryption in Azure Data Explorer - Azure portal
description: This article describes how to secure your with encryption in Azure Data Explorer within the Azure portal.
ms.reviewer: gabil
ms.topic: how-to
ms.date: 02/08/2022
---

# Secure your cluster with encryption in Azure Data Explorer

Azure Data Explorer clusters use persistent storage where data at rest is encrypted, and cache storage that is deleted when the compute ends.

[Azure Disk Encryption](/azure/security/azure-security-disk-encryption-overview) helps protect and safeguard your data to meet your organizational security and compliance commitments. It provides volume encryption for the operating system and data disks of your cluster virtual machines. When you create a cluster, its data storage data is [automatically encrypted](/azure/storage/common/storage-service-encryption) at the [service level](setting-cluster-storage-encryption.md). Data storage integrates with [Azure Key Vault](/azure/key-vault/) to store Microsoft or customer managed key, which are used to control and manage disk encryption keys and secrets, and ensure all data on cluster disks is encrypted. Storage encryption is automatically applied using a Microsoft or customer managed key stored in the Azure Key Vault.

If you require a higher level of assurance that your data is secure, you can enable [double encryption](/azure/storage/common/infrastructure-encryption-enable). When double encryption is enabled, data in the storage account is encrypted twice at the storage level, using two different encryption algorithms and two different keys. Double encryption of Azure Storage data protects against a scenario where one of the encryption algorithms or keys may be compromised. In this scenario, the additional layer of encryption continues to protect your data.

Use the following links to learn more about the supported encryption:

* [Enable storage encryption](storage-encryption.md)
* [Enable double encryption](double-encryption.md)

## Azure Data Explorer stores data within a region

Every Azure Data Explorer cluster runs on dedicated resources in a single region. All data is stored within the region.

## Next steps

[Check cluster health](check-cluster-health.md)
