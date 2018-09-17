---
title: Role Based Authorization Model  - Azure Data Explorer | Microsoft Docs
description: This article describes Role Based Authorization Model  in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Role Based Authorization Model 

> [!IMPORTANT]
> Before altering authorization rules on your Kusto cluster(s), please make sure you reviewed [Kusto Access Control Overview](../management/access-control/index.md) and [Role Based Authorization](../management/access-control/role-based-authorization.md).
> These articles will help you understand what Identity Providers are supported and recommended by Kusto for authentication, as well as how Role based authorization works in Kusto. 


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
|Cluster User |AAD User |Julia Ilyana |6dbe4cc3-dbe0-76946a820502 |aaduser=jil@fabrikam.com
|Cluster User |AAD User |Mike White |48476cb0-ce38-57ee135b1fdf |aaduser=mike@fabrikam.com 
|Cluster User |AAD Group |Fabrikam: All Staff |ddd441d-b5a1-8e200fc7409e |aadgroup=dd5a7f9f-b5a1-8e200fc7409e 
|Cluster Admin |AAD User |Mike White |48476cb0-ce38-57ee135b1fdf |aaduser=mikeoein@fabrikam.com 
|Database Apsty Admin |AAD User |Mark Smith |cd709aed-a26c-e3953dec735e |aaduser=msmith@fabrikam.com 

## Adding one or more principals

```kusto
.add database database_name admins (Principal ,...) ['Description'] 

.add database database_name users (Principal ,...) ['Description']

.add database database_name viewers Principal ,...) ['Description']

.add database database_name ingestors (Principal ,...) ['Description']

.add database database_name monitors (Principal ,...) ['Description']
```

## Removing one or more principals

```kusto
.drop database <DatabaseName> admins (Principal, ...) 

.drop database <DatabaseName> users (Principal, ...)

.drop database <DatabaseName> viewers (Principal, ...)

.drop database <DatabaseName> ingestors (Principal, ...)

.drop database <DatabaseName> monitors (Principal, ...)
```

### Removing all principals
```kusto
.set database database_name admins none 

.set database database_name users none 

.set database database_name viewers none

.set database database_name ingestors none
```

* `admins` refers to the "Admins" role. 
* `users` refers to the "Users" role. 
* `viewers` refers to the "Viewers" role.

* `ingestors` refers to the "Ingestors" role. 
* `monitors` refers to the "Monitor" role. 
* `none` removes all authenticated users. Only cluster admins will be DB admin. 
  
**Principals** 

|Identity provider |Principal kind |Syntax|
|------------------|---------------|---
|AAD               |User           |`aaduser=`*UserEmailAddress*
|AAD               |Group          |`aadgroup=`*GroupObjectId*<br>`aadgroup=`*GroupDisplayName*<br>`aadgroup=`*GroupEmailAddress*
|AAD               |App            |`aadapp=`*ApplicationId*<br>`aadapp`=*ApplicationDisplayName*
 
**Examples**

```kusto
.add database Test users ('aaduser=imike@fabrikam.com') 'Test user (AAD)'
.add database Test users ('aadgroup=<SG display name or SG group ID or SG Display name>') 'Test group (AAD)'
.add database Test users ('aadapp=<App display name or App ID>') 'Test app (AAD)'
.add database Test users ('dstsuser=imike@fabrikam.com ') 'Test user (dSTS)'
```

## List cluster principals

List all the principals of this cluster:

```kusto
.show cluster principals
```

Example result:

|Role |PrincipalType |PrincipalDisplayName |PrincipalObjectId |PrincipalFQN 
|---|---|---|---|---
|Cluster Admin |AAD User |Julia Ilyana |94752274-2397-bf226ac7ef3a |aaduser=sigwjs@fabrikam.com 
|Cluster Admin |AAD User |Mike Senior |48476cb0-ce38-41b1-b646-57ee135b1fdf |aaduser=imike@fabrikam.com 
|Cluster Admin |AAD Group |Fabrikam: All Staff |ddd4410-b5a1-8e200fc7409e |aadgroup=dd5a7f9f-b5a1-8e200fc7409e 
|Cluster Admin |AAD User |Mike Senior |a8e71651-8e89-f31be58ba189 |aaduser=mikeoein@fabrikam.com 

## Managing cluster principals

These commands modify the lists of role access principals of the cluster: 

### Adding one or more principals

