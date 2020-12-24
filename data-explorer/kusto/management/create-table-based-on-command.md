---
title: .create table - Azure Data Explorer
description: This article describes .create table based-on command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/06/2020
---
# .create table

Creates a new empty table based on existing table.

The command must run in context of a specific database.

Requires [Database admin permission](access-control/role-based-authorization.md).

**Syntax**

`.create` `table` *TableName* `based-on` *OtherTable*  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

All properties of the source table are copied to the new table, except for the following:

 * [Update policy](updatepolicy.md)
 * [Authorized principals](security-roles.md#managing-table-security-roles) (current principal is added to the table admins).

**Example** 

```kusto
.create table MyLogs_Temp based-on MyLogs with (folder="TempTables")
```
 
**Return output**

Returns the table's schema in JSON format, same as:

```kusto
.show table MyLogs schema as json
```
