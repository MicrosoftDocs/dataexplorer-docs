---
title: search operator - Azure Data Explorer | Microsoft Docs
description: This article describes search operator in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# search operator

The search operator provides a multi-table/multi-column search experience.

## Syntax

* [*TabularSource* `|`] `search` [`kind=`*CaseSensitivity*] [`in` `(`*TableSources*`)`] *SearchPredicate*

## Arguments

* *TabularSource*: An optional tabular expression that acts as a data source to be searched over,
  such as a table name, a [union operator](unionoperator.md), the results
  of a tabular query, etc. Cannot appear together with the optional phrase that includes *TableSources*.

* *CaseSensitivity*: An optional flag that controls the behavior of all `string` scalar operators
  with respect to case sensitivity. Valid values are the two synonyms `default` and `case_insensitive`
  (which is the default for operators such as `has`, namely being case-insensitive) and `case_sensitive`
  (which forces all such operators into case-sensitive matching mode).

* *TableSources*: An optional comma-separated list of "wildcarded" table names to take part in the search.
  The list has the same syntax as the list of the [union operator](unionoperator.md).
  Cannot appear together with the optional *TabularSource*.

* *SearchPredicate*: A mandatory predicate that defines what to search for (in other words,
  a Boolean expression that is evaluated for every record in the input and that, if it returns
  `true`, the record is outputted.)
  The syntax for *SearchPredicate* extends and modifies the normal Kusto syntax for Boolean expressions:

  **String matching extensions**: String literals that appear as terms in the *SearchPredicate* indicate a term
    match between all columns and the literal using `has`, `hasprefix`, `hassuffix`, and the inverted (`!`)
    or case-sensitive (`sc`) versions of these operators. The decision whether to apply `has`, `hasprefix`,
    or `hassuffix` depends on whether the literal starts or ends (or both) by an asterisk (`*`). Asterisks
    inside the literal are not allowed.

    |Literal   |Operator   |
    |----------|-----------|
    |`billg`   |`has`      |
    |`*billg`  |`hassuffix`|
    |`billg*`  |`hasprefix`|
    |`*billg*` |`contains` |
    |`bi*lg`   |`matches regex`|

  **Column restriction**: By default, string matching extensions attempt to match against all columns
    of the data set. It is possible to restrict this matching to a particular column by using
    the following syntax: *ColumnName*`:`*StringLiteral*.

  **String equality**: Exact matches of a column against a string value (instead of a term-match)
    can be done using the syntax *ColumnName*`==`*StringLiteral*.

  **Other Boolean expressions**: All regular Kusto Boolean expressions are supported by the syntax.
    For example, `"error" and x==123` means: search for records that have the term `error` in any
    of their columns, and have the value `123` in the `x` column."

  **Regex match**: Regular expression matching is indicated using *Column* `matches regex` *StringLiteral*
    syntax, where *StringLiteral* is the regex pattern.

Note that if both *TabularSource* and *TableSources* are omitted, the search is carried over all unrestricted tables
and views of the database in scope.

## Summary of string matching extensions

  |# |Syntax                                 |Meaning (equivalent `where`)           |Comments|
  |--|---------------------------------------|---------------------------------------|--------|
  | 1|`search "err"`                         |`where * has "err"`                    ||
  | 2|`search in (T1,T2,A*) and "err"`       |`union T1,T2,A* | where * has "err"`   ||
  | 3|`search col:"err"`                     |`where col has "err"`                  ||
  | 4|`search col=="err"`                    |`where col=="err"`                     ||
  | 5|`search "err*"`                        |`where * hasprefix "err"`              ||
  | 6|`search "*err"`                        |`where * hassuffix "err"`              ||
  | 7|`search "*err*"`                       |`where * contains "err"`               ||
  | 8|`search "Lab*PC"`                      |`where * matches regex @"\bLab\w*PC\b"`||
  | 9|`search *`                             |`where 0==0`                           ||
  |10|`search col matches regex "..."`       |`where col matches regex "..."`        ||
  |11|`search kind=case_sensitive`           |                                       |All string comparisons are case-sensitive|
  |12|`search "abc" and ("def" or "hij")`    |`where * has "abc" and (* has "def" or * has hij")`||
  |13|`search "err" or (A>a and A<b)`        |`where * has "err" or (A>a and A<b)`   ||

## Remarks

**Unlike** the [find operator](findoperator.md), the `search` operator does not support the following:

1. `withsource=`: The output will always include a column called `$table` of type `string` whose value
   is the table name from which each record was retrieved (or some system-generated name if the source
   is not a table but a composite expression).
2. `project=`, `project-smart`: The output schema is fixed and includes the outer union of all tables
   being searched, up to a limit of 1000 columns.

## Examples

```kusto
// 1. Simple term search over all unrestricted tables and views of the database in scope
search "billg"

// 2. Like (1), but looking only for records that match both terms
search "billg" and ("steveb" or "satyan")

// 3. Like (1), but looking only in the TraceEvent table
search in (TraceEvent) and "billg"

// 4. Like (2), but performing a case-sensitive match of all terms
search "BillB" and ("SteveB" or "SatyaN")

// 5. Like (1), but restricting the match to some columns
search CEO:"billg" or CSA:"billg"

// 6. Like (1), but only for some specific time limit
search "billg" and Timestamp >= datetime(1981-01-01)

// 7. Searches over all the higher-ups
search in (C*, TF) "billg" or "davec" or "steveb"

// 8. A different way to say (7)
union C*, TF | search "billg" or "davec" or "steveb"
```