---
title: Azure Data Explorer Kusto Emulator
description: 'Learn more about Azure Data Explorer Kusto Emulator'
ms.reviewer: vplauzon
ms.topic: conceptual
ms.date: 05/30/2022
---
# Azure Data Explorer Kusto Emulator

Should contain:

The Kusto Emulator provides a local environment emulating the [Kusto Query Engine](https://docs.microsoft.com/en-us/azure/data-explorer/engine-v3) facilitating local development and automated testing.  It runs locally and doesn't require provisioning any Azure service or incurring any cost (it is a free offering).  It comes with an End-User License Agreement (EULA) that can be found [here](todo).

> [!NOTE]
> The Kusto Container isn't meant for production use.  It had many limitations that makes it a very poor technology for production scenario.
> It is also explicitly forbidden by the EULA to perform benchmark tests using the emulator.  Given the built-in limitations of the emulator, it has a very different performance profile compare to the Azure service.
> The Kusto emulator is a free offering and doesn't come with any support from Microsoft.

## Architecture

The Kusto Emulator is packaged as a Windows Docker Container Image.  It exposes a query endpoint on HTTP that can be consumed with any client, e.g. [Kusto.Explorer](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/tools/kusto-explorer-using), [Kusto.CLI](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/tools/kusto-cli) or [Kusto.Data SDKs](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/api/netfx/about-kusto-data).

![Kusto Emulator](media/kusto-emulator/kusto-emulator.png)

Kusto Emulator encapsulates the [Kusto Query Engine](https://docs.microsoft.com/en-us/azure/data-explorer/engine-v3).  It supports all commands and queries within its [architecture limitations](#limitations) (e.g. [Row Level Security](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/management/rowlevelsecuritypolicy) are supported but since there is no authentication, the are not useful).

Kusto Emulator doesn't include a [Data Management service](https://docs.microsoft.com/en-us/azure/data-explorer/ingest-data-overview).  It therefore doesn't support queued / managed ingestion.  It does however support [ingestion commands](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/management/data-ingestion/ingest-from-query).  The data is persisted on disk within the container by default (and is therefore as ephemeral as the container is) and can also be persisted outside the container by mounting a volume on the container.

Kusto Emulator can also access local files (again, through mounted volumes) for ingestion or [external table](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/schema-entities/externaltables) / [external data](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/externaldata-operator?pivots=azuredataexplorer).

Security features are not present on the Kusto Emulator.  There is no authentication, no encrypted connection (connection is done through an HTTP connection) and no encryption at rest.  Since users are not authenticated, there is no access control.

Although ingested data can be stored externally to the container, it isn't recommended to hold data for long period of times for the following reasons:

1. There is no guarantee the [extent](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/management/extents-overview) format is going to be compatible from one version of the Kusto Emulator to another.
1. Extents aren't [merged](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/management/mergepolicy) and therefore can become fragmented as data get ingested

## Kusto Emulator Scenarios

The main scenarios for the Kusto Emulators are:

1.  Automated testing
1. Local development

Automated testing can be done using the Kusto Emulator without provisioning an Azure Service and without connection to Internet.  It can be a very efficient to get a Kusto Query Engine available for automated tests.

Local development can be done without relying on an internet connection nor a provisioned service.

## Kusto Emulator vs Free Cluster

There are some overlap between the Kusto Emulator and the [Free Cluster](https://docs.microsoft.com/en-us/azure/data-explorer/start-for-free) offering.  The following table contrasts the two offerings' specifications.

| Item | Free Cluster | Kusto Emulator
|--|--|--
| Storage (uncompressed) | ~100 GB | Limited by host capacity only
| Databases | Up to 10 | Up to 10000
| Tables per database | Up to 100 | Unlimited
| Columns per table | Up to 200 | Unlimited
| Materialized views per database | Up to 5 | Unlimited
| Managed Ingestion Pipelines | All of them | None
| Security features | Encrypted connection only | None
| Long term data management | Full support | No extent merge capability
| Internet requirement | Cloud Service | No connectivity required

Kusto Emulator core scenarios are local development and automated testing.

The best fit for local development depends on the features required (see previous table).  For instance, if managed pipelines are required the Free Cluster would work best.  On the other hand, if local development needs to be supported in disconnected mode, Kusto Emulator would be a better fit.

Automated Testing is more suited for the Kusto Emulator since a Free Cluster is associated to an email address.

## Limitations

In general, this offering isn't suited for production workloads.

* This offering is not supported by Microsoft support
* No security features:  authentication (hence access control), encrypted connections, encryption at rest
* No managed pipeline (e.g. Event Hub, IoT Hub & Event Grid) and support for ingestion endpoint (e.g. Kusto.Ingest SDKs)
* Auto merge of extent (long term data management)

## Next steps

[Kusto Emulator Installation](todo.md)
