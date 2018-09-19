---
title: The Kusto REST API Response Object - Azure Data Explorer | Microsoft Docs
description: This article describes The Kusto REST API Response Object in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# The Kusto REST API Response Object


## Body

If the status code is 200, the response body is a JSON document that
encodes the query or command's results as a set of rectangular tables.
(In other words, the response body encodes something with the information
content of a .NET `System.Data.IDataReader` object.)

The encoding is optimized to reduce the number of bytes on the wire
and make it easier for consumers to parse.

Basically, the object consists of an array of one or more tables. Each
table is a JSON property bag with:
* A string `TableName` slot
* An array called `Columns`, each of which is a property bag holding a
  `ColumnName`, `DataType` and `ColumnType` properties of type `string`.
  The difference between `DataType` and `ColumnType` is that the first
  tells how is the actual data stored in the storage while
  the second tells what is the type of that data (e.g: for dynamic columns,
  `ColumnType` is `dynamic` while `DataType` is `string`).
* An array called `Rows`, each element of which is an array of primitive types holding the actual data.

This is best explained by using the following diagram:

![JSON Response Representation](../images/rest-json-representation.png "rest-json-representation")