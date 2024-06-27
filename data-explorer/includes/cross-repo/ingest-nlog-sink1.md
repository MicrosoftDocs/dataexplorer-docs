---
ms.topic: include
ms.date: 06/23/2024
---
# Ingest data with the NLog sink into Azure Data Explorer

NLog is a flexible and free logging platform for various .NET platforms, including .NET standard. NLog allows you to write to several targets, such as a database, file, or console. With NLog, you can change the logging configuration on-the-fly. The NLog sink is a target for NLog that allows you to send your log messages to a KQL cluster. The plugin is built on top of the Azure-Kusto-Data library and provides an efficient way to sink your logs to your cluster.

In this article you will learn how to get data with nLog sink.
