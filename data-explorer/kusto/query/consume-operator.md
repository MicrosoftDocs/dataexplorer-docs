---
title:  consume operator
description: Learn how to use the consume operator to consume the tabular data stream handed to the operator.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# consume operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Consumes the tabular data stream handed to the operator.

The `consume` operator is mostly used for triggering the query side-effect without actually returning
the results back to the caller.

The `consume` operator can be used for estimating the cost of a query without actually delivering the results back to the client.
(The estimation isn't exact for various reasons; for example, `consume` is calculated distributively, so `T | consume` won't transmit the table's data between the nodes of the cluster.)

## Syntax

`consume` [`decodeblocks` `=` *DecodeBlocks*]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *DecodeBlocks* | `bool` | | If set to `true`, or if the request property `perftrace` is set to `true`, the `consume` operator won't just enumerate the records at its input, but actually force each value in those records to be decompressed and decoded.|

### Returns

The `consume` operator returns the same tabular data stream as its input, but it doesn't return the data to the client.

## Examples

The following example shows how to use the `consume` operator to trigger the query side-effect without actually returning the results back to the caller.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSsp5qpRKM9ILUpVCC5JLElVsLVVUApxjXAMVgJKJOfnFZfmpgIAUnD8ni4AAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where State == "TEXAS"
| consume
```

In this example, the query filters the `StormEvents` table for rows where the `State` is "TEXAS" and then applies the `consume` operator. The data is processed, but no results are returned to the client.

**Output**
The results table is empty, as the `consume` operator does not return any data to the client.
