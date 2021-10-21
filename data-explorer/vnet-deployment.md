---
title: Deploy Azure Data Explorer into your Virtual Network
description: Learn how to deploy Azure Data Explorer into your Virtual Network
author: orspod
ms.author: orspodek
ms.reviewer: basaba
ms.service: data-explorer
ms.topic: how-to
ms.date: 07/01/2021
---

# Deploy Azure Data Explorer cluster into your Virtual Network

This article explains the resources that are present when you deploy an Azure Data Explorer cluster into a custom Azure Virtual Network. This information will help you deploy a cluster into a subnet in your Virtual Network (VNet). For more information on Azure Virtual Networks, see [What is Azure Virtual Network?](/azure/virtual-network/virtual-networks-overview)

:::image type="content" source="media/vnet-deployment/vnet-diagram.png" alt-text="diagram showing schematic virtual network architecture."::: 

Azure Data Explorer supports deploying a cluster into a subnet in your Virtual Network (VNet). This capability enables you to:

* Enforce [Network Security Group](/azure/virtual-network/security-overview) (NSG) rules on your Azure Data Explorer cluster traffic.
* Connect your on-premises network to Azure Data Explorer cluster's subnet.
* Secure your data connection sources ([Event Hub](/azure/event-hubs/event-hubs-about) and [Event Grid](/azure/event-grid/overview)) with [service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview).

## Access your Azure Data Explorer cluster in your VNet

You can access your Azure Data Explorer cluster using the following IP addresses for each service (engine and data management services):

* **Private IP**: Used for accessing the cluster inside the VNet.
* **Public IP**: Used for accessing the cluster from outside the VNet for management and monitoring, and as a source address for outbound connections started from the cluster.

The following DNS records are created to access the service: 

* `[clustername].[geo-region].kusto.windows.net` (engine) `ingest-[clustername].[geo-region].kusto.windows.net` (data management) are mapped to the public IP for each service. 

* `private-[clustername].[geo-region].kusto.windows.net` (engine) `ingest-private-[clustername].[geo-region].kusto.windows.net`\\`private-ingest-[clustername].[geo-region].kusto.windows.net` (data management) are mapped to the private IP for each service.

## Plan subnet size in your VNet

The size of the subnet used to host an Azure Data Explorer cluster can't be altered after the subnet is deployed. In your VNet, Azure Data Explorer uses one private IP address for each VM and two private IP addresses for the internal load balancers (engine and data management). Azure networking also uses five IP addresses for each subnet. Azure Data Explorer provisions two VMs for the data management service. Engine service VMs are provisioned per user configuration scale capacity.

The total number of IP addresses:

| Use | Number of addresses |
| --- | --- |
| Engine service | 1 per instance |
| Data management service | 2 |
| Internal load balancers | 2 |
| Azure reserved addresses | 5 |
| **Total** | **#engine_instances + 9** |

> [!IMPORTANT]
> Subnet size must be planned in advance since it can't be changed after Azure Data Explorer is deployed. Therefore, reserve needed subnet size accordingly.

## Service endpoints for connecting to Azure Data Explorer

[Azure Service Endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview) enables you to secure your Azure multi-tenant resources to your virtual network.
Deploying Azure Data Explorer cluster into your subnet allows you to setup data connections with [Event Hub](/azure/event-hubs/event-hubs-about) or [Event Grid](/azure/event-grid/overview) while restricting the underlying resources for Azure Data Explorer subnet.

> [!NOTE]
> When using EventGrid setup with [Storage](/azure/storage/common/storage-introduction) and [Event Hub](/azure/event-hubs/event-hubs-about), the storage account used in the subscription can be locked with service endpoints to Azure Data Explorer's subnet while allowing trusted Azure platform services in the [firewall configuration](/azure/storage/common/storage-network-security), but the Event Hub can't enable Service Endpoint since it doesn't support trusted [Azure platform services](/azure/event-hubs/event-hubs-service-endpoints).

## Private Endpoints

[Private Endpoints](/azure/private-link/private-endpoint-overview) allow private access to Azure resources (such as [Storage/Event Hub](vnet-endpoint-storage-event-hub.md)/Data Lake Gen 2), and use private IP from your Virtual Network, effectively bringing the resource into your VNet.
Create a [private endpoint](/azure/private-link/private-endpoint-overview) to resources used by data connections, such as Event Hub and Storage, and external tables such as Storage, Data Lake Gen 2, and SQL Database from your VNet to access the underlying resources privately.

 > [!NOTE]
 > Setting up Private Endpoint requires [configuring DNS](/azure/private-link/private-endpoint-dns), We support [Azure Private DNS zone](/azure/dns/private-dns-privatednszone) setup only. Custom DNS server isn't supported. 

## Dependencies for VNet deployment

### Network Security Groups configuration

