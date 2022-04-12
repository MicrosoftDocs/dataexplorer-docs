---
title: Enable cluster disk encryption in Azure Data Explorer
description: This article describes how to secure your cluster using disk encryption in Azure Data Explorer within the Azure portal.
ms.reviewer: gabil
ms.topic: how-to
ms.date: 04/12/2022
---

# Enable disk encryption for your cluster in Azure Data Explorer

Your cluster security settings allow you to enable disk encryption on your cluster. Enabling [encryption at rest](/azure/security/fundamentals/encryption-atrest) on your cluster provides data protection for stored data. Encryption can use a Microsoft-managed key or [customer managed keys](/azure/key-vault/general/basic-concepts.md) stored in the [Azure Key Vault](/azure/key-vault/).

1. In the Azure portal, go to your Azure Data Explorer cluster resource. Under the **Settings** heading, select **Security**.

    ![Turn on encryption at rest.](media/manage-cluster-security/security-encryption-at-rest.png)

1. In the **Security** window, select **On** for the **Disk encryption** security setting.

1. Select **Save**.

> [!NOTE]
> Select **Off** to disable the encryption after it has been enabled.

## Next steps

[Check cluster health](check-cluster-health.md)
