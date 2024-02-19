---
title: "Apply Row-Level Security to SQL External Table in Azure Data Explorer"
description: "This document describes how to create a Row-Level Security solution with Azure Data Explorer SQL External Tables."
ms.reviewer: danielkoralek
ms.topic: how-to 
ms.date: 02/16/2024

#customer intent: As a Data Administrator, I want to restrict access to the data on SQL External Tables so that each user can see only their data.
---
# Apply Azure Data Explorer Row-Level Security on SQL External Tables

This document describes how to apply Row-Level Security solution over Azure Data Explorer SQL External Tables, since Exernal Tables do not support policy definition.

## Use Case

You have Azure Data Explorer SQL External Tables accessing data on a SQL Server and want to implement data isolation at the user level, restricting the access to the data based on the current Entra ID / user credential in Azure Data Explorer. With this, you want to leverage the same behavior as applying user access control with RLS on standard Azure Data Explorer tables.

## Prerequisites

* You are able to provide your Azure Data Explorer users with access to the source SQL Server (instructions to follow) and grant access to the source table.
* You have permission to change the Connection String in the External Table definition, or create a new External Table.

## Solution Implementation

This solution is going to use two other existing features, one in SQL Server (the source SQL Server for your External Tables), and the other in Azure Data Explorer:

* Row-Level Security in SQL Server.
* Azure Data Explorer Microsoft Entra ID Impersonation in SQL Server connection string.

By the end of this implementation, the users querying the SQL External Table in Azure Data Explorer will be able to only see the records addressed to them, based on the Row-Level Security policy defined in the source database.

For the following implementation procedure, this document will consider the source being a table called `SourceTable`, with the following schema:

``` sql
CREATE TABLE SourceTable (
    id INT,
    region VARCHAR(5),
    central VARCHAR(5),
    systemuser VARCHAR(200)
)
```

> [!NOTE]
> The `systemuser` column contains the user email to whom the data record belongs, and who should have access to it.

### Configure Row-Level Security in the source SQL Server - SQL Server side

1. First, create a SQL Function with the logic for the data access policy: 

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

    > [!NOTE]
    > In this example the Row-Level Security is being established upon the current user's email matching the `systemuser` column. However, this logic could be modified to meet any other business requirement.

1. Create the Security Policy on the table `SourceTable` with passing the column name as the parameter:

    ``` sql
    CREATE SECURITY POLICY SourceTableFilter
    ADD FILTER PREDICATE Security.mySecurityPredicate(systemuser)
    ON dbo.SourceTable
    WITH (STATE = ON)
    GO
    ```

    > [!NOTE]
    > From this moment on, the data is already restricted by the `mySecurityPredicate` function logic.

1. Disable & enable the Security Policy for testing:

    ``` sql
    ALTER SECURITY POLICY SourceTableFilter
    WITH (STATE = OFF);
    ```

    ``` sql
    ALTER SECURITY POLICY SourceTableFilter
    WITH (STATE = ON);
    ```

### Allow Azure Data Explorer user access to SQL Server -SQL Server side

The following steps depend on the SQL Server version that you are using. For more details, please refer to the Row-Level Security in SQL Server documentation mentioned at the end of this document.

1. Create the proper Login and User for each Entra ID credential that is going to access the data stored in SQL Server:

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
    
### Define SQL External Table connection String [ADX side]

The next steps are based on the documentation also mentioned at the end of this document, covering the different types of SQL Connection Strings to be used with SQL External Tables.

1. Create SQL External Table with using Connection String with `Active Directory Integrated` authentication type, as following the Entra ID Impersonation method decribed in the documentation:

    ``` sql
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
    
1. Validate the data isolation based on the Entra ID, just like it would work with Row-Level Security on Azure Data Explorer. In this case, the data is going to be filtered based on the SourceTable's `systemuser` column, matching the Entra ID user (email address) from the Azure Data Explorer impersonation:

    ``` sql
    external_table('SQLSourceTable')
    ```
    
    > [!NOTE]
    > The policy can be disabled and enabled again, on the SQL Server side, for testing purpose.

## Expected results

With the Security Policy enabled on the SQL Server side, Azure Data Explorer users are going to see only the records matching their Entra IDs (or the business logic applied), as the result of the query against the SQL External table.

With the Security Policy disabled, all users will get the full table content as the result of the query against the SQL External table.

## Related content

* [Row-Level Security in SQL Server](/sql/relational-databases/security/row-level-security?view=sql-server-ver16)
* [SQL External Table Connection Strings](kusto/api/connection-strings/sql-connection-strings.md)

