---
title: Kusto Emulator Installation
description: This article you'll learn how to install the Kusto Emulator and run your first queries.
ms.reviewer: vplauzon
ms.topic: how-to
ms.date: 05/25/2022
---

# Kusto Emulator Installation

Installing the Kusto Emulator on your laptop allows to quickly get a local development environment while installing it on a CI/CD agent VM allows for running automated tests.

In this article, we'll show you how to install the Kusto Emulator and quickly get started by creating a database, ingesting data and querying it.

## Prerequisites

* The host OS must be either
  * Windows Server 2022
  * Windows Server 2019 Version 10.0.17763.2928 and above)
  * Windows 11
*    [Docker Client](https://docs.docker.com/desktop/windows/install/) with 

## End-User License Agreement (EULA)

The End-User License Agreement (EULA) is [available here](https://aka.ms/adx.emulator.eula).

Since a container runs without a graphical interface, there are no screen to accept / consent to the EULA.  This is done instead by passing an environment variable to the container named `ACCEPT_EULA` of value `Y` (yes).

## Run Container

You can run the Kusto Emulator with a simple `docker run` on the [Kusto Emulator Container Image](https://aka.ms/adx.emulator.image) passing the *EULA consent environment variable* discussed in the previous section and mapping the internal port 8080 (the port inside the container) to a port on the host:

docker pull microsoft/azure-cosmos-emulator-linux

```bash
docker run -e ACCEPT_EULA=Y -t -d -p <HostPort>:8080 TODO:microsoft/kustainer
```

> [!NOTE]
> The Kusto engine requires allocating at least 2GB of physical memory to start. If running on Windows Professional (which by default allocated only 1GB to containers), you can increase the default memory assigned to the container by adding --memory 4096m to the docker run command.

> [!NOTE]
> The image might not run in process-isolation mode. Make sure that the container is started in Hyper-V isolation mode by adding --isolation=hyperv to the docker run command.

To run the container without starting Kusto itself:

```bash
docker run -t -d -p <HostPort>:8080 --entrypoint cmd.exe kusto.azurecr.io/kustainer:<tag> 
```
This command will return the `Container_Process_ID` (you can also run `docker ps` to find it).

```bash
docker attach <Container_Process_ID> 
```

To start the Kusto service run `C:\>Kusto\StartKusto.cmd` from the container console.

## Testing Connectivity

TODO

## Tools to connect to the emulator

TODO (simple how-to for each tool):

* [Kusto.Explorer](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/tools/kusto-explorer)
* [Kusto.CLI](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/tools/kusto-cli)
* [Kusto.Data SDKs](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/api/netfx/about-kusto-data)

## Stopping the container

TODO

## Mounting a local folder to the container

TODO

## Creating a volatile database

TODO

## Creating a persistent database

TODO

## Ingest local file

TODO

## Query table

TODO

