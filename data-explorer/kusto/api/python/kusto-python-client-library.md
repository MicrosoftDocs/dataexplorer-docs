---
title: Azure Data Explorer Python SDK - Azure Data Explorer | Microsoft Docs
description: This article describes Azure Data Explorer Python SDK in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 05/29/2019

---
# Azure Data Explorer Python SDK

Azure Data Explorer *Kusto Python Client* library provides the capability to query Azure Data Explorer clusters using Python. It is Python 2.x/3.x compatible and supports
all data types using the familiar Python DB API interface.

It's possible to use the library, for instance, from [Jupyter Notebooks](https://jupyter.org/) which are attached to Spark clusters,
including, but not exclusively, [Azure Databricks](https://azure.microsoft.com/en-us/services/databricks/) instances.

*Kusto Python Ingest Client* is a python library that allows to send data to Azure Data Explorer service - i.e. ingest data. 

* [How to install the package](https://github.com/Azure/azure-kusto-python#install)

* [Kusto query sample](https://github.com/Azure/azure-kusto-python/blob/master/azure-kusto-data/tests/sample.py)

* [Data ingest sample](https://github.com/Azure/azure-kusto-python/blob/master/azure-kusto-ingest/tests/sample.py)

* [GitHub Repository](https://github.com/Azure/azure-kusto-python)

    [![alt text](https://travis-ci.org/Azure/azure-kusto-python.svg?branch=master "azure-kusto-python")](https://travis-ci.org/Azure/azure-kusto-python)

* Pypi packages:

    * [azure-kusto-data](https://pypi.org/project/azure-kusto-data/)
    [![PyPI version](https://badge.fury.io/py/azure-kusto-data.svg)](https://badge.fury.io/py/azure-kusto-data)
    * [azure-kusto-ingest](https://pypi.org/project/azure-kusto-ingest/)
    [![PyPI version](https://badge.fury.io/py/azure-kusto-ingest.svg)](https://badge.fury.io/py/azure-kusto-ingest)
    * [azure-mgmt-kusto](https://pypi.org/project/azure-mgmt-kusto/)
    [![PyPI version](https://badge.fury.io/py/azure-mgmt-kusto.svg)](https://badge.fury.io/py/azure-mgmt-kusto)