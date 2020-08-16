---
title: Row Level Security (Preview) - Azure Data Explorer
description: This article describes Row Level Security (Preview) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/25/2020
---
# Row Level Security (Preview)

Use group membership or execution context to control access to rows in a database table.

Row Level Security (RLS) simplifies the design and coding of security. It lets you apply restrictions on data row access in your application. For example, limit user access to rows relevant to their department, or restrict customer access to only the data relevant to their company.

The access restriction logic is located in the database tier, rather than away from the data in another application tier. The database system applies the access restrictions every time data access is attempted from any tier. This logic makes your security system more reliable and robust by reducing the surface area of your security system.

RLS lets you provide access to other applications and users, only to a certain portion of a table. For example, you might want to:

* Grant access only to rows that meet some criteria
* Anonymize data in some of the columns
* All of the above

For more information, see [control commands for managing the Row Level Security policy](../management/row-level-security-policy.md).

> [!NOTE]
> The RLS policy that you configure on the production database will also take effect in the follower databases. You can’t configure different RLS policies on the production and follower databases.

> [!TIP]
> These functions are often useful for row_level_security queries:
> * [current_principal()](../query/current-principalfunction.md)
> * [current_principal_details()](../query/current-principal-detailsfunction.md)
> * [current_principal_is_member_of()](../query/current-principal-ismemberoffunction.md)

## Limitations

There's no limit on the number of tables on which Row Level Security policy can be configured.

The RLS policy can't be enabled on a table:
* for which [continuous data export](../management/data-export/continuous-data-export.md) is configured.
* referenced by a query of an [update policy](./updatepolicy.md).
* on which [restricted view access policy](./restrictedviewaccesspolicy.md) is configured.

## Examples

### Limit access to Sales table

In a table named `Sales`, each row contains details about a sale. One of the columns contains the name of the salesperson. Instead of giving your salespeople access to all records in `Sales`, enable a Row Level Security policy on this table to only return records where the salesperson is the current user:

```kusto
Sales | where SalesPersonAadUser == current_principal()
```

You can also mask the credit card number:

```kusto
Sales | where SalesPersonAadUser == current_principal() | extend CreditCardNumber = "****"
```

If you want every sales person to see all the sales of a specific country, you can define a query similar to:

```kusto
let UserToCountryMapping = datatable(User:string, Country:string)
[
  "john@domain.com", "USA",
  "anna@domain.com", "France"
];
Sales
| where Country in (UserToCountryMapping | where User == current_principal_details()["UserPrincipalName"] | project Country)
```

If you have a group that contains the managers, you might want to give them access to all rows. Query the Row Level Security policy.

```kusto
let IsManager = current_principal_is_member_of('aadgroup=sales_managers@domain.com');
let AllData = Sales | where IsManager;
let PartialData = Sales | where not(IsManager) and (SalesPersonAadUser == current_principal());
union AllData, PartialData
| extend CreditCardNumber = "****"
```

### Expose different data to members of different Azure AD groups

If you have multiple Azure AD groups, and you want the members of each group to see a different subset of data, use this structure for an RLS query. Assume a user can only belong to a single Azure AD group.

```kusto
let IsInGroup1 = current_principal_is_member_of('aadgroup=group1@domain.com');
let IsInGroup2 = current_principal_is_member_of('aadgroup=group2@domain.com');
let IsInGroup3 = current_principal_is_member_of('aadgroup=group3@domain.com');
let DataForGroup1 = Customers | where IsInGroup1 and <filtering specific for group1>;
let DataForGroup2 = Customers | where IsInGroup2 and <filtering specific for group2>;
let DataForGroup3 = Customers | where IsInGroup3 and <filtering specific for group3>;
union DataForGroup1, DataForGroup2, DataForGroup3
```

### Apply the same RLS function on multiple tables

First, define a function that receives the table name as a string parameter, and references the table using the `table()` operator. 

For example:

```
.create-or-alter function RLSForCustomersTables(TableName: string) {
    table(TableName)
    | ...
}
```

Then configure RLS on multiple tables this way:


```
.alter table Customers1 policy row_level_security enable "RLSForCustomersTables('Customers1')"
.alter table Customers2 policy row_level_security enable "RLSForCustomersTables('Customers2')"
.alter table Customers3 policy row_level_security enable "RLSForCustomersTables('Customers3')"
```

### Produce an error upon unauthorized access

If you want non-authorized table users to receive an error instead of returning an empty table, use the [`assert()`](../query/assert-function.md) function. The following example shows you how to produce this error in an RLS function:

```
.create-or-alter function RLSForCustomersTables() {
    MyTable
    | where assert(current_principal_is_member_of('aadgroup=mygroup@mycompany.com') == true, "You don't have access")
}
```

You can combine this approach with other examples. For example, you can display different results to users in different AAD Groups, and produce an error for everyone else.

## More use cases

* A call center support person may identify callers by several digits of their social security number or credit card number. Those numbers shouldn't be fully exposed to
the support person. An RLS policy can be applied on the table to mask all but the last four digits of any social security or credit card number in the result set of any query.
* Set an RLS policy that masks personally identifiable information (PII), and enables developers to query production environments for troubleshooting purposes without violating compliance regulations.
* A hospital can set an RLS policy that allows nurses to view data rows for their patients only.
* A bank can set an RLS policy to restrict access to financial data rows based on an employee's business division or role.
* A multi-tenant application can store data from many tenants in a single tableset (which is efficient). They would use an RLS policy to enforce a logical separation of each tenant's data rows from every other tenant's rows, so each tenant can see only its data rows.

## Performance impact on queries

When an RLS policy is enabled on a table, there will be some performance impact on queries that access that table. Access to the table will actually be replaced by the RLS query that's defined on that table. The performance impact of an RLS query will normally consist of two parts:

* Membership checks in Azure Active Directory
* The filters applied on the data

For example:

```kusto
let IsRestrictedUser = current_principal_is_member_of('aadgroup=some_group@domain.com');
let AllData = MyTable | where not(IsRestrictedUser);
let PartialData = MyTable | where IsRestrictedUser and (...);
union AllData, PartialData
```

If the user isn't part of *some_group@domain.com*, then `IsRestrictedUser` will be evaluated to `false`. The query that will be evaluated is similar to this one:

```kusto
let AllData = MyTable;           // the condition evaluates to `true`, so the filter is dropped
let PartialData = <empty table>; // the condition evaluates to `false`, so the whole expression is replaced with an empty table
union AllData, PartialData       // this will just return AllData, as PartialData is empty
```

Similarly, if `IsRestrictedUser` evaluates to `true`, then only the query for `PartialData` will be evaluated.

### Improve query performance when RLS is used

* If a filter is applied on a high-cardinality column, for example, DeviceID, consider using [Partitioning policy](./partitioningpolicy.md) or [Row Order policy](./roworderpolicy.md)
* If a filter is applied on a low-medium-cardinality column, consider using [Row Order policy](./roworderpolicy.md)

## Performance impact on ingestion

There's no performance impact on ingestion.
