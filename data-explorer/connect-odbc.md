---
title: Connect to Azure Data Explorer with ODBC
description: In this article, you learn how to set up an Open Database Connectivity (ODBC) connection to Azure Data Explorer.
ms.reviewer: gabil
ms.topic: how-to
ms.date: 03/08/2023
---

# Connect to Azure Data Explorer with ODBC

Open Database Connectivity ([ODBC](/sql/odbc/reference/odbc-overview)) is a widely accepted application programming interface (API) for database access. Use ODBC to connect to Azure Data Explorer from applications that don't have a dedicated connector.

Behind the scenes, applications call functions in the ODBC interface, which are implemented in database-specific modules called *drivers*. Azure Data Explorer supports a subset of the SQL Server communication protocol ([MS-TDS](./t-sql.md)), so it can use the ODBC driver for SQL Server.

Using the following video, you can learn to create an ODBC connection.

> [!VIDEO https://www.youtube.com/embed/qA5wxhrOwog]

Alternatively, you can [configure the ODBC data source](#configure-the-odbc-data-source).

In the article, you learn how to use the SQL Server ODBC driver, so you can connect to Azure Data Explorer from any application that supports ODBC.

## Prerequisites

* [Microsoft ODBC Driver for SQL Server version 17.2.0.1 or later](/sql/connect/odbc/download-odbc-driver-for-sql-server) for your operating system.

## Configure the ODBC data source

Follow these steps to configure an ODBC data source using the ODBC driver for SQL Server.

1. In Windows, search for *ODBC Data Sources*, and open the ODBC Data Sources desktop app.

1. Select **Add**.

    ![Add data source.](media/connect-odbc/add-data-source.png)

1. Select **ODBC Driver 17 for SQL Server** then **Finish**.

    ![Select driver.](media/connect-odbc/select-driver.png)

1. Enter a name and description for the connection and the cluster you want to connect to, then select **Next**. The cluster URL should be in the form *\<ClusterName\>.\<Region\>.kusto.windows.net*.

    >[!NOTE]
    > When entering the cluster URL, do not include the prefix "https://".

    ![Select server.](media/connect-odbc/select-server.png)

1. Select **Active Directory Integrated** then **Next**.

    ![Active Directory Integrated.](media/connect-odbc/active-directory-integrated.png)

1. Select the database with the sample data then **Next**.

    ![Change default database.](media/connect-odbc/change-default-database.png)

1. On the next screen, leave all options as defaults then select **Finish**.

1. Select **Test Data Source**.

    ![Test data source.](media/connect-odbc/test-data-source.png)

1. Verify that the test succeeded then select **OK**. If the test didn't succeed, check the values that you specified in previous steps, and ensure you have sufficient permissions to connect to the cluster.

    ![Test succeeded.](media/connect-odbc/test-succeeded.png)

## Use the ODBC data source

You can use the ODBC data source from other applications to connect to Azure Data Explorer with a connection string of the following format.

```odbc
"Driver={ODBC Driver 17 for SQL Server};Server=mykustocluster.kusto.windows.net;Database=mykustodatabase;Authentication=ActiveDirectoryIntegrated"
```

> [!NOTE]
> Azure Data Explorer considers string values as `NVARCHAR(MAX)`, which may not work well with some ODBC applications. Cast the data to `NVARCHAR(`*n*`)` using the `Language` parameter in the connection string. For example, `Language=any@MaxStringSize:5000` will encode strings as `NVARCHAR(5000)`. For more information, see [tuning options](sql-server-emulation-overview.md#tuning-options).

## Application authentication

To use application principal authentication with ODBC, you must provide the Microsoft Entra tenant ID. You can set this configuration in the connection string, the Windows registry, or the odbc.ini file. See examples in the following tabs. For more information, see [tuning options](sql-server-emulation-overview.md#tuning-options).

### [Connection string](#tab/connection-string)

Set the application principal with `Language=any@AadAuthority:<aad_tenant_id>` in the connection string. Replace `<aad_tenant_id>`, `<aad_application_id>`, and `<aad_application_secret>` with the Microsoft Entra tenant ID, Microsoft Entra application ID, and the Microsoft Entra application secret respectively.

```odbc
"Driver={ODBC Driver 17 for SQL Server};Server=<adx_cluster_name>.<region_name>.kusto.windows.net;Database=<adx_database_name>;Authentication=ActiveDirectoryServicePrincipal;Language=any@AadAuthority:<aad_tenant_id>;UID=<aad_application_id>;PWD=<aad_application_secret>"
```

### [Windows registry](#tab/windows-registry)

Edit the `Language` field in the ODBC data source (DSN) in the registry for Windows as follows.

```odbc
[HKEY_CURRENT_USER\SOFTWARE\ODBC\ODBC.INI\MyUserDSN]
"Language"="any@AadAuthority:<aad_tenant_id>"
```

### [odbc.ini file](#tab/odbcini-file)

For Linux and macOS, edit the odbc.ini file, as follows.

```odbc
# [DSN name]
[MSSQLTest]
Driver = ODBC Driver 17 for SQL Server
# Server = [protocol:]server[,port]
Server = tcp:<adx_cluster_name>.<region_name>.kusto.windows.net,1433
Language = any@AadAuthority:<aad_tenant_id>
```

## Example

The following example shows how to connect to Azure Data Explorer using an ODBC driver in PowerShell. For this to work, you must first follow the steps in [Configure the ODBC data source](#configure-the-odbc-data-source).

```powershell
$conn = [System.Data.Common.DbProviderFactories]::GetFactory("System.Data.Odbc").CreateConnection()
$conn.ConnectionString = "Driver={ODBC Driver 17 for SQL Server};Server=mykustocluster.kusto.windows.net;Database=mykustodatabase;Authentication=ActiveDirectoryIntegrated"
$conn.Open()
$conn.GetSchema("Tables")
$conn.Close()
```

---

## Related content

* See the overview on [SQL Server emulation in Azure Data Explorer](sql-server-emulation-overview.md)
* [Run KQL queries and call stored functions](sql-kql-queries-and-stored-functions.md)
