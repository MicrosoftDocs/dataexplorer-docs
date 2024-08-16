---
title:  Kusto Python SDK
description: This article describes Python SDK.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# Kusto Python SDK

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

The Kusto Python Client library lets you query your database using Python.

The library is Python 2.x/3.x compatible. It supports all data types using the Python DB API interface.

You can use the library, for example, from [Jupyter Notebooks](https://jupyter.org/) that are attached to Spark clusters,
including, but not exclusively, [Azure Databricks](https://azure.microsoft.com/services/databricks/) instances.

*Kusto Python Ingest Client* is a python library that lets you send, or ingest, data to your database.

## Related content

* [How to install the package](https://github.com/Azure/azure-kusto-python#install)
* [Kusto query sample](https://github.com/Azure/azure-kusto-python/blob/master/azure-kusto-data/tests/sample.py)
* [Data ingest sample](https://github.com/Azure/azure-kusto-python/blob/master/azure-kusto-ingest/tests/sample.py)
* [GitHub Repository](https://github.com/Azure/azure-kusto-python)

    [![Build status badge](https://badge.fury.io/py/azure-kusto-python.svg)](https://github.com/Azure/azure-kusto-python/actions/workflows/build.yml)

::: moniker range ="azure-data-explorer"
* [Ingest data using Python](/azure/data-explorer/python-ingest-data.md)
::: moniker-end

* Pypi packages:

    * [azure-kusto-data](https://pypi.org/project/azure-kusto-data/)
    [![Screenshot of a button labeled P Y P I package 1.0.2.](https://badge.fury.io/py/azure-kusto-data.svg)](https://badge.fury.io/py/azure-kusto-data)
    * [azure-kusto-ingest](https://pypi.org/project/azure-kusto-ingest/)
    [![Screenshot of a button. The button is labeled P Y P I package 1.0.2.](https://badge.fury.io/py/azure-kusto-ingest.svg)](https://badge.fury.io/py/azure-kusto-ingest)
    * [azure-mgmt-kusto](https://pypi.org/project/azure-mgmt-kusto/)
    [![Screenshot of a button labeled P Y P I package 0.9.0.](https://badge.fury.io/py/azure-mgmt-kusto.svg)](https://badge.fury.io/py/azure-mgmt-kusto)
