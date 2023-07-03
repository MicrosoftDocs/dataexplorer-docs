---
title: 'Ingest data using the Azure Data Explorer Python library'
description: In this article, you learn how to ingest (load) data into Azure Data Explorer using Python.
ms.reviewer: vladikbr
ms.topic: how-to
ms.date: 05/08/2023

# Customer intent: As a Python developer, I want to ingest data into Azure Data Explorer so that I can query data to include in my apps.
---

# Ingest data using the Azure Data Explorer Python library

> [!div class="op_single_selector"]
> * [.NET](net-sdk-ingest-data.md)
> * [Python](python-ingest-data.md)
> * [Node](node-ingest-data.md)
> * [Go](go-ingest-data.md)
> * [Java](java-ingest-data.md)

In this article, you ingest data using the Azure Data Explorer Python library. Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data Explorer provides two client libraries for Python: an [ingest library](https://github.com/Azure/azure-kusto-python/tree/master/azure-kusto-ingest) and [a data library](https://github.com/Azure/azure-kusto-python/tree/master/azure-kusto-data). These libraries enable you to ingest, or load, data into a cluster and query data from your code.

First, create a table and data mapping in a cluster. You then queue ingestion to the cluster and validate the results.

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* [Python 3.4+](https://www.python.org/downloads/).

## Install the data and ingest libraries

Install *azure-kusto-data* and *azure-kusto-ingest*.

```python
pip install azure-kusto-data
pip install azure-kusto-ingest
```

## Add import statements and constants

Import classes from azure-kusto-data.

```python
from azure.kusto.data import KustoClient, KustoConnectionStringBuilder
from azure.kusto.data.exceptions import KustoServiceError
from azure.kusto.data.helpers import dataframe_from_result_table
```

To authenticate an application, Azure Data Explorer uses your Azure Active Directory tenant ID. To find your tenant ID, use the following URL, replacing your domain for *YourDomain*.

```http
https://login.microsoftonline.com/<YourDomain>/.well-known/openid-configuration/
```

For example, if your domain is *contoso.com*, the URL is: [https://login.microsoftonline.com/contoso.com/.well-known/openid-configuration/](https://login.microsoftonline.com/contoso.com/.well-known/openid-configuration/). Click this URL to see the results; the first line is as follows.

```console
"authorization_endpoint":"https://login.microsoftonline.com/6babcaad-604b-40ac-a9d7-9fd97c0b779f/oauth2/authorize"
```

The tenant ID in this case is `6babcaad-604b-40ac-a9d7-9fd97c0b779f`. Set the values for AAD_TENANT_ID, KUSTO_URI, KUSTO_INGEST_URI, and KUSTO_DATABASE before running this code.

```python
AAD_TENANT_ID = "<TenantId>"
KUSTO_URI = "https://<ClusterName>.<Region>.kusto.windows.net/"
KUSTO_INGEST_URI = "https://ingest-<ClusterName>.<Region>.kusto.windows.net/"
KUSTO_DATABASE = "<DatabaseName>"
```

Now construct the connection string. The following example uses device authentication to access the cluster. You can also use [managed identity](managed-identities-overview.md) authentication, [Azure Active Directory application certificate](https://github.com/Azure/azure-kusto-python/blob/master/azure-kusto-data/tests/sample.py#L24), [Azure Active Directory application key](https://github.com/Azure/azure-kusto-python/blob/master/azure-kusto-data/tests/sample.py#L20), and [Azure Active Directory user and password](https://github.com/Azure/azure-kusto-python/blob/master/azure-kusto-data/tests/sample.py#L34).

You create the destination table and mapping in a later step.

```python
KCSB_INGEST = KustoConnectionStringBuilder.with_interactive_login(
    KUSTO_INGEST_URI)

KCSB_DATA = KustoConnectionStringBuilder.with_interactive_login(
    KUSTO_URI)

DESTINATION_TABLE = "StormEvents"
DESTINATION_TABLE_COLUMN_MAPPING = "StormEvents_CSV_Mapping"
```

## Set source file information

Import additional classes and set constants for the data source file. This example uses a sample file hosted on Azure Blob Storage. The **StormEvents** sample data set contains weather-related data from the [National Centers for Environmental Information](https://www.ncei.noaa.gov/).

```python
from azure.kusto.data import DataFormat
from azure.kusto.ingest import QueuedIngestClient, IngestionProperties, FileDescriptor, BlobDescriptor, DataFormat, ReportLevel, ReportMethod

CONTAINER = "samplefiles"
ACCOUNT_NAME = "kustosamples"
SAS_TOKEN = ""  # If relevant add SAS token
FILE_PATH = "StormEvents.csv"
FILE_SIZE = 64158321    # in bytes

BLOB_PATH = "https://" + ACCOUNT_NAME + ".blob.core.windows.net/" + \
    CONTAINER + "/" + FILE_PATH + SAS_TOKEN
```

## Create a table on your cluster

Create a table that matches the schema of the data in the StormEvents.csv file. When this code runs, it returns a message like the following message: *To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code F3W4VWZDM to authenticate*. Follow the steps to sign in, then return to run the next code block. Subsequent code blocks that make a connection require you to sign in again.

```python
KUSTO_CLIENT = KustoClient(KCSB_DATA)
CREATE_TABLE_COMMAND = ".create table StormEvents (StartTime: datetime, EndTime: datetime, EpisodeId: int, EventId: int, State: string, EventType: string, InjuriesDirect: int, InjuriesIndirect: int, DeathsDirect: int, DeathsIndirect: int, DamageProperty: int, DamageCrops: int, Source: string, BeginLocation: string, EndLocation: string, BeginLat: real, BeginLon: real, EndLat: real, EndLon: real, EpisodeNarrative: string, EventNarrative: string, StormSummary: dynamic)"

RESPONSE = KUSTO_CLIENT.execute_mgmt(KUSTO_DATABASE, CREATE_TABLE_COMMAND)

dataframe_from_result_table(RESPONSE.primary_results[0])
```

## Define ingestion mapping

Map incoming CSV data to the column names and data types used when creating the table. This maps source data fields to destination table columns

```python
CREATE_MAPPING_COMMAND = """.create table StormEvents ingestion csv mapping 'StormEvents_CSV_Mapping' '[{"Name":"StartTime","datatype":"datetime","Ordinal":0}, {"Name":"EndTime","datatype":"datetime","Ordinal":1},{"Name":"EpisodeId","datatype":"int","Ordinal":2},{"Name":"EventId","datatype":"int","Ordinal":3},{"Name":"State","datatype":"string","Ordinal":4},{"Name":"EventType","datatype":"string","Ordinal":5},{"Name":"InjuriesDirect","datatype":"int","Ordinal":6},{"Name":"InjuriesIndirect","datatype":"int","Ordinal":7},{"Name":"DeathsDirect","datatype":"int","Ordinal":8},{"Name":"DeathsIndirect","datatype":"int","Ordinal":9},{"Name":"DamageProperty","datatype":"int","Ordinal":10},{"Name":"DamageCrops","datatype":"int","Ordinal":11},{"Name":"Source","datatype":"string","Ordinal":12},{"Name":"BeginLocation","datatype":"string","Ordinal":13},{"Name":"EndLocation","datatype":"string","Ordinal":14},{"Name":"BeginLat","datatype":"real","Ordinal":16},{"Name":"BeginLon","datatype":"real","Ordinal":17},{"Name":"EndLat","datatype":"real","Ordinal":18},{"Name":"EndLon","datatype":"real","Ordinal":19},{"Name":"EpisodeNarrative","datatype":"string","Ordinal":20},{"Name":"EventNarrative","datatype":"string","Ordinal":21},{"Name":"StormSummary","datatype":"dynamic","Ordinal":22}]'"""

RESPONSE = KUSTO_CLIENT.execute_mgmt(KUSTO_DATABASE, CREATE_MAPPING_COMMAND)

dataframe_from_result_table(RESPONSE.primary_results[0])
```

## Queue a message for ingestion

Queue a message to pull data from blob storage and ingest that data into Azure Data Explorer.

```python
INGESTION_CLIENT = QueuedIngestClient(KCSB_INGEST)

# All ingestion properties are documented here: https://learn.microsoft.com/azure/kusto/management/data-ingest#ingestion-properties
INGESTION_PROPERTIES = IngestionProperties(database=KUSTO_DATABASE, table=DESTINATION_TABLE, data_format=DataFormat.CSV,
                                           ingestion_mapping_reference=DESTINATION_TABLE_COLUMN_MAPPING, additional_properties={'ignoreFirstRecord': 'true'})
# FILE_SIZE is the raw size of the data in bytes
BLOB_DESCRIPTOR = BlobDescriptor(BLOB_PATH, FILE_SIZE)
INGESTION_CLIENT.ingest_from_blob(
    BLOB_DESCRIPTOR, ingestion_properties=INGESTION_PROPERTIES)

print('Done queuing up ingestion with Azure Data Explorer')
```

## Query data that was ingested into the table

Wait for five to 10 minutes for the queued ingestion to schedule the ingest and load the data into Azure Data Explorer. Then run the following code to get the count of records in the StormEvents table.

```python
QUERY = "StormEvents | count"

RESPONSE = KUSTO_CLIENT.execute_query(KUSTO_DATABASE, QUERY)

dataframe_from_result_table(RESPONSE.primary_results[0])
```

## Run troubleshooting queries

Sign in to [https://dataexplorer.azure.com](https://dataexplorer.azure.com) and connect to your cluster. Run the following command in your database to see if there were any ingestion failures in the last four hours. Replace the database name before running.

```Kusto
.show ingestion failures
| where FailedOn > ago(4h) and Database == "<DatabaseName>"
```

Run the following command to view the status of all ingestion operations in the last four hours. Replace the database name before running.

```Kusto
.show operations
| where StartedOn > ago(4h) and Database == "<DatabaseName>" and Table == "StormEvents" and Operation == "DataIngestPull"
| summarize arg_max(LastUpdatedOn, *) by OperationId
```

## Clean up resources

If you plan to follow our other articles, keep the resources you created. If not, run the following command in your database to clean up the StormEvents table.

```Kusto
.drop table StormEvents
```

## Next steps

* [Query data using Python](python-query-data.md)
