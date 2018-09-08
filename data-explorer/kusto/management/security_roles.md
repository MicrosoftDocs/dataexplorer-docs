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
These articles will help you understand what Identity Providers are supported and recommended by Kusto for authentcation, as well as how Role based authorization works in Kusto. 


## List principals

List all the principals of this cluster:

```kusto
.show cluster principals
```

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
|Cluster User |AAD User |Julia Ilyana |94752274-2397-bf226ac7ef3a |aaduser=sigwjs@fabrikam.com 
|Cluster User |AAD User |Mike Senior |a8e71651-8e89-931be58ba189 |aaduser=imikeoein@fabrikam.com 
|Cluster User |AAD Group |Fabrikam: All Staff |ddd4410-b5a1-8e200fc7409e |aadgroup=dd5a7f9f-b5a1-8e200fc7409e 
|Cluster Admin |AAD User |Mike Senior |a8e71651-8e89-f31be58ba189 |aaduser=mikeoein@fabrikam.com 
|Cluster Viewer |AAD User |Nitzan Parness |2ff79583-f835-b7c4-599e1575f9b0 |aaduser=nparness@fabrikam.com
|Database Apsty Admin |AAD User |Ido Eynath |a8e71651-8885-f31be58ba189 |aaduser=iduipn@fabrikam.com 
|Database Apsty User |AAD User |Liron Eizenman |94752274-4314-ff226ac7ef3a |aaduser=fabdev01@fabrikam.com 
|Database Apsty User |Kusto User |ido | |upn=ido 


## Managing database principals

These commands modify the lists of role access principals of a database: 

### Adding one or more principals

```kusto
.add database database_name admins (Principal ,...) ['Description'] 

.add database database_name users (Principal ,...) ['Description']

.add database database_name viewers Principal ,...) ['Description']

.add database database_name unrestrictedviewers (Principal ,...) ['Description']

.add database database_name ingestors (Principal ,...) ['Description']

.add database database_name monitors (Principal ,...) ['Description']
```

### Removing one or more principals

```kusto
.drop database <DatabaseName> admins (Principal, ...) 

.drop database <DatabaseName> users (Principal, ...)

.drop database <DatabaseName> unrestrictedviewers (Principal, ...)

.drop database <DatabaseName> viewers (Principal, ...)

.drop database <DatabaseName> ingestors (Principal, ...)

.drop database <DatabaseName> monitors (Principal, ...)
```

### Removing all principals
```kusto
.set database database_name admins none 

.set database database_name users none 

.set database database_name viewers none

.set database database_name unrestrictedviewers none

.set database database_name ingestors none
```

* `admins` refers to the "Admins" role. 
* `users` refers to the "Users" role. 
* `viewers` refers to the "Viewers" role.
* `unrestrictedviewers` refers to the "UnrestrictedViewers" role.
* `ingestors` refers to the "Ingestors" role. 
* `monitors` refers to the "Monitor" role. 
* `none` removes all authenticated users. Only cluster admins will be DB admin. 
  
**Principals** 

|Identity provider |Principal kind |Syntax|
|------------------|---------------|---
|AAD               |User           |`aaduser=`*UserEmailAddress*
|AAD               |Group          |`aadgroup=`*GroupObjectId*<br>`aadgroup=`*GroupDisplayName*<br>`aadgroup=`*GroupEmailAddress*
|AAD               |App            |`aadapp=`*ApplicationId*<br>`aadapp`=*ApplicationDisplayName*
|dSTS              |User           |`dstsuser=`*UserEmailAddress*
|dSTS              |Group          |`dstsgroup=`*Domain*\\*GroupName*
|dSTS              |App            |`dstsapp=`*ApplicationId*
|Kusto (basic auth)|User           |`upn=`*UserName*
 
**Examples**

