---
title:  JSONPath syntax
description: Learn how to use JSONPath expressions to specify data mappings and KQL functions that process dynamic objects.
ms.reviewer: igborodi
ms.topic: reference
ms.date: 07/24/2023
---

# JSONPath expressions

JSONPath notation describes the path to one or more elements in a JSON document.

The JSONPath notation is used in the following scenarios:

- To specify [data mappings for ingestion](../management/mappings.md)
- To specify [data mappings for external tables](../management/external-table-mapping-create.md)
- In Kusto Query Language (KQL) functions that process dynamic objects, like [bag_remove_keys()](bag-remove-keys-function.md) and [extract_json()](extractjsonfunction.md)

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

Given the following JSON document:

```json
{
  "Source": "Server-01",
  "Timestamp": "2023-07-25T09:15:32.123Z",
  "Log Level": "INFO",
  "Message": "Application started successfully.",
  "Details": {
    "Service": "AuthService",
    "Endpoint": "/api/login",
    "Response Code": 200,
    "Response Time": 54.21,
    "User": {
      "User ID": "user123",
      "Username": "kiana_anderson",
      "IP Address": "192.168.1.100"
    }
  }
}
```

You can represent each of the fields with JSONPath notation as follows:

```kusto
'$.Source'                     // Source field
'$.Timestamp'                  // Timestamp field
'$['Log Level']'               // Log Level field
'$.Message'                    // Message field
'$.Details.Service'            // Service field
'$.Details.Endpoint'           // Endpoint field
'$.Details['Response Code']'   // Response Code field
'$.Details['Response Time']'   // Response Time field
'$.Details.User['User ID']'    // User ID field
'$.Details.User.Username'      // Username field
'$.Details.User['IP Address']' // IP Address field

```

## See also

* [Get the path to a dynamic field](../../web-results-grid.md#get-the-path-to-a-dynamic-field)
* [Add filter from dynamic field](../../web-results-grid.md#add-filter-from-dynamic-field)
