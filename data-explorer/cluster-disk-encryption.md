---
title: Secure your cluster using Disk Encryption in Azure Data Explorer - Azure portal
description: This article describes how to secure your cluster using Disk Encryption in Azure Data Explorer within the Azure portal.
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: how-to
ms.date: 08/02/2020
---

# Secure your cluster using Disk Encryption in Azure Data Explorer - Azure portal

[Azure Disk Encryption](/azure/security/azure-security-disk-encryption-overview) helps protect and safeguard your data to meet your organizational security and compliance commitments. It provides volume encryption for the OS and data disks of your cluster virtual machines. It also integrates with [Azure Key Vault](/azure/key-vault/), which allows us to control and manage the disk encryption keys and secrets, and ensure all data on the VM disks is encrypted.
  
## Enable encryption at rest in the Azure portal
  
Your cluster security settings allow you to enable disk encryption on your cluster. Encryption at rest and disk encryption are different. Enabling [encryption at rest](/azure/security/fundamentals/encryption-atrest) on your cluster provides data protection for stored data (at rest). The cluster encrypts data at rest utilizing Storage Service Encryption at the blob persistency layer. All underlying storage accounts are by default encrypted with MS-managed keys.
Encrypting the storage accounts with customer-managed keys and disk encryption are optional and can be enabled on a cluster scope.

1. In the Azure portal, go to your Azure Data Explorer cluster resource. Under the **Settings** heading, select **Security**. 

    ![Turn on encryption at rest.](media/manage-cluster-security/security-encryption-at-rest.png)

1. In the **Security** window, select **On** for the **Disk encryption** security setting. 

1. Select **Save**.
 
> [!NOTE]
> Select **Off** to disable the encryption after it has been enabled.

## Azure Data Explorer stores data within a region

Every Azure Data Explorer cluster runs on dedicated resources in a single region. All data is stored within the region. 

## Next steps

[Check cluster health](check-cluster-health.md)