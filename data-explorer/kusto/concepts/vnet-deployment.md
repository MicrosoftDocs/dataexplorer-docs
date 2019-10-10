---
title: Virtual Network deployment - Azure Data Explorer | Microsoft Docs
description: This article describes Virtual Network deployment in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/07/2019
---
# Virtual Network deployment

Azure Data Explorer supports deploying a cluster into a subnet in your Virtual Network (VNet). This enables you to:

* Enforce Network Security Group (NSG) rules on your Azure Data Explorer cluster traffic.
* Connect your on-premise network to Azure Data Explorer cluster's subnet.
* Secure your data connection sources (Event Hub and Event Grid) with service endpoints.

Azure Data Explorer cluster has the following IP addresses for each service (Engine and Data Management services):

* Private IP: Used for accessing the cluster inside the VNet.
* Public IP: Used for accessing the cluster from outside the VNet (e.g. management and monitoring) and as a source address for outbound connections initiated from the cluster.

The following DNS records are created to access the service: 
* `[clustername].[geo-region].kusto.windows.net` (Engine) `ingest-[clustername].[geo-region].kusto.windows.net` (Data Management) are mapped to the Public IP for each service. 

* `private-[clustername].[geo-region].kusto.windows.net` (Engine) `private-ingest-[clustername].[geo-region].kusto.windows.net` (Data Management) are mapped to the Private IP for each service. 

![alt text](./images/vnet-diagram.png "vnet-diagram")

## Dependencies 

ADX's data plane service can be accessed using HTTPs (443) and TDS endpoint (1433), inbound access must be allowed to work with these endpoints, in addition these NSG rules must be allowed: 

### **Inbound**

| **Use**   | **From**   | **To**   | **Protocol**   |
| --- | --- | --- | --- |
| Management  | ADX management addresses/AzureDataExplorerManagement(SerivceTag) | ADX subnet:443  | TCP  |
| Health monitoring  | ADX health monitoring addresses  | ADX subnet:443  | TCP  |
| ADX Internal Communication  | ADX subnet: All ports  | ADX subnet:All ports  | All  |
| Allow Azure load balancer inbound (health probe)  | AzureLoadBalancer  | ADX subnet:80,443  | TCP  |

### **Outbound**

| **Use**   | **From**   | **To**   | **Protocol**   |
| --- | --- | --- | --- |
| Dependency on Storage  | ADX subnet  | Storage:443  | TCP  |
| Dependency on Data Lake  | ADX subnet  | AzureDataLake:443  | TCP  |
| EventHub ingestion/service monitoring  | ADX subnet  | EventHub:443,5671  | TCP  |
| Publish Metrics  | ADX subnet  | AzureMonitor:443 | TCP  |
| Azure Monitor configuration download  | ADX subnet  | Azure Monitor Configuration Endpoint Addresses:443 | TCP  |
| Active Directory (if applicable) | ADX subnet | AzureActiveDirectory:443 | TCP

| Certificate Authority | ADX subnet | Internet:80 | TCP |
| Internal Communication  | ADX subnet  | ADX Subnet:All Ports  | All  |
| Ports that are used for sql\_request/http\_request plugins  | ADX subnet  | Internet:Custom  | TCP  |

### Azure Data Explorer Management IP addresses

| Region | Addresses |	
| --- | --- |
| Australia Central | 20.37.26.134 |
| Australia Central2 | 20.39.99.177 |
| Australia East | 40.82.217.84 |
| Australia Southeast | 20.40.161.39 |
| BrazilSouth | 191.233.25.183 |
| Canada Central | 40.82.188.208 |
| Canada East | 40.80.255.12 |
| Central India | 40.81.249.251 |
| Central US | 40.67.188.68 |
| Central US EUAP | 40.89.56.69 |
| East Asia | 20.189.74.103 |
| East US | 52.224.146.56 |
| East US2 | 52.232.230.201 |
| East US2 EUAP | 52.253.226.110 |
| France Central | 40.66.57.91 |
| France South | 40.82.236.24 |
| Japan East | 20.43.89.90 |
| Japan West | 40.81.184.86 |
| Korea Central | 40.82.156.149 |
| Korea South | 40.80.234.9 |
| North Central US | 40.81.45.254 |
| North Europe | 52.142.91.221 |
| South Africa North | 102.133.129.138 |
| South Africa West | 102.133.0.97 |
| South Central US | 20.45.3.60 |
| Southeast Asia | 40.119.203.252 |
| South India | 40.81.72.110 |
| UK South | 40.81.154.254 |
| UK West | 40.81.122.39 |
| West Central US | 52.159.55.120 |
| West Europe | 51.145.176.215 |
| West India | 40.81.88.112 |
| West US | 13.64.38.225 |
| West US2 | 40.90.219.23 |

### Health Monitoring Addresses

