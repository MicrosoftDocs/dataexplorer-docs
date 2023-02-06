---
title: Connect to Azure Data Explorer with JDBC
description: In this article, you learn how to set up a JDBC connection to Azure Data Explorer.
ms.topic: how-to
ms.date: 02/02/2023
---

## Query data in MATLAB

From MATLAB, you can connect to Azure Data Explorer using [JDBC](connect-jdbc.md) and run queries with [T-SQL](kusto/api/tds/t-sql.md). This functionality is made possible by Azure Data Explorer's TDS-compliant endpoints, which emulate Microsoft SQL Server. This article will take you through the process of setting up an Azure Data Explorer connection in MATLAB.

## Connect from MATLAB

To connect to Azure Data Explorer from MATLAB, do the following:

1. Create a "javaclasspath.txt" file in your preferences directory. This file will be used to add the required JAR-files to the front of MATLAB's static classpath.

   ```java
   edit(fullfile(prefdir,'javaclasspath.txt'))
   ```

1. Add the paths to the required JAR-files by replacing `c:\full\path\to` with the actual full paths to these files.

   ```java
   <before>
   c:\full\path\to\accessors-smart-1.2.jar
   c:\full\path\to\activation-1.1.jar
   c:\full\path\to\adal4j-1.6.3.jar
   c:\full\path\to\asm-5.0.4.jar
   c:\full\path\to\commons-codec-1.11.jar
   c:\full\path\to\commons-lang3-3.5.jar
   c:\full\path\to\gson-2.8.0.jar
   c:\full\path\to\javax.mail-1.6.1.jar
   c:\full\path\to\jcip-annotations-1.0-1.jar
   c:\full\path\to\json-smart-2.3.jar
   c:\full\path\to\lang-tag-1.4.4.jar
   c:\full\path\to\mssql-jdbc-7.0.0.jre8.jar
   c:\full\path\to\nimbus-jose-jwt-6.5.jar
   c:\full\path\to\oauth2-oidc-sdk-5.64.4.jar
   c:\full\path\to\slf4j-api-1.7.21.jar
   ```

   > [!IMPORTANT]
   > You need the `<before>` at the top, so that these files are added to the front of the classpath.

1. Restart MATLAB to make sure that these classes are loaded.

1. In the MATLAB command window, run the following command to reset `TransformerFactory` to the default. MATLAB usually overloads this with `Saxon`, which is incompatible with the `adal4j` dependency.

   ```java
   java.lang.System.clearProperty('javax.xml.transform.TransformerFactory')
   ```

1. In the MATLAB command window, run the following command to connect to Azure Data Explorer.

   ```java
   conn = database('<database_name>','<AAD_user>','<AAD_user_password>','com.microsoft.sqlserver.jdbc.SQLServerDriver' ['jdbc:sqlserver://<cluster_name.region>.kusto.windows.net:1433;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.kusto.windows.net;loginTimeout=30;authentication=ActiveDirectoryPassword;database='])
   ```

   > [!NOTE]
   >
   > * If you end with `database=` without a value, the database name will be inferred.
   > * To use Azure Active Directory integrated authentication, replace **ActiveDirectoryPassword** with **ActiveDirectoryIntegrated**.

1. In the MATLAB command window, test the connection and run a sample [T-SQL](kusto/api/tds/t-sql.md) query. Replace `<table_name>` with an existing table in Azure Data Explorer.

   ```java
   data = select(conn, 'SELECT * FROM <table_name>')
   data
   ```

## Next steps

* Learn how to [query with T-SQL](kusto/api/tds/t-sql.md) in Azure Data Explorer
* Learn more about how to use [JDBC](connect-jdbc.md) with Azure Data Explorer
* Use [ODBC](connect-odbc.md) to connect to Azure Data Explorer
