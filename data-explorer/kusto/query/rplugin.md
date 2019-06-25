---
title: R plugin (Preview) - Azure Data Explorer | Microsoft Docs
description: This article describes R plugin (Preview) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 06/24/2019
---
# R plugin (Preview)

The R plugin runs a user-defined-function (UDF) using an R script. The R script gets tabular data as its input, and is expected to produce a tabular output.
The plugin's runtime is hosted in  a sandbox, an isolated and secure environment,  running on the cluster's nodes.

### Syntax


*T* `|` `evaluate` [`hint.distribution` `=` (`single` | `per_node`)] `r(`*output_schema*`,` *script* [`,` *script_parameters*][`,` *external_artifacts*]`)`

### Arguments

* *output_schema*: A `type` literal that defines the output schema of the tabular data, returned by the R code.
    * The format is: `typeof(`*ColumnName*`:` *ColumnType* [, ...]`)`, for example: `typeof(col1:string, col2:long)`.
    * To extend the input schema, use the following syntax: `typeof(*, col1:string, col2:long)`.
* *script*: A `string` literal that is the valid R script to be executed.
* *script_parameters*: An optional `dynamic` literal which is a property bag of name/value pairs to be passed to the
   R script as the reserved `kargs` dictionary (see [Reserved R variables](#reserved-r-variables)).
* *hint.distribution*: An optional hint for the plugin's execution to be distributed across multiple cluster nodes.
   Default: `single`.
    * `single`: A single instance of the script will run over the entire query data.
    * `per_node`: If the query before the R block is distributed, an instance of the script will run on each node over the data that it contains.
