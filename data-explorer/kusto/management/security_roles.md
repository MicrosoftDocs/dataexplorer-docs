---
title: Role Based Authorization Model  - Azure Kusto | Microsoft Docs
description: This article describes Role Based Authorization Model  in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Role Based Authorization Model 


> IMPORTANT: Before altering authorization rules on your Kusto cluster(s), please make sure you reviewed [Kusto Access Control Overview](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/security.html) and [Role Based Authorization](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/principal-roles.html).
These articles will help you understand what Identity Providers are supported and recommended by Kusto for authentication, as well as how Role based authorization works in Kusto. 


## List principals


List all the principals on this database, including cluster admins, users and viewers which have permissions on this database:

```kusto
.show database DatabaseName principals 
```

Show all the principals on this table, including cluster/database admins, users and viewers which have permissions on this table:

```kusto
.show table TableName principals
```

Example result:

|Role |PrincipalType |PrincipalDisplayName |PrincipalObjectId |PrincipalFQN 
|---|---|---|---|---