```kusto
.add database Test users ('aaduser=imikeoein@fabrikam.com') 'Test user (AAD)'
.add database Test users ('aadgroup=<SG display name or SG group ID or SG Display name>') 'Test group (AAD)'
.add database Test users ('aadapp=<App display name or App ID>') 'Test app (AAD)'
.add database Test users ('dstsuser=imikeoein@fabrikam.com ') 'Test user (dSTS)'
.add database Test users (@'dstsgroup=<Domain>\<GroupName>') 'Test group (dSTS)'
.add database Test users (@'dstsapp=<App ID>') 'Test app (dSTS)'
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
|Cluster Admin |AAD User |Mike Senior |a8e71651-8e89-931be58ba189 |aaduser=imikeoein@fabrikam.com 
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
|dSTS              |User           |`dstsuser=`*UserEmailAddress*
|dSTS              |Group          |`dstsgroup=`*Domain*\\*GroupName*
|dSTS              |App            |`dstsapp=`*ApplicationId*
|Kusto (basic auth)|User           |`upn=`*UserName*

**Examples**

```kusto
.add cluster admins ('aaduser=imikeoein@fabrikam.com') 'Test user (AAD)'
.add cluster admins ('aadgroup=<SG display name or SG group ID or SG Display name>') 'Test group (AAD)'
.add cluster admins ('aadapp=<App display name or App ID>') 'Test app (AAD)'
.add cluster admins ('dstsuser=imikeoein@fabrikam.com ') 'Test user (dSTS)'
.add cluster admins (@'dstsgroup=<Domain>\<GroupName>') 'Test group (dSTS)'
.add cluster admins (@'dstsapp=<App ID>') 'Test app (dSTS)'
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
|dSTS              |User           |`dstsuser=`*UserEmailAddress*
|dSTS              |Group          |`dstsgroup=`*GroupName* 
|dSTS              |App            |`dstsapp=`*ApplicationId*
|Kusto (basic auth)|User           |`upn=`*UserName*
 
**Example**

```kusto
.add table Test admins ('aaduser=imikeoein@fabrikam.com ')
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
|dSTS              |User           |`dstsuser=`*UserEmailAddress*
|dSTS              |Group          |`dstsgroup=`*GroupName* 
|dSTS              |App            |`dstsapp=`*ApplicationId*
|Kusto (basic auth)|User           |`upn=`*UserName*
 
**Example**

```kusto
.add function MyFunction admins ('aaduser=imikeoein@fabrikam.com ')
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
.show principal "aaduser=imikeoein@fabrikam.com" roles
.show principal @'dstsapp=<App ID>' roles
```

## Basic authentication provider

Basic authentication users are those registered directly with Kusto. Useful for tutorial events.

### Create a basic user

**Syntax**

`.create basicauth user` *Username* [`password` *Password*]

This command creates a new Kusto user in the cluster
named *Username* (which must be a `string` literal)
that has the password *Password* (also a `string`) literal.
If *Password* is omitted, the command will generate a random
password.

The password is salted and passed through a one-way hash
before storing it in Kusto, so there's no way to recover
an old password; be sure to store it in a secure and persistent
storage. 

> Note that it is recommended that the password be prefixed
  by an `h`, as shown in the example below, to prevent Kusto
  from echoing it in the trace log. 

**Example**

```kusto
.create basicauth user "zivc" password h"12345678"
```

### List basic authentication users

`.show basicauth users`

### Drop users

`.drop basicauth user` *Username*

This command drops an existing Kusto user from the cluster
named *Username* (which must be a `string` literal).

## Blocking principals manually

A cluster admin has the capability of blocking a certain user or application from accessing the cluster.
Once a principal is blocked, all Query and Admin commands will be denied for that principal.
Being able to manually block principals will allow a cluster admin to handle cases were a certain principal was identified as the source for 
queries/commands which for some reason consume an excessive amount of resources, and hence should be stopped until a further investigation.
Note as well that cluster admin is the only one who can unblock a principal.

**Syntax**

```kusto
.add cluster blockedprincipals` *Principal* ['Application'] ['User'] ['Period'] ['Reason']
.drop cluster blockedprincipals` *Principal* ['Application'] ['User']
.show cluster blockedprincipals
```

Unlike adding and dropping a blocked principals, which require a Cluster Admin privileges, showing the list of blocked principals requires a Cluster User privileges.

* `Application` refers to the optional x-ms-app header sent with the Http request.
* `User` refers to the optional x-ms-user header sent with the Http request.
* `Period` indicates the amount of time which the principal should be blocked for. If no value is provided, principal will be blocked permanently (practically for 10 years).
* `Reason` a note explaining why that principal was blocked.

**Examples**

```kusto
.add cluster blockedprincipals 'aaduser=imikeoein@fabrikam.com' period 4d reason "Some explanation..."
.add cluster blockedprincipals 'dstsapp=<App ID>' application '<App name>' user '<User name>' period 30d reason "Some explanation"
.add cluster blockedprincipals 'upn=<User Name>'
.show cluster blockedprincipals
.drop cluster blockedprincipals 'aaduser=imikeoein@fabrikam.com'
```