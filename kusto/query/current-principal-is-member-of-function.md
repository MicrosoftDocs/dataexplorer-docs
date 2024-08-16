---
title:  current_principal_is_member_of()
description: Learn how to use the current_principal_is_member_of() function to check the identity of the principal running the query.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# current_principal_is_member_of()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Checks group membership or principal identity of the current principal running the query.

## Syntax

`current_principal_is_member_of(`*group*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *group* | `dynamic` |  :heavy_check_mark: | An array of string literals in which each literal represents a Microsoft Entra principal. See [examples for Microsoft Entra principals](../management/reference-security-principals.md).|

> [!NOTE]
> To avoid throttling from Microsoft Entra ID, the `current_principal_is_member_of()` function only works with string literals. Using values that aren't string literals will result in an error in order to avoid a potentially large number of queries to Microsoft Entra ID.

## Returns

The function returns `true` if the current principal running the query is successfully matched for at least one input argument. If not, the function returns `false`.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12MywqDMBQF9/0Kd7bQFPMgMZRA/yTcvEqo0XA1/1/rwkXPYhaHYSrmeeswrm3ajG+Icd5s3U+fK0w2r7bE4iLaJV0v3b4eILQ1ovmBvhI4zB8oD7+U/t6dyhuXVs3Bf+l0oFYjJQTKOSMctCACpCY6ASNUKc7SoLmU4qlY0uPoEhllokRQSERTcIQF5cNAaXBC9Uf29gUBrFgb0AAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=current_principal_is_member_of(
    'aaduser=user1@fabrikam.com', 
    'aadgroup=group1@fabrikam.com',
    'aadapp=66ad1332-3a94-4a69-9fa2-17732f093664;72f988bf-86f1-41af-91ab-2d7cd011db47'
    )
```

**Output**

| result |
|--------|
| false  |

Using dynamic array instead of multiple arguments:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12MywrCMBRE935Fd23BSPMgaZCA/yESbl4SbNqQNgv/3tqFC2dxYIbD5BLnrSl+rdOmbC3Fz5vO+2hjhknHVSefjC96Cd2p2ePeM6Rou/vRWgBXV1/UF/gWwJT4gnSxS2rPzU95lqVmdfBf+jmQs+IcHKaUIAqSIQZcIhmAICwEJWGQlHN2FSTIcTQBjTxgxDAEJDEYRJywbsDYGSba4/bR9x8D/i004AAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=current_principal_is_member_of(
    dynamic([
    'aaduser=user1@fabrikam.com', 
    'aadgroup=group1@fabrikam.com',
    'aadapp=66ad1332-3a94-4a69-9fa2-17732f093664;72f988bf-86f1-41af-91ab-2d7cd011db47'
    ]))
```

**Output**

| result |
|--------|
| false  |

