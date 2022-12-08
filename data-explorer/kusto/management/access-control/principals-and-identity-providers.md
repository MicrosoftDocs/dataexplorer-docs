---
title: Security principals - Azure Data Explorer
description: This article describes security principals and identity providers in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 12/08/2022
---
# Security principals

The Azure Data Explorer authorization model supports several identity providers (IdPs) and principal types.
This article reviews identity providers and their supported principal types, and demonstrates how to reference these principals when assigning [security roles](../../management/security-roles.md) with management commands.

## Azure Active Directory

The recommended way to access Azure Data Explorer is by authenticating to the Azure Active Directory (Azure AD) service. Azure AD is an identity provider capable of authenticating security principals and coordinating with other identity providers, such as Microsoft's Active Directory.

Azure AD supports the following authentication scenarios:

* **Interactive sign-in**: Used to authenticate human principals.
* **Non-interactive sign-in**: Used to authenticate services and applications.

> [!NOTE]
> Azure AD does not allow authentication of service accounts that are by definition on-premises AD entities. The Azure AD equivalent of an AD service account is the Azure AD application.

### Azure AD group principals

Azure Data Explorer only supports Security Group (SG) principals and not Distribution Group (DG) principals. An attempt to set up access for a DG on the cluster will result in an error.

### Referencing Azure AD principals

A principal can be referenced using their object ID or User Principal Name (UPN), which is a username and domain in email address format. For example, `abbiatkins@fabrikam.com`.

To identify a principal, we also need to know the Azure AD tenant to which the principal belongs. In some cases, the UPN contains the tenant information. In these cases, the tenant will be resolved from the UPN. In other cases, the tenant ID or name must be explicitly provided.

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

### Examples

The following example uses the user UPN to define a principal the user role on the `Test` database. The tenant information is not specified, so the query engine will attempt to resolve the Azure AD tenant using the UPN.

```kusto
.add database Test users ('aaduser=imikeoein@fabrikam.com') 'Test user (AAD)'
```

The following example uses a group name and tenant name to assign the group to the user role on the `Test` database.

```kusto
.add database Test users ('aadgroup=SGDisplayName;fabrikam.com') 'Test group @fabrikam.com (AAD)'
```

The following example uses an app ID and tenant name to assign the app the user role on the `Test` database.

```kusto
.add database Test users ('aadapp=4c7e82bd-6adb-46c3-b413-fdd44834c69b;fabrikam.com') 'Test app @fabrikam.com (AAD)'
```

## Microsoft Accounts (MSAs)

Azure Data Explorer supports user authentication for Microsoft Accounts (MSAs). MSAs are all of the Microsoft-managed non-organizational user accounts. For example, `hotmail.com`, `live.com`, `outlook.com`.

If a User Principal Name (UPN)—a username and domain in email address format—contains an MSA in the domain section, the user can be authenticated. Unlike with [Azure AD principals](#referencing-azure-ad-principals), there won't be an attempt to resolve the tenant information from the UPN.

### Referencing MSA principals

| IdP | Type | Syntax |
|--|--|--|
| Live.com | User | `msauser=`*UserEmailAddress* |

### Example

The following example assigns an MSA user to the user role on the `Test` database.

```kusto
.add database Test users ('msauser=abbiatkins@live.com') 'Test user (live.com)'
```

## Next steps

* Learn how to [authenticate with Azure Active Directory](how-to-authenticate-with-aad.md)
* Learn how to use [management commands to assign security roles](../security-roles.md)
* Learn how to use the Azure portal to [manage database principals and roles](../../../manage-database-permissions.md)
