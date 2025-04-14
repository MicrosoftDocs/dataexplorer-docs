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

1. From the left-hand menu, under **Security + Networking**, select **Networking**. If you select the *Enabled from selected IP addresses* option, you must specify the IP address or CIDR using the IPv4 address format.

    :::image type="content" source="media/security-network-restrict-access/networking-public-access.png" alt-text="Screenshot of the networking public access page." lightbox="media/security-network-restrict-access/networking-public-access.png":::

1. Within the **Public network access** area, select one of the following three options:

   * **Enabled from all networks**: This option allows access from public networks.
  
   * **Enabled from selected IP addresses**: This option allows you to define a firewall allowlist of IP addresses, Classless Inter-Domain Routing (CIDR) notation, or [service tags](/azure/virtual-network/service-tags-overview) that can connect to the public endpoint of your cluster. In CIDR notation, the IP address is followed by a slash and a number that represents the subnet mask. For more information, see [Specify selected IP addresses](#specify-selected-ip-addresses).
  
   * **Disabled**: This option prevents access to the cluster from public networks and instead requires connection through a private endpoint.

1. Select **Save**.

### Specify selected IP addresses

The **Enabled from selected IP addresses** option provides flexibility in managing network access to your cluster by offering multiple ways to define the IP addresses that can connect. You can specify individual IP addresses, use CIDR notation to define a range of IP addresses, or utilize [service tags](/azure/virtual-network/service-tags-overview), which represent a group of IP address prefixes from specific Azure services. The following [examples](#examples) show how each can be specified.

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

The following example uses a service tag to allow access to the Azure Storage IP address range from the Azure Data Center in the West US region.

```plaintext
Storage.WestUS
```

For a full list of service tags, see [Available service tags](/azure/virtual-network/service-tags-overview#available-service-tags).

#### Configure selected IP addresses

You can configure the selected IP addresses either through the Azure portal or by modifying the ARM template. Choose the method that best aligns with your workflow, requirements, and network access management needs.

#### [Azure portal](#tab/portal)

1. Go to your cluster in the [Azure portal](https://portal.azure.com/).
1. Under **Security + networking** > **Networking** > **Public access**, select **Enabled from selected IP addresses**.

    :::image type="content" source="media/security-network-restrict-access/networking-public-access-selected-ip-addresses-service-tag.png" lightbox="media/security-network-restrict-access/networking-public-access-selected-ip-addresses-service-tag.png" alt-text="Screenshot of the network configuration page, showing the enabled from selected IP addresses option without any address range or service tag configured.":::

1. Configure the Service Tags you want to allow to connect to the cluster.

    :::image type="content" source="media/security-network-restrict-access/networking-public-access-selected-ip-addresses-service-tag-search.png" lightbox="media/security-network-restrict-access/networking-public-access-selected-ip-addresses-service-tag-search.png" alt-text="Screenshot of the network configuration page, showing the Service Tag search bar to configure the allowed service tags.":::

1. Configure the IP addresses or CIDR ranges that you want to allow to connect to the cluster.

    :::image type="content" source="media/security-network-restrict-access/networking-public-access-selected-ip-addresses-service-tag-configured.png" lightbox="media/security-network-restrict-access/networking-public-access-selected-ip-addresses-service-tag-configured.png" alt-text="Screenshot of the network configuration page, showing the selected IP addresses specified for Enabled from selected IP addresses. They are specified as individual IP address and in CIDR notation. Additionally the selected Service tags are shown.":::

1. Select **Save** to submit the configuration.

#### [ARM template](#tab/arm)

1. Locate the [**allowedIpRangeList** cluster property](/azure/templates/microsoft.kusto/clusters?pivots=deployment-language-arm-template#clusterproperties-1) in your cluster's ARM template.

   ```json
   "properties": {
        ...
        "publicNetworkAccess": "Enabled",
        "allowedIpRangeList": [],
        ...
    }
   ```

1. Add IP addresses, CIDRs, or service tags to the `allowedIpRangeList` property.

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

1. [**Deploy**](/azure/azure-resource-manager/templates/deployment-tutorial-local-template?tabs=azure-powershell) the ARM template.

---

## Related content

* [Troubleshooting Private Endpoints in Azure Data Explorer](security-network-private-endpoint-troubleshoot.md)
