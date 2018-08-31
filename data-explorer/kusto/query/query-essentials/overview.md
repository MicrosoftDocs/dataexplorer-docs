---
title: Kusto query language (Azure Kusto)
description: This article describes Kusto query language in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto query language

A Kusto query is a read-only request to process data and return results.
The request is stated in plain text, using a data-flow model designed to
make the syntax easy to read, author, and automate. The query uses schema
entities that are organized in a hierarchy familiar to many users from the
relational query (SQL) world: the schema consists of databases, tables,
and columns, while the data is arranges in table rows.

At the top level, a Kusto query is a sequence of one or more statements,
with at least one of these statements producing a tabular result set
(the tabular expression statement) as the result of the query. This
statement is modeled as a flow of data from one tabular query operator
to another, starting with some tabular data reference and concatenated by
the pipe (`|`) character.

For example, the following query starts with a table called
`StormEvents` (the cluster and database that host this table are implicit
here), picks up just the records for which the `StartTime` column is within
the month of November 2007, from that set it keeps only the records for which
the value of the `State` column is the string `FLORIDA`, and then returns
the number of the records in the "surviving" set.

```kusto
StormEvents 
| where StartTime >= datetime(2007-11-01) and StartTime < datetime(2007-12-01)
| where State == "FLORIDA"  
| count 
```

To run this query, [click here](https://help.kusto.windows.net:443/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVuDlqlEoz0gtSlUILkksKgnJzE1VsLNVSEksSS0BsjWMDAzMdQ0NdQ0MNRUS81KQVNlgqDICqUIxsCRVwdZWQcnNxz%2fI08VRSQFsXXJ%2baV4JAPfnzX2EAAAA).
In this case, the result will be:

|Count|
|-----|
|   28|