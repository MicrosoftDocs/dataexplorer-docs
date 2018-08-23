# Query statements

A data query is a composition of one or more *statements*, delimited
by a semicolon (`;`). There are four types of statements:

* **Let statement**, which defines a binding between a name and an expression.
* **Restrict statement**, which adds restrictions on what data is available
  for query.
* **Set statement** (query options statement), which sets a query option that affects how
  a query is processed and what results it returns.
* **Tabular expression statement**, which is an expression over Kusto
  tables that yields a tabular data set.

Notes:

* The effect of query statements lasts for the duration of the query and does
not extend beyond that; queries cannot make any durable change to the system.

* Multiple tabular expression statements represent a [batch](batches.md) of queries.
