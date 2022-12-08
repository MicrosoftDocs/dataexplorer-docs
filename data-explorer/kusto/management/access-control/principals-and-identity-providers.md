---
title: Security Principals and Identity Providers - Azure Data Explorer
description: This article describes security principals and identity providers in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/13/2020
---
# Security Principals and Identity Providers

The authorization model supports several identity providers (IdPs) and multiple principal types.
This article reviews the supported principal types and demonstrates their use with [role assignment commands](../../management/security-roles.md).

## Azure Active Directory

Azure Active Directory (Azure AD) is Azure's preferred multi-tenant cloud directory service and identity provider. It's
capable of authenticating security principals or federating with other identity providers, such as Microsoft's Active Directory (AD).

Azure AD is the preferred method for authenticating to the cluster. It supports the following authentication scenarios:

* **User authentication** (interactive sign-in): Used to authenticate human principals.
* **Application authentication** (non-interactive sign-in): Used to authenticate services and applications that have to run or authenticate without user interaction.

> [!NOTE]
> Azure AD does not allow authentication of service accounts that are by definition on-premises AD entities. The Azure AD equivalent of an AD service account is the Azure AD application.

### Azure AD Group principals

Azure Data Explorer only supports Security Group (SG) principals and not Distribution Group (DG) principals. An attempt to set up access for a DG on the cluster will result in an error.

### Azure AD Tenants

If an Azure AD tenant isn't explicitly specified, an attempt will be made to resolve it from the Universal Principal Name (UPN) if provided. For example, `johndoe@fabrikam.com`. If your principal doesn't include the tenant information in UPN form, you must explicitly mention it by appending the tenant ID, or name to the principal descriptor.

#### Examples for Azure AD principals

Use the syntax in the following table to reference security principals. For example, when using management commands to set security roles.

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
// No need to specify Azure AD tenant for UPN, because query engine attempts to perform the resolution by itself
.add database Test users ('aaduser=imikeoein@fabrikam.com') 'Test user (AAD)'

// Azure AD SG on 'fabrikam.com' tenant
.add database Test users ('aadgroup=SGDisplayName;fabrikam.com') 'Test group @fabrikam.com (AAD)'

// Azure AD App on 'fabrikam.com' tenant - by tenant name
.add database Test users ('aadapp=4c7e82bd-6adb-46c3-b413-fdd44834c69b;fabrikam.com') 'Test app @fabrikam.com (AAD)'
```

## Microsoft Accounts (MSAs)

Microsoft account (MSA) is the term for all the Microsoft-managed non-organizational user accounts. For example, `hotmail.com`, `live.com`, `outlook.com`.
Azure Data Explorer supports user authentication for MSAs that are identified by their UPN; there's no concept of security groups.
No attempt will be made to resolve UPNs when an MSA principal is configured on it.

### Examples for MSA principals

| IdP | Type | Syntax |
|--|--|--|
| Live.com | User | `msauser=`john.doe@live.com` |

```kusto
.add database Test users ('msauser=john.doe@live.com') 'Test user (live.com)'
```

## Next steps

* Use the Azure portal to [manage database principals and roles](manage-database-permissions)
* Learn how to use [management commands to set security roles](../security-roles.md)
