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