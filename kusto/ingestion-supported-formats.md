---
title: Data formats supported for ingestion
description: Learn about the various data and compression formats supported for ingestion.
ms.reviewer: tzgitlin
ms.topic: conceptual
ms.date: 08/11/2024
monikerRange: "azure-data-explorer || microsoft-fabric"
---
# Data formats supported for ingestion

> [!INCLUDE [applies](includes/applies-to-version/applies.md)] [!INCLUDE [fabric](includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](includes/applies-to-version/azure-data-explorer.md)]

Data ingestion is the process by which data is added to a table and is made available for query. For all ingestion methods, other than ingest-from-query, the data must be in one of the supported formats. The following table lists and describes the formats that is supported for data ingestion.

> [!NOTE]
> Before you ingest data, make sure that your data is properly formatted and defines the expected fields. We recommend using your preferred validator to confirm the format is valid. For example, you may find the following validators useful to check CSV or JSON files:
>
> * CSV: http://csvlint.io/
> * JSON: https://jsonlint.com/
>

For more information about why ingestion might fail, see [Ingestion failures](management/ingestion-failures.md) 
::: moniker range="azure-data-explorer"
and  [Ingestion error codes in Azure Data Explorer](/azure/data-explorer/error-codes.md).
::: moniker-end


|Format   |Extension   |Description|
|---------|------------|-----------|
|ApacheAvro|`.avro`    |An [AVRO](https://avro.apache.org/docs/current/) format with support for [logical types](https://avro.apache.org/docs/current/spec.html#Logical+Types). The following compression codecs are supported: `null`, `deflate`, and `snappy`. Reader implementation of the `apacheavro` format is based on the official [Apache Avro library](https://github.com/apache/avro). For information about ingesting Event Hub Capture Avro files, see [Ingesting Event Hub Capture Avro files](/azure/data-explorer/ingest-data-event-hub-overview.md#schema-mapping-for-event-hub-capture-avro-files). |
|Avro     |`.avro`     |A legacy implementation for [AVRO](https://avro.apache.org/docs/current/) format based on [.NET library](https://www.nuget.org/packages/Microsoft.Hadoop.Avro). The following compression codecs are supported: `null`, `deflate` (for `snappy` - use `ApacheAvro` data format). |
|CSV      |`.csv`      |A text file with comma-separated values (`,`). See [RFC 4180: _Common Format and MIME Type for Comma-Separated Values (CSV) Files_](https://www.ietf.org/rfc/rfc4180.txt).|
|JSON     |`.json`     |A text file with JSON objects delimited by `\n` or `\r\n`. See [JSON Lines (JSONL)](http://jsonlines.org/).|
|MultiJSON|`.multijson`|A text file with a JSON array of property bags (each representing a record), or any number of property bags delimited by whitespace, `\n` or `\r\n`. Each property bag can be spread on multiple lines.|
|ORC      |`.orc`      |An [ORC file](https://en.wikipedia.org/wiki/Apache_ORC).|
|Parquet  |`.parquet`  |A [Parquet file](https://en.wikipedia.org/wiki/Apache_Parquet). |
|PSV      |`.psv`      |A text file with pipe-separated values (<code>&#124;</code>). |
|RAW      |`.raw`      |A text file whose entire contents is a single string value. |
|SCsv     |`.scsv`     |A text file with semicolon-separated values (`;`).|
|SOHsv    |`.sohsv`    |A text file with SOH-separated values. (SOH is ASCII codepoint 1; this format is used by Hive on HDInsight.)|
|TSV      |`.tsv`      |A text file with tab-separated values (`\t`).|
|TSVE     |`.tsv`      |A text file with tab-separated values (`\t`). A backslash character (`\`) is used for escaping.|
|TXT      |`.txt`      |A text file with lines delimited by `\n`. Empty lines are skipped.|
|W3CLOGFILE |`.log`    |[Web log file](https://www.w3.org/TR/WD-logfile.html) format standardized by the W3C. |

> [!NOTE]
>
> * Ingestion from data storage systems that provide ACID functionality on top of regular Parquet format files (e.g. Apache Iceberg, Apache Hudi, Delta Lake) is not supported.
> * Schema-less Avro is not supported.

::: moniker range="azure-data-explorer"
For more info on ingesting data using `json` or `multijson` formats, see [ingest json formats](/azure/data-explorer/ingest-json-formats.md).
::: moniker-end

## Supported data compression formats

Blobs and files can be compressed through any of the following compression algorithms:

|Compression|Extension|
|-----------|---------|
|GZip       |.gz      |
|Zip        |.zip     |

Indicate compression by appending the extension to the name of the blob or file.

For example:
* `MyData.csv.zip` indicates a blob or a file formatted as CSV, compressed with ZIP (archive or a single file)
* `MyData.json.gz` indicates a blob or a file formatted as JSON, compressed with GZip.

Blob or file names that don't include the format extensions but just compression (for example, `MyData.zip`) is also supported. In this case, the file format
must be specified as an ingestion property because it cannot be inferred.

> [!NOTE]
> * Some compression formats keep track of the original file extension as part of the compressed stream. This extension is generally ignored for determining the file format. If the file format can't be determined from the (compressed) blob or file name, it must be specified through the `format` ingestion property.
> * Not to be confused with internal (chunk level) compression codec used by `Parquet`, `AVRO` and `ORC` formats. Internal compression name is usually added to a file name before file format extension, for example: `file1.gz.parquet`, `file1.snappy.avro`, etc.
> * [Deflate64/Enhanced Deflate](https://en.wikipedia.org/wiki/Deflate#Deflate64/Enhanced_Deflate) Zip compression method is not supported. Please note that Windows built-in Zip compressor may choose to use this compression method on files of size over 2GB.

## Related content

* Learn more about [supported data formats](ingestion-supported-formats.md)
* Learn more about [Data ingestion properties](ingestion-properties.md)
::: moniker range="azure-data-explorer"
* Learn more about [data ingestion](/azure/data-explorer/ingest-data-overview.md)
::: moniker-end
