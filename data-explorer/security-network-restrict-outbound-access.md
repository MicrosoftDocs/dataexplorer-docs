---
title: Restrict outbound access from your Azure Data Explorer cluster
description: In this article, you'll learn how to restrict the outbound access from your Azure Data Explorer cluster to other services.
ms.reviewer: eladb
ms.topic: how-to
ms.date: 11/13/2022
---

# Restrict outbound access from your Azure Data Explorer cluster

Restricting outbound access of your cluster is important to mitigate risks like data exfiltration. A malicious actor could potentially create an external table to a storage account and extract large amounts of data. You can control outbound access at the cluster level by defining [callout policies](kusto/management/callout-policy.md). Managing callout policies enables you to allow outbound access to specified SQL, storage, or other endpoints.

In this article, you'll learn how about an extension to callout policies that enables you to further restrict call outs from your cluster.

## Types of callout policies

Callout policies can be divided, as follows:

* **Immutable callout policies**: These are the standard policies of a cluster. They're preconfigured and can't be modified.
* **Cluster callout policies**: These are policies that you can modify using callout policy commands.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).

## Run callout policy commands

1. Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

1. On the left menu, select **Query**, and then connect to your cluster.
1. In the query window, run the following query to inspect the list of immutable callout policies on your cluster:

    ```kusto
    .show cluster policy callout
    ```

    :::image type="content" source="media/security-network-restrict-access/restrict-outbound-access.png" alt-text="Screenshot of the restricted query page, showing the immutable callout policies.":::

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

1. Trigger an ARM deployment using the Azure CLI with an updated ARM template:

    Example ARM template file named "template.json" with the property **restrictOutboundNetworkAccess** set to **Enabled**:

    ```javascript
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      ...
      "resources": [
          {
              "type": "Microsoft.Kusto/Clusters",
              "apiVersion": "2021-02-01",
              ...
              "properties": {
                  ...
                  "restrictOutboundNetworkAccess": "Enabled",
                  ...
              }
          }
          ...
      ]
    }
    ```

    Example call using the Azure CLI referring to the template above.

    ```bash
    # Replace the <...> placeholders with the correct values
    az deployment group create   --name RestrictOutboundAccess   --resource-group <resource group>   --template-file ./template.json
    ```

    Updating the `restrictOutboundNetworkAccess` cluster property removes all the immutable policies on your cluster. This prevents initiating call outs to other services as shown in the following example.

    :::image type="content" source="media/security-network-restrict-access/restrict-outbound-access-enabled-error-data-plane.png" alt-text="Screenshot of the restricted query page, showing an immutable callout policies error.":::

1. Run the following command again and verify that it returns an empty list:

    ```kusto
    .show cluster policy callout 
    | where EntityType == "Cluster immutable policy"
    ```

    :::image type="content" source="media/security-network-restrict-access/restrict-outbound-access-enabled-no-immutable-callout-policies.png" alt-text="Screenshot of the restricted query page, showing no immutable callout policies.":::

## Add FQDNs to the callouts under restricted conditions

If you want to allow outbound access to a specific FQDN, you can add it to the `allowedFqdnList` list for your cluster. You can do this by running by making changes to the ARM template of the Azure Data Explorer cluster.

1. Trigger an ARM deployment using the Azure CLI with an updated ARM template:

    Example ARM template file named "template.json" with the property **allowedFqdnList** set to **["some.sql.azuresynapse.net", "..."]**:

    ```javascript
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      ...
      "resources": [
          {
              "type": "Microsoft.Kusto/Clusters",
              "apiVersion": "2021-02-01",
              ...
              "properties": {
                  ...
                  "restrictOutboundNetworkAccess": "Enabled",
                  "allowedFqdnList": ["some.sql.azuresynapse.net", "..."]
                  ...
              }
          }
          ...
      ]
    }
    ```

    Example call using the Azure CLI referring to the template above.

    ```bash
    # Replace the <...> placeholders with the correct values
    az deployment group create   --name ConfigureAllowedFqdnList   --resource-group <resource group>   --template-file ./template.json
    ```

1. By adding the FQDN to the allowed list, you'll be able to make call outs to the specified FQDN. You can check the result of the deployment by executing the following command:

    ```kusto
    .show cluster policy callout 
    | project Policy=parse_json(Policy)
    | mv-expand Policy
    | where Policy.CalloutType == "sql" 
    ```

    :::image type="content" source="media/security-network-restrict-access/restrict-outbound-access-enabled-allowed-fqdn-set.png" alt-text="Screenshot of the restricted query page, showing a configured callout policy.":::

    > [!NOTE]
    > There is a set of default policies set for Azure Data Explorer to communicate with its internal storage layer. They expose no risk for data exfiltration.

## Related content

* [Troubleshoot Private Endpoints in Azure Data Explorer](security-network-private-endpoint-troubleshoot.md)
