---
title: Conditional Access with Azure Data Explorer
description: In this article, you learn how to enable conditional access on your Azure Data Explorer cluster.
ms.reviewer: cosh
ms.topic: how-to
ms.date: 07/03/2022
---

# Conditional Access with Azure Data Explorer

## What is Conditional Access?

The modern security perimeter extends beyond an organization's network to include user and device identity. Organizations can use identity-driven signals as part of their access control decisions. You can use [Microsoft Entra Conditional Access](/azure/active-directory/conditional-access/overview) to bring signals together, to make decisions, and enforce organizational policies.

Conditional Access policies at their simplest are like if-then statements. If a user wants to access a resource, then they must complete an action. For example, a data engineer wants to access Azure Data Explorer but is required to do multi-factor authentication (MFA) to access it.

In the following example, you'll learn how to configure a Conditional Access policy that enforces MFA for selected users using the Azure Data Explorer web UI. You can use the same steps to create other policies to meet your organization's security requirements.

### Prerequisites

Using this feature requires a Microsoft Entra ID P1 or P2 license. To find the right license for your requirements, see [Compare available features of Microsoft Entra ID](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

> [!NOTE]
> Conditional Access policies are only applied to Azure Data Explorer's data administration operations and don't affect any resource administration operations.

> [!TIP]
> Conditional Access policies are applied at the tenant level; hence, it's applied to all clusters in the tenant.

## Configure Conditional Access

1. Sign in to the Azure portal as a global administrator, security administrator, or Conditional Access administrator.

1. Browse to **Microsoft Entra ID** > **Security** > **Conditional Access**.
1. Select **New policy**.

    :::image type="content" source="media/conditional-access/configure-select-conditional-access.png" alt-text="Screenshot of the Security page, showing the Conditional Access tab.":::

1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users and groups**. Under **Include** > **Select users and groups**, select **Users and groups**, add the user or group you want to include for Conditional Access, and then select **Select**.

    :::image type="content" source="media/conditional-access/configure-assign-user.png" alt-text="Screenshot of the users and groups section, showing the assignment of users.":::

1. Under **Cloud apps or actions**, select **Cloud apps**. Under **Include**, select **Select apps** to see a list of all apps available for Conditional Access. Select **Azure Data Explorer** > **Select**.

    > [!TIP]
    > Please make sure you select the Azure Data Explorer app with the following GUID: 2746ea77-4702-4b45-80ca-3c97e680e8b7.

    :::image type="content" source="media/conditional-access/configure-select-apps.png" alt-text="Screenshot of the cloud apps section, showing the selection of the Azure Data Explorer app.":::

1. Under **Conditions**, set the conditions you want to apply for all device platforms and then select **Done**. For more information, see [Microsoft Entra Conditional Access : Conditions](/azure/active-directory/conditional-access/concept-conditional-access-conditions).

    :::image type="content" source="media/conditional-access/configure-select-conditions.png" alt-text="Screenshot of the conditions section, showing the assignment of conditions.":::

1. Under **Access controls**, select **Grant**, select **Require multi-factor authentication**, and then select **Select**.

    :::image type="content" source="media/conditional-access/configure-grant-access.png" alt-text="Screenshot of the access controls section, showing the granting access requirements.":::

1. Set **Enable policy** to **On**, and then select **Save**.

    :::image type="content" source="media/conditional-access/configure-enforce-mfa.png" alt-text="Screenshot of the enable policy section, showing the policy being turned on.":::

1. Verify the policy by asking an assigned user to access the [Azure Data Explorer web UI](https://dataexplorer.azure.com/). The user should be prompted for MFA.

     :::image type="content" source="media/conditional-access/configure-test-policy.png" alt-text="Screenshot of the M F A prompt.":::

## Related content

* [Azure Data Explorer: Zero Trust Security with Conditional Access](https://aka.ms/kusto.conditional.access.blog)
