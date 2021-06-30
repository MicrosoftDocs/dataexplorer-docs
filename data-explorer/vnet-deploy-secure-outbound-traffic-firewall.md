---
title: Secure Outbound Network Dependencies in Your Virtual Network Firewall
description: Learn how to secure outbound network dependencies in your virtual network firewall
author: orspod
ms.author: orspodek
ms.reviewer: basaba
ms.service: data-explorer
ms.topic: how-to
ms.date: 10/31/2019
---

# Securing outbound traffic with a firewall from your Azure Data Explorer cluster in your Virtual Network

## Fully Qualified Domain Names (FQDN) to secure in your outbound firewall

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
> If you're using [Azure Firewall](/azure/firewall/overview), add **Network Rule** with the following properties: <br>
> **Protocol**: TCP <br> **Source Type**: IP Address <br> **Source**: * <br> **Service Tags**: AzureMonitor <br> **Destination Ports**: 443

You also need to define the [route table](/azure/virtual-network/virtual-networks-udr-overview) on the subnet with the [management addresses](vnet-deployment.md#azure-data-explorer-management-ip-addresses) and [health monitoring addresses](vnet-deployment.md#health-monitoring-addresses) with next hop *Internet* to prevent asymmetric routes issues.

For example, for **West US** region, the following UDRs must be defined:

| Name | Address Prefix | Next Hop |
| --- | --- | --- |
| ADX_Management | 13.64.38.225/32 | Internet |
| ADX_Monitoring | 23.99.5.162/32 | Internet |

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

The outbound dependencies cover categories such as "Azure Active Directory", "Azure Monitor", "Certificate Authority" and "Azure Storage". In each category there is a list of domain names and ports which are needed to run the service. They can be used to programmatically configure the firewall appliance of choice.
