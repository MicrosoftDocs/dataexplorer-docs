---
title: Data Ingestion - Supported Formats and Compression
description: Explore the various data formats like CSV, JSON, Parquet, and more, supported for ingestion. Understand compression options and best practices for data preparation.
ms.reviewer: tzgitlin
ms.topic: conceptual
ms.date: 10/29/2025
monikerRange: "azure-data-explorer || microsoft-fabric"
---
# Data formats supported for ingestion

> [!INCLUDE [applies](includes/applies-to-version/applies.md)] [!INCLUDE [fabric](includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](includes/applies-to-version/azure-data-explorer.md)]

Data ingestion adds data to a table and makes it available for query. For all ingestion methods, other than ingest-from-query, the data must be in one of the supported formats. The following table lists and describes the formats that are supported for data ingestion.

> [!NOTE]
> Before you ingest data, make sure that your data is properly formatted and defines the expected fields. We recommend using your preferred validator to confirm the format is valid. For example, you may find the following validators useful to check CSV or JSON files:
>
> * CSV: http://csvlint.io/
> * JSON: https://jsonlint.com/

To learn why ingestion might fail, see [Ingestion failures](management/ingestion-failures.md).
::: moniker range="azure-data-explorer"
and [Ingestion error codes in Azure Data Explorer](/azure/data-explorer/error-codes).
::: moniker-end

|Format   |Extension   |Description|
|---------|------------|-----------|
|ApacheAvro|`.avro`    |An [Avro](https://avro.apache.org/docs/current/) format that supports [logical types](https://avro.apache.org/docs/++version++/specification/#Logical+Types). Supported compression codecs: `null`, `deflate`, and `snappy`. The reader implementation of the `apacheavro` format is based on the official [Apache Avro library](https://github.com/apache/avro). For details on ingesting Event Hubs Capture Avro files, see [Ingesting Event Hubs Capture Avro files](/azure/data-explorer/ingest-data-event-hub-overview#schema-mapping-for-event-hub-capture-avro-files). |
|Avro     |`.avro`     |A legacy implementation of the [Avro](https://avro.apache.org/docs/current/) format based on the [.NET library](https://www.nuget.org/packages/Microsoft.Hadoop.Avro). Supported compression codecs: `null` and `deflate`. To use `snappy`, use the `ApacheAvro` data format. |
|AzMonStream     |N/A     |Azure Monitor [export format to Event Hub](https://learn.microsoft.com/en-us/azure/azure-monitor/platform/stream-monitoring-data-event-hubs#data-formats).  Supported only in Event Hub. |
|CSV      |`.csv`      |A text file with comma-separated values (`,`). See [RFC 4180: _Common Format and MIME Type for Comma-Separated Values (CSV) Files_](https://www.ietf.org/rfc/rfc4180.txt).|
|JSON     |`.json`     |A text file with JSON objects delimited by `\n` or `\r\n`. See [JSON Lines (JSONL)](http://jsonlines.org/).|
|MultiJSON|`.multijson`|A text file with a JSON array of property bags (each representing a record), or any number of property bags delimited by whitespace, `\n`, or `\r\n`. Each property bag can span multiple lines.|
|ORC      |`.orc`      |An [ORC file](https://en.wikipedia.org/wiki/Apache_ORC).|
|Parquet  |`.parquet`  |A [Parquet file](https://en.wikipedia.org/wiki/Apache_Parquet). |
|PSV      |`.psv`      |A text file with pipe-separated values (<code>&#124;</code>). |
|RAW      |`.raw`      |A text file whose entire contents are a single string value. |
|SCsv     |`.scsv`     |A text file with semicolon-separated values (`;`).|
|SOHsv    |`.sohsv`    |A text file with SOH-separated values. (SOH is ASCII codepoint 1; this format is used by Hive on HDInsight.)|
|TSV      |`.tsv`      |A text file with tab-separated values (`\t`).|
|TSVE     |`.tsv`      |A text file with tab-separated values (`\t`). A backslash character (`\`) is used for escaping.|
|TXT      |`.txt`      |A text file with lines delimited by `\n`. Empty lines are skipped.|
|W3CLOGFILE |`.log`    |[Web log file](https://www.w3.org/TR/WD-logfile.html) format standardized by the W3C. |

> [!NOTE]
>
> * Ingestion from data storage systems that provide ACID functionality on top of regular Parquet format files (for example, Apache Iceberg, Apache Hudi, and Delta Lake) isn't supported.
> * Schemaless Avro isn't supported.

::: moniker range="azure-data-explorer"
For more information about ingesting data by using the `json` or `multijson` formats, see [Ingest JSON formats](/azure/data-explorer/ingest-json-formats).
::: moniker-end

## Supported data compression formats

Compress blobs and files with these algorithms:

|Compression|Extension|
|-----------|---------|
|gzip       |.gz      |
|zip        |.zip     |

Indicate compression by appending the extension to the blob or file name.

For example:

* `MyData.csv.zip` indicates a blob or file formatted as CSV, compressed with zip (archive or single file).
* `MyData.json.gz` indicates a blob or file formatted as JSON, compressed with gzip.

Blob or file names that include only the compression extension (for example, `MyData.zip`) are also supported. In this case, specify the file format
as an ingestion property because it can't be inferred.

> [!NOTE]
>
> * Some compression formats store the original file extension in the compressed stream. Ignore this extension when you determine the file format. If you can't determine the file format from the compressed blob or file name, specify it with the `format` ingestion property.
> * Don't confuse these with internal chunk-level compression codecs used by `Parquet`, `AVRO`, and `ORC` formats. The internal compression name is usually added before the file format extension (for example, `file1.gz.parquet`, `file1.snappy.avro`).
> * The [Deflate64/Enhanced Deflate](https://en.wikipedia.org/wiki/Deflate#Deflate64/Enhanced_Deflate) zip compression method isn't supported. Windows built-in zip compressor can use this method on files larger than 2 GB.

## Related content

* [Supported data formats](ingestion-supported-formats.md)
* [Data ingestion properties](ingestion-properties.md)
::: moniker range="azure-data-explorer"
* [Data ingestion](/azure/data-explorer/ingest-data-overview)
::: moniker-end
