---
title: Principals and Identity Providers - Azure Data Explorer | Microsoft Docs
description: This article describes Principals and Identity Providers in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/14/2019

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

#### AAD Tenants


>If AAD tenant is not explicitly specified, Kusto will attempt to resolve it from the UPN (UniversalPrincipalName, e.g., `johndoe@fabrikam.com`), if provided.
  If your principal does not include the tenant information (not in UPN form), you must explicitly mention it by appending the tenant ID or name to the principal descriptor.

**Examples for AAD principals**

|AAD Tenant |Type |Syntax |
|-----------|-----|-------|
|Implicit (UPN)  |User  |`aaduser=`*UserEmailAddress*
|Explicit (ID)   |User  |`aaduser=`*UserEmailAddress*`;`*TenantId* or `aaduser=`*ObjectID*`;`*TenantId*
|Explicit (Name) |User  |`aaduser=`*UserEmailAddress*`;`*TenantName* or `aaduser=`*ObjectID*`;`*TenantName*
|Implicit (UPN)  |Group |`aadgroup=`*GroupEmailAddress*
|Explicit (ID)   |Group |`aadgroup=`*GroupObjectId*`;`*TenantId* or`aadgroup=`*GroupDisplayName*`;`*TenantId*
|Explicit (Name) |Group |`aadgroup=`*GroupObjectId*`;`*TenantName* or`aadgroup=`*GroupDisplayName*`;`*TenantName*
|Explicit (UPN)  |App   |`aadapp`=*ApplicationDisplayName*`;`*TenantId*
|Explicit (Name) |App   |`aadapp=`*ApplicationId*`;`*TenantName*

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

