---
title: Restrict outbound access from your Azure Data Explorer cluster
description: In this article, you'll learn how to restrict the outbound access from your Azure Data Explorer cluster to other services.
ms.reviewer: herauch
ms.topic: how-to
ms.date: 04/10/2025
---

# Restrict outbound access from your Azure Data Explorer cluster

Restricting outbound access of your cluster is important to mitigate risks like data exfiltration. A malicious actor could potentially create an external table to a storage account and extract large amounts of data. You can control outbound access at the cluster level by enabling [**restricted outbound access**](#enable-or-disable-restricted-outbound-access) and configuring either [**FQDN-based allow lists**](#configure-fqdn-based-allow-lists) or [**callout policies**](#configure-callout-policies-preview).

> [!IMPORTANT]
> You can configure **either** the FQDN-based allow list **or** callout policies for restricted outbound access. Configuring both simultaneously results in an error.

## Data Exfiltration Protection

Data exfiltration is a significant concern for enterprises, especially when sensitive or proprietary data is stored in Azure Data Explorer clusters. Without proper controls, malicious actors or misconfigured systems could potentially transfer data to unauthorized external destinations.

The **restricted outbound access** feature helps mitigate this risk by allowing you to:

- **Restrict outbound traffic**: Prevent unauthorized data transfers by blocking all outbound traffic except to explicitly allowed destinations.
- **Control access with FQDN-based allow lists**: Specify the exact Fully Qualified Domain Names (FQDNs) that the cluster can communicate with, ensuring data is only sent to trusted endpoints.
- **Enforce callout policies**: Define granular rules for specific types of outbound traffic, such as SQL or external data calls, to allow or deny access based on your organization's security requirements.

By implementing restricted outbound access, enterprises can ensure that their Azure Data Explorer clusters are protected against data exfiltration risks, aligning with compliance and security standards.

## Enable or disable restricted outbound access

You can enable or disable restricted outbound access at the ARM layer by configuring the `restrictOutboundNetworkAccess` property in your cluster's ARM template.

Once restricted outbound access is enabled, you can't make changes to the callout policy using the [.alter](/kusto/management/alter-callout-policy-command?view=azure-data-explorer&preserve-view=true) or [.alter-merge](/kusto/management/alter-merge-callout-policy-command?view=azure-data-explorer&preserve-view=true) cluster policy callout commands. To make changes to the callout policy, update the `allowedFqdnList` or the `allowedCallout` property in the ARM template or using the Azure CLI.

### Example: Enable restricted outbound access

The following ARM template enables restricted outbound access for your cluster:

> In the following example, replace \<ClusterName\> and \<ClusterRegion\> with your own values.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Kusto/Clusters",
      "apiVersion": "2021-02-01",
      "name": "<ClusterName>",
      "location": "<ClusterRegion>",
      "properties": {
        "restrictOutboundNetworkAccess": "Enabled"
      }
    }
  ]
}
```

### Example: Disable restricted outbound access

To disable restricted outbound access, set the `restrictOutboundNetworkAccess` property to `Disabled`:

> In the following example, replace \<ClusterName\> and \<ClusterRegion\> with your own values.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Kusto/Clusters",
      "apiVersion": "2021-02-01",
      "name": "<ClusterName>",
      "location": "<ClusterRegion>",
      "properties": {
        "restrictOutboundNetworkAccess": "Disabled"
      }
    }
  ]
}
```

### Example: Enable restricted outbound access using the Azure Portal

