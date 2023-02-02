---
title: Callout policy - Azure Data Explorer
description: This article describes Callout policy in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/01/2020
---
# Callout policy

Azure Data Explorer clusters can communicate with external services in many different scenarios.
Cluster admins can manage the authorized domains for external calls, by updating the cluster's callout policy.

Callout policies are being managed at cluster-level and are classified into the following types.
* `kusto` - Controls Azure Data Explorer cross-cluster queries.
* `sql` - Controls the [SQL plugin](../query/sqlrequestplugin.md).
* `mysql` - Controls the [MySQL plugin](../query/mysqlrequest-plugin.md).
* `azure_digital_twins` - Controls the [Azure Digital Twins plugin](../query/azure-digital-twins-query-request-plugin.md).
* `cosmosdb` - Controls the [CosmosDB plugin](../query/cosmosdb-plugin.md).
* `sandbox_artifacts` - Controls sandboxed plugins ([python](../query/pythonplugin.md) | [R](../query/rplugin.md)).
* `external_data` - Controls access to external data through [external tables](../query/schema-entities/externaltables.md) or [externaldata](../query/externaldata-operator.md) operator.
* `webapi` - Controls access to http endpoints

Callout policy is composed of the following.

* **CalloutType** - Defines the type of the callout, and can be one of above listed types.
* **CalloutUriRegex** - Specifies the permitted Regex of the callout's domain
* **CanCall** - Indicates whether the callout is permitted external calls.

## Predefined callout policies

The table shows a set of predefined callout policies that are preconfigured on Azure Data Explorer clusters to enable callouts to selected services.

|Service      |Designation  |Permitted domains |
|-------------|-------------|-------------|
|Kusto |Cross cluster queries |`[a-z0-9]{3,22}\\.(\\w+\\.)?kusto\\.windows\\.net/?$` <br> `[a-z0-9]{3,22}\\.(\\w+\\.)?kustomfa\\.windows\\.net/?$` |
|Azure DB |SQL requests |`[a-z0-9][a-z0-9\\-]{0,61}[a-z0-9]?\\.database\\.windows\\.net/?$`|

More predefined policies on your cluster may be observed with next query:

```kusto
.show cluster policy callout 
| where EntityType == 'Cluster immutable policy'
| project Policy
```

## Control commands

The commands require [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions.

**Show all configured callout policies**

```kusto
.show cluster policy callout
```

**Alter callout policies**

```kusto
.alter cluster policy callout @'[{"CalloutType": "sql","CalloutUriRegex": "sqlname\\.database\\.azure\\.com/?$","CanCall": true}]'
```

**Add a set of permitted callouts**

```kusto
.alter-merge cluster policy callout @'[{"CalloutType": "sql","CalloutUriRegex": "sqlname\\.database\\.azure\\.com/?$","CanCall": true}]'
```

**Delete all non-immutable callout policies**

```kusto
.delete cluster policy callout
```
