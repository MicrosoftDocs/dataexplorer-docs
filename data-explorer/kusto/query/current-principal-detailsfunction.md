---
title:  current_principal_details()
description: Learn how to use the current_principal_details() function to return the details of the principal running the query. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/07/2023
---
# current_principal_details()

Returns details of the principal running the query.

## Syntax

`current_principal_details()`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Returns

The details of the current principal as a [dynamic](../query/scalar-data-types/dynamic.md). The following table describes the returned fields.

|Field|Description|
|--|--|
|UserPrincipalName|The sign-in identifier for users. For more information, see [UPN](/azure/active-directory/hybrid/connect/plan-connect-userprincipalname#what-is-userprincipalname).|
|IdentityProvider|The source that validates the identity of the principal.|
|Authority|The Azure AD tenant ID.|
|Mfa|Indicates the use of [multi-factor authentication](/azure/active-directory/authentication/concept-mfa-howitworks). For more information, see [Access token claims reference](/azure/active-directory/develop/access-token-claims-reference#amr-claim).|
|Type|The category of the principal: `aaduser`, `aadapp`, or `aadgroup`.|
|DisplayName|The user-friendly name  for the principal that is displayed in the UI.|
|ObjectId|The Azure AD object ID for the principal.|
|FQN|The Fully Qualified Name (FQN) of the principal. Valuable for [security role management commands](../management/security-roles.md). For more information, see [Referencing security principals](../management/referencing-security-principals.md).|

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUixTS4tKkrNK4kvAPKTMwsSc+JTUksSM3OKNTQBdsrI5yMAAAA=" target="_blank">Run the query</a>

```kusto
print details=current_principal_details()
```

**Example output**

|details|
|---|
|{<br>  "UserPrincipalName": "user@fabrikam.com",<br>  "IdentityProvider": "https://sts.windows.net",<br>  "Authority": "72f988bf-86f1-41af-91ab-2d7cd011db47",<br>  "Mfa": "True",<br>  "Type": "AadUser",<br>  "DisplayName": "James Smith (upn: user@fabrikam.com)",<br>  "ObjectId": "346e950e-4a62-42bf-96f5-4cf4eac3f11e",<br>  "FQN": null,<br>  "Notes": null<br>}|
