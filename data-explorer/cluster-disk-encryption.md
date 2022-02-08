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

[Azure Disk Encryption](/azure/security/azure-security-disk-encryption-overview) helps protect and safeguard your data to meet your organizational security and compliance commitments. It provides volume encryption for the OS and data disks of your cluster virtual machines. When you create a cluster, its data storage is [automatically encrypted at the service level](/azure/storage/common/storage-service-encryption). 

If you require a higher level of assurance that your data is secure, you can also enable [infrastructure level encryption](/azure/storage/common/infrastructure-encryption-enable), also known as double encryption. When infrastructure encryption is enabled, data in the storage account is encrypted twice, once at the service level and once at the infrastructure level, using two different encryption algorithms and two different keys. Double encryption of Azure Storage data protects against a scenario where one of the encryption algorithms or keys may be compromised. In this scenario, the additional layer of encryption continues to protect your data.

See:
* [Enabling storage encryption](setting-cluster-storage-encryption.md)
* [Enabling infrastructure encryption](double-encryption.md)

## Azure Data Explorer stores data within a region

Every Azure Data Explorer cluster runs on dedicated resources in a single region. All data is stored within the region.

## Next steps

[Check cluster health](check-cluster-health.md)