| Region | Addresses |
| --- | --- |
| Australia Central | 191.239.64.128 |
| Australia Central 2 | 191.239.64.128 |
| Australia East | 191.239.64.128 |
| Australia Southeast | 191.239.160.47 |
| Brazil South | 23.98.145.105 |
| Canada Central | 168.61.212.201 |
| Canada East | 168.61.212.201 |
| Central India | 23.99.5.162 |
| Central US | 168.61.212.201 |
| Central US EUAP | 168.61.212.201 |
| East Asia | 168.63.212.33 |
| East US | 137.116.81.189 |
| East US 2 | 137.116.81.189 |
| East US 2 EUAP | 137.116.81.189 |
| France Central | 23.97.212.5 |
| France South | 23.97.212.5 |
| Japan East | 138.91.19.129 |
| Japan West | 138.91.19.129 |
| Korea Central | 138.91.19.129 |
| Korea South | 138.91.19.129 |
| North Central US | 23.96.212.108 |
| North Europe | 191.235.212.69 
| South Africa North | 104.211.224.189 |
| South Africa West | 104.211.224.189 |
| South Central US | 23.98.145.105 |
| South India | 23.99.5.162 |
| Southeast Asia | 168.63.173.234 |
| UK South | 23.97.212.5 |
| UK West | 23.97.212.5 |
| West Central US | 168.61.212.201 |
| West Europe | 23.97.212.5 |
| West India | 23.99.5.162 |
| West US | 23.99.5.162 |
| West US 2 | 23.99.5.162 |	

### Azure Monitor Configuration Endpoint Addresses

| Region | Addresses |
| --- | --- |
| Australia Central | 52.148.86.165 |
| Australia Central 2 | 52.148.86.165 |
| Australia East | 52.148.86.165 |
| Australia Southeast | 52.148.86.165 |
| Brazil South | 13.68.89.19 |
| Canada Central | 13.90.43.231 |
| Canada East | 13.90.43.231 |
| Central India | 13.71.25.187 |
| Central US | 52.173.95.68 |
| Central US EUAP | 13.90.43.231 |
| East Asia | 13.75.117.221 |
| East US | 13.90.43.231 |
| East US 2 | 13.68.89.19 |	
| East US 2 EUAP | 13.68.89.19 |
| France Central | 52.174.4.112 |
| France South | 52.174.4.112 |
| Japan East | 13.75.117.221 |
| Japan West | 13.75.117.221 |
| Korea Central | 13.75.117.221 |
| Korea South | 13.75.117.221 |
| North Central US | 52.162.240.236 |
| North Europe | 52.169.237.246 |
| South Africa North | 13.71.25.187 |
| South Africa West | 13.71.25.187 |
| South Central US | 13.84.173.99 |
| South India | 13.71.25.187 |
| Southeast Asia | 52.148.86.165 |
| UK South | 52.174.4.112 |
| UK West | 52.169.237.246 |
| West Central US | 52.161.31.69 |
| West Europe | 52.174.4.112 |
| West India | 13.71.25.187 |
| West US | 40.78.70.148 |
| West US 2 | 52.151.20.103 |

## Service Endpoints

Azure Service Endpoints enables you to secure your Azure multi-tenant resoruces to your virtual network.
<br>
Deploying Azure Data Explorer cluster into your subnet allows you to setup data connections with EventHub or EventGrid while restricting the underlying resources for ADX subnet.

## Subnet Size Consideration

ADX uses one private IP address for each VM and two private IP addresses for the internal load balancers, In addition, Azure networking reserve 5 IP addresses for each subnet.
<br>
ADX provisions two VMs for data management service, engine service scales per user configuration in scale capacity.
<br>
In total number of IP addreses :
| Use | Number of addresses |
| --- | --- |
| Engine service |1 per instance |
| Data management service | 2 |
| Internal load balancers | 2 |
| Azure reserved addresses | 5 |
| **Total** | **#engine_instances + 9** |

As subnet size cannot be changed after ADX is deployed you need to reserve subnet size accordingly.

## ExpressRoute Setup

It is possible for customer to advertise default route (0.0.0.0/0) through the BGP session, thus forcing traffic coming out of the Virtual Network to be forwarded to customer’s premise network that can drop the traffic, causing outbound flows to break, to overcome this default UDR (0.0.0.0/0) can be configured and next hop will be “Internet”, since the UDR takes precedence over BGP, the traffic will be destined to the internet.

## Securing outbound traffic with firewall

If you want to secure outbound traffic using Azure Firewall or any virtual appliance to lock it to domain names the following FQDNs must be allowed in the firewall.

* prod.warmpath.msftcloudes.com:443
* production.diagnostics.monitoring.core.windows.net:443
* graph.windows.net:443
* *.update.microsoft.com:443
* shavamanifestcdnprod1.azureedge.net:443
* login.live.com:443
* wdcp.microsoft.com:443
* login.microsoftonline.com:443
* azureprofilerfrontdoor.cloudapp.net:443
* *.core.windows.net:443
* *.servicebus.windows.net:443
* shoebox2.metrics.nsatc.net:443
* production.diagnostics.monitoring.core.windows.net:443
* prod-dsts.dsts.core.windows.net:443
* ocsp.msocsp.com:80
* *.windowsupdate.com:80
* ocsp.digicert.com:80
* go.microsoft.com:80
* dmd.metaservices.microsoft.com:80
* www.msftconnecttest.com:80
* crl.microsoft.com:80
* www.microsoft.com:80
* adl.windows.com:80
* crl3.digicert.com:80

In addition, you need to define route table with on the subnet with the management addresses and health monitoring addresses with next hop "Internet" to prevent asymmetric routes issues.
<br>
For example, for **West US** region, the following UDRs must be defined:
<br>
| Name | Address Prefix | Next Hop |
| --- | --- | --- |
| ADX_Management | 13.64.38.225/32 | Internet |
| ADX_Monitoring | 23.99.5.162/32 | Internet |

## Deploy using ARM template

To deploy Azure Data Explorer cluster into your virtual network use this template [Deploy Azure Data Explorer cluster into your VNet](https://azure.microsoft.com/en-us/resources/templates/101-kusto-vnet/)

The template creates cluster, virutal network, subnet, network security group, public ip addresses.