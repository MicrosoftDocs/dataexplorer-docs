---
title: LightIngest - Azure Data Explorer | Microsoft Docs
description: This article describes LightIngest in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# LightIngest

LightIngest is a command-line utility for ingesting data into a Kusto service.
The utility can pull source data from a local folder or from a Azure Blob Storage
container.

## Getting the tool

LightIngest is shipped as an executable (`LightIngest.exe`) and associated libraries.
The tool requires no installation and can be downloaded as part of the `Microsoft.Azure.Kusto.Tools`
NuGet package [here](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/).
- Once you have the the package downloaded, extract the contents of the *tools* directory in it.

Extract the contents, and run the executable.

## Running the tool

Run `LightIngest.exe /help` to get help on the command-line arguments the tool takes. 

## Usage examples

The following invocation loads all blobs in an Azure Blob Storage container
CONTAINER_NAME in the Azure Storage account ACCOUNT_NAME having the key ACCOUNT_KEY.
Data is loaded to the database DATABASE_NAME, table TABLE_NAME in the Kusto cluster CLUSTER.
Only blobs whose name ends with `.csv` are uploaded, in batches of 100 blobs at a time.

```
LightIngest.exe https://CLUSTER.kusto.windows.net;Fed=True
  -database:DATABASE_NAME -table:TABLE_NAME
  -source:https://ACCOUNT_NAME.blob.core.windows.net/CONTAINER_NAME;ACCOUNT_KEY
  -pattern:*.csv -batch:100 
```

Here is a similar example, but now loading data from a local folder:

```
LightIngest.exe https://CLUSTER.kusto.windows.net;Fed=True
  -database:DATABASE_NAME -table:TABLE_NAME 
  -source:D:\Data 
  -pattern:*.csv -batch:100 
```