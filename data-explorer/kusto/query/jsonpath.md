---
title:  JSONPath syntax
description: Learn how to use JSONPath expressions to specify data mappings and KQL functions that process dynamic objects.
ms.reviewer: igborodi
ms.topic: reference
ms.date: 07/23/2023
---

# JSONPath expressions

JSONPath notation describes the path to one or more elements in a JSON document.

The JSONPath notation is used in the following scenarios:

- To specify [data mappings for ingestion](../management/mappings.md)
- To specify [data mappings for external tables](../management/external-table-mapping-create.md)
- In KQL functions that process dynamic objects, like [bag_remove_keys()](bag-remove-keys-function.md) and [extract_json()](extractjsonfunction.md)

The following subset of the JSONPath notation is supported:

|Path expression|Description|
|---|---|
|`$`|Root object|
|`.` | Selects the specified property in a parent object. <br> Use this notation if the property doesn't contain special characters. |
|`['property']` or `["property"]`| Selects the specified property in a parent object. Make sure you put single quotes or double quotes around the property name. <br> Use this notation if the property name contains special characters, such as spaces, or begins with a character other than `A..Za..z_`. |
|`[n]`| Selects the n-th element from an array. Indexes are 0-based. |

> [!NOTE]
>
> Wildcards, recursion, union, slices, and current object are not supported.

## Example

In the `StormEvents` table of the `Samples` database, there is a column named `StormSummary`. The following query retrieves the contents of the `StormSummary` column for a specific event with an `EventId` of "11920".

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVAHM9UxRsbRWUDA0tjQyUgFIFRflZqcklCsEgDcGlubmJRZUA9EM6WT0AAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| where EventId == "11920"
| project StormSummary
```

**Output**

The column contains a JSON object with details about the storm event, including `TotalDamages`, `StartTime`, `EndTime`, and `Details` with additional nested information such as the `Description` and `Location`.

```json
{
    "TotalDamages": 10000,
    "StartTime": "2007-01-01T00:00:00.0000000Z",
    "EndTime": "2007-01-28T21:00:00.0000000Z",
    "Details": {
        "Description": "The Wabash River in Vermillion County remained above flood stage through most of January. Crests were as high as 12 feet above flood stage.",
        "Location": "INDIANA"
    }
}
```

Let's create a new table that will contain this data in separate columns.

```kusto
// Create the table.
.create table StormSummaryTable (TotalDamages: int, StartTime: datetime, EndTime: datetime, Description: string, Location: string)

// Create the ingestion mapping.
.create table StormSummaryTable ingestion json mapping 'StormSummaryMapping'
    '[{"column":"TotalDamages","path":"$.TotalDamages"}, 
      {"column":"StartTime","path":"$.StartTime"},
      {"column":"EndTime","path":"$.EndTime"},
      {"column":"Description","path":"$.Details.Description"},
      {"column":"Location","path":"$.Details.Location"}]'

// Ingest the data.
.set StormSummaryTable <|
   StormEvents
   | project StormSummary
```

The ingestion mapping could also be created with square bracket syntax, though this is only required if there are spaces or special characters in the key name. For example:

```kusto
// Create the ingestion mapping with square bracket syntax.
.create table StormSummaryTable ingestion json mapping 'StormSummaryMapping'
    '[{"column":"TotalDamages","path":"$['TotalDamages']"}, 
      {"column":"StartTime","path":"$['StartTime']"},
      {"column":"EndTime","path":"$['EndTime']"},
      {"column":"Description","path":"$['Details']['Description']"},
      {"column":"Location","path":"$['Details']['Location']"}]'
```

## See also

* [Use the Azure Data Explorer web UI to get the path to a dynamic field](../../web-results-grid.md#get-the-path-to-a-dynamic-field)
