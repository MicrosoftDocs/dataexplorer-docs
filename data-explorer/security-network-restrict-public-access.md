---
title: Manage public access to your Azure Data Explorer cluster
description: Learn how to Manage public access to your Azure Data Explorer cluster.
ms.reviewer: eladb
ms.topic: how-to
ms.date: 08/09/2023
---

# Manage public access to your Azure Data Explorer cluster

This article describes how to allow, limit, or prevent public access to your Azure Data Explorer cluster. 

## Manage public access

To allow, limit, or prevent public access to your cluster, follow these steps:

1. In the [Azure portal](https://ms.portal.azure.com/), go to your cluster.

1. From the left-hand menu, under **Security + Networking**, select **Networking**. If you select the *Enabled from selected IP addresses* option, you must the specify the IP address or CIDR using the IPv4 address format.

    :::image type="content" source="media/security-network-restrict-access/networking-public-access.png" alt-text="Screenshot of the networking public access page." lightbox="media/security-network-restrict-access/networking-public-access.png":::

1. Within the **Public network access** area, select one of the following three options:

   * **Enabled from all networks**: This option allows access from public networks.
  
   * **Enabled from selected IP addresses**: This option allows you to define a firewall allowlist of IP addresses, CIDR notations (Classless Inter-Domain Routing), or [service tags](/azure/virtual-network/service-tags-overview) that can connect to the public endpoint of your cluster. In CIDR notation, the IP address is followed by a slash and a number that represents the subnet mask.
  
   * **Disabled**: This option prevents access to the cluster from public networks and instead requires connection through a private endpoint.

1. Select **Save**.

### Enabled from selected IP addresses

When selecting the **Enabled from selected IP addresses** option, you have several ways to define the IP addresses that are allowed to connect to your Azure Data Explorer cluster. You can specify individual IP addresses, use CIDR (Classless Inter-Domain Routing) notation to define a range of IP addresses, or utilize [service tags](/azure/virtual-network/service-tags-overview) which represent a group of IP address prefixes from specific Azure services. These options provide flexibility in managing network access to your cluster.

#### Examples

The following examples show how to specify IP addresses, CIDR notations, and service tags.

##### Individual IP addresses

The following example specifies a single IP address in the format `xxx.xxx.xxx.xxx`.

```plaintext
192.168.1.10
```

##### CIDR notation

The following example specifies a range of IP addresses from `192.168.1.0` to `192.168.1.255` using CIDR notation. The `/24` indicates that the first 24 bits, or three octets, represent the network part of the address, while the last eight bits are used for the host addresses within the network from `0` to `255`.

```plaintext
192.168.1.0/24
```

##### Service tags

The following example uses a service tag to allow access to the Azure Storage IP address range from the Azure Data Center in West US.

```plaintext
Storage
```

For a full list of service tags, refer to the [service tags documentation](/azure/virtual-network/service-tags-overview#available-service-tags).

#### Configuration of selected IP addresses

There are two ways to configure the selected IP addresses: using the Azure portal or by modifying the ARM template. Each method provides a different approach to managing network access, allowing you to choose the one that best fits your workflow and requirements.

#### [Azure portal](#tab/portal)

> [!CAUTION]
> For the configuration of [service tags](/azure/virtual-network/service-tags-overview#available-service-tags) use the **ARM template**.

1. Navigate to the **Networking** configuration of your Azure Data Explorer cluster and select **Enabled from selected IP addresses**.

  :::image type="content" source="media/security-network-restrict-access/networking-public-access-selectedIpAddresses.png" alt-text="Screenshot of the network configuration page, showing showing the enabled from selected IP addresses option without any address range being configured.":::

1. Configure the address ranges you like to allow to connect to the Azure Data Explorer cluster. You can use IP addresses or CIDRs.

  :::image type="content" source="media/security-network-restrict-access/networking-public-access-selectedIpAddresses-configured.png" alt-text="Screenshot of the network configuration page, showing showing the enabled from selected IP addresses. There is a configuration for an IP address and a CIDR.":::

1. Click on the **Save** button to submit the configuration.

#### [ARM template](#tab/arm)

1. Locate the [**allowedIpRangeList** cluster property](/azure/templates/microsoft.kusto/clusters?pivots=deployment-language-arm-template#clusterproperties-1) in the ARM template of your cluster

   ```json
   "properties": {
        ...
        "publicNetworkAccess": "Enabled",
        "allowedIpRangeList": [],
        ...
    }
   ```

1. Add IP addresses, CIDRs or service tags to the **allowedIpRangeList** property.

   ```json
   "properties": {
        ...
        "publicNetworkAccess": "Enabled",
        "allowedIpRangeList": [
            "192.168.1.10",
            "192.168.2.0/24",
            "PowerBI",
            "LogicApps"
        ],
        ...
    }
   ```

1. [**Deploy**](/azure/azure-resource-manager/templates/deployment-tutorial-local-template?tabs=azure-powershell) the ARM template

---

## Related content

* [Troubleshooting Private Endpoints in Azure Data Explorer](security-network-private-endpoint-troubleshoot.md)
