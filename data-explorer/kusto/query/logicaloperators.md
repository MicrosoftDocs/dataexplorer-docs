---
title:  Logical (binary) operators
description: Learn how to use Logical (binary) operators to return a Boolean result.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/26/2022
---
# Logical (binary) operators

The following logical operators can be used to perform comparisons and evaluations:

|Operator name|Syntax|Meaning|
|-------------|------|-------|
|Equality     |`==`  |Returns `true` if both operands are non-null and equal to each other. Otherwise, returns `false`.|
|Inequality   |`!=`  |Returns `true` if any of the operands are null or if the operands aren't equal to each other. Otherwise, returns `false`.|
|Logical and  |`and` |Returns `true` only if both operands are `true`.|
|Logical or   |`or`  |Returns `true` if either of the operands is `true`, regardless of the other operand.|

> [!NOTE]
> These logical operators are sometimes referred-to as Boolean operators,
> and sometimes as binary operators. The terms are interchangeable.

## How logical operators work with null values

Two Boolean null values aren't considered equal nor nonequal, so `bool(null) == bool(null)` and `bool(null) != bool(null)` both return `false`.

However, `and` and `or` operators treat the null value as equivalent to `false`. So, `bool(null) or true` evaluates to `true`, and `bool(null) and true` evaluates to `false`.

## Examples

### Equality

The following query returns a count of all storm events where the event type is "Tornado".

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVAHNDKgtSFWxtFZRC8ovyElPylYDSyfmleSUAv6U3MTIAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| where EventType == "Tornado"
| count
```

**Output**

|Count|
|--|
|1238|

### Inequality

The following query returns a count of all storm events where the event type isn't "Tornado".

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVAHNDKgtSFRRtFZRC8ovyElPylYDSyfmleSUAcTPHAjIAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| where EventType != "Tornado"
| count
```

**Output**

|Count|
|--|
|57828|

### Logical and

The following query returns a count of all storm events where the event type is "Tornado" and the state is "KANSAS".

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVAHNDKgtSFWxtFZRC8ovyElPylRQS81IUgksSSyDC3o5+wY7BSkBNyfmleSUAE6g+EUgAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| where EventType == "Tornado" and State == "KANSAS"
| count
```

**Output**

|Count|
|--|
|161|

### Logical or

The following query returns a count of all storm events where the event type is "Tornado" or "Thunderstorm Wind".

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVAHNDKgtSFWxtFZRC8ovyElPylRTyi9BlMkrzUlKLikFGKIRn5qUoAY1Izi/NKwEAnoJgt1YAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| where EventType == "Tornado" or EventType == "Thunderstorm Wind"
| count
```

**Output**

|Count|
|--|
|14253|
