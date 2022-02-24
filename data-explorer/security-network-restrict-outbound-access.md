---
title: Restrict outbound access from your Azure Data Explorer cluster
description: In this article you will learn how to restrict the outbound access access from your Azure Data Explorer cluster to other services.
author: shsagir
ms.author: shsagir
ms.reviewer: eladb
ms.service: data-explorer
ms.topic: how-to
ms.date: 02/23/2022
---

# Restrict outbound access from your Azure Data Explorer cluster

Restricting outbound access of your cluster is important to mitigate risks like data exfiltration. A malicious actor could potentially create an external table to a storage account and extract large amounts of data. You can control outbound access at the cluster level by defining [callout policies](kusto/management/calloutpolicy.md). Managing callout policies enables you to allow outbound access to specified SQL, storage, or other endpoints.

In this article, you'll learn how about an extension to callout policies that enables you to further restrict call outs from your cluster.

## Types of callout policies

Callout policies can be divided, as follows:

* **Immutable callout policies**: These are the standard policies of a cluster. They are preconfigured and cannot be modified.
* **Cluster callout policies**: These are policies that you can modify using callout policy commands.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Create [a cluster and database](create-cluster-database-portal.md), or use the Azure Data Explorer help cluster.

## Run callout policy commands

1. Sign in to the [Azure Data Explorer Web UI](https://dataexplorer.azure.com/).

1. On the left menu, select **Query**, and then connect to your cluster.
1. In the query window, run the following query to inspect the list of immutable callout policies on your cluster:

    ```kusto
    .show cluster policy callout
    ```

    :::image type="content" source="media/security-network-restrict-access/restrict-outbound-access.png" alt-text="Immutable callout policies.":::

The following shows an example of immutable callout policies. Notice that in the list there are a few default rules that allow making calls out to other services, such as external data.

```json
[
   {
      "CalloutType":"kusto",
      "CalloutUriRegex":"[a-z0-9]{3,22}\\.(\\w+\\.)?kusto(mfa)?\\.windows\\.net/?$",
      "CanCall":true
   },
   {
      "CalloutType":"kusto",
      "CalloutUriRegex":"//[a-z0-9]{3,22}\\.[a-z0-9-]{1,50}\\.(kusto\\.azuresynapse|kustodev\\.azuresynapse-dogfood)\\.net/?$",
      "CanCall":true
   },
   {
      "CalloutType":"kusto",
      "CalloutUriRegex":"^https://([A-Za-z0-9]+\\.)?(ade|adx)\\.(int\\.)?(applicationinsights|loganalytics|monitor)\\.(io|azure(\\.com|\\.us|\\.cn))/",
      "CanCall":true
   },
   {
      "CalloutType":"sql",
      "CalloutUriRegex":"[a-z0-9][a-z0-9\\-]{0,61}[a-z0-9]?\\.database\\.windows\\.net/?$",
      "CanCall":true
   },
   {
      "CalloutType":"sql",
      "CalloutUriRegex":"[a-z0-9-]{0,61}?(-ondemand)?\\.sql\\.azuresynapse(-dogfood)?\\.net/?$",
      "CanCall":true
   },
   {
      "CalloutType":"external_data",
      "CalloutUriRegex":".*",
      "CanCall":true
   },
   {
      "CalloutType":"azure_digital_twins",
      "CalloutUriRegex":"[A-Za-z0-9\\-]{3,63}\\.api\\.[A-Za-z0-9]+\\.digitaltwins\\.azure\\.net/?$",
      "CanCall":true
   }
]
```

## Empty the list of immutable callout policies

To restrict outbound access to from your cluster, you must empty the list of immutable callout policies. You can do this by running the following command using the Azure CLI or any other tools by calling the Azure Data Explorer APIs.

1. Run the following command using the Azure CLI:

    ```bash
    az kusto cluster update --resource-group "restricted-rg" --name "restricted" --subscription "sid" --verbose  --set properties.restrictOutboundNetworkAccess="Enabled"
    ```

    Updating the `restrictOutboundNetworkAccess` cluster property removes all the immutable policies on your cluster. This prevents initiating call outs to other services as shown in the following example.

    :::image type="content" source="media/security-network-restrict-access/restrict-outbound-access-enabled-errorDataplane.png" alt-text="Immutable callout policies error.":::

1. Run the following command again and verify that the list of immutable callout policies is empty:

    ```kusto
    .show cluster policy callout
    ```

    :::image type="content" source="media/security-network-restrict-access/restrict-outbound-access-enabled.png" alt-text="Immutable callout policies":::

## Add FQDNs to the callouts under restricted conditions

If you want to allow outbound access to a specific FQDN, you can add it to the `AllowedFQDNList` list for your cluster. You can do this by running the following command using the Azure CLI or any other tools by calling the Azure Data Explorer APIs.

```bash
az kusto cluster update --resource-group "restricted-rg" --name "restricted" --subscription "sid" --verbose  --addAllowedFQDN "adedicated.sql.azuresynapse.net"
```

By adding the FQDN to the allowed list, you'll be able to make call outs to the specified FQDN.

## Next steps

* [Troubleshooting Private Endpoints in Azure Data Explorer](security-network-private-endpoint-troubleshoot.md)
