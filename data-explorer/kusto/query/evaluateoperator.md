---
title: evaluate operator - Azure Data Explorer | Microsoft Docs
description: This article describes evaluate operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# evaluate operator

The evaluate operator is a tabular operator that provides a mechanism to invoke
query functionality which is non-relational by nature (for example, because it
does not have a predefined output schema). This functionality is exposed to the
user under the name of **plugin**.

**Syntax**

[*T* `|`] `evaluate` *PluginName* `(` [*PluginArg1* [`,` *PluginArg2*]... `)`

Where:

* *T* is an optional tabular input to the plugin. (Some plugins don't take
  any input, and act as a tabular data source.)
* *PluginName* is the mandatory name of the plugin being invoked.
* *PluginArg1*, ... are the optional arguments to the plugin.

**Remarks**

Syntactically, `evaluate` behaves similarly
to the [invoke operator](./invokeoperator.md), which invokes tabular functions.

Plugins provided through the evaluate operator are not bound by the regular
rules of query execution or argument evaluation. Additionally, specific plugins
may have specific restrictions; for example, plugins whose output schema depends
on the data (e.g., the [bag_unpack plugin](./bag-unpackplugin.md)) cannot be used
when performing cross-cluster queries.