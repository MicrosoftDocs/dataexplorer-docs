---
title: Callout policy - Azure Data Explorer
description: This article describes Callout policy in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/05/2023
---
# Callout policy

Azure Data Explorer clusters can communicate with external services in many different scenarios.
Cluster administrators can manage the authorized domains for external calls by updating the cluster's callout policy.

## Properties of a callout

A callout policy is composed of the following properties:

| Name            | Type   | Description                                                                                             |
|-----------------|--------|---------------------------------------------------------------------------------------------------------|
| CalloutType     | string | Defines the type of callout, and can be one of types listed in [callout types](#types-of-callout).      |
| CalloutUriRegex | string | Specifies the regular expression whose matches represent the domain of resources of the callout domain. |
| CanCall         | bool   | Whether the callout is permitted or denied external calls.                                              |

## Types of callout

Callout policies are managed at cluster-level and are classified into the following types:

| Callout policy type | Description                                                                                                                                                           |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| kusto               | Controls Azure Data Explorer cross-cluster queries.                                                                                                                   |
| sql                 | Controls the [SQL plugin](../query/sqlrequestplugin.md).                                                                                                              |
| mysql               | Controls the [MySQL plugin](../query/mysqlrequest-plugin.md).                                                                                                         |
| azure_digital_twins | Controls the [Azure Digital Twins plugin](../query/azure-digital-twins-query-request-plugin.md).                                                                      |
| cosmosdb            | Controls the [Cosmos DB plugin](../query/cosmosdb-plugin.md).                                                                                                         |
| sandbox_artifacts   | Controls sandboxed plugins ([python](../query/pythonplugin.md) and [R](../query/rplugin.md)).                                                                         |
| external_data       | Controls access to external data through [external tables](../query/schema-entities/externaltables.md) or [externaldata](../query/externaldata-operator.md) operator. |
| webapi              | Controls access to http endpoints.                                                                                                                                    |

## Predefined callout policies

The following table shows a set of predefined callout policies that are preconfigured on Azure Data Explorer clusters to enable callouts to selected services:

| Service             | Designation           | Permitted domains                                                                                                         |
|---------------------|-----------------------|---------------------------------------------------------------------------------------------------------------------------|
| Kusto               | Cross cluster queries | `[a-z0-9]{3,22}\\.(\\w+\\.)?kusto(mfa)?\\.windows\\.net/?$`                                                               |
| Kusto               | Cross cluster queries | `^https://[a-z0-9]{3,22}\\.[a-z0-9-]{1,50}\\.(kusto\\.azuresynapse|kustodev\\.azuresynapse-dogfood)\\.net/?$`             |
| Kusto               | Cross cluster queries | `^https://([A-Za-z0-9]+\\.)?(ade|adx)\\.(int\\.|aimon\\.)?(applicationinsights|loganalytics|monitor)\\.(io|azure\\.com)/` |
| Azure DB            | SQL requests          | `[a-z0-9][a-z0-9\\-]{0,61}[a-z0-9]?\\.database\\.windows\\.net/?$`                                                        |
| Synapse Analytics   | SQL requests          | `[a-z0-9-]{0,61}?(-ondemand)?\\.sql\\.azuresynapse(-dogfood)?\\.net/?$`                                                   |
| External Data       | External data         | `.*`                                                                                                                      |
| Azure Digital Twins | Azure Digital Twins   | `[A-Za-z0-9\\-]{3,63}\\.api\\.[A-Za-z0-9]+\\.digitaltwins\\.azure\\.net/?$`                                               |

More predefined policies on your cluster may be observed with next query:

```kusto
.show cluster policy callout 
| where EntityType == 'Cluster immutable policy'
| project Policy
```

## Remarks

If an external resource of a given type matches more than one policy defined for such type, and at least one of the matched policies has their CanCall property set to false, access to the resource is denied.
