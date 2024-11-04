---
title:  current_principal_details()
description: Learn how to use the current_principal_details() function to return the details of the principal running the query. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/03/2024
---
# current_principal_details()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns details of the principal running the query.

## Syntax

`current_principal_details()`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

The details of the current principal as a [dynamic](../query/scalar-data-types/dynamic.md). The following table describes the returned fields.

|Field|Description|
|--|--|
|UserPrincipalName|The sign-in identifier for users. For more information, see [UPN](/azure/active-directory/hybrid/connect/plan-connect-userprincipalname#what-is-userprincipalname).|
|IdentityProvider|The source that validates the identity of the principal.|
|Authority|The Microsoft Entra tenant ID.|
|Mfa|Indicates the use of [multifactor authentication](/azure/active-directory/authentication/concept-mfa-howitworks). For more information, see [Access token claims reference](/azure/active-directory/develop/access-token-claims-reference#amr-claim).|
|Type|The category of the principal: `aaduser`, `aadapp`, or `aadgroup`.|
|DisplayName|The user-friendly name  for the principal that is displayed in the UI.|
|ObjectId|The Microsoft Entra object ID for the principal.|
|FQN|The Fully Qualified Name (FQN) of the principal. Valuable for [security role management commands](../management/security-roles.md). For more information, see [Referencing security principals](../management/reference-security-principals.md).|
|Country|The user's country or region. This property is returned if the information is present. The value is a standard two-letter country or region code, for example, FR, JP, and SZ.|
|TenantCountry|The resource tenant's country or region, set at a tenant level by an admin. This property is returned if the information is present. The value is a standard two-letter country or region code, for example, FR, JP, and SZ. |
|TenantRegion|The region of the resource tenant. This property is returned if the information is present. The value is a standard two-letter country or region code, for example, FR, JP, and SZ. |

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUixTS4tKkrNK4kvAPKTMwsSc+JTUksSM3OKNTQBdsrI5yMAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print details=current_principal_details()
```

**Example output**

|details|
|---|
|{<br>  "Country": "DE",<br>  "TenantCountry": "US",<br>  "TenantRegion": "WW",<br>  "UserPrincipalName": "user@fabrikam.com",<br>  "IdentityProvider": "https://sts.windows.net",<br>  "Authority": "11a11aa-22b2-33cc-44dd-5g5ee555ee55",<br>  "Mfa": "True",<br>  "Type": "AadUser",<br>  "DisplayName": "James Smith (upn: user@fabrikam.com)",<br>  "ObjectId": "666f666f-7g77-88hh-99i9-0jj0jjj0j00j",<br>  "FQN": null,<br>  "Notes": null<br>}|
