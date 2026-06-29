---
title: Configure Conditional Access for Azure Data Explorer
description: Learn how to configure a Conditional Access policy in Microsoft Entra ID to enforce multifactor authentication for Azure Data Explorer.
ms.reviewer: cosh
ms.topic: how-to
ms.date: 06/16/2026
# customer intent: As a security administrator, I want to configure Conditional Access for Azure Data Explorer so that I can enforce multifactor authentication for selected users.
---

# Configure Conditional Access for Azure Data Explorer

Use Conditional Access with Azure Data Explorer to reduce unauthorized access risk by requiring extra verification for selected users during data administration operations.

Conditional Access policies evaluate sign-in context and apply controls such as multifactor authentication (MFA).

In this article, you configure a policy in Microsoft Entra ID that requires MFA for selected users of the Azure Data Explorer web UI.

## Prerequisites

* A Microsoft Entra ID P1 or P2 license. For licensing details, see [Compare available features of Microsoft Entra ID](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).
* At least the [Conditional Access Administrator](/entra/identity/role-based-access-control/permissions-reference#conditional-access-administrator) role.

> [!NOTE]
> Conditional Access policies apply at the tenant level, so they affect all clusters in the tenant. These policies apply to Azure Data Explorer data administration operations and don't affect resource administration operations.

## Configure Conditional Access

Use the following steps to create a policy that requires MFA for selected users in Azure Data Explorer.

1. Sign in to the Azure portal as at least a [Conditional Access Administrator](/entra/identity/role-based-access-control/permissions-reference#conditional-access-administrator).

1. In the Azure portal, go to **Microsoft Entra ID** > **Security** > **Conditional Access**.
1. Select **New policy**.

    :::image type="content" source="media/conditional-access/configure-select-conditional-access.png" alt-text="Screenshot of the Security page, showing the Conditional Access tab.":::

1. Give your policy a name. Use a meaningful naming standard.
1. Under **Assignments**, select **Users and groups**. Under **Include** > **Select users and groups**, select **Users and groups**, add the user or group you want to include for Conditional Access, and then select **Select**.

    :::image type="content" source="media/conditional-access/configure-assign-user.png" alt-text="Screenshot of the users and groups section, showing the assignment of users.":::

1. Under **Cloud apps or actions**, select **Cloud apps**. Under **Include**, select **Select apps** to see a list of all apps available for Conditional Access. Select **Azure Data Explorer** > **Select**.

    > [!NOTE]
    > In some cases, the application name might be displayed as **KustoService**.

    :::image type="content" source="media/conditional-access/configure-select-apps.png" alt-text="Screenshot of the cloud apps section, showing the selection of the Azure Data Explorer app.":::

1. Under **Conditions**, set the conditions that you want to apply for all device platforms, and then select **Done**. For more information, see [Microsoft Entra Conditional Access: Conditions](/azure/active-directory/conditional-access/concept-conditional-access-conditions).

    :::image type="content" source="media/conditional-access/configure-select-conditions.png" alt-text="Screenshot of the conditions section, showing the assignment of conditions.":::

1. Under **Access controls**, select **Grant**, select **Require multi-factor authentication**, and then select **Select**.

    :::image type="content" source="media/conditional-access/configure-grant-access.png" alt-text="Screenshot of the access controls section, showing the granting access requirements.":::

1. Set **Enable policy** to **On**, and then select **Save**.

    :::image type="content" source="media/conditional-access/configure-enforce-mfa.png" alt-text="Screenshot of the enable policy section, showing the policy being turned on.":::

1. Verify the policy by asking an assigned user to access the [Azure Data Explorer web UI](https://dataexplorer.azure.com/). The user is prompted for MFA.

    :::image type="content" source="media/conditional-access/configure-test-policy.png" alt-text="Screenshot of the multifactor authentication prompt shown to a user during sign-in.":::

## Related content

* [Microsoft Entra Conditional Access overview](/azure/active-directory/conditional-access/overview)
