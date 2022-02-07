---
title: Secure your cluster using Disk Encryption in Azure Data Explorer - Azure portal
description: This article describes how to secure your cluster using Disk Encryption in Azure Data Explorer within the Azure portal.
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: how-to
ms.date: 02/06/2022
---

# Secure your cluster using Disk Encryption in Azure Data Explorer - Azure portal

[Azure Disk Encryption](/azure/security/azure-security-disk-encryption-overview) helps protect and safeguard your data to meet your organizational security and compliance commitments. It provides volume encryption for the OS and data disks of your cluster virtual machines. 

## Encryption options

There are two options for encryption:
- [Encryption at rest at the storage level](#enable-encryption-at-the-storage-level-in-azure-portal) - when you encrypt data in files or directories at the Operating System level, you can adequately protect data at rest. However, the storage system has no knowledge of database objects or structures.
- Encryption at the virtual machine level/disk encryption - it is considered more secure to encrypt data at the level of volumes for data in use.
  
## Enabling encryption at the storage level in Azure portal
  
Your cluster security settings allow you to enable disk encryption on your cluster. Enabling [encryption at rest](/azure/security/fundamentals/encryption-atrest) on your cluster provides data protection for stored data (at rest). The cluster encrypts data at rest utilizing Storage Service Encryption at the blob persistency layer. All underlying storage accounts are by default encrypted with MS-managed keys.
Encrypting the storage accounts with customer-managed keys and disk encryption are optional and can be enabled on a cluster scope.

1. In the Azure portal, go to your Azure Data Explorer cluster resource. Under the **Settings** heading, select **Security**. 

    ![Turn on encryption at rest.](media/manage-cluster-security/security-encryption-at-rest.png)

1. In the **Security** window, select **On** for the **Disk encryption** security setting. 

1. Select **Save**.
 
> [!NOTE]
> Select **Off** to disable the encryption after it has been enabled.

## Enabling encryption at the virtual machine level in Azure portal

???

## Limitations for encryption at the storage level

???

## Limitations for encryption at the virtual machine level

The following limitations apply to [selected volumes](kusto/concepts/sandboxes.md#virtual-machine-sizes) when enabling disk encryption:
* Performance impact of up to a single digit
* Cannot be used with sandboxes

## Azure Data Explorer stores data within a region

Every Azure Data Explorer cluster runs on dedicated resources in the region specified during provisioning. All data is stored within that region.

## Next steps

[Check cluster health](check-cluster-health.md)