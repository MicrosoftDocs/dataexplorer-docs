---
title: Microsoft Logic Apps and Azure Data Explorer
description: Learn how to use Logic Apps to run Kusto queries and commands automatically and schedule them.
ms.reviewer: docohe
ms.topic: how-to
ms.date: 08/11/2024
---

# Microsoft Logic Apps and Azure Data Explorer

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

<!-- //TODO - per Akshay this does work with Fabric but you need to direct user to find the right query uri and take out ADX specific language -->

The [Microsoft Logic Apps](/azure/logic-apps/logic-apps-what-are-logic-apps) connector allows you to run queries and commands automatically as part of a scheduled or triggered task.

Logic Apps and :::no-loc text="Power Automate"::: are built on the same connector. Therefore, the [limitations](/azure/data-explorer/flow#limitations), [actions](/azure/data-explorer/flow#flow-actions), [authentication](/azure/data-explorer/flow#authentication) and [usage examples](/azure/data-explorer/flow-usage) that apply to :::no-loc text="Power Automate":::, also apply to Logic Apps, as mentioned on the [:::no-loc text="Power Automate"::: documentation page](/azure/data-explorer/flow).

:::moniker range="azure-data-explorer"
> [!NOTE]
> In order for a logic app to access to a [network protected cluster](/azure/data-explorer/security-network-private-endpoint), you must add the [outbound IP addresses](/connectors/common/outbound-ip-addresses#azure-logic-apps) associated with the region of your logic app to the firewall allowlist. For more information, see [Manage public access to your Azure Data Explorer cluster](/azure/data-explorer/security-network-restrict-public-access).
:::moniker-end

## Create a logic app with Azure Data Explorer

1. Open the [Microsoft Azure portal](https://ms.portal.azure.com/).
1. Search for "Logic apps" and select the **Logic apps** service.

    :::image type="content" source="media/logic-apps/logic-app-search.png" alt-text="Screenshot of the Azure portal, showing the search for Logic apps." lightbox="media/logic-apps/logic-app-search.png#lightbox":::

1. Select **+Add**.

    :::image type="content" source="media/logic-apps/logic-app-add.png" alt-text="Screenshot of the Logic apps page, showing the add logic app button.":::

1. In the **Create Logic App** pane, fill out your app details, and then select **Review + create**.
1. Verify that the details are correct, and then select **Create**.

    :::image type="content" source="media/logic-apps/logic-app-create-new.png" alt-text="Screenshot of the Create Logic App page, showing the Basics tab filled out.":::

1. When the logic app is created, go to the resource **Overview** page.
1. On the left menu, select **Workflows**, and then select **+ Add**.

    :::image type="content" source="media/logic-apps/logic-app-workflow.png" alt-text="Screenshot of the Workflows page, showing the add workflow button.":::

1. In the **New workflow** pane, fill out the workflow details, and then select **Create**.

    :::image type="content" source="media/logic-apps/logic-app-new-workflow.png" alt-text="Screenshot of the New workflow page, showing the details filled out and the create button.":::

1. In the list of workflows, select your workflow.
1. On the left menu, select **Designer**.
1. Add a recurrence trigger, and under **Choose an operation**, search for **Azure Data Explorer**, and select then the **Azure** results tab.
1. Select **Azure Data Explorer**, and then under **Actions** choose the action you want to use. To learn more about each action, see [flow actions](/azure/data-explorer/flow#flow-actions).

    :::image type="content" source="media/logic-apps/logic-app-kusto-connector-inline.png" alt-text="Screenshot of the designer page, showing the Azure Data Explorer actions." lightbox="media/logic-apps/logic-app-kusto-connector.png":::

## Related content

* To learn more about configuring a recurrence action, see the [:::no-loc text="Power Automate"::: documentation page](/azure/data-explorer/flow).
* Take a look at some [usage examples](/azure-data-explorer/flow-usage) for ideas on configuring your logic app actions.
