---
title: Callout policy - Azure Data Explorer
description: This article describes Callout policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 04/01/2020
---
# Callout policy

Azure Data Explorer clusters can communicate with external services in many different scenarios.
Cluster admins can manage the authorized domains for external calls, by updating the cluster's callout policy.

Callout policies are being managed at cluster-level and are classified into the following types.
* `kusto` - Controls Azure Data Explorer cross-cluster queries.
* `sql` - Controls the [SQL plugin](../query/sqlrequestplugin.md).
* `cosmosdb` - Controls the [CosmosDB plugin](../query/cosmosdb-plugin.md).
* `sandbox_artifacts` - Controls sandboxed plugins ([python](../query/pythonplugin.md) | [R](../query/rplugin.md)).
* `external_data` - Controls access to external data through [external tables](../query/schema-entities/externaltables.md) or [externaldata](../query/externaldata-operator.md) operator.

Callout policy is composed of the following.

* **CalloutType** - Defines the type of the callout, and can be `kusto` or `sql`.
* **CalloutUriRegex** - Specifies the permitted Regex of the callout's domain
* **CanCall** - Indicates whether the callout is permitted external calls.

## Predefined callout policies

The table shows a set of predefined callout policies that are preconfigured on all Azure Data Explorer clusters to enable callouts to select services.

|Service      |Cloud        |Designation  |Permitted domains |
|-------------|-------------|-------------|-------------|
|Kusto |`Public Azure` |Cross cluster queries |`^[^.]*\.kusto\.windows\.net$` <br> `^[^.]*\.kustomfa\.windows\.net$` |
|Kusto |`Black Forest` |Cross cluster queries |`^[^.]*\.kusto\.cloudapi\.de$` <br> `^[^.]*\.kustomfa\.cloudapi\.de$` |
|Kusto |`Fairfax` |Cross cluster queries |`^[^.]*\.kusto\.usgovcloudapi\.net$` <br> `^[^.]*\.kustomfa\.usgovcloudapi\.net$` |
|Kusto |`Mooncake` |Cross cluster queries |`^[^.]*\.kusto\.chinacloudapi\.cn$` <br> `^[^.]*\.kustomfa\.chinacloudapi\.cn$` |
|Azure DB |`Public Azure` |SQL requests |`^[^.]*\.database\.windows\.net$` <br> `^[^.]*\.databasemfa\.windows\.net$` |
|Azure DB |`Black Forest` |SQL requests |`^[^.]*\.database\.cloudapi\.de$` <br> `^[^.]*\.databasemfa\.cloudapi\.de$` |
|Azure DB |`Fairfax` |SQL requests |`^[^.]*\.database\.usgovcloudapi\.net$` <br> `^[^.]*\.databasemfa\.usgovcloudapi\.net$` |
|Azure DB |`Mooncake` |SQL requests |`^[^.]*\.database\.chinacloudapi\.cn$` <br> `^[^.]*\.databasemfa\.chinacloudapi\.cn$` |
|Baselining service |Public Azure |Baselining requests |`baseliningsvc-int.azurewebsites.net` <br> `baseliningsvc-ppe.azurewebsites.net` <br> `baseliningsvc-prod.azurewebsites.net` |

## Control commands

The commands require [AllDatabasesAdmin](access-control/role-based-authorization.md) permissions.

**Show all configured callout policies**

```kusto
.show cluster policy callout
```

**Alter callout policies**

```kusto
.alter cluster policy callout @'[{"CalloutType": "sql","CalloutUriRegex": "sqlname.database.azure.com","CanCall": true}]'
```

**Add a set of permitted callouts**

```kusto
.alter-merge cluster policy callout @'[{"CalloutType": "sql","CalloutUriRegex": "sqlname.database.azure.com","CanCall": true}]'
```

**Delete all non-immutable callout policies**

```kusto
.delete cluster policy callout
```
