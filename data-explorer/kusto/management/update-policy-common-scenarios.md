---
title: Optimize Data Models with Table Update Policies
description: Learn how table update policies can streamline data enrichment, routing, and model optimization for medallion architecture and star schema designs.
ms.topic: conceptual
ms.date: 11/04/2025
---
# What are common scenarios for using table update policies

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

This section describes well known scenarios that use update policies. Adopt these scenarios if your circumstances are similar.

In this article, you learn about these common scenarios:

> [!div class="checklist"]
>
> * [Medallion architecture data enrichment](#medallion-architecture-data-enrichment)
> * [Data routing](#data-routing)
> * [Optimizing data models](#optimize-data-models)

## Medallion architecture data enrichment

Update policies on tables let you apply rapid transformations efficiently and are compatible with the [medallion lakehouse architecture in Fabric](/fabric/onelake/onelake-medallion-lakehouse-architecture).

In the medallion architecture, when raw data lands in a landing table (bronze layer), an update policy applies initial transformations and saves the enriched output to a silver layer table. This process cascades, where the data from the silver layer table triggers another update policy to further refine the data and hydrate a gold layer table.

The following diagram shows an example of a data enrichment update policy named **Get_Values**. The enriched data outputs to a silver layer table, which includes a calculated timestamp value and lookup values based on the raw data.

:::image type="content" source="media/update-policy-common-scenarios/medallion-architecture-data-enrichment.png" alt-text="Diagram that shows the medallion architecture data enrichment scenario using update policies.":::

## Data routing

A special case of data enrichment occurs when a raw data element has data that is routed to a different table based on one or more of its attributes.

Consider an example that uses the same base data as the previous scenario, but this time, there are three messages. The first message is a device telemetry message, the second message is a device alarm message, and the third message is an error.

To handle this scenario, three update policies are used. The **Get_Telemetry** update policy filters the device telemetry message, enriches the data, and saves it to the **Device_Telemetry** table. Similarly, the **Get_Alarms** update policy saves the data to the **Device_Alarms** table. Finally, the **Log_Error** update policy sends unknown messages to the **Error_Log** table, letting operators detect malformed messages or unexpected schema evolution.

The following diagram shows the example with the three update policies.

:::image type="content" source="media/update-policy-common-scenarios/data-routing.png" alt-text="Diagram that shows the data routing scenario using update policies.":::

## Optimize data models

Update policies on tables are built for speed. Tables typically conform to [star schema design](/power-bi/guidance/star-schema), which supports developing data models optimized for performance and usability.

Querying tables in a star schema often requires joining tables, but table joins can cause performance issues, especially when querying large volumes of data. Flatten the model by storing denormalized data at ingestion time to improve query performance.

Joining tables at ingestion time operates on a small batch of data, reducing the computational cost of the join. This approach significantly improves the performance of downstream queries.

For example, enrich raw telemetry data from a device by looking up values from a dimension table. An update policy performs the lookup at ingestion time and saves the output to a denormalized table. You can also extend the output with data sourced from a reference data table.

The following diagram shows an example with an update policy named **Enrich_Device_Data**. This policy extends the output data with data sourced from the **Site** reference data table.

:::image type="content" source="media/update-policy-common-scenarios/optimize-data-models.png" alt-text="Diagram that shows the optimized data models scenario using an update policies solution.":::

## Related content

- [Table update policies](update-policy.md)
- [Tutorial: Route data using table update policies](update-policy-tutorial.md)
