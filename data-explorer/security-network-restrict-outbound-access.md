---
title: Restrict outbound access from Azure Data Explorer
description: 'In this article you will learn how to restrict the outbound access access from Azure Data Explorer to other services.'
author: cosh
ms.author: herauch
ms.reviewer: eladb
ms.service: data-explorer
ms.topic: how-to
ms.date: 01/21/2022
---

# Howto restrict outbound access from Azure Data Explorer (public preview)

Restricting the outbound access of an Azure Data Explorer cluster is important to mitigate risks like data exfiltration. A malicious attacker could potentially create an external table to a storage account and extract large amounts of data. In order to control that risk Azure Data Explorer is able to define callout policies. Managing them allows to allow outbound access to certain SQL, Storage or other endpoints.

This HowTo covers an extension to callout policies which enables the user to restrict the callouts even more.

## Callout policies

The callout policies can be devided into two parts:

* Immutable callout policies. They can be considered the standard callout policies of an Azure Data Explorer cluster and they are configured by default and cannot be modified.
* Cluster callout policies. They can be configured by the user using the callout policy commands.

Using the command in the screenshot you can inspect the callout policies on your cluster:

![Immutable callout policies.](media/security-network-restrict-access/restrict-outbound-access.png)

Example of immutable callout policies:

```javascript
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

You can see by the list of callouts that there are quite some default rules which allow making callouts (external tables, etc) to other services.

## Create an empty list of immutable callout policies

To create an empty list of immutable callout policies on your Azure Data Explorer cluster, you need to make a configuration via the Azure CLI or other tools calling the Azure Data Explorer APIs (ARM, Powershell, etc.).

Azure CLI call:

```bash
az kusto cluster update --resource-group "restricted-rg" --name "restricted" --subscription "sid" --verbose  --set properties.restrictOutboundNetworkAccess="Enabled"
```

After you updated the "restrictOutboundNetworkAccess" cluster property, the immutable policies will no longer exist on your cluster. This has the effect that no callouts to other services can be initiated

![Immutable callout policies](media/security-network-restrict-access/restrict-outbound-access-enabled.png)

## Add FQDNs to the callouts under restricted conditions

Once you enabled the "restrictOutboundNetworkAccess" cluster property, you will not be able to make changes to the cluster callout policies using the callout policy command.

![Immutable callout policies error.](media/security-network-restrict-access/restrict-outbound-access-enabled-errorDataplane.png)

The only way to add a FQDN to the list of allowed callouts is modifying the "AllowedFQDNList" property of the Azure Data Explorer cluster.

Example of adding a SQL db as an allowed FQDN:

```bash
az kusto cluster update --resource-group "restricted-rg" --name "restricted" --subscription "sid" --verbose  --addAllowedFQDN "adedicated.sql.azuresynapse.net"
```

Once you executed this command the user will be able to make callouts to the respective FQDN.

## Next steps

* [Troubleshooting Private Endpoints in Azure Data Explorer](security-network-private-endpoint-troubleshoot.md)
