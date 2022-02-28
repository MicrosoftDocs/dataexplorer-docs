---
title: Stored functions management overview - Azure Data Explorer | Microsoft Docs
description: This article describes Stored functions management overview in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/18/2020
---
# Stored functions management overview
This section describes control commands used for creating and altering the following [user-defined functions](../query/functions/user-defined-functions.md):

|Function |Description|
|---------|-----------|
|[`.alter function`](alter-function.md) |Alters an existing function and stores it inside the database metadata |
|[`.alter function docstring`](alter-docstring-function.md) |Alters the DocString value of an existing function |
|[`.alter function folder`](alter-folder-function.md) |Alters the Folder value of an existing function |
|[`.create function`](create-function.md) |Creates a stored function |
|[`.create-or-alter function`](create-alter-function.md) |Creates a stored function or alters an existing function and stores it inside the database metadata |
|[`.drop functions`](drop-function.md) |Drops a function (or functions) from the database |
|[`.show functions` and `.show function`](show-function.md) |Lists all the stored functions, or a specific function, in the currently-selected database |
