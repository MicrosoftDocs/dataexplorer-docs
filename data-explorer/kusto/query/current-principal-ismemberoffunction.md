---
title: current_principal_is_member_of() - Azure Data Explorer
description: This article describes current_principal_is_member_of() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 10/31/2021
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# current_principal_is_member_of()

::: zone pivot="azuredataexplorer"

Checks group membership or principal identity of the current principal running the query.

## Syntax

`current_principal_is_member_of(`*group*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*group* | string | &check;| A comma-separated list of AAD principals. See [referencing Azure AD principals](../management/access-control/principals-and-identity-providers.md#referencing-azure-ad-principals).

## Returns

If the current principal running the query is successfully matched for at least one input argument, the function returns `true`. If not, the function returns `false`.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print result=current_principal_is_member_of(
    'aaduser=user1@fabrikam.com', 
    'aadgroup=group1@fabrikam.com',
    'aadapp=66ad1332-3a94-4a69-9fa2-17732f093664;72f988bf-86f1-41af-91ab-2d7cd011db47'
    )
```

| result |
|--------|
| false  |

Using dynamic array instead of multiple arguments:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print result=current_principal_is_member_of(
    dynamic([
    'aaduser=user1@fabrikam.com', 
    'aadgroup=group1@fabrikam.com',
    'aadapp=66ad1332-3a94-4a69-9fa2-17732f093664;72f988bf-86f1-41af-91ab-2d7cd011db47'
    ]))
```

| result |
|--------|
| false  |

::: zone-end

::: zone pivot="azuremonitor"

This capability isn't supported in Azure Monitor

::: zone-end
