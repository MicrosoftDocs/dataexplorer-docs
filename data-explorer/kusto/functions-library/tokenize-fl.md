---
title:  tokenize_fl()
description:  This article describes tokenize_fl() user-defined function.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 01/01/2026
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# tokenize_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The function `tokenize_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that tokenizes semi-structured text strings, such as log lines, into separate columns. It uses a regex-based approach to split text on non-alphanumeric delimiters while preserving common semantic characters like periods, hyphens, colons, slashes, and equals signs.

## Syntax

*T* `|` `invoke` `tokenize_fl(`*text_col*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*text_col*| `string` | :heavy_check_mark:| The name of the string column containing the text to tokenize.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `tokenize_fl()`, see [Example](#example).

```kusto
let tokenize_fl=(tbl:(*), text_col:string)
{
    let universal_regex = @"[^\w\.\-:/=]+";             //  Universal Token Splitter
    tbl
    | serialize _rid=row_number()
    | join (tbl
    | extend _text = column_ifexists(text_col, '')
    | extend norm = replace_regex(_text, universal_regex, "$$$")
    | extend tokens = split(norm, "$$$")
    | serialize _rid=row_number()
    | mv-expand with_itemindex = i tokens
    | summarize cols = make_bag(bag_pack(strcat("col", tostring(i + 1)), tokens)) by _rid
    | evaluate bag_unpack(cols)
    ) on _rid
    | project-away _rid, _rid1
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\ML", docstring = "regex tokenizer for log strings")
tokenize_fl(tbl:(*), text_col:string)
{
    let universal_regex = @"[^\w\.\-:/=]+";             //  Universal Token Splitter
    tbl
    | serialize _rid=row_number()
    | join (tbl
    | extend _text = column_ifexists(text_col, '')
    | extend norm = replace_regex(_text, universal_regex, "$$$")
    | extend tokens = split(norm, "$$$")
    | serialize _rid=row_number()
    | mv-expand with_itemindex = i tokens
    | summarize cols = make_bag(bag_pack(strcat("col", tostring(i + 1)), tokens)) by _rid
    | evaluate bag_unpack(cols)
    ) on _rid
    | project-away _rid, _rid1
}
```

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

```kusto
let tokenize_fl=(tbl:(*), text_col:string)
{
    let universal_regex = @"[^\w\.\-:/=]+";             //  Universal Token Splitter
    tbl
    | serialize _rid=row_number()
    | join (tbl
    | extend _text = column_ifexists(text_col, '')
    | extend norm = replace_regex(_text, universal_regex, "$$$")
    | extend tokens = split(norm, "$$$")
    | serialize _rid=row_number()
    | mv-expand with_itemindex = i tokens
    | summarize cols = make_bag(bag_pack(strcat("col", tostring(i + 1)), tokens)) by _rid
    | evaluate bag_unpack(cols)
    ) on _rid
    | project-away _rid, _rid1
};
let tbl = datatable(s:string)
[
  "INFO 2025-12-11T11:22:33Z device=cam01 temp=32.8C ip=10.0.0.5/24",
  "WARN user=adi path=/var/log/syslog error:disk-full id=aa:bb:cc:01",
];
tbl
| invoke tokenize_fl('s')
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
let tbl = datatable(s:string)
[
  "INFO 2025-12-11T11:22:33Z device=cam01 temp=32.8C ip=10.0.0.5/24",
  "WARN user=adi path=/var/log/syslog error:disk-full id=aa:bb:cc:01",
];
tbl
| invoke tokenize_fl('s')
```

---

**Output**

| s | col1 | col2 | col3 | col4 | col5 | col6 |
|--|--|--|--|--|--|--|
| INFO 2025-12-11T11:22:33Z device=cam01 temp=32.8C ip=10.0.0.5/24 | INFO | 2025-12-11T11:22:33Z | device=cam01 | temp=32.8C | ip=10.0.0.5/24 | |
| WARN user=adi path=/var/log/syslog error:disk-full id=aa:bb:cc:01 | WARN | user=adi | path=/var/log/syslog | error:disk-full | id=aa:bb:cc:01 | |
