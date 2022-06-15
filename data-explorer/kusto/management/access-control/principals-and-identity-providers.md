---
title: Principals and Identity Providers - Azure Data Explorer
description: This article describes Principals and Identity Providers in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/13/2020
---
# Principals and Identity Providers

The authorization model supports several identity providers (IdPs) and multiple principal types.
This article reviews the supported principal types and demonstrates their use with [role assignment commands](../../management/security-roles.md).

## Azure Active Directory

Azure Active Directory (Azure AD) is Azure's preferred multi-tenant cloud directory service and identity provider. It's
capable of authenticating security principals or federating with other identity providers, such as Microsoft's Active Directory (AD).

Azure AD is the preferred method for authenticating to the cluster. It supports the following authentication scenarios:

* **User authentication** (interactive sign-in): Used to authenticate human principals.
* **Application authentication** (non-interactive sign-in): Used to authenticate services and applications that have to run/authenticate with no human user being present.

> [!NOTE]
> Azure AD does not allow authentication of service accounts that are by definition on-prem AD entities. The Azure AD equivalent of an AD service account is the Azure AD application.

### Azure AD Group principals

Azure Data Explorer only supports Security Group (SG) principals and not Distribution Group (DG) principals. Attempt to set up access for a DG on the cluster will result in an error.

### Azure AD Tenants

If an Azure AD tenant isn't explicitly specified, the cluster will attempt to resolve it from the Universal Principal Name (UPN) (for example, `johndoe@fabrikam.com`), if provided. If your principal doesn't include the tenant information (in UPN form), you must explicitly mention it by appending the tenant ID, or name to the principal descriptor.

#### Examples for Azure AD principals

| Azure AD Tenant | Type | Syntax |
|--|--|--|
| Implicit (UPN) | User | `aaduser=`*UserEmailAddress* |
| Explicit (ID) | User | `aaduser=`*UserEmailAddress*`;`*TenantId* or `aaduser=`*ObjectID*`;`*TenantId* |
| Explicit (Name) | User | `aaduser=`*UserEmailAddress*`;`*TenantName* or `aaduser=`*ObjectID*`;`*TenantName* |
| Implicit (UPN) | Group | `aadgroup=`*GroupEmailAddress* |
| Explicit (ID) | Group | `aadgroup=`*GroupObjectId*`;`*TenantId* or`aadgroup=`*GroupDisplayName*`;`*TenantId* |
| Explicit (Name) | Group | `aadgroup=`*GroupObjectId*`;`*TenantName* or`aadgroup=`*GroupDisplayName*`;`*TenantName* |
| Explicit (UPN) | App | `aadapp`=*ApplicationDisplayName*`;`*TenantId* |
| Explicit (Name) | App | `aadapp=`*ApplicationId*`;`*TenantName* |

```kusto
// No need to specify Azure AD tenant for UPN, because the cluster (Kusto) performs the resolution by itself
.add database Test users ('aaduser=imikeoein@fabrikam.com') 'Test user (AAD)'

// Azure AD SG on 'fabrikam.com' tenant
.add database Test users ('aadgroup=SGDisplayName;fabrikam.com') 'Test group @fabrikam.com (AAD)'

// Azure AD App on 'fabrikam.com' tenant - by tenant name
.add database Test users ('aadapp=4c7e82bd-6adb-46c3-b413-fdd44834c69b;fabrikam.com') 'Test app @fabrikam.com (AAD)'
```

## Microsoft Accounts (MSAs)

Microsoft account (MSA) is the term for all the Microsoft-managed non-organizational user accounts (for example, `hotmail.com`, `live.com`, `outlook.com`.)
Azure Data Explorer supports user authentication for MSAs that are identified by their UPN; there's no concept of security groups.
The cluster **will not** attempt to resolve UPNs when an MSA principal is configured on it.

### Examples for MSA principals

| IdP | Type | Syntax |
|--|--|--|
| Live.com | User | `msauser=`john.doe@live.com` |

```kusto
.add database Test users ('msauser=john.doe@live.com') 'Test user (live.com)'
```
