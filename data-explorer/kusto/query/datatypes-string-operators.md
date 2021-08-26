---
title: String operators - Azure Data Explorer
description: This article describes String operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 10/19/2020
ms.localizationpriority: high 
---
# String operators

Kusto offers a variety of query operators for searching string data types. The following article describes how string terms are indexed, lists the string query operators, and gives tips for optimizing performance.

## Understanding string terms

Kusto indexes all columns, including columns of type `string`. Multiple indexes are built for such columns, depending on the actual data. These indexes aren't directly exposed, but are used in queries with the `string` operators that have `has` as part of their name, such as `has`, `!has`, `hasprefix`, `!hasprefix`. The semantics of these operators are dictated by the way the column is encoded. Instead of doing a "plain" substring match, these operators match *terms*.

### What is a term? 

By default, each `string` value is broken into maximal sequences of ASCII alphanumeric characters, and each of those sequences is made into a term.
For example, in the following `string`, the terms are `Kusto`, `KustoExplorerQueryRun`, and the following substrings: `ad67d136`, `c1db`, `4f9f`, `88ef`, `d94f3b6b0b5a`.

```
Kusto: ad67d136-c1db-4f9f-88ef-d94f3b6b0b5a;KustoExplorerQueryRun
```

Kusto builds a term index consisting of all terms that are *three characters or more*, and this index is used by string operators such as `has`, `!has`, and so on.  If the query looks for a term that is smaller than three characters, or uses a `contains` operator, then the query will revert to scanning the values in the column. Scanning is much slower than looking up the term in the term index.

> [!NOTE]
> In EngineV2, a term consists of four or more characters.

## Operators on strings

> [!NOTE]
> The following abbreviations are used in the table below:
> * RHS = right hand side of the expression
> * LHS = left hand side of the expression
> 
> Operators with an `_cs` suffix are case sensitive.

> [!NOTE]
> Case-insensitive operators are currently supported only for ASCII-text. For non-ASCII comparison, use the [tolower()](tolowerfunction.md) function.

|Operator|Description|Case-Sensitive|Example (yields `true`)|
|--------|-----------|--------------|-----------------------|
|[`==`](equalsoperator.md)|Equals |Yes|`"aBc" == "aBc"`|
|[`!=`](equalsoperator.md)|Not equals |Yes |`"abc" != "ABC"`|
|[`=~`](equalsoperator.md) Equals |No |`"abc" =~ "ABC"`|
|[`!~`](equalsoperator.md) |Not equals |No |`"aBc" !~ "xyz"`|
|[`has``](hasoperator.md) |Right-hand-side (RHS) is a whole term in left-hand-side (LHS) |No |`"North America" has "america"`|
|[`!has`](hasoperator.md) |RHS isn't a full term in LHS |No |`"North America" !has "amer"`|
|[`has_all`](has-all-operator.md) |Same as `has` but works on all of the elements |No |`"North and South America" has_all("south", "north")`|
|[`has_any`](has-anyoperator.md) |Same as `has` but works on any of the elements |No |`"North America" has_any("south", "north")`|
|[`has_cs`](hasoperator.md) |RHS is a whole term in LHS |Yes |`"North America" has_cs "America"`|
|[`!has_cs`](hasoperator.md) |RHS isn't a full term in LHS |Yes |`"North America" !has_cs "amer"` |
|[`hasprefix`](hasprefixoperator.md) |RHS is a term prefix in LHS |No |`"North America" hasprefix "ame"`|
|[`!hasprefix`](hasprefixoperator.md) |RHS isn't a term prefix in LHS |No |`"North America" !hasprefix "mer"`| 
|[`hasprefix_cs`](hasprefixoperator.md) |RHS is a term prefix in LHS |Yes |`"North America" hasprefix_cs "Ame"` |
|[`!hasprefix_cs`](hasprefixoperator.md) |RHS isn't a term prefix in LHS |Yes |`"North America" !hasprefix_cs "CA"`| 
|[`hassuffix`](hassuffixoperator.md) |RHS is a term suffix in LHS |No |`"North America" hassuffix "ica"`|
|[`!hassuffix`](hassuffixoperator.md) |RHS isn't a term suffix in LHS |No |`"North America" !hassuffix "americ"`|
|[`hassuffix_cs`](hassuffixoperator.md)  |RHS is a term suffix in LHS |Yes |`"North America" hassuffix_cs "ica"`|
|[`!hassuffix_cs`](hassuffixoperator.md) |RHS isn't a term suffix in LHS |Yes |`"North America" !hassuffix_cs "icA"`|
|[`contains`](containsoperator.md) |RHS occurs as a subsequence of LHS |No |`"FabriKam" contains "BRik"`|
|[`!contains`](containsoperator.md) |RHS doesn't occur in LHS |No |`"Fabrikam" !contains "xyz"`|
|[`contains_cs`](containsoperator.md) |RHS occurs as a subsequence of LHS |Yes |`"FabriKam" contains_cs "Kam"`|
|[`!contains_cs`](containsoperator.md)   |RHS doesn't occur in LHS |Yes |`"Fabrikam" !contains_cs "Kam"`|
|[`startswith`](containsoperator.md) |RHS is an initial subsequence of LHS |No |`"Fabrikam" startswith "fab"`|
|[`!startswith`](containsoperator.md) |RHS isn't an initial subsequence of LHS |No |`"Fabrikam" !startswith "kam"`|
|[`startswith_cs`](containsoperator.md)  |RHS is an initial subsequence of LHS |Yes |`"Fabrikam" startswith_cs "Fab"`|
|[`!startswith_cs`](containsoperator.md) |RHS isn't an initial subsequence of LHS |Yes |`"Fabrikam" !startswith_cs "fab"`|
|[`endswith`](endswithoperator.md) |RHS is a closing subsequence of LHS |No |`"Fabrikam" endswith "Kam"`|
|[`!endswith`](endswithoperator.md) |RHS isn't a closing subsequence of LHS |No |`"Fabrikam" !endswith "brik"`|
|[`endswith_cs`](endswithoperator.md) |RHS is a closing subsequence of LHS |Yes |`"Fabrikam" endswith_cs "kam"`|
|[`!endswith_cs`](endswithoperator.md) |RHS isn't a closing subsequence of LHS |Yes |`"Fabrikam" !endswith_cs "brik"`|
|[`matches regex`](regexoperator.md) |LHS contains a match for RHS |Yes |`"Fabrikam" matches regex "b.*k"`|
|[`in`](inoperator.md) |Equals to one of the elements |Yes |`"abc" in ("123", "345", "abc")`|
|[`!in`](inoperator.md) |Not equals to any of the elements |Yes |`"bca" !in ("123", "345", "abc")`|
|[`in~`](inoperator.md) |Equals to one of the elements |No |`"abc" in~ ("123", "345", "ABC")`|
|[`!in~`](inoperator.md) |Not equals to any of the elements |No |`"bca" !in~ ("123", "345", "ABC")`|

> [!TIP]
> All operators containing `has` search on indexed *terms* of four or more characters, and not on substring matches. A term is created by breaking up the string into sequences of ASCII alphanumeric characters. See [understanding string terms](#understanding-string-terms).

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one.
For example:

* Use `==`, not `=~`
* Use `in`, not `in~`
* Use `contains_cs`, not `contains`

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. 
`has` works faster than `contains`, `startswith`, or `endswith`.

For more information, see [Query best practices](best-practices.md).

For example, the first of these queries will run faster:

```kusto
EventLog | where continent has "North" | count;
EventLog | where continent contains "nor" | count
```
For more information, see [Query best practices](best-practices.md).