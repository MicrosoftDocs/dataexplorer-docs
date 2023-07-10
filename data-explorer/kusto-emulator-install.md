---
title: Install the Azure Data Explorer Kusto emulator
description: In this article, you'll learn how to install the Azure Data Explorer Kusto emulator and run your first query.
ms.reviewer: vplauzon
ms.topic: how-to
ms.date: 05/08/2023
---

# Install the Azure Data Explorer Kusto emulator

You can install the Azure Data Explorer Kusto emulator in the following ways:

- On your own device: Consider using this option if you need to provision a local development environment
- On a CI/CD agent virtual machine (VM): Use this option if you require a CI/CD pipeline for running automated tests

The emulator is available as a *Windows* or *Linux* Docker container image.

In this article, you'll learn how to:

- [Install the Kusto emulator](#install-the-kusto-emulator)
- [Connect to the emulator](#connect-to-the-emulator)
- [Create a database](#create-a-database)
- [Ingest data](#ingest-data)
- [Query data](#query-data)

## Prerequisites

- The host operating system must be one of the following:
  - Windows Server 2022
  - Windows Server 2019 Version 10.0.17763.2928 or newer
  - Windows 11
  - Any Linux distro that supports Docker Client for Linux

    > [!IMPORTANT]
    > Linux distros only support Linux container images.

- 2 gigabytes (GB) of RAM minimum; we recommend using 4 GB or more
- Docker Client for [Windows](https://docs.docker.com/desktop/windows/install/) or [Linux](https://docs.docker.com/desktop/install/linux-install/)

## Install the Kusto emulator

The following steps are for using PowerShell to start the emulator using the [Kusto emulator container image](https://aka.ms/adx.emulator.image). For other options, see [Run emulator options](#run-emulator-options).

1. For Windows only, switch Docker to run with Windows containers. You may need to enable the feature in the Docker settings.

    :::image type="content" source="media/kusto-emulator/kusto-emulator-docker-windows-container.png" alt-text="Screenshot of the Docker settings, showing the Switch to Windows containers option.":::

1. Run the following command to start the emulator.

    > [!IMPORTANT]
    > The Kusto emulator container image is a free offering under the [Microsoft Software License Terms](https://aka.ms/adx.emulator.license). Since the emulator runs in a container, you must accept the license terms by passing the `ACCEPT_EULA` environment variable to the container with its value set to `Y` indicating.

    > [!NOTE]
    >
    > - The first time this command is run, Docker pulls the container image which is several GBs in size and may take several minutes to download. Once downloaded, the image is cached and available for subsequent runs without having to download it again.
    > - (For Windows container only) The container must be run in process-isolation mode. This is the default on some versions of Docker. For other versions, you can start the container in Hyper-V isolation mode by adding `--isolation=hyperv` to the run command.

    - To start the Windows container on Windows Server operating system, make sure you use the `latest` or `stable` tag:

        ```powershell
        docker run -e ACCEPT_EULA=Y -m 4G -d -p 8080:8080 -t mcr.microsoft.com/azuredataexplorer/kustainer:latest
        ```

    - To start the Windows container on Windows 11, make sure you use the `windows11` tag:

        ```powershell
        docker run -e ACCEPT_EULA=Y -m 4G -d -p 8080:8080 -t mcr.microsoft.com/azuredataexplorer/kustainer:windows11
        ```

    - To start the Linux container:

        ```powershell
        docker run -e ACCEPT_EULA=Y -m 4G -d -p 8080:8080 -t mcr.microsoft.com/azuredataexplorer/kustainer-linux:latest
        ```

1. Run the following command to verify that the container is running.

    ```powershell
    docker ps
    ```

    The command returns a list of running container instances. Verify that the emulator image *mcr.microsoft.com/azuredataexplorer/kustainer:latest* appears in the list.

    ```powershell
    CONTAINER ID   IMAGE                                                  COMMAND                  CREATED          STATUS          PORTS                    NAMES
    a8b51bce21ad   mcr.microsoft.com/azuredataexplorer/kustainer:latest   "powershell -Command¦"   11 minutes ago   Up 10 minutes   0.0.0.0:8080->8080/tcp   contoso
    ```

1. Run the following command to verify that Kusto emulator is running. The command runs the `.show cluster` query against the management API and it should return a *StatusCode* with value *200*.

    ```powershell
    Invoke-WebRequest -Method post -ContentType 'application/json' -Body '{"csl":".show cluster"}' http://localhost:8080/v1/rest/mgmt
    ```

    The command should return something like the following:

    ```powershell
    StatusCode        : 200
    StatusDescription : OK
    Content           : {"Tables":[{"TableName":"Table_0","Columns":[{"ColumnName":"NodeId","DataType":"String","ColumnType":"string"},{"ColumnName":"Address","DataType":"St
                        ring","ColumnType":"string"},{"ColumnName":"Name","...
    RawContent        : HTTP/1.1 200 OK
                        Transfer-Encoding: chunked
                        x-ms-client-request-id: unspecified;d239f3aa-7df0-4e46-af0a-edd7139d0511
                        x-ms-activity-id: a0ac8941-7e4c-4176-98fa-b7ebe14fae90
                        Content-Type: application...
    Forms             : {}
    Headers           : {[Transfer-Encoding, chunked], [x-ms-client-request-id, unspecified;d239f3aa-7df0-4e46-af0a-edd7139d0511], [x-ms-activity-id,
                        a0ac8941-7e4c-4176-98fa-b7ebe14fae90], [Content-Type, application/json]...}
    Images            : {}
    InputFields       : {}
    Links             : {}
    ParsedHtml        : System.__ComObject
    RawContentLength  : 988
    ```

### Run emulator options

You can use any of the following options when running the emulator:

- Mount a local folder to the container: Use this option to mount a folder in the host environment into the container. Mounting a host folder enables your queries to interact with local files, which is useful for [creating a database persistent between container runs](#create-a-database) and [ingesting data](#ingest-data).

    For example, to mount the folder "D:\host\local" on the host to the folder "c:\kustodatadata" in the container, use the following command on Windows Server:

    ```powershell
    docker run -v d:\host\local:c:\kustodata -e ACCEPT_EULA=Y -m 4G -d -p 8080:8080 -t mcr.microsoft.com/azuredataexplorer/kustainer:latest
    ```

- Run on a different port: The Kusto emulator exposes access to the Kusto Query Engine on port 8080; hence in other examples you mapped the host port 8080 to the emulator port 8080. You can use this option to map a different host to the engine.

    For example, to map port 9000 on the host to the engine, use the following command on Windows Server:

    ```powershell
    docker run -e ACCEPT_EULA=Y -m 4G -d -p 9000:8080 -t mcr.microsoft.com/azuredataexplorer/kustainer:latest
    ```

## Connect to the emulator

You can use any of the following tools to connect to and interact with the emulator:

- [Kusto.Explorer](kusto/tools/kusto-explorer.md)
- [Kusto.CLI](kusto/tools/kusto-cli.md)
- [Kusto.Data SDKs](kusto/api/netfx/about-kusto-data.md)

In the following sections, you'll use Kusto.Explorer to create a database, ingest data, and query it. To learn more, see [Using Kusto.Explorer](kusto/tools/kusto-explorer-using.md).

> [!IMPORTANT]
> The Kusto Emulator doesn't support HTTPS or Azure Active Directory (Azure AD) authentication. The following image highlights the affected fields in the **Add connection** properties.
>
> - The **Cluster connection** must begin with `http://` and not `https://`.
> - In **Security** > **Advanced: Connection String**, you'll need to remove the `AAD Federated Security=True` portion of the connection string to disable Azure AD authentication.
>
> :::image type="content" source="media/kusto-emulator/kusto-emulator-connection.png" alt-text="Screenshot of Kusto Explorer connection.":::

## Create a database

You'll need a database in your emulator for your data.

A database can be persisted in a container folder or on a [mounted folder](#run-emulator-options).  The former's lifetime is bound to the container and won't be persisted between runs.  Also, container virtual storage is less efficient than native one.  Mounted folder enables you  to keep the data between container runs.

In this example, we keep the data on the container.

In the [Kusto.Explorer Query mode](kusto/tools/kusto-explorer-using.md#query-mode), run the following command to create a persistent database:

```kusto
.create database <YourDatabaseName> persist (
  @"c:\kustodata\dbs\<YourDatabaseName>\md",
  @"c:\kustodata\dbs\<YourDatabaseName>\data"
  )
```

## Ingest data

To ingest data, you must first create an external table linked to a file and then ingest the data into a table in the database.

Use the steps in the following example to create an external table and ingest data into it. For the example, in the local folder *c:\kustodata*, you'll create a file called `sample.csv` with the following data:

```text
Alice, 1
Bob, 2
Carl, 3
```

1. Run the following command to [create a table](kusto/management/create-table-command.md) to receive the data:

    ```kusto
    .create table MyIngestedSample(Name:string, Id:int)
    ```

1. Run the following command to [ingest the file into the table](kusto/management/data-ingestion/ingest-from-storage.md):

    ```kusto
    .ingest into table MyIngestedSample(@"c:\kustodata\sample.csv")
    ```

## Query data

You can view the data in the table using the following query:

```kusto
MyIngestedSample
| summarize sum(Id), avg(Id)
```

## Stopping the container

1. You can stop the container by running the following command to obtain the container ID:

    ```powershell
    docker ps
    ```

1. Run the following command with the container ID:

    ```powershell
    docker stop <containerID>
    ```

## Next steps

- [Kusto Query Language (KQL) overview](kusto/query/index.md)
