---
title:  Query/management HTTP response
description: This article describes Query/management HTTP response in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/05/2018
---
# Query/management HTTP response

## Response status

The HTTP response status line follows the HTTP standard response codes.
For example, code 200 indicates success. 

The following status codes are currently in use, although any valid HTTP code may be returned.

|Code|Subcode        |Description                                    |
|----|---------------|-----------------------------------------------|
|100 |Continue       |Client can continue to send the request.       |
|200 |OK             |Request started processing successfully.       |
|400 |BadRequest     |Request is badly formed and failed (permanently).|
|401 |Unauthorized   |Client needs to authenticate first.            |
|403 |Forbidden      |Client request is denied.                      |
|404 |NotFound       |Request references a non-existing entity.      |
|413 |PayloadTooLarge|Request payload exceeded limits.               |
|429 |TooManyRequests|Request has been denied because of throttling. |
|504 |Timeout        |Request has timed out.                         |
|520 |ServiceError   |Service found an error while processing the request.|

> [!NOTE]
> The 200 status code shows that the request processing has successfully started, 
> and not that it has successfully completed.
> Failures encountered during request processing after the 200 status code
> has returned are called "partial query failures", and when they
> are encountered, special indicators are injected into the response stream
> to alert the client that they occurred.

## Response headers

The following custom headers will be returned.

|Custom header           |Description                                                                                               |
|------------------------|----------------------------------------------------------------------------------------------------------|
|`x-ms-client-request-id`|The unique request identifier sent in the request header of the same name, or some unique identifier.     |
|`x-ms-activity-id`      |A globally unique correlation identifier for the request. It's created by the service.                    |

## Response body

If the status code is 200, the response body is a JSON document that encodes
the query or management command's results as a sequence of rectangular tables.
See below for details.

> [!NOTE]
> The sequence of tables is reflected by the SDK. For example, when using the
> .NET Framework Kusto.Data library, the sequence of tables then becomes
> the results in the `System.Data.IDataReader` object returned by the SDK.

If the status code indicates a 4xx or a 5xx error, other than 401,
the response body is a JSON document that encodes the details of the failure.
For more information, see [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines).

> [!NOTE]
> If the `Accept` header is not included with the request, the response body
> of a failure is not necessarily a JSON document.

## JSON encoding of a sequence of tables

The JSON encoding of a sequence of tables is a single JSON property bag with
the following name/value pairs.

|Name  |Value                              |
|------|-----------------------------------|
|Tables|An array of the Table property bag.|

The Table property bag has the following name/value pairs.

|Name     |Value                               |
|---------|------------------------------------|
|TableName|A string that identifies the table. |
|Columns  |An array of the Column property bag.|
|Rows     |An array of the Row array.          |

The Column property bag has the following name/value pairs.

|Name      |Value                                                          |
|----------|---------------------------------------------------------------|
|ColumnName|A string that identifies the column.                           |
|DataType  |A string that provides the approximate .NET Type of the column.|
|ColumnType|A string that provides the [scalar data type](../../query/scalar-data-types/index.md) of the column.|

The Row array has the same order as the respective Columns array.
The Row array also has one element that coincides with the value of the row for the relevant column.
Scalar data types that can't be represented in JSON, such as `datetime`
and `timespan`, are represented as JSON strings.

The following example shows one possible such object, when it contains
a single table called `Table_0` that has a single column `Text` of type
`string`, and a single row.

```json
{
    "Tables": [{
        "TableName": "Table_0",
        "Columns": [{
            "ColumnName": "Text",
            "DataType": "String",
            "ColumnType": "string"
        }],
        "Rows": [["Hello, World!"]]
}
```

Another example: 

:::image type="content" source="../images/rest-json-representation.png" alt-text="Screenshot showing the tree view of a JSON file that contains an array of Table objects.":::

## The meaning of tables in the response

In most cases, management commands return a result with a single table, containing
the information generated by the management command. For example, the `.show databases`
command returns a single table with the details of all accessible databases in the cluster.

Queries generally return multiple tables.
For each [tabular expression statement](../../query/tabularexpressionstatements.md),
one or more tables are generated in-order, representing the results produced by the statement.

> [!NOTE]
> There can be multiple such tables because of [batches](../../query/batches.md)
> and [fork operators](../../query/forkoperator.md)).

Three tables are often produced:

* An @ExtendedProperties table that provides additional values, such as client visualization
  instructions (information provided by the [render operator](../../query/renderoperator.md)),
  information about the query's effective [database cursor](../../management/database-cursor.md),
  or information about the query's effective use of the [query results cache](../../query/query-results-cache.md).
  
  For queries sent using the v1 protocol, the table has a single column of type `string`,
  whose value is a JSON-encoded string, such as:

  |Value|
  |-----|
  |{"Visualization":"piechart",...}|
  |{"Cursor":"637239957206013576"}|

  For queries sent using the v2 protocol, the table has three columns:
  (1) An `integer` column called `TableId` indicating which table
      in the results set the record applies to;
  (2) A `string` column called `Key` indicating the kind of information
      provided by the record (possible values: `Visualization`, `ServerCache`,
      and `Cursor`);
  (3) A `dynamic` column called `Value` providing the Key-determined information.

  |TableId|Key|Value|
  |-------|---|-----|
  |1      |ServerCache|{"OriginalStartedOn":"2021-06-11T07:48:34.6201025Z",...}|
  |1      |Visualization|{"Visualization":"piechart",...}|

* A QueryStatus table that provides additional information about the execution
  of the query itself, such as, if it completed successfully or not,
  and what were the resources consumed by the query.

  This table has the following structure:

  |Timestamp                  |Severity|SeverityName|StatusCode|StatusDescription            |Count|RequestId|ActivityId|SubActivityId|ClientActivityId|
  |---------------------------|--------|------------|----------|-----------------------------|-----|---------|----------|-------------|----------------|
  |2020-05-02 06:09:12.7052077|4       |Info        | 0        | Query completed successfully|1    |...      |...       |...          |...             |

  Severity values of 2 or smaller indicate failure.

* A TableOfContents table, which is created last, and lists the other tables in the results. 

  An example for this table is:

  |Ordinal|Kind            |Name               |Id                                  |PrettyName|
  |-------|----------------|-------------------|------------------------------------|----------|
  |0      | QueryResult    |PrimaryResult      |db9520f9-0455-4cb5-b257-53068497605a||
  |1      | QueryProperties|@ExtendedProperties|908901f6-5319-4809-ae9e-009068c267c7||
  |2      | QueryStatus    |QueryStatus        |00000000-0000-0000-0000-000000000000||
