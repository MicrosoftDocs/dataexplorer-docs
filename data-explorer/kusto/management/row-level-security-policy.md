---
title: RowLevelSecurity policy - Azure Data Explorer | Microsoft Docs
description: This article describes RowLevelSecurity policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 10/11/2020
---
# row_level_security policy command

This article describes commands used for configuring a [row_level_security policy](rowlevelsecuritypolicy.md) for database tables or [materialized views](materialized-views/materialized-view-overview.md) (with some [limitations](materialized-views/materialized-view-policies.md#row-level-security-policy)).

## Displaying the policy

To display the policy, use the following command:

```kusto
.show table <table_name> policy row_level_security

.show materialized-view <materialized_view_name> policy row_level_security
```

## Configuring the policy

Enable row_level_security policy on a table or a materialized view:

```kusto
.alter table <table_name> policy row_level_security enable "<query>"

.alter materialized-view <materialized_view_name> policy row_level_security enable "<query>"
```

Disable row_level_security policy on a table:

```kusto
.alter table <table_name> policy row_level_security disable "<query>"

.alter materialized-view <materialized_view_name> policy row_level_security disable "<query>"
```

Even when the policy is disabled, you can force it to apply to a single query. Enter the following line before the query:

`set query_force_row_level_security;`

This is useful if you want to try various queries for row_level_security, but don’t want it to actually take effect on users. Once you’re confident in the query, enable the policy.

> [!NOTE]
> The following restrictions apply to the `query`:
>
> * The query should produce exactly the same schema as the table on which the policy is defined. That is, the query's result should return exactly the same columns as the original table, in the same order, with the same names and types.
> * The query can only use the following operators: `extend`, `where`, `project`, `project-away`, `project-keep`, `project-rename`, `project-reorder`, `join` and `union`.
> * The query can't reference other tables on which RLS is enabled.
> * The query can be any of the following, or a combination of them:
>    * Query (for example, `<table_name> | extend CreditCardNumber = "****"`)
>    * Function (for example, `AnonymizeSensitiveData`)
>    * Datatable (for example, `datatable(Col1:datetime, Col2:string) [...]`)
> * Setting a row level security policy on a source table of a [materialized view](materialized-views/materialized-view-overview.md) may fail, if the materialized view does not have a RLS policy defined as well. Please refer to the documentation of [materialized view row level security policy](materialized-views/materialized-view-policies.md#row-level-security-policy) about this failure.

> [!TIP]
> These functions are often useful for row_level_security queries:
> * [current_principal()](../query/current-principalfunction.md)
> * [current_principal_details()](../query/current-principal-detailsfunction.md)
> * [current_principal_is_member_of()](../query/current-principal-ismemberoffunction.md)

**Examples**
Alter table row level security policy:

```kusto
.create-or-alter function with () TrimCreditCardNumbers() {
    let UserCanSeeFullNumbers = current_principal_is_member_of('aadgroup=super_group@domain.com');
    let AllData = Customers | where UserCanSeeFullNumbers;
    let PartialData = Customers | where not(UserCanSeeFullNumbers) | extend CreditCardNumber = "****";
    union AllData, PartialData
}

.alter table Customers policy row_level_security enable "TrimCreditCardNumbers"
```

Alter same policy for a materialized view over the table:

```kusto
.create-or-alter function with () TrimCreditCardNumbersMV() {
    let UserCanSeeFullNumbers = current_principal_is_member_of('aadgroup=super_group@domain.com');
    let AllData = CustomersView | where UserCanSeeFullNumbers;
    let PartialData = CustomersView | where not(UserCanSeeFullNumbers) | extend CreditCardNumber = "****";
    union AllData, PartialData
}

.alter materialized-view CustomersView policy row_level_security enable "TrimCreditCardNumbersMV"
```

**Performance note**: `UserCanSeeFullNumbers` will be evaluated first, and then either `AllData` or `PartialData` will be evaluated, but not both, which is the expected result.
You can read more about the performance impact of RLS [here](rowlevelsecuritypolicy.md#performance-impact-on-queries).

## Deleting the policy

```kusto
.delete table <table_name> policy row_level_security

.delete materialized-view <materialized_view_name> policy row_level_security
```
