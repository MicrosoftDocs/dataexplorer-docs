---
title: Enabling cluster storage encryption in Azure Data Explorer - Azure portal
description: This article describes how to secure your cluster using storage encryption in Azure Data Explorer within the Azure portal.
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: how-to
ms.date: 02/08/2022
---

# Enabling storage encryption for your cluster in Azure Data Explorer
  
Your cluster security settings allow you to enable disk encryption on your cluster. Enabling [encryption at rest](/azure/security/fundamentals/encryption-atrest) on your cluster provides data protection for stored data.

1. In the Azure portal, go to your Azure Data Explorer cluster resource. Under the **Settings** heading, select **Security**. 

    ![Turn on encryption at rest.](media/manage-cluster-security/security-encryption-at-rest.png)

1. In the **Security** window, select **On** for the **Disk encryption** security setting. 

1. Select **Save**.
 
> [!NOTE]
> Select **Off** to disable the encryption after it has been enabled.

## Double encryption

When you create a cluster, if you require a higher level of assurance that your data is secure, you can also enable [Azure Storage infrastructure level encryption](/azure/storage/common/infrastructure-encryption-enable). To do this, enable [double encryption](double-encryption.md).

## Next steps

[Check cluster health](check-cluster-health.md)