[Network Security Groups (NSG)](/azure/virtual-network/security-overview) provide the ability to control network access within a VNet. Azure Data Explorer automatically applies the following required network security rules. For Azure Data Explorer to operate using the [subnet delegation](/azure/virtual-network/subnet-delegation-overview) mechanism, before creating the cluster in the subnet, you must delegate the subnet to **Microsoft.Kusto/clusters** .

 > [!NOTE]
 > By enabling subnet delegation on the Azure Data Explorer cluster's subnet, you enable the service to define its pre-conditions for deployment in the form of Network Intent Policies. When creating the cluster in the subnet, the NSG configurations mentioned in the following sections are automatically created for you.

#### Inbound NSG configuration

| **Use**   | **From**   | **To**   | **Protocol**   |
| --- | --- | --- | --- |
| Management  |[Azure Data Explorer management addresses](#azure-data-explorer-management-ip-addresses)/AzureDataExplorerManagement(ServiceTag) | Azure Data Explorer subnet:443  | TCP  |
| Health monitoring  | [Azure Data Explorer health monitoring addresses](#health-monitoring-addresses)  | Azure Data Explorer subnet:443  | TCP  |
| Synthetics monitoring  | [Azure Data Explorer health monitoring addresses](#Synthetics-monitoring-addresses)  | Azure Data Explorer subnet:443  | TCP  |
| Azure Data Explorer internal communication  | Azure Data Explorer subnet: All ports  | Azure Data Explorer subnet:All ports  | All  |
| Allow Azure load balancer inbound (health probe)  | AzureLoadBalancer  | Azure Data Explorer subnet:80,443  | TCP  |

#### Outbound NSG configuration

| **Use**   | **From**   | **To**   | **Protocol**   |
| --- | --- | --- | --- |
| Dependency on Azure Storage  | Azure Data Explorer subnet  | Storage:443  | TCP  |
| Dependency on Azure Data Lake  | Azure Data Explorer subnet  | AzureDataLake:443  | TCP  |
| EventHub ingestion and service monitoring  | Azure Data Explorer subnet  | EventHub:443,5671  | TCP  |
| Publish Metrics  | Azure Data Explorer subnet  | AzureMonitor:443 | TCP  |
| Active Directory (if applicable) | Azure Data Explorer subnet | AzureActiveDirectory:443 | TCP |
| Certificate authority | Azure Data Explorer subnet | Internet:80 | TCP |
| Internal communication  | Azure Data Explorer subnet  | Azure Data Explorer Subnet:All Ports  | All  |
| Ports that are used for `sql\_request` and `http\_request` plugins  | Azure Data Explorer subnet  | Internet:Custom  | TCP  |

### Relevant IP addresses

#### Azure Data Explorer management IP addresses

> [!NOTE]
> For future deployments, use AzureDataExplorer Service Tag

| Region | Addresses |
| --- | --- |
| Australia Central | 20.37.26.134 |
| Australia Central 2 | 20.39.99.177 |
| Australia East | 40.82.217.84 |
| Australia Southeast | 20.40.161.39 |
| Brazil South | 191.233.25.183 |
| Brazil Southeast | 191.232.16.14 |
| Canada Central | 40.82.188.208 |
| Canada East | 40.80.255.12 |
| Central India | 40.81.249.251, 104.211.98.159 |
| Central US | 40.67.188.68 |
| Central US EUAP | 40.89.56.69 |
| China East 2 | 139.217.184.92 |
| China North 2 | 139.217.60.6 |
| East Asia | 20.189.74.103 |
| East US | 52.224.146.56 |
| East US 2 | 52.232.230.201 |
| East US 2 EUAP | 52.253.226.110 |
| France Central | 40.66.57.91 |
| France South | 40.82.236.24 |
| Germany West Central | 51.116.98.150 |
| Japan East | 20.43.89.90 |
| Japan West | 40.81.184.86 |
| Korea Central | 40.82.156.149 |
| Korea South | 40.80.234.9 |
| North Central US | 40.81.43.47 |
| North Europe | 52.142.91.221 |
| Norway East | 51.120.49.100 |
| Norway West | 51.120.133.5 |
| South Africa North | 102.133.129.138 |
| South Africa West | 102.133.0.97 |
| South Central US | 20.45.3.60 |
| Southeast Asia | 40.119.203.252 |
| South India | 40.81.72.110, 104.211.224.189 |
| Switzerland North | 51.107.42.144 |
| Switzerland West | 51.107.98.201 |
| UAE Central | 20.37.82.194 |
| UAE North | 20.46.146.7 |
| UK South | 40.81.154.254 |
| UK West | 40.81.122.39 |
| USDoD Central | 52.182.33.66 |
| USDoD East | 52.181.33.69 |
| USGov Arizona | 52.244.33.193 |
| USGov Texas | 52.243.157.34 |
| USGov Virginia | 52.227.228.88 |
| West Central US | 52.159.55.120 |
| West Europe | 51.145.176.215 |
| West India | 40.81.88.112 |
| West US | 13.64.38.225 |
| West US 2 | 40.90.219.23 |
| West US 3 | 20.40.24.116 |

#### Health monitoring addresses

| Region | Addresses |
| --- | --- |
| Australia Central | 52.163.244.128 |
| Australia Central 2 | 52.163.244.128 |
| Australia East | 52.163.244.128 |
| Australia Southeast | 52.163.244.128 |
| Brazil South | 23.101.115.123 |
| Canada Central | 23.101.115.123 |
| Canada East | 23.101.115.123 |
| Central India | 52.163.244.128 |
| Central US | 23.101.115.123 |
| Central US EUAP | 23.101.115.123 |
| China East 2 | 40.73.96.39 |
| China North 2 | 40.73.33.105 |
| East Asia | 52.163.244.128 |
| East US | 52.249.253.174 |
| East US 2 | 104.46.110.170 |
| East US 2 EUAP | 104.46.110.170 |
| France Central | 40.127.194.147 |
| France South | 40.127.194.147 |
| Japan East | 52.163.244.128 |
| Japan West | 52.163.244.128 |
| Korea Central | 52.163.244.128 |
| Korea South | 52.163.244.128 |
| North Central US | 23.101.115.123 |
| North Europe |  40.127.194.147 |
| South Africa North | 52.163.244.128 |
| South Africa West | 52.163.244.128 |
| South Central US | 104.215.116.88 |
| South India | 52.163.244.128 |
| Southeast Asia | 52.163.244.128 |
| UK South | 40.127.194.147 |
| UK West | 40.127.194.147 |
| USDoD Central | 52.238.116.34 |
| USDoD East | 52.238.116.34 |
| USGov Arizona | 52.244.48.35 |
| USGov Texas | 52.238.116.34 |
| USGov Virginia | 23.97.0.26 |
| West Central US | 23.101.115.123 |
| West Europe | 213.199.136.176 |
| West India | 52.163.244.128 |
| West US | 13.88.13.50 |
| West US 2 | 52.183.35.124 |

#### Synthetics monitoring addresses

| Region | Addresses |
| --- | --- |
| US West | 40.80.156.205,  40.80.152.218,  104.42.156.123,  104.42.216.21,  40.78.63.47,  40.80.156.103,  40.78.62.97,  40.80.153.6 |																										


## Disable access to Azure Data Explorer from the public IP

If you want to completely disable access to Azure Data Explorer via the public IP address, create another inbound rule in the NSG. This rule has to have a lower [priority](/azure/virtual-network/security-overview#security-rules) (a higher number). 

| **Use**   | **Source** | **Source service tag** | **Source port ranges**  | **Destination** | **Destination port ranges** | **Protocol** | **Action** | **Priority** |
| ---   | --- | --- | ---  | --- | --- | --- | --- | --- |
| Disable access from the internet | Service Tag | Internet | *  | VirtualNetwork | * | Any | Deny | higher number than the rules above |

This rule will allow you to connect to the Azure Data Explorer cluster only via the following DNS records (mapped to the private IP for each service):
* `private-[clustername].[geo-region].kusto.windows.net` (engine)
* `private-ingest-[clustername].[geo-region].kusto.windows.net` (data management)

## ExpressRoute setup

Use ExpressRoute to connect on premises network to the Azure Virtual Network. A common setup is to advertise the default route (0.0.0.0/0) through the Border Gateway Protocol (BGP) session. This forces traffic coming out of the Virtual Network to be forwarded to the customer's premise network that may drop the traffic, causing outbound flows to break. To overcome this default, [User Defined Route (UDR)](/azure/virtual-network/virtual-networks-udr-overview#user-defined) (0.0.0.0/0) can be configured and next hop will be *Internet*. Since the UDR takes precedence over BGP, the traffic will be destined to the Internet.

## Securing outbound traffic with a firewall

If you want to secure outbound traffic using [Azure Firewall](/azure/firewall/overview) or any virtual appliance to limit domain names, the following Fully Qualified Domain Names (FQDN) must be allowed in the firewall.

```
prod.warmpath.msftcloudes.com:443
gcs.prod.monitoring.core.windows.net:443
production.diagnostics.monitoring.core.windows.net:443
graph.windows.net:443
graph.microsoft.com:443
*.update.microsoft.com:443
login.live.com:443
wdcp.microsoft.com:443
login.microsoftonline.com:443
azureprofilerfrontdoor.cloudapp.net:443
*.core.windows.net:443
*.servicebus.windows.net:443,5671
shoebox2.metrics.nsatc.net:443
prod-dsts.dsts.core.windows.net:443
ocsp.msocsp.com:80
*.windowsupdate.com:80
ocsp.digicert.com:80
go.microsoft.com:80
dmd.metaservices.microsoft.com:80
www.msftconnecttest.com:80
crl.microsoft.com:80
www.microsoft.com:80
adl.windows.com:80
crl3.digicert.com:80
```

> [!NOTE]
> If you're using [Azure Firewall](/azure/firewall/overview), add **Network Rule** with the following properties:
>
> **Protocol**: TCP  
> **Source Type**: IP Address  
> **Source**: \*  
> **Service Tags**: AzureMonitor  
> **Destination Ports**: 443

You also need to define the [route table](/azure/virtual-network/virtual-networks-udr-overview) on the subnet with the [management addresses](vnet-deployment.md#azure-data-explorer-management-ip-addresses), [health monitoring addresses](vnet-deployment.md#health-monitoring-addresses) and [Synthetics monitoring addresses](vnet-deployment.md#synthetics-monitoring-addresses) with next hop *Internet* to prevent asymmetric routes issues.

For example, for **West US** region, the following UDRs must be defined:

| Name | Address Prefix | Next Hop |
| --- | --- | --- |
| ADX_Management | 13.64.38.225/32 | Internet |
| ADX_Monitoring | 23.99.5.162/32 | Internet |
| ADX_Synthetics_1 | 40.80.156.205/32 | Internet |
| ADX_Synthetics_1 | 40.80.152.218/32 | Internet |
| ADX_Synthetics_1 | 104.42.156.123/32 | Internet |
| ADX_Synthetics_1 | 104.42.216.21/32 | Internet |
| ADX_Synthetics_1 | 40.78.63.47/32 | Internet |
| ADX_Synthetics_1 | 40.80.156.103/32 | Internet |
| ADX_Synthetics_1 | 40.78.62.97/32 | Internet |
| ADX_Synthetics_1 | 40.80.153.6/32 | Internet |

## How to discover dependencies automatically

Azure Data Explorer provides an API that allows customers to discover all external outbound dependencies (FQDNs) programmatically.
These outbound dependencies will allow customers to setup a Firewall at their end to allow management traffic through the dependent FQDNs. Customers can have these firewall appliances either in Azure or on-premises. The latter might cause additional latency and might impact the service performance. Service teams will need to test out this scenario to evaluate impact on the service performance.

The [ARMClient](https://chocolatey.org/packages/ARMClient) is used to demonstrate the REST API using PowerShell.

1. Log in with ARMClient

   ```powerShell
   armclient login
   ```

2. Invoke diagnose operation

    ```powershell
    $subscriptionId = '<subscription id>'
    $clusterName = '<name of cluster>'
    $resourceGroupName = '<resource group name>'
    $apiversion = '2021-01-01'
    
    armclient get /subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Kusto/clusters/$clusterName/OutboundNetworkDependenciesEndpoints?api-version=$apiversion
    ```

3. Check the response

    ```javascript
    {
       "value": 
       [
        ...
          {
            "id": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Kusto/Clusters/<clusterName>/OutboundNetworkDependenciesEndpoints/AzureActiveDirectory",
            "name": "<clusterName>/AzureActiveDirectory",
            "type": "Microsoft.Kusto/Clusters/OutboundNetworkDependenciesEndpoints",
            "etag": "\"\"",
            "location": "<AzureRegion>",
            "properties": {
              "category": "Azure Active Directory",
              "endpoints": [
                {
                  "domainName": "login.microsoftonline.com",
                  "endpointDetails": [
                    {
                      "port": 443
                    }
                  ]
                },
                {
                  "domainName": "graph.windows.net",
                  "endpointDetails": [
                    {
                      "port": 443
                    }
                  ]
                }
              ],
              "provisioningState": "Succeeded"
            }
          }
        ...
       ]
   }
    ```

The outbound dependencies cover categories such as "Azure Active Directory", "Azure Monitor", "Certificate Authority", and "Azure Storage". In each category there is a list of domain names and ports which are needed to run the service. They can be used to programmatically configure the firewall appliance of choice.

## Deploy Azure Data Explorer cluster into your VNet using an Azure Resource Manager template

To deploy Azure Data Explorer cluster into your virtual network, use the [Deploy Azure Data Explorer cluster into your VNet](https://azure.microsoft.com/resources/templates/kusto-vnet/) Azure Resource Manager template.

This template creates the cluster, virtual network, subnet, network security group, and public IP addresses.

## Known limitations

* Virtual network resources with deployed clusters do not support the [move to a new resource group or subscription](/azure/azure-resource-manager/management/move-resource-group-and-subscription) operation.
* Public IP address resources used for the cluster engine or the data management service do not support the move to a new resource group or subscription operation.
