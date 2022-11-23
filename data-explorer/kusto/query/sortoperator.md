---
title: sort operator  - Azure Data Explorer
description: This article describes sort operator  in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# sort operator

Sort the rows of the input table into order by one or more columns.

```kusto
T | sort by strlen(country) asc, price desc
```

**Alias**

`order`

## Syntax

*T* `| sort by` *expression* [`asc` | `desc`] [`nulls first` | `nulls last`] [`,` ...]

## Arguments

* *T*: The table input to sort.
* *expression*: A scalar expression by which to sort. The type of the values must be numeric, date, time or string.
* `asc` Sort by into ascending order, low to high. The default is `desc`, descending high to low.
* `nulls first` (the default for `asc` order) will place the null values at the beginning and `nulls last` (the default for `desc` order) will place the null values at the end.

## Example

[**Run the query**](https://dataexplorer.azure.com/clusters/help/databases/SampleLogs?query=H4sIAAAAAAAAAwspSkxO9clPL+aqUSjPSC1KVXDOyUzNKwlKLSxNLS7xTFGwtVVQMk20MLFIMzfQtbS0NNNNTTI01zU0TU3RNTJMskhNsjRJSjNIVQKaUJxfVKKQVKkQkpkL1JyYW6CQWJwMAFAUnRtjAAAA)

```kusto
TraceLogs
| where ClientRequestId == "5a848f70-9996-eb17-15ed-21b8eb94bf0e"
| sort by Timestamp asc
```

All rows in table Traces that have a specific `ClientRequestId`, sorted by their timestamp.
