---
title: Query best practices  - Azure Kusto | Microsoft Docs
description: This article describes Query best practices  in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Query best practices 

There are several DOs and DONTs you can follow to make you query run faster.

**DOs**

-	Use time filters first. Kusto is highly optimized to utilize time filters.
-	Put filters that are expected to get rid most of the data in the beginning of the query (right after time filters)
-	Check that most of your filters are appearing in the beginning of the query (before you start using 'extend') 
-	Prefer 'has' keyword over 'contains' when looking for full tokens. 'has' is more performant as it doesn't have to look-up for substrings.
-	Prefer looking in specific column rather than using '*' (full text search across all columns)
-	When using [join](./joinoperator.md) - choose the table with less rows to be the first one (left-most). 
-   When [joining](./joinoperator.md) data across clusters - run the query on the "right" side of the join (where most of the data is located).
-   When using [join](./joinoperator.md) - project only needed columns from both sides of the join (this will reduce payload pulled from one machine to another)
-   If you find that most of your queries deal with extracting fields from [dynamic objects](./scalar-data-types/dynamic.md) across millions of rows, consider
materialize this column at ingestion time. This way - you will pay only once for column extraction.  

**DON'Ts**

-	Trying new queries without 'limit [small number]' or 'count' at the end. 
    Running unbound queries over unknown data set may yield GBs of results to be returned to the client, resulting in slow response and cluster being busy.
-	If you find that you're applying conversions (JSON, string, etc) over 1B+ records - reshape your query to reduce amount of data fed into the conversion
-	Don't use tolower(Col) == "lowercasestring" to do case insensitive comparisons. Kusto has an operator for that. Please use Col =~ "lowercasestring" instead.
-   Don't filter on a calculated column, if you can filter on a table column. In other words: Don't do this `T | extend _value = <expression> | where predicate(_value)`, instead do: `T | where predicate(expression(_value))`