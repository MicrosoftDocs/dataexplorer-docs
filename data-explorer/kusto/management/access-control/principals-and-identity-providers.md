---
title: Principals and Identity Providers - Azure Data Explorer | Microsoft Docs
description: This article describes Principals and Identity Providers in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Principals and Identity Providers

Kusto Authorization model supports several Identity Providers (IdPs) and multiple principal types.
This article reviews the supported principal types and demonstrates their use with [role assignment commands](../../management/security-roles.md).

### Azure Active Directory
Azure Active Directory (AAD) is Azure's preferred multi-tenant cloud directory service and Identity Provider,
capable of authenticating security principals or federating with other identity providers, such as Microsoft's Active Directory.

AAD is the preferred method for authenticating to Kusto. It supports a number of authentication scenarios:
* **User authentication** (interactive logon): Used to authenticate human principals.
* **Application authentication** (non-interactive logon): Used to authenticate services and applications that have to run/authenticate with no human user being present.

>NOTE: Azure Active Directory does not allow authentication of service accounts (that are by definition on-prem AD entities).
  The AAD equivalent of AD service account is the AAD application.

#### AAD Group principals
Kusto only supports Security Group principals (and not Distribution Group ones). Attempt to set up access for a DG on a Kusto cluster will result in an error.

#### Non microsoft.com AAD Tenants
**By default, any Kusto cluster accepts access tokens issued by any Microsoft AAD tenant (MSIT - microsoft.com, AME, GBL) in every Azure cloud**.<br>
Non-Microsoft AAD tenants can be added to the trusted issuers per Kusto service by filing a support ticket at [https://aka.ms/kustosupport](https://aka.ms/kustosupport).
>Unless AAD tenant is explicitly specified, Kusto will assume MSIT.
  If your principals are in other tenant, you need to explicitly mention it by appending the tenant ID or name to the principal descriptor.
  There is no need to append the tenant to UPN, as it already contains it (e.g., `johndoe@fabrikam.com`).


**Examples for AAD principals**
|AAD Tenant |Type |Syntax |
|-----------|-----|-------|
|Default  |User  |`aaduser=`*UserEmailAddress*
|Other    |User  |`aaduser=`*UserEmailAddress*`;`*TenantId*
|Default  |Group |`aadgroup=`*GroupObjectId*<br>`aadgroup=`*GroupDisplayName*<br>`aadgroup=`*GroupEmailAddress*
|Other    |Group |`aadgroup=`*GroupObjectId*`;`*TenantId*<br>`aadgroup=`*GroupDisplayName*`;`*TenantId*<br>`aadgroup=`*GroupEmailAddress*`;`*TenantId*
|Default  |App   |`aadapp=`*ApplicationId*<br>`aadapp`=*ApplicationDisplayName*
|Other    |App   |`aadapp=`*ApplicationId*<br>`aadapp`=*ApplicationDisplayName*`;`*TenantId*

```kusto
// No need to specify AAD tenant for UPN, as Kusto performs the resolution by itself
.add database Test users ('aaduser=imikeoein@fabrikam.com') 'Test user (AAD)'

// AAD SG on 'fabrikam.com' tenant
.add database Test users ('aadgroup=SGDisplayName;fabrikam.com') 'Test group @fabrikam.com (AAD)'

// AAD App on 'fabrikam.com' tenant - by tenant name
.add database Test users ('aadapp=4c7e82bd-6adb-46c3-b413-fdd44834c69b;fabrikam.com') 'Test app @fabrikam.com (AAD)'
```

### Microsoft Accounts (MSAs)
Microsoft Accounts (MSAs) is the term for all the Microsoft-managed non-organizational user accounts, e.g. `hotmail.com`, `live.com`, `outlook.com`.
Kusto supports user authentication for MSAs (note, that there is no security groups concept), which are identified by their UPN (Universal Principal Name).
When an MSA principal is configured on a Kusto resource, Kusto **will not** attempt to resolve the UPN provided.

**Examples for MSA principals**

|IdP  |Type  |Syntax |
|-----|------|-------|
|Live.com |User  |`msauser=`john.doe@live.com`

```kusto
.add database Test users ('msauser=john.doe@live.com') 'Test user (live.com)'
```

