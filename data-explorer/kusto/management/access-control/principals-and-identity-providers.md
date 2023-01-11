---
title: Referencing security principals - Azure Data Explorer
description: This article describes how to reference security principals and identity providers in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 12/08/2022
---
# Referencing security principals

The Azure Data Explorer authorization model allows for the use of Azure Active Directory (Azure AD) user identities and Microsoft Accounts (MSAs) as security principals. This article provides an overview of the supported principal types for both Azure AD and MSAs, and demonstrates how to properly reference these principals when assigning security roles using [management commands](../security-roles.md).

## Azure Active Directory

The recommended way to access Azure Data Explorer is by authenticating to the Azure AD service. Azure AD is an identity provider capable of authenticating security principals and coordinating with other identity providers, such as Microsoft's Active Directory.

Azure AD supports the following authentication scenarios:

* **User authentication** (interactive sign-in): Used to authenticate human principals.
* **Application authentication** (non-interactive sign-in): Used to authenticate services and applications that have to run or authenticate without user interaction.

> [!NOTE]
> Azure AD does not allow authentication of service accounts that are by definition on-premises AD entities. The Azure AD equivalent of an AD service account is the Azure AD application.

### Azure AD group principals

Azure Data Explorer only supports Security Group (SG) principals and not Distribution Group (DG) principals. An attempt to set up access for a DG on the cluster will result in an error.

### Referencing Azure AD principals

The syntax for referencing Azure AD principals is outlined in the following table. If you specify a User Principal Name (UPN) without tenant information, the system will attempt to resolve the tenant details from the UPN. If the resolution fails, provide the tenant information explicitly.

| Type of Principal | Tenant Identifier | Syntax |
|--|--|--|
| User  | Implicit (UPN)  | `aaduser`=*UserEmailAddress*|
| User  | Explicit (ID)   | `aaduser`=*UserEmailAddress*;*TenantId*|
| User  | Explicit (ID)   | `aaduser`=*ObjectID*;*TenantId*|
| User  | Explicit (Name) | `aaduser`=*UserEmailAddress*;*TenantName*|  
| User  | Explicit (Name) | `aaduser`=*ObjectID*;*TenantName*|
| Group | Implicit (UPN)  | `aadgroup`=*GroupEmailAddress*|
| Group | Explicit (ID)   | `aadgroup`=*GroupObjectId*;*TenantId*|
| Group | Explicit (ID)   | `aadgroup`=*GroupDisplayName*;*TenantId*|
| Group | Explicit (Name) | `aadgroup`=*GroupObjectId*;*TenantName*|
| Group | Explicit (Name) | `aadgroup`=*GroupDisplayName*;*TenantName*|
| App   | Explicit (UPN)  | `aadapp`=*ApplicationDisplayName*;*TenantId*
| App   | Explicit (Name) | `aadapp`=*ApplicationId*;*TenantName*|

### Examples

The following example uses the user UPN to define a principal the user role on the `Test` database. The tenant information isn't specified, so the query engine will attempt to resolve the Azure AD tenant using the UPN.

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
