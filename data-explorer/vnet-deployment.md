---
title: Deploy Azure Data Explorer into your Virtual Network
description: Learn how to deploy Azure Data Explorer into your Virtual Network
ms.reviewer: basaba
ms.topic: how-to
ms.custom: devx-track-arm-template
ms.date: 03/30/2022
---

# Deploy Azure Data Explorer cluster into your Virtual Network

> [!IMPORTANT]
> Consider moving to an Azure Private Endpoint based solution for implementing network security with Azure Data Explorer. It is less error-prone and provides [feature parity](security-network-overview.md#comparison-and-recommendation).

This article explains the resources that are present when you deploy an Azure Data Explorer cluster into a custom Azure Virtual Network. This information will help you deploy a cluster into a subnet in your Virtual Network (VNet). For more information on Azure Virtual Networks, see [What is Azure Virtual Network?](/azure/virtual-network/virtual-networks-overview)

:::image type="content" source="media/vnet-deployment/vnet-diagram.png" alt-text="diagram showing schematic virtual network architecture.":::

Azure Data Explorer supports deploying a cluster into a subnet in your Virtual Network (VNet). This capability enables you to:

* Enforce [Network Security Group](/azure/virtual-network/security-overview) (NSG) rules on your Azure Data Explorer cluster traffic.
* Connect your on-premises network to Azure Data Explorer cluster's subnet.
* Secure your data connection sources ([Event Hubs](/azure/event-hubs/event-hubs-about) and [Event Grid](/azure/event-grid/overview)) with [service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview).

## Access your Azure Data Explorer cluster in your virtual network

You can access your Azure Data Explorer cluster using the following IP addresses for each service (engine and data management services):

* **Private IP**: Used for accessing the cluster inside the virtual network.
* **Public IP**: Used for accessing the cluster from outside the virtual network for management and monitoring, and as a source address for outbound connections started from the cluster.

> [!IMPORTANT]
> The default NSG rules block access to public IP addresses outside the virtual network. To reach a public endpoint, you must add an exception for your public IP addresses in the NSG.

The following DNS records are created to access the service:

* `[clustername].[geo-region].kusto.windows.net` (engine) `ingest-[clustername].[geo-region].kusto.windows.net` (data management) are mapped to the public IP for each service.

* `private-[clustername].[geo-region].kusto.windows.net` (engine) `ingest-private-[clustername].[geo-region].kusto.windows.net`\\`private-ingest-[clustername].[geo-region].kusto.windows.net` (data management) are mapped to the private IP for each service.

## Plan subnet size in your virtual network

The size of the subnet used to host an Azure Data Explorer cluster can't be altered after the subnet is deployed. In your virtual network, Azure Data Explorer uses one private IP address for each VM and two private IP addresses for the internal load balancers (engine and data management). Azure networking also uses five IP addresses for each subnet. Azure Data Explorer provisions two VMs for the data management service. Engine service VMs are provisioned per user configuration scale capacity.

The total number of IP addresses:

| Use | Number of addresses |
|--|--|
| Engine service | 1 per instance |
| Data management service | 2 |
| Internal load balancers | 2 |
| Azure reserved addresses | 5 |
| **Total** | **#engine_instances + 9** |

> [!IMPORTANT]
>
> - Make sure that you plan the subnet size before deploying Azure Data Explorer. Once deployed, the subnet size cannot be changed.
> - Make sure that you don't deploy any other Azure resources or services in the Subnet where you plan to deploy Azure Data Explorer. Doing so will prevent Azure Data Explorer starting when resuming from a suspended state.

## Service endpoints for connecting to Azure Data Explorer

[Azure Service Endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview) enables you to secure your Azure multi-tenant resources to your virtual network.
Deploying the cluster into your subnet allows you to set up data connections with [Event Hubs](/azure/event-hubs/event-hubs-about) or [Event Grid](/azure/event-grid/overview) while restricting the underlying resources for Azure Data Explorer subnet.

## Private Endpoints

[Private Endpoints](/azure/private-link/private-endpoint-overview) allow private access to Azure resources (such as [storage/event hub](vnet-endpoint-storage-event-hub.md)/Data Lake Gen 2), and use private IP from your Virtual Network, effectively bringing the resource into your virtual network.
Create a [private endpoint](/azure/private-link/private-endpoint-overview) to resources used by data connections, such as event hub and storage, and external tables such as Storage, Data Lake Gen 2, and SQL Database from your virtual network to access the underlying resources privately.

 > [!NOTE]
 > Setting up Private Endpoint requires [configuring DNS](/azure/private-link/private-endpoint-dns), We support [Azure Private DNS zone](/azure/dns/private-dns-privatednszone) setup only. Custom DNS server isn't supported.

## Configure Network Security Group rules

[NSGs](/azure/virtual-network/security-overview) give you the ability to control network access within a virtual network. You must configure NSGs for your Azure Data Explorer cluster to work in your virtual network.

### Configure Network Security Group rules using subnet delegation

[Subnet delegation](/azure/virtual-network/subnet-delegation-overview) is the default method for configuring Network Security Group rules for Azure Data Explorer clusters deployed into a subnet in your virtual network. When using subnet delegation, you must delegate the subnet to *Microsoft.Kusto/clusters* before creating the cluster in the subnet.

By enabling subnet delegation on the cluster's subnet, you enable the service to define its pre-conditions for deployment in the form of Network Intent Policies. When creating the cluster in the subnet, the NSG configurations mentioned in the following sections are automatically created for you.

> [!WARNING]
> Changing your subnet delegation configuration will eventually disrupt the normal operation of your cluster. For example, after stopping the cluster you may not be able to start your cluster, run management commands, or apply health monitoring on your cluster.

### Configure Network Security Group rules manually

Alternatively, you can manually configure your NSG. By default, deploying a cluster into a virtual network enforces subnet delegation for "Microsoft.Kusto/clusters" to be configured. Opting out of this requirement is possible using the [Preview features](https://portal.azure.com/#blade/Microsoft_Azure_Resources/PreviewFeaturesBlade) pane.

 > [!WARNING]
 > Manually configuring NSG rules for your cluster is not trivial and requires you to constantly monitor this article for changes. We highly recommended using subnet delegation for your cluster or, if you prefer, consider using a [Private Endpoint](security-network-private-endpoint.md) based solution.

#### Inbound NSG configuration

| **Use** | **From** | **To** | **Protocol** |
|--|--|--|--|
| Management | [Azure Data Explorer management addresses](#azure-data-explorer-management-ip-addresses)/AzureDataExplorerManagement(ServiceTag) | *YourAzureDataExplorerSubnet*:443 | TCP |
| Health monitoring | [Azure Data Explorer health monitoring addresses](#health-monitoring-addresses) | *YourAzureDataExplorerSubnet*:443 | TCP |
| Azure Data Explorer internal communication | *YourAzureDataExplorerSubnet*: All ports | *YourAzureDataExplorerSubnet*:All ports | All |
| Allow Azure load balancer inbound (health probe) | AzureLoadBalancer | *YourAzureDataExplorerSubnet*:80,443 | TCP |

#### Outbound NSG configuration

| **Use** | **From** | **To** | **Protocol** |
|--|--|--|--|
| Dependency on Azure Storage | *YourAzureDataExplorerSubnet* | Storage:443 | TCP |
| Dependency on Azure Data Lake | *YourAzureDataExplorerSubnet* | AzureDataLake:443 | TCP |
| Event Hubs ingestion and service monitoring | *YourAzureDataExplorerSubnet* | EventHub:443,5671 | TCP |
| Publish Metrics | *YourAzureDataExplorerSubnet* | AzureMonitor:443 | TCP |
| Active Directory (if applicable) | *YourAzureDataExplorerSubnet* | AzureActiveDirectory:443 | TCP |
| Dependency on KeyVault | *YourAzureDataExplorerSubnet* | AzureKeyVault:443 | TCP |
| Certificate authority | *YourAzureDataExplorerSubnet* | Internet:80 | TCP |
| Internal communication | *YourAzureDataExplorerSubnet* | Azure Data Explorer Subnet:All Ports | All |
| Ports that are used for `sql\_request` and `http\_request` plugins | *YourAzureDataExplorerSubnet* | Internet:Custom | TCP |

The following sections list the relevant IP addresses for management and health monitoring.

> [!NOTE]
> You can disregard the following lists if your subnet is delegated to *Microsoft.Kusto/clusters* as described in [Configure Network Security Group rules using subnet delegation](#configure-network-security-group-rules-using-subnet-delegation). In this scenario, IP addresses may be not be up to date but will be automatically updated when the required NSG rules are assigned to the cluster.

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
| Poland Central | 20.215.208.177 |
| South Africa North | 102.133.129.138 |
| South Africa West | 102.133.0.97 |
| South Central US | 20.45.3.60 |
| Southeast Asia | 40.119.203.252 |
| South India | 40.81.72.110, 104.211.224.189 |
| Switzerland North | 20.203.198.33 |
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
| Australia Central | 52.163.244.128, 20.36.43.207, 20.36.44.186, 20.36.45.105, 20.36.45.34, 20.36.44.177, 20.36.45.33, 20.36.45.9 |
| Australia Central 2 | 52.163.244.128 |
| Australia East | 52.163.244.128, 13.70.72.44, 52.187.248.59, 52.156.177.51, 52.237.211.110, 52.237.213.135, 104.210.70.186, 104.210.88.184, 13.75.183.192, 52.147.30.27, 13.72.245.57 |
| Australia Southeast | 52.163.244.128, 13.77.50.98, 52.189.213.18, 52.243.76.73, 52.189.194.173, 13.77.43.81, 52.189.213.33, 52.189.216.81, 52.189.233.66, 52.189.212.69, 52.189.248.147 |
| Brazil South | 23.101.115.123, 191.233.203.34, 191.232.48.69, 191.232.169.24, 191.232.52.16, 191.239.251.52, 191.237.252.188, 191.234.162.82, 191.232.49.124, 191.232.55.149, 191.232.49.236 |
| Canada Central | 23.101.115.123, 52.228.121.143, 52.228.121.146, 52.228.121.147, 52.228.121.149, 52.228.121.150, 52.228.121.151, 20.39.136.152, 20.39.136.155, 20.39.136.180, 20.39.136.185, 20.39.136.187, 20.39.136.193, 52.228.121.152, 52.228.121.153, 52.228.121.31, 52.228.118.139, 20.48.136.29, 52.228.119.222, 52.228.121.123 |
| Canada East | 23.101.115.123, 40.86.225.89, 40.86.226.148, 40.86.227.81, 40.86.225.159, 40.86.226.43, 40.86.227.75, 40.86.231.40, 40.86.225.81 |
| Central India | 52.163.244.128, 52.172.204.196, 52.172.218.144, 52.172.198.236, 52.172.187.93, 52.172.213.78, 52.172.202.195, 52.172.210.146 |
| Central US | 23.101.115.123, 13.89.172.11, 40.78.130.218, 40.78.131.170, 40.122.52.191, 40.122.27.37, 40.113.224.199, 40.122.118.225, 40.122.116.133, 40.122.126.193, 40.122.104.60 |
| Central US EUAP | 23.101.115.123 |
| China East 2 | 40.73.96.39 |
| China North 2 | 40.73.33.105 |
| East Asia | 52.163.244.128, 13.75.34.175, 168.63.220.81, 207.46.136.220, 168.63.210.90, 23.101.15.21, 23.101.7.253, 207.46.136.152, 65.52.180.140, 23.101.13.231, 23.101.3.51 |
| East US | 52.249.253.174, 52.149.248.192, 52.226.98.175, 52.226.98.216, 52.149.184.133, 52.226.99.54, 52.226.99.58, 52.226.99.65, 52.186.38.56, 40.88.16.66, 40.88.23.108, 52.224.135.234, 52.151.240.130, 52.226.99.68, 52.226.99.110, 52.226.99.115, 52.226.99.127, 52.226.99.153, 52.226.99.207, 52.226.100.84, 52.226.100.121, 52.226.100.138, 52.226.100.176, 52.226.101.50, 52.226.101.81, 52.191.99.133, 52.226.96.208, 52.226.101.102, 52.147.211.11, 52.147.211.97, 52.147.211.226, 20.49.104.10 |
| East US 2 | 104.46.110.170, 40.70.147.14, 40.84.38.74, 52.247.116.27, 52.247.117.99, 52.177.182.76, 52.247.117.144, 52.247.116.99, 52.247.67.200, 52.247.119.96, 52.247.70.70 |
| East US 2 EUAP | 104.46.110.170 |
| France Central | 40.127.194.147, 40.79.130.130, 40.89.166.214, 40.89.172.87, 20.188.45.116, 40.89.133.143, 40.89.148.203, 20.188.44.60, 20.188.45.105, 20.188.44.152, 20.188.43.156 |
| France South | 40.127.194.147 |
| Japan East | 52.163.244.128, 40.79.195.2, 40.115.138.201, 104.46.217.37, 40.115.140.98, 40.115.141.134, 40.115.142.61, 40.115.137.9, 40.115.137.124, 40.115.140.218, 40.115.137.189 |
| Japan West | 52.163.244.128, 40.74.100.129, 40.74.85.64, 40.74.126.115, 40.74.125.67, 40.74.128.17, 40.74.127.201, 40.74.128.130, 23.100.108.106, 40.74.128.122, 40.74.128.53 |
| Korea Central | 52.163.244.128, 52.231.77.58, 52.231.73.183, 52.231.71.204, 52.231.66.104, 52.231.77.171, 52.231.69.238, 52.231.78.172, 52.231.69.251 |
| Korea South | 52.163.244.128, 52.231.200.180, 52.231.200.181, 52.231.200.182, 52.231.200.183, 52.231.153.175, 52.231.164.160, 52.231.195.85, 52.231.195.86, 52.231.195.129, 52.231.200.179, 52.231.146.96 |
| North Central US | 23.101.115.123 |
| North Europe |  40.127.194.147, 40.85.74.227, 40.115.100.46, 40.115.100.121, 40.115.105.188, 40.115.103.43, 40.115.109.52, 40.112.77.214, 40.115.99.5 |
| South Africa North | 52.163.244.128 |
| South Africa West | 52.163.244.128 |
| South Central US | 104.215.116.88, 13.65.241.130, 40.74.240.52, 40.74.249.17, 40.74.244.211, 40.74.244.204, 40.84.214.51, 52.171.57.210, 13.65.159.231 |
| South India | 52.163.244.128 |
| Southeast Asia | 52.163.244.128, 20.44.192.205, 20.44.193.4, 20.44.193.56, 20.44.193.98, 20.44.193.147, 20.44.193.175, 20.44.194.249, 20.44.196.82, 20.44.196.95, 20.44.196.104, 20.44.196.115, 20.44.197.158, 20.195.36.24, 20.195.36.25, 20.195.36.27, 20.195.36.37, 20.195.36.39, 20.195.36.40, 20.195.36.41, 20.195.36.42, 20.195.36.43, 20.195.36.44, 20.195.36.45, 20.195.36.46, 20.44.197.160, 20.44.197.162, 20.44.197.219, 20.195.58.80, 20.195.58.185, 20.195.59.60, 20.43.132.128 |
| Switzerland North | 51.107.58.160, 51.107.87.163, 51.107.87.173, 51.107.83.216, 51.107.68.81, 51.107.87.174, 51.107.87.170, 51.107.87.164, 51.107.87.186, 51.107.87.171 |
| UK South | 40.127.194.147, 51.11.174.122, 51.11.173.237, 51.11.174.192, 51.11.174.206, 51.11.175.74, 51.11.175.129, 20.49.216.23, 20.49.216.160, 20.49.217.16, 20.49.217.92, 20.49.217.127, 20.49.217.151, 20.49.166.84, 20.49.166.178, 20.49.166.237, 20.49.167.84, 20.49.232.77, 20.49.232.113, 20.49.232.121, 20.49.232.130, 20.49.232.140, 20.49.232.169, 20.49.165.24, 20.49.232.240, 20.49.217.152, 20.49.217.164, 20.49.217.181, 51.145.125.189, 51.145.126.43, 51.145.126.48, 51.104.28.64 |
| UK West | 40.127.194.147, 51.140.245.89, 51.140.246.238, 51.140.248.127, 51.141.48.137, 51.140.250.127, 51.140.231.20, 51.141.48.238, 51.140.243.38 |
| USDoD Central | 52.126.176.221, 52.126.177.43, 52.126.177.89, 52.126.177.90, 52.126.177.171, 52.126.177.233, 52.126.177.245, 52.126.177.150, 52.126.178.37, 52.126.178.44, 52.126.178.56, 52.126.178.59, 52.126.178.68, 52.126.178.70, 52.126.178.97, 52.126.178.98, 52.126.178.93, 52.126.177.54, 52.126.178.94, 52.126.178.129, 52.126.178.130, 52.126.178.142, 52.126.178.144, 52.126.178.151, 52.126.178.172, 52.126.178.179, 52.126.178.182, 52.126.178.187, 52.126.178.189, 52.126.178.154, 52.127.34.97 |
| USDoD East | 52.127.161.3, 52.127.163.115, 52.127.163.124, 52.127.163.125, 52.127.163.130, 52.127.163.131, 52.127.163.152, 20.140.189.226, 20.140.191.106, 20.140.191.107, 20.140.191.128, 52.127.161.234, 52.245.216.185, 52.245.216.186, 52.245.216.187, 52.245.216.160, 52.245.216.161, 52.245.216.162, 52.245.216.163, 52.245.216.164, 52.245.216.165, 52.245.216.166, 52.245.216.167, 52.245.216.168, 20.140.191.129, 20.140.191.144, 20.140.191.170, 52.245.214.70, 52.245.214.164, 52.245.214.189, 52.127.50.128 |
| USGov Arizona |52.244.204.5,  52.244.204.137,  52.244.204.158,  52.244.204.184,  52.244.204.225,  52.244.205.3,  52.244.50.212,  52.244.55.231,  52.244.205.91,  52.244.205.238,  52.244.201.244,  52.244.201.250,  52.244.200.92,  52.244.206.12,  52.244.206.58,  52.244.206.69,  52.244.206.83,  52.244.207.78,  52.244.203.11,  52.244.203.159,  52.244.203.238,  52.244.200.31,  52.244.202.155,  52.244.206.225,  52.244.218.1,  52.244.218.34,  52.244.218.38,  52.244.218.47,  52.244.202.7,  52.244.203.6,  52.127.2.97 |
| USGov Texas | 52.126.176.221, 52.126.177.43, 52.126.177.89, 52.126.177.90, 52.126.177.171, 52.126.177.233, 52.126.177.245, 52.126.177.150, 52.126.178.37, 52.126.178.44, 52.126.178.56, 52.126.178.59, 52.126.178.68, 52.126.178.70, 52.126.178.97, 52.126.178.98, 52.126.178.93, 52.126.177.54, 52.126.178.94, 52.126.178.129, 52.126.178.130, 52.126.178.142, 52.126.178.144, 52.126.178.151, 52.126.178.172, 52.126.178.179, 52.126.178.182, 52.126.178.187, 52.126.178.189, 52.126.178.154, 52.127.34.97 |
| USGov Virginia | 52.127.161.3,  52.127.163.115,  52.127.163.124,  52.127.163.125,  52.127.163.130,  52.127.163.131,  52.127.163.152,  20.140.189.226,  20.140.191.106,  20.140.191.107,  20.140.191.128,  52.127.161.234,  52.245.216.185,  52.245.216.186,  52.245.216.187,  52.245.216.160,  52.245.216.161,  52.245.216.162,  52.245.216.163,  52.245.216.164,  52.245.216.165,  52.245.216.166,  52.245.216.167,  52.245.216.168,  20.140.191.129,  20.140.191.144,  20.140.191.170,  52.245.214.70,  52.245.214.164,  52.245.214.189,  52.127.50.128 |
| West Central US | 23.101.115.123, 13.71.194.194, 13.78.151.73, 13.77.204.92, 13.78.144.31, 13.78.139.92, 13.77.206.206, 13.78.140.98, 13.78.145.207, 52.161.88.172, 13.77.200.169 |
| West Europe | 213.199.136.176, 51.124.88.159, 20.50.253.190, 20.50.254.255, 52.143.5.71, 20.50.255.137, 20.50.255.176, 52.143.5.148, 20.50.255.211, 20.54.216.1, 20.54.216.113, 20.54.216.236, 20.54.216.244, 20.54.217.89, 20.54.217.102, 20.54.217.162, 20.50.255.109, 20.54.217.184, 20.54.217.197, 20.54.218.36, 20.54.218.66, 51.124.139.38, 20.54.218.71, 20.54.218.104, 52.143.0.117, 20.54.218.240, 20.54.219.47, 20.54.219.75, 20.76.10.82, 20.76.10.95, 20.76.10.139, 20.50.2.13 |
| West India | 52.163.244.128 |
| West US | 13.88.13.50, 40.80.156.205, 40.80.152.218, 104.42.156.123, 104.42.216.21, 40.78.63.47, 40.80.156.103, 40.78.62.97, 40.80.153.6 |
| West US 2 | 52.183.35.124, 40.64.73.23, 40.64.73.121, 40.64.75.111, 40.64.75.125, 40.64.75.227, 40.64.76.236, 40.64.76.240, 40.64.76.242, 40.64.77.87, 40.64.77.111, 40.64.77.122, 40.64.77.131, 40.91.83.189, 52.250.74.132, 52.250.76.69, 52.250.76.130, 52.250.76.137, 52.250.76.145, 52.250.76.146, 52.250.76.153, 52.250.76.177, 52.250.76.180, 52.250.76.191, 52.250.76.192, 40.64.77.143, 40.64.77.159, 40.64.77.195, 20.64.184.243, 20.64.184.249, 20.64.185.9, 20.42.128.97 |

## ExpressRoute setup

Use ExpressRoute to connect on premises network to the Azure Virtual Network. A common setup is to advertise the default route (0.0.0.0/0) through the Border Gateway Protocol (BGP) session. This forces traffic coming out of the Virtual Network to be forwarded to the customer's premise network that may drop the traffic, causing outbound flows to break. To overcome this default, [User Defined Route (UDR)](/azure/virtual-network/virtual-networks-udr-overview#user-defined) (0.0.0.0/0) can be configured and next hop will be *Internet*. Since the UDR takes precedence over BGP, the traffic will be destined to the Internet.

## Securing outbound traffic with a firewall

If you want to secure outbound traffic using [Azure Firewall](/azure/firewall/overview) or any virtual appliance to limit domain names, the following Fully Qualified Domain Names (FQDN) must be allowed in the firewall.

```ini
prod.warmpath.msftcloudes.com:443
gcs.prod.monitoring.core.windows.net:443
production.diagnostics.monitoring.core.windows.net:443
graph.windows.net:443
graph.microsoft.com:443
*.login.microsoft.com :443
*.update.microsoft.com:443
login.live.com:443
wdcp.microsoft.com:443
login.microsoftonline.com:443
azureprofilerfrontdoor.cloudapp.net:443
*.core.windows.net:443
*.servicebus.windows.net:443,5671
shoebox2.metrics.nsatc.net:443
prod-dsts.dsts.core.windows.net:443
*.vault.azure.net
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
>
> * To restrict access for dependencies with a wildcard (*), use the API described in [How to discover dependencies automatically](vnet-deployment.md#how-to-discover-dependencies-automatically).
> * If you're using [Azure Firewall](/azure/firewall/overview), add **Network Rule** with the following properties:
>
>     **Protocol**: TCP
>     **Source Type**: IP Address
>     **Source**: \*
>     **Service Tags**: AzureMonitor
>     **Destination Ports**: 443

### Configure the route table

You must configure the [route table](/azure/virtual-network/virtual-networks-udr-overview) of your cluster's subnet with next hop *Internet* to prevent asymmetric routes issues.

#### Configure the route table using subnet delegation

We recommend using subnet delegation to configure the route table for your cluster's deployment, similarly to how it was done for [NSG rules](#configure-network-security-group-rules-using-subnet-delegation). By enabling subnet delegation on the cluster's subnet, you enable the service to configure and update the route table for you.

#### Configure the route table manually

Alternatively, you can manually configure the route table. By default, deploying a cluster into a virtual network enforces subnet delegation for "Microsoft.Kusto/clusters" to be configured. Opting out of this requirement is possible using the [Preview features](https://portal.azure.com/#blade/Microsoft_Azure_Resources/PreviewFeaturesBlade) pane.

 > [!WARNING]
 > Manually configuring the route table for your cluster is not trivial and requires you to constantly monitor this article for changes. We highly recommended using subnet delegation for your cluster or, if you prefer, consider using a [Private Endpoint](security-network-private-endpoint.md) based solution.

To manually configure the [route table](/azure/virtual-network/virtual-networks-udr-overview) you must define it on the subnet. You need to add the [management](vnet-deployment.md#azure-data-explorer-management-ip-addresses) and [health monitoring](vnet-deployment.md#health-monitoring-addresses) addresses with next hop *Internet*.

For example, for **West US** region, the following UDRs must be defined:

| Name | Address Prefix | Next Hop |
| --- | --- | --- |
| ADX_Management | 13.64.38.225/32 | Internet |
| ADX_Monitoring | 23.99.5.162/32 | Internet |
| ADX_Monitoring_1 | 40.80.156.205/32 | Internet |
| ADX_Monitoring_2 | 40.80.152.218/32 | Internet |
| ADX_Monitoring_3 | 104.42.156.123/32 | Internet |
| ADX_Monitoring_4 | 104.42.216.21/32 | Internet |
| ADX_Monitoring_5 | 40.78.63.47/32 | Internet |
| ADX_Monitoring_6 | 40.80.156.103/32 | Internet |
| ADX_Monitoring_7 | 40.78.62.97/32 | Internet |
| ADX_Monitoring_8 | 40.80.153.6/32 | Internet |

## How to discover dependencies automatically

Azure Data Explorer provides an API that allows customers to discover all external outbound dependencies (FQDNs) programmatically.
These outbound dependencies will allow customers to set up a Firewall at their end to allow management traffic through the dependent FQDNs. Customers can have these firewall appliances either in Azure or on-premises. The latter might cause additional latency and might impact the service performance. Service teams will need to test out this scenario to evaluate impact on the service performance.

The [ARMClient](https://chocolatey.org/packages/ARMClient) is used to demonstrate the REST API using PowerShell.

1. Sign in with ARMClient

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

The outbound dependencies cover categories such as *Azure Active Directory*, *Azure Monitor*, *Certificate Authority*, *Azure Storage*, and *Internal Tracing*. In each category, there's a list of domain names and ports that are needed to run the service. They can be used to programmatically configure the firewall appliance of choice.

## Deploy Azure Data Explorer cluster into your virtual network using an Azure Resource Manager template

To deploy Azure Data Explorer cluster into your virtual network, use the [Deploy Azure Data Explorer cluster into your virtual network](https://azure.microsoft.com/resources/templates/kusto-vnet/) Azure Resource Manager template.

This template creates the cluster, virtual network, subnet, network security group, and public IP addresses.

## Known limitations

* Virtual network resources with deployed clusters don't support the [move to a new resource group or subscription](/azure/azure-resource-manager/management/move-resource-group-and-subscription) operation.
* Public IP address resources used for the cluster engine or the data management service don't support the move to a new resource group or subscription operation.
* It's not possible to use the "private-" DNS prefix of virtual network injected Azure Data Explorer clusters as part of your query
