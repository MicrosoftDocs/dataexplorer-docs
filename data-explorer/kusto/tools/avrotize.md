---
title:  Avrotize k2a tool
description: Learn how to use the avrotize k2a command to connect to a Kusto database and create an Avro schema.
ms.topic: reference
ms.date: 01/14/2025
---
# Avrotize tool

[Avrotize is a versatile tool](https://pypi.org/project/avrotize/) for converting data and database schema formats, and generating code in various programming languages. The tool supports the conversion of Kusto table schemas to [Apache Avro](https://avro.apache.org/) format and vice versa with the [Convert Kusto table definition to Avrotize Schema](https://github.com/clemensv/avrotize?tab=readme-ov-file#convert-kusto-table-definition-to-avrotize-schema) or `avrotize k2a` command. The tool handles dynamic columns in Kusto tables by:

* Inferring the schema through sampling
* Resolving arrays and records at any level of nesting
* Detecting conflicting schemas
* Creating type unions for each different schema branch

> [!NOTE]
> The Avrotize k2a tool is an open-source tool provided as-is without product support.

## Convert table definition to AVRO format

You can use the `avrotize k2a` command to connect to a Kusto database and create an Avro schema with a record type for each of the tables in the database.

The following are examples of how to use the command:

* Create an Avro schema with a top-level union with a record for each table:

    ```bash
    avrotize k2a --kusto-uri <Uri> --kusto-database <DatabaseName> --avsc <AvroFilename.avsc>
    ```

* Create a XRegistry Catalog file with CloudEvent wrappers and per-event schemas:

    In the following example, you create xRegistry catalog files with schemas for each table. If the input table contains CloudEvents identified by columns like *id*, *source*, and *type*, the tool creates separate schemas for each event type.

    ```bash
    avrotize k2a --kusto-uri <URI> --kusto-database <DatabaseName> --avsc <AvroFilename.xreg.json> --emit-cloudevents-xregistry --avro-namespace <AvroNamespace>
    ```

## Convert AVRO schema to Kusto table declaration

You can use the [`avrotize a2k`](https://github.com/clemensv/avrotize?tab=readme-ov-file#convert-avrotize-schema-to-kusto-table-declaration) command to create KQL table declarations from Avro schema and JSON mappings. It can also include docstrings in the table declarations extracted from the "doc" annotations in the Avro record types.

If the Avro schema is a single record type, the output script includes a [`.create table`](../management/create-table-command.md) command for the record. The record fields are converted into columns in the table. If the Avro schema is a type union (a top-level array), the output script emits a separate `.create table` command for each record type in the union.

```bash
avrotize a2k  .\<AvroFilename.avsc> --out <KustoFilename.kql>
```

The Avrotize tool is capable of converting JSON Schema, XML Schema, ASN.1 Schema, and Protobuf 2 and Protobuf 3 schemas into Avro schema. You can first convert the source schema into an Avro schema to normalize it, and then further convert it into Kusto schema.

For example, the following command converts an input JSON Schema document "address.json":

```bash
avrotize j2a address.json --out address.avsc
```

You can also chain the commands together to convert from JSON Schema via Avro into Kusto schema:

```bash
avrotize j2a address.json | avrotize a2k --out address.kql
```

## Related content

* [Avrotize GitHub repository page](https://github.com/clemensv/avrotize?tab=readme-ov-file#convert-kusto-table-definition-to-avro-schema)
* [AVRO mapping pypi](https://pypi.org/project/avrotize/)
* [AVRO mapping](../management/avro-mapping.md)