---
title: .show databases schema - Azure Data Explorer | Microsoft Docs
description: This article describes .show databases schema in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# .show databases schema

Returns a flat list of the structure of the selected databases with all their tables and columns in a single table or JSON object.
When used with a version, the database is only returned if it's a later version than the version provided.

> [!NOTE]
> The version should only be provided in "vMM.mm" format. MM represents the major version and mm represent the minor version.

`.show` `database` *DatabaseName* `schema` [`details`] [`if_later_than` *"Version"*] 

`.show` `database` *DatabaseName* `schema` [`if_later_than` *"Version"*]  `as` `json`
 
`.show` `databases` `(` *DatabaseName1*`,` ...`)` `schema` [`details` | `as` `json`]
 
`.show` `databases` `(` *DatabaseName1* if_later_than *"Version"*`,` ...`)` `schema` [`details` | `as` `json`]

**Example** 
 
The database 'TestDB' has 1 table called 'Events'.

```
.show database TestDB schema 
```

**Example output**

|DatabaseName|TableName|ColumnName|ColumnType|IsDefaultTable|IsDefaultColumn|PrettyName|Version
|---|---|---|---|---|---|---|--- 
|TestDB||||False|False||v.1.1		
|TestDB|Events|||True|False||		
|TestDB|Events|	Name|System.String|True|False||		
|TestDB|Events|	StartTime|	System.DateTime|True|False||	
|TestDB|Events|	EndTime|	System.DateTime|True|False||		
|TestDB|Events|	City|	System.String|True|	False||		
|TestDB|Events|	SessionId|	System.Int32|True|	True|| 

**Example** 
 
```
.show database TestDB schema if_later_than "v1.0" 
```
**Example output**

|DatabaseName|TableName|ColumnName|ColumnType|IsDefaultTable|IsDefaultColumn|PrettyName|Version
|---|---|---|---|---|---|---|--- 
|TestDB||||False|False||v.1.1		
|TestDB|Events|||True|False||		
|TestDB|Events|	Name|System.String|True|False||		
|TestDB|Events|	StartTime|	System.DateTime|True|False||	
|TestDB|Events|	EndTime|	System.DateTime|True|False||		
|TestDB|Events|	City|	System.String|True|	False||		
|TestDB|Events|	SessionId|	System.Int32|True|	True||  

Because a version lower than the current database version was provided, the 'TestDB' schema was returned. Providing an equal or higher version would have generated an empty result.

**Example** 
 
```
.show database TestDB schema as json
```

**Example output**

```json
"{""Databases"":{""TestDB"":{""Name"":""TestDB"",""Tables"":{""Events"":{""Name"":""Events"",""DefaultColumn"":null,""OrderedColumns"":[{""Name"":""Name"",""Type"":""System.String""},{""Name"":""StartTime"",""Type"":""System.DateTime""},{""Name"":""EndTime"",""Type"":""System.DateTime""},{""Name"":""City"",""Type"":""System.String""},{""Name"":""SessionId"",""Type"":""System.Int32""}]}},""PrettyName"":null,""MajorVersion"":1,""MinorVersion"":1,""Functions"":{}}}}"
```

