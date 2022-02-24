---
title: Conditional Access with Azure Data Explorer 
description: 'In this article, you learn how to enable conditional access on your Azure Data Explorer cluster .'
author: anshulsharmas
ms.author: anshulsharmas
ms.reviewer: cosh
ms.service: data-explorer
ms.topic: how-to
ms.date: 21/02/2022
ms.custom: references_regions
---

# Conditional Access with Azure Data Explorer

## What is Conditional Access?

The modern security perimeter now extends beyond an organization's network to include user and device identity. Organizations can use identity-driven signals as part of their access control decisions. If you are familiar with [Azure AD (Azure Active Directory) Conditional Access](https://docs.microsoft.com/en-us/azure/active-directory/conditional-access/overview), it brings signals together, to make decisions, and enforce organizational policies.  

Conditional Access policies at their simplest are if-then statements, if a user wants to access a resource, then they must complete an action. For example, a data engineer wants to access Azure Data Explorer but is required to do multi-factor authentication to access it.

[Azure  Data Explorer](https://docs.microsoft.com/en-us/azure/data-explorer/) now supports Conditional Access. The following steps show how to configure Azure Data Explorer to enforce a Conditional Access policy. In this example, we will enforce Multi factor Authentication (MFA) for selected users.

### Prerequisites

Using this feature requires an Azure AD Premium license. To find the right license for your requirements, see [Compare available features of Azure AD](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

> [!NOTE] Please note Conditional Access policies are applied only to Azure Data Explorer Data plane operations, it does not affect any Control plane operations. For more details, see [Azure Control & Data plane](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/control-plane-and-data-plane).

> [!TIP]
> Conditional Access policies are applied at the tenant level - so it will apply to all Azure Data > Explorer clusters in the tenant.

## Configure conditional access 

1. Sign into the Azure portal, select **Azure Active Directory**, select the Security Blade & then select **Conditional Access**.

    :::image type="content" source="media/conditional-access/configure-select-ca.png" alt-text="Select the isolated compute SKU.":::
    
2. In the **Conditional Access-Policies** blade, click **new policy**, and provide a name. 

3. Under **Assignments**, select **Users and groups**, check **Select users and groups**, and then select the user or group for Conditional Access. Click **Select** to accept your selection. 

    :::image type="content" source="media/conditional-access/configure-assign-user.png" alt-text="Select the isolated compute SKU.":::

4. Select **Cloud apps**, click **Select apps**. You see all apps available for Conditional Access. Select **Azure Data Explorer**, at the bottom click **Select**, and then click **Done**. 
> [!TIP]
> Please make sure you select the first party app Azure Data Explorer with the associated guid as shown below. 

    :::image type="content" source="media/conditional-access/configure-select-apps.png" alt-text="Select the isolated compute SKU.":::

5. Select any **Conditions** you want to apply. We will enable it for all Device platforms. For more details, see [Azure Active Directory Conditional Access : Conditions](https://docs.microsoft.com/en-us/azure/active-directory/conditional-access/concept-conditional-access-conditions).  

    :::image type="content" source="media/conditional-access/configure-select-conditions.png" alt-text="Select the isolated compute SKU.":::

6. Next select **Access controls**, select **Grant**, and then check the policy you want to apply. For this example, we select **Require multi-factor authentication**. 

    :::image type="content" source="media/conditional-access/configure-grant-access.png" alt-text="Select the isolated compute SKU.":::

7. Enable policy by switching the toggle **On** and click **Save**. 

    :::image type="content" source="media/conditional-access/configure-enforce-mfa.png" alt-text="Select the isolated compute SKU.":::

8. Test the policy by accessing the [ADX Web Explorer ](https://dataexplorer.azure.com/) or [Kusto Explorer](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/tools/kusto-explorer). The configured user should be prompted for MFA. 

     :::image type="content" source="media/conditional-access/configure-test-policy.png" alt-text="Select the isolated compute SKU.":::

## Summary 

We configured Azure Data Explorer to enforce a Conditional Access policy - **Required multi-factor authentication** for the selected user. Similarly, you can create additional policies suitable to your organizations security posture.

## Next steps

* [Azure Data Explorer: Zero Trust Security with Conditional Access ](<<link to the blog>> )