```kusto
.add cluster admins (Principal ,...) ['Description'] 

.add cluster users  (Principal ,...) ['Description']

.add cluster viewers  (Principal ,...) ['Description']

.add cluster databasecreators  (Principal ,...) ['Description']
```
Here, *Principal* is a `string` literal indicating the identity provider,
principal kind, and principal identity (see below for the syntax).

### Removing one or more principals

```kusto
.drop cluster admins (Principal, ...) 

.drop cluster users  (Principal, ...)

.drop cluster viewers  (Principal, ...)

.drop cluster databasecreators  (Principal, ...)
```

### Removing all principals

```kusto
.set cluster admins none 

.set cluster users  none 

.set cluster viewers  none

.set cluster databasecreators  none
```

* `admins` refers to the "Admins" role. 
* `users` refers to the "Users" role. 
* `viewers` refers to the "Viewers" role. 
* `databasecreators` refers to the "DatabaseCreators" role. 
* `none` removes all authenticated users. Only cluster admins will be DB admin. 
  
**Principals** 

|Identity provider |Principal kind |Syntax|
|------------------|---------------|---
|AAD               |User           |`aaduser=`*UserEmailAddress*
|AAD               |Group          |`aadgroup=`*GroupObjectId*<br>`aadgroup=`*GroupDisplayName*<br>`aadgroup=`*GroupEmailAddress*
|AAD               |App            |`aadapp=`*ApplicationId*<br>`aadapp`=*ApplicationDisplayName*

**Examples**

```kusto
.add cluster admins ('aaduser=imike@fabrikam.com') 'Test user (AAD)'
.add cluster admins ('aadgroup=<SG display name or SG group ID or SG Display name>') 'Test group (AAD)'
.add cluster admins ('aadapp=<App display name or App ID>') 'Test app (AAD)'
```

## Managing table principals

These commands modify the lists of role access principals of a table (only "Admins" role is available on the table level): 

### Adding one or more principals

```kusto
.add table table_name admins (Principal ,...) ['Description'] 

.add table table_name ingestors (Principal ,...) ['Description'] 
```

### Removing one or more principals

```kusto
.drop table table_name admins    (Principal, ...) 

.drop table table_name ingestors (Principal, ...) 
```

### Removing all principals
```kusto
.set table table_name admins    none 

.set table table_name ingestors none 
```

* `admins` refers to the "Admins" role. 
* `ingestors` refers to the "Ingestors" role. 
* `none` removes all authenticated users. Only cluster and db admins will be table admins. 
  
**Principals** 

|Identity provider |Principal kind |Syntax|
|------------------|---------------|---
|AAD               |User           |`aaduser=`*UserEmailAddress* 
|AAD               |Group          |`aadgroup=`*GroupObjectId*<br>`aadgroup=`*GroupDisplayName*<br>`aadgroup=`*GroupEmailAddress* 
|AAD               |App            |`aadapp=`*ApplicationId*<br>`aadapp`=*ApplicationDisplayName*
 
**Example**

```kusto
.add table Test admins ('aaduser=imike@fabrikam.com ')
```

## Manage function principals

These commands modify the lists of role access principals of a function: 

### Adding one or more principals

```kusto
.add function function_name admins (Principal ,...) ['Description'] 
```

### Removing one or more principals

```kusto
.drop function function_name admins (Principal, ...) 
```

### Removing all principals
```kusto
.set function function_name admins none 
```

* `admins` refers to the "Admins" role. 
* `none` removes all authenticated users. Only cluster and db admins will be function admins. 

**Principals** 

|Identity provider |Principal kind |Syntax|
|------------------|---------------|---
|AAD               |User           |`aaduser=`*UserEmailAddress* 
|AAD               |Group          |`aadgroup=`*GroupObjectId*<br>`aadgroup=`*GroupDisplayName*<br>`aadgroup=`*GroupEmailAddress* 
|AAD               |App            |`aadapp=`*ApplicationId*<br>`aadapp`=*ApplicationDisplayName*
 
**Example**

```kusto
.add function MyFunction admins ('aaduser=imike@fabrikam.com ')
```

## List user roles

```kusto
.show principal roles
```
List all roles for the current user (the user who executed the command). Minimum permissions: the user should have access to minimum 1 database in the cluster.

```kusto
.show principal "addObjectPrefix=AADObjectid" roles
```
List all roles for the specified principal (user, application) AADObjectid. The command runs in cluster context, meaning it returns all databases and cluster level roles the principal has access to.
Required permissions: cluster user.

**Examples**

```kusto
.show principal "aaduser=imike@fabrikam.com" roles
```