1. Go to your cluster in the [Azure portal](https://portal.azure.com/).
1. Navigate to **Security + networking** > **Networking** > **Restrict outbound access**.
1. Select **Enabled** to enable the restricted outbound access.

    :::image type="content" source="media/security-network-restricted-outbound-access/security-network-roa-enabled-noFQDN.png" lightbox="media/security-network-restricted-outbound-access/security-network-roa-enabled-noFQDN.png" alt-text="Screenshot of the network configuration page, showing the restricted outbound access configuration without FQDNs configured.":::

1. Select **Save** to submit the configuration.

## Configure FQDN-based allow lists

When restricted outbound access is enabled, you can allow specific FQDNs by adding them to the `allowedFqdnList` property in your cluster's ARM template.

### Example: Allow specific FQDNs using ARM templates

The following ARM template allows outbound access to specific FQDNs while keeping restricted outbound access enabled:

> In the following example, replace \<ClusterName\> and \<ClusterRegion\> with your own values.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Kusto/Clusters",
      "apiVersion": "2021-02-01",
      "name": "<ClusterName>",
      "location": "<ClusterRegion>",
      "properties": {
        "restrictOutboundNetworkAccess": "Enabled",
        "allowedFqdnList": [
          "example.sql.azuresynapse.net",
          "example.blob.core.windows.net"
        ]
      }
    }
  ]
}
```

### Example: Allow specific FQDNs using the Azure Portal

1. Go to your cluster in the [Azure portal](https://portal.azure.com/).
1. Navigate to **Security + networking** > **Networking** > **Restrict outbound access**.
1. Select **Enabled** to enable the restricted outbound access and configure the FQDNs.

    :::image type="content" source="media/security-network-restricted-outbound-access/security-network-roa-enabled.png" lightbox="media/security-network-restricted-outbound-access/security-network-roa-enabled.png" alt-text="Screenshot of the network configuration page, showing the restricted outbound access configuration with FQDNs configured.":::

1. Select **Save** to submit the configuration.

## Configure callout policies (Preview)

Alternatively, you can configure **callout policies** directly in the ARM template or using the Azure CLI. Callout policies allow you to define specific rules for outbound access to SQL, storage, or other endpoints.

> [!NOTE]
> You can't configure callout policies with restricted outbound access directly through the Azure portal.

### Example: Configure callout policies using ARM template

The following ARM template configures callout policies along with restricted outbound access:

> In the following example, replace \<ClusterName\> and \<ClusterRegion\> with your own values.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Kusto/Clusters",
      "apiVersion": "2021-02-01",
      "name": "<ClusterName>",
      "location": "<ClusterRegion>",
      "properties": {
        "restrictOutboundNetworkAccess": "Enabled",
        "calloutPolicies": [
          {
            "calloutType": "sql",
            "calloutUriRegex": "[a-z0-9][a-z0-9\\-]{0,61}[a-z0-9]?\\.database\\.windows\\.net/?$",
            "outboundAccess": "Allow"
          },
          {
            "calloutType": "external_data",
            "calloutUriRegex": ".*",
            "outboundAccess": "Deny"
          }
        ]
      }
    }
  ]
}
```

### Example: Configure callout policies using Azure CLI

You can also configure callout policies using the Azure CLI. The following command sets the callout policies for an cluster:

> In the following example, replace \<ResourceGroupName\> and \<ClusterName\> with your own values.

```bash
az resource update --resource-group <ResourceGroupName> \
  --name <ClusterName> \
  --resource-type Microsoft.Kusto/clusters \
  --set properties.calloutPolicies='[
  {
    "calloutType": "sql",
    "calloutUriRegex": "sqlname\\.database\\.azure\\.com/?$",
    "outboundAccess": "Allow"
  }
]'
```

## Verify restricted outbound access and policies

After enabling restricted outbound access or configuring callout policies, you can verify the configuration by running the following KQL command in the Azure Data Explorer web UI:

```kusto
.show cluster policy callout
```

This command displays the current callout policies and allowed FQDNs.

> [!NOTE]
> There are default policies set for a cluster to communicate with its internal storage layer, which expose no risk of data exfiltration.

## Limitations

While restricted outbound access offers robust security, it's important to be aware of some limitations:

- FQDN-based allow lists do not support **webapi** callouts.
- You can configure either FQDN-based allow lists or callout policies, but not both simultaneously. Attempting to configure both results in a configuration error.
- Clusters have a set of default policies for internal communication with its storage layer. These policies can't be changed and don't pose a risk for data exfiltration.
- You can't configure callout policies with restricted outbound access directly through the Azure portal.

## Related content

- [Callout Policy](/kusto/management/callout-policy?view=azure-data-explorer&preserve-view=true)
