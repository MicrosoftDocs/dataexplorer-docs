---
title: Restrict outbound access from your Azure Data Explorer cluster
description: In this article, you'll learn how to restrict the outbound access from your Azure Data Explorer cluster to other services.
ms.reviewer: herauch
ms.topic: how-to
ms.date: 09/04/2025
---

# Restrict outbound access from your Azure Data Explorer cluster

Restricting outbound access of your cluster is important to mitigate risks like data exfiltration. A malicious actor could potentially create an external table to a storage account and extract large amounts of data. You can control outbound access at the cluster level by enabling [**restricted outbound access**](#enable-or-disable-restricted-outbound-access) and configuring either [**FQDN-based allow lists**](#configure-fqdn-based-allow-lists) or [**callout policies**](#configure-callout-policies).

> [!IMPORTANT]
> You can configure **either** the FQDN-based allow list **or** callout policies for restricted outbound access. Configuring both simultaneously will result in an error.

## Data Exfiltration Protection

Data exfiltration is a significant concern for enterprises, especially when sensitive or proprietary data is stored in Azure Data Explorer clusters. Without proper controls, malicious actors or misconfigured systems could potentially transfer data to unauthorized external destinations.

The **restricted outbound access** feature helps mitigate this risk by allowing you to:

- **Restrict outbound traffic**: Prevent unauthorized data transfers by blocking all outbound traffic except to explicitly allowed destinations.
- **Control access with FQDN-based allow lists**: Specify the exact Fully Qualified Domain Names (FQDNs) that the cluster can communicate with, ensuring data is only sent to trusted endpoints.
- **Enforce callout policies**: Define granular rules for specific types of outbound traffic, such as SQL or external data calls, to allow or deny access based on your organization's security requirements.

By implementing restricted outbound access, enterprises can ensure that their Azure Data Explorer clusters are protected against data exfiltration risks, aligning with compliance and security standards.

## Enable or disable restricted outbound access

You can enable or disable restricted outbound access at the ARM layer by configuring the `restrictOutboundNetworkAccess` property in your Azure Data Explorer cluster's ARM template.

Once restricted outbound access is enabled, you cannot make any changes to the callout policy on the [data plane]((kusto/management/callout-policy.md#alter-callout-policy-command)). Any modifications to the callout policy must be made at the control plane level by updating the `allowedFqdnList` or the `allowedCallout` property in the ARM template or through the Azure CLI.

### Example: Enable restricted outbound access

The following ARM template enables restricted outbound access for your cluster:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Kusto/Clusters",
      "apiVersion": "2021-02-01",
      "name": "<cluster_name>",
      "location": "<region>",
      "properties": {
        "restrictOutboundNetworkAccess": "Enabled"
      }
    }
  ]
}
```

### Example: Disable restricted outbound access

To disable restricted outbound access, set the `restrictOutboundNetworkAccess` property to `Disabled`:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Kusto/Clusters",
      "apiVersion": "2021-02-01",
      "name": "<cluster_name>",
      "location": "<region>",
      "properties": {
        "restrictOutboundNetworkAccess": "Disabled"
      }
    }
  ]
}
```

## Configure FQDN-based allow lists

When restricted outbound access is enabled, you can allow specific FQDNs by adding them to the `allowedFqdnList` property in your cluster's ARM template.

### Example: Allow specific FQDNs

The following ARM template allows outbound access to specific FQDNs while keeping restricted outbound access enabled:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Kusto/Clusters",
      "apiVersion": "2021-02-01",
      "name": "<cluster_name>",
      "location": "<region>",
      "properties": {
        "restrictOutboundNetworkAccess": "Enabled",
        "allowedFqdnList": [
          "some.sql.azuresynapse.net",
          "example.blob.core.windows.net"
        ]
      }
    }
  ]
}
```

## Configure callout policies

Alternatively, you can configure **callout policies** directly in the ARM template or using the Azure CLI. Callout policies allow you to define specific rules for outbound access to SQL, storage, or other endpoints.

### Example: Configure callout policies using ARM template

The following ARM template configures callout policies alongside restricted outbound access:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Kusto/Clusters",
      "apiVersion": "2021-02-01",
      "name": "<cluster_name>",
      "location": "<region>",
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

You can also configure callout policies using the Azure CLI. The following command sets callout policies for an Azure Data Explorer cluster:

```bash
az resource update --resource-group <resource-group-name> \
  --name <cluster-name> \
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

This command will display the current callout policies or any allowed FQDNs.

> [!NOTE]
> There is a set of default policies set for Azure Data Explorer to communicate with its internal storage layer. They expose no risk for data exfiltration.

## Limitations

While restricted outbound access provides robust security, there are some limitations to be aware of:

- FQDN-based allow lists do not support Random HTTPS endpoints.
- You can configure either FQDN-based allow lists or callout policies, but not both simultaneously. Attempting to configure both will result in a configuration error.
- Azure Data Explorer has a set of default policies for internal communication with its storage layer. These policies cannot be changed but pose no risk for data exfiltration.

## Related content

- [Callout Policy documentation](kusto/management/callout-policy.md)
