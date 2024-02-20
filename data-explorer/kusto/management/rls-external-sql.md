---
title: "Use Row-Level Security with SQL External Tables in Azure Data Explorer"
description: "This document describes how to create a Row-Level Security solution with Azure Data Explorer SQL External Tables."
ms.reviewer: danielkoralek
ms.topic: how-to 
ms.date: 02/20/2024
#customer intent: As a Data Administrator, I want to restrict access to the data on SQL External Tables so that each user can see only their data.
---
# Apply Row-Level Security on SQL External Tables

This document describes how to apply a Row-Level Security (RLS) solution with [SQL external tables](/azure/data-explorer/kusto/management/external-sql-tables). [Row-Level Security](/azure/data-explorer/kusto/management/row-level-security-policy) implements data isolation at the user level, restricting the access to data based on the current user credential. However, Kusto external tables don't support RLS policy definitions, so data isolation on external SQL tables require a different approach. The following solution employs using Row-Level Security in SQL Server, and Microsoft Entra ID Impersonation in the SQL Server connection string. This combination provides the same behavior as applying user access control with RLS on standard Kusto tables, such that the users querying the SQL External Table are able to only see the records addressed to them, based on the Row-Level Security policy defined in the source database.

## Prerequisites

* `ALTER ANY SECURITY POLCY` [permission](/sql/relational-databases/security/permissions-database-engine) on the SQL Server
* [Table admin level permissions](/azure/data-explorer/kusto/access-control/role-based-access-control) on the Kusto-side SQL external table

## Sample table

The example source is a table called `SourceTable`, with the following schema:

``` sql
CREATE TABLE SourceTable (
    id INT,
    region VARCHAR(5),
    central VARCHAR(5),
    systemuser VARCHAR(200)
)
```

> [!NOTE]
> The `systemuser` column contains the user email to whom the data record belongs. This is the same user who should have access to this data.

## Configure Row-Level Security in the source SQL Server - SQL Server side

For general information on SQL Server Row-Level Security, see [Row-Level Security in SQL Server](/sql/relational-databases/security/row-level-security).

1. Create a SQL Function with the logic for the data access policy. In this example, the Row-Level Security is based on the current user's email matching the `systemuser` column. This logic could be modified to meet any other business requirement. 

    ``` sql
    CREATE SCHEMA Security;
    GO
     
    CREATE FUNCTION Security.mySecurityPredicate(@CheckColumn AS nvarchar(100))
        RETURNS TABLE
    WITH SCHEMABINDING
    AS
        RETURN SELECT 1 AS mySecurityPredicate_result
        WHERE @CheckColumn = ORIGINAL_LOGIN() OR USER_NAME() = 'Manager';
    GO
    ```

1. Create the Security Policy on the table `SourceTable` with passing the column name as the parameter:

    ``` sql
    CREATE SECURITY POLICY SourceTableFilter
    ADD FILTER PREDICATE Security.mySecurityPredicate(systemuser)
    ON dbo.SourceTable
    WITH (STATE = ON)
    GO
    ```

    > [!NOTE]
    > At this point, the data is already restricted by the `mySecurityPredicate` function logic.

1. Disable and enable the security policy for testing:

    ``` sql
    ALTER SECURITY POLICY SourceTableFilter
    WITH (STATE = OFF);
    ```

    ``` sql
    ALTER SECURITY POLICY SourceTableFilter
    WITH (STATE = ON);
    ```

### Allow user access to SQL Server - SQL Server side

The following steps depend on the SQL Server version that you're using.

1. Create a sign in and User for each Microsoft Entra ID credential that is going to access the data stored in SQL Server:

    ``` sql
    CREATE LOGIN [user@domain.com] FROM EXTERNAL PROVIDER --MASTER
    
    CREATE USER [user@domain.com] FROM EXTERNAL PROVIDER --DATABASE
    ```
    
1. Grant SELECT on the Security function to the Entra ID user:

    ``` sql
    GRANT SELECT ON Security.mySecurityPredicate to [user@domain.com]
    ```
    
1. Grant SELECT on the `SourceTable` to the Entra ID user:

    ``` sql
    GRANT SELECT ON dbo.SourceTable to [user@domain.com]
    ```

### Define SQL External Table connection String - Kusto side

For more information on the connection string, see [SQL External Table Connection Strings](/azure/data-explorer/kusto/api/connection-strings/sql-connection-strings).

1. Create a SQL External Table with using Connection String with `Active Directory Integrated` authentication type. For more information, see [Microsoft Entra integrated (impersonation)](/azure/data-explorer/kusto/api/connection-strings/sql-connection-strings#microsoft-entra-integrated-impersonation). 

    ``` KQL
    .create external table SQLSourceTable (id:long, region:string, central:string, systemser:string) 
    kind=sql
    table=SourceTable
    ( 
       h@'Server=tcp:[sql server endpoint],1433;Authentication=Active Directory Integrated;Initial Catalog=[database name];'
    )
    with 
    (
       docstring = "Docs",
       folder = "ExternalTables", 
       createifnotexists = false,
       primarykey = 'id'
    )
    ```

    **Connection String**:

    ```
    Server=tcp:[sql server endpoint],1433;Authentication=Active Directory Integrated;Initial Catalog=[database name];
    ```

1. Validate the data isolation based on the Microsoft Entra ID, like it would work with Row-Level Security on in Kusto. In this case, the data is filtered based on the SourceTable's `systemuser` column, matching the Microsoft Entra ID user (email address) from the Kusto impersonation:

    ``` KQL
    external_table('SQLSourceTable')
    ```
    > [!NOTE]
    > The policy can be disabled and enabled again, on the SQL Server side, for testing purposes.

    With the Security Policy enabled on the SQL Server side, Kusto users only see the records matching their Entra IDs, as the result of the query against the SQL External table. With the Security Policy disabled, all users are able to access the full table content as the result of the query against the SQL External table.

## Related content

* [Row-Level Security in SQL Server](/sql/relational-databases/security/row-level-security)
* [SQL External Table Connection Strings](/azure/data-explorer/kusto/api/connection-strings/sql-connection-strings)
