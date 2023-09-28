---
title: Referencing security principals
description: Learn how to reference security principals and identity providers.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# Referencing security principals

The Azure Data Explorer authorization model allows for the use of Azure Active Directory (Azure AD) user and application identities and Microsoft Accounts (MSAs) as security principals. This article provides an overview of the supported principal types for both Azure AD and MSAs, and demonstrates how to properly reference these principals when assigning security roles using [management commands](security-roles.md).

## Azure Active Directory

The recommended way to access your cluster is by authenticating to the Azure AD service. Azure AD is an identity provider capable of authenticating security principals and coordinating with other identity providers, such as Microsoft's Active Directory.

Azure AD supports the following authentication scenarios:

* **User authentication** (interactive sign-in): Used to authenticate human principals.
* **Application authentication** (non-interactive sign-in): Used to authenticate services and applications that have to run or authenticate without user interaction.

> [!NOTE]
>
> * Azure AD does not allow authentication of service accounts that are by definition on-premises AD entities. The Azure AD equivalent of an AD service account is the Azure AD application.
> * Only supports Security Group (SG) principals and not Distribution Group (DG) principals are supported. An attempt to set up access for a DG on the cluster will result in an error.

### Referencing Azure AD principals and groups

The syntax for referencing Azure AD user and application principals and groups is outlined in the following table.

If you use a [User Principal Name (UPN)](/azure/active-directory/hybrid/plan-connect-userprincipalname#what-is-userprincipalname) to reference a user principal, and an attempt will be made to infer the tenant from the domain name and try to find the principal. If the principal isn't found, explicitly specify the tenant ID or name in addition to the user's UPN or object ID.

Similarly, you can reference a security group with the group email address in [UPN format](/azure/active-directory/hybrid/plan-connect-userprincipalname#upn-format) and an attempt will be made to infer the tenant from the domain name. If the group isn't found, explicitly specify the tenant ID or name in addition to the group display name or object ID.

| Type of Entity | Azure AD Tenant | Syntax |
|--|--|--|
| User | Implicit | `aaduser`=*UPN* |
| User | Explicit (ID) | `aaduser`=*UPN*;*TenantId*<br />or<br />`aaduser`=*ObjectID*;*TenantId* |
| User | Explicit (Name) |`aaduser`=*UPN*;*TenantName*<br />or<br />`aaduser`=*ObjectID*;*TenantName* |
| Group | Implicit | `aadgroup`=*GroupEmailAddress* |
| Group | Explicit (ID) | `aadgroup`=*GroupDisplayName*;*TenantId*<br />or<br />`aadgroup`=*GroupObjectId*;*TenantId* |
| Group | Explicit (Name) |`aadgroup`=*GroupDisplayName*;*TenantName*<br />or<br />`aadgroup`=*GroupObjectId*;*TenantName* |
| App | Explicit (ID) | `aadapp`=*ApplicationDisplayName*;*TenantId*<br />or<br />`aadapp`=*ApplicationId*;*TenantId*|
| App | Explicit (Name) | `aadapp`=*ApplicationDisplayName*;*TenantName*<br />or<br />`aadapp`=*ApplicationId*;*TenantName*|

> [!NOTE]
> Use the "App" format to reference [managed identities](../../managed-identities-overview.md), in which the *ApplicationId* is the managed identity object ID or managed identity client (application) ID.

### Examples

The following example uses the user UPN to define a principal the user role on the `Test` database. The tenant information isn't specified, so your cluster will attempt to resolve the Azure AD tenant using the UPN.

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

User authentication for Microsoft Accounts (MSAs) is supported. MSAs are all of the Microsoft-managed non-organizational user accounts. For example, `hotmail.com`, `live.com`, `outlook.com`.

### Referencing MSA principals

| IdP | Type | Syntax |
|--|--|--|
| Live.com | User | `msauser=`*UPN* |

### Example

The following example assigns an MSA user to the user role on the `Test` database.

```kusto
.add database Test users ('msauser=abbiatkins@live.com') 'Test user (live.com)'
```

## Next steps

* Read the [authentication overview](../access-control/index.md)
* Learn how to use [management commands to assign security roles](security-roles.md)
* Learn how to use the Azure portal to [manage database principals and roles](../../manage-database-permissions.md)
* [current_principal_details()](../query/current-principal-detailsfunction.md)
