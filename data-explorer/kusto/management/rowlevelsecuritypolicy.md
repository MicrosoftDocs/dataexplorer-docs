---
title: Row Level Security (Preview) - Azure Data Explorer | Microsoft Docs
description: This article describes Row Level Security (Preview) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/25/2020
---
# Row Level Security (Preview)

Use group membership or execution context to control access to rows in a database table.

Row Level Security (RLS) simplifies the design and coding of security in your application by letting you apply
restrictions on data row access. For example, limit user access to rows relevant to their department, or restrict customer
access to only the data relevant to their company.

The access restriction logic is located in the database tier, rather than away from the data
in another application tier. The database system applies the access restrictions every time
data access is attempted from any tier. This makes your security system more reliable
and robust by reducing the surface area of your security system.

RLS lets you provide access to other applications and/or users only to a certain
portion of a table. For example, you might want to:

* Grant access only to rows that meet some criteria
* Anonymize data in some of the columns
* Both of the above

> [!NOTE]
> The Row Level Security policy can't be enabled on a table:
> * For which [Continuous Data Export](../management/data-export/continuous-data-export.md) is configured.
> * That is referenced by a query of some [Update Policy](./updatepolicy.md).
> * On which [Restricted View Access Policy](./restrictedviewaccesspolicy.md) is configured.

For more on the control commands for managing the Row Level Security policy, [see here](../management/row-level-security-policy.md).

## Examples

In a table named `Sales`, each row contains details about a sale. One of the
columns contains the name of the sales person.
Instead of giving your sales people access to all records in `Sales`, you can enable
a Row Level Security policy on this table to only return records where the sales person is the current user:

```
Sales | where SalesPersonAadUser == current_principal()
```

You can also mask the credit card number:

```
Sales | where SalesPersonAadUser == current_principal() | extend CreditCardNumber = "****"
```

If you want every sales person to see all the sales of a specific country, you can define
a query similar to the following:

```
let UserToCountryMapping = datatable(User:string, Country:string)
[
  "john@domain.com", "USA",
  "anna@domain.com", "France"
];
Sales
| where Country in (UserToCountryMapping | where User == current_principal_details()["UserPrincipalName"] | project Country)
```

If you have an AAD group that contains the managers of the sales people, you might want them
to have access to all rows. This can be achieved by the following
query in the Row Level Security policy:

```
let IsManager = current_principal_is_member_of('aadgroup=sales_managers@domain.com');
let AllData = Sales | where IsManager;
let PartialData = Sales | where not(IsManager) and (SalesPersonAadUser == current_principal());
union AllData, PartialData
| extend CreditCardNumber = "****"
```

In general, if you have multiple AAD groups, and you want the members of each group to see a
different subset of data, you can follow this structure for an RLS query (assuming a user can
only belong to a single AAD group):

```
let IsInGroup1 = current_principal_is_member_of('aadgroup=group1@domain.com');
let IsInGroup2 = current_principal_is_member_of('aadgroup=group2@domain.com');
let IsInGroup3 = current_principal_is_member_of('aadgroup=group3@domain.com');
let DataForGroup1 = Customers | where IsInGroup1 and <filtering specific for group1>;
let DataForGroup2 = Customers | where IsInGroup2 and <filtering specific for group2>;
let DataForGroup3 = Customers | where IsInGroup3 and <filtering specific for group3>;
union DataForGroup1, DataForGroup2, DataForGroup3
```

## More use cases

* A call center support person may identify callers by several digits of their social security number
or credit card number. Those numbers should not be fully exposed to
the support person. An RLS policy can be applied on the table to mask all but the last four digits
of any social security or credit card number in the result set of any query.
* Set an RLS policy that masks personally identifiable information (PII), enabling developers to 
query production environments for troubleshooting purposes without violating compliance regulations.
* A hospital can set an RLS policy that allows nurses to view data rows for their patients only.
* A bank can set an RLS policy to restrict access to financial data rows based on an employee's business
division or role.
* A multi-tenant application can store data from many tenants in a single tableset (which is very efficient). They would use an RLS policy to enforce a logical separation of each tenant's data rows from every other tenant's rows, so each tenant can see only its data rows.