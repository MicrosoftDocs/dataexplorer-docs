---
title: Ingest data from Fluent Bit to Azure Data Explorer
description: Learn how to ingest (load) data into Azure Data Explorer from Fluent Bit.
ms.reviewer: ramacg
ms.topic: how-to
ms.date: 10/02/2023
---

# Ingest data from Fluent Bit to Azure Data Explorer

Fluent Bit is an open-source log aggregator that streamlines log management. It effortlessly collects logs from diverse sources like files and event streams, then filters, transforms, and sends them to storage. This makes it a top pick for lightweight, high-performance log processing in cloud and containerized setups. Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data.

In this article, you learn how to use the Azure Data Explorer Fluent Bit add-on to send data from Fluent Bit to a table in your cluster. You initially create a table and data mapping, then direct Fluent Bit to send data into the table, and then validate the results.

## Prerequisites

* An Azure AD application (LINK)

## Create a table and a mapping object

## Send logs from Fluent Bit to your table

## Query your logs

## Next step

> [!div class="nextstepaction"]
> [Write queries](kusto/query/tutorials/learn-common-operators.md)
