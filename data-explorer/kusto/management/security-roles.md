---
title: Role Based Authorization Model - Azure Data Explorer | Microsoft Docs
description: This article describes Role Based Authorization Model in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Role Based Authorization Model

[!IMPORTANT]
Before altering authorization rules on your Kusto cluster(s), please review the
[Kusto access control overview](../management/access-control/index.md) and
[role based authorization](../management/access-control/role-based-authorization.md) topics.

This topic describes the control commands used to manage security roles.
Every securable object (e.g. a database, or a table) has a number of security roles
which are groups of security groups and security principals, alongside a set of
permissions that are associated with the security role. When a principal attempts
to make an operation on a securable object Kusto checks that the principal is
a member of at least one role that grants permission for the operation on the object.

For example, the database admin security role is associated with every database,
and grants the principals in it (either directly or through them being a part
of a security group that is in the role) the permission to modify the database
and objects in it.

The commands to manage security roles generally have this syntax:

*Verb* *SecurableObjectType* *SecurableObjectName* *Role* [`(` *ListOfPrincipals* `)` [*Description*]]

*Verb* indicates the kind of action to perform: `.show`, `.add`, `.drop`, and `.set`.

|*Verb* |Description                                  |
|-------|---------------------------------------------|
|`.show`|Returns the current value or values.         |
|`.add` |Adds one or more principals to the role.     |
|`.drop`|Removes one or more principals from the role.|
|`.set` |Sets the role to the specific list of principals, removing all previous ones (if any).|

*SecurableObjectType* is the kind of object whose role is specified:

|*SecurableObjectType*|Description|
|---------------------|-----------|
|`database`|The specified database|
|`table`|The specified table|

*SecurableObjectName* is the name of the object.

*Role* is the name of the relevant role:

|*Role*      |Description|
|------------|-----------|
|`principals`|Can appear only as part of a `.show` verb; returns the list of principals that can affect the securable object.|
|`admins`    |Have control over the securable object, including the ability to view, modify it, and remove the object and all sub-objects.|
|`users`     |Can view the securable object, and create new objects underneath it.|
|`viewers`   |Can view the securable object.|
|`ingestors` |At the database level only, allow data ingestion into all tables.|
|`monitors`  ||

*ListOfPrincipals* is an optional, comma-delimited, list of security principals
identifiers (values of type `string`).

*Description* is an optional value of type `string` ********

## Examples

The following control command lists all security principals which have some
access to the table `StormEvents` in the database in scope:

```kusto
.show table StormEvents principals
```

Here are potential results from this command:

|Role |PrincipalType |PrincipalDisplayName |PrincipalObjectId |PrincipalFQN 
|---|---|---|---|---
|Database Apsty Admin |AAD User |Mark Smith |cd709aed-a26c-e3953dec735e |aaduser=msmith@fabrikam.com|

The following control command 

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

