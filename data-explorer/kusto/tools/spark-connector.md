---
title: Kusto Connector for Apache Spark - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto Connector for Apache Spark in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/15/2019
---
# Kusto Connector for Apache Spark

[Apache Spark](https://spark.apache.org/) is a unified analytics engine for large-scale data processing.

Making Kusto and Spark work together enables building fast and scalable applications,
targeting a variety of Machine Learning, Extract-Transform-Load (ETL), Log Analytics and other
data driven scenarios.

The current release of the Kusto connector exposes Kusto as a valid Data Store for standard Spark source
and sink operations such as write, read and writeStream. It can be used for experimentation, and for
applications where the size of data read from Kusto is fairly small.

Additional information can be found [here](https://github.com/Azure/azure-kusto-spark).