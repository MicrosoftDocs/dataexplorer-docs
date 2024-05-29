---
title: Query consistency policy
description: Learn how to use the query consistency policy to control the consistency mode of queries.
ms.reviewer: yonil
ms.topic: reference
ms.date: 11/27/2023
---
# Query consistency policy

A workload group's query consistency policy allows specifying options that control the [consistency mode](../concepts/queryconsistency.md) of queries.

## The policy object

Each option consists of:

* A typed `Value` - the value of the limit.
* `IsRelaxable` - a boolean value that defines if the option can be relaxed by the caller, as part of the request's [request properties](../api/rest/request-properties.md). Default is `true`.

The following limits are configurable:

| Name                   | Type                 | Description                                                                                      | Supported values                                                               | Default value | Matching client request property |
|------------------------|----------------------|--------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|---------------|----------------------------------|
| QueryConsistency       | `QueryConsistency`   | The [consistency mode](../concepts/queryconsistency.md) to use.                                 | `Strong`, `Weak`, or `WeakAffinitizedByQuery`, `WeakAffinitizedByDatabase`     | `Strong`      | `queryconsistency`               |
| CachedResultsMaxAge    | `timespan`           | The maximum age of [cached query results](../query/query-results-cache.md) that can be returned. | A non-negative `timespan`                                                      | `null`        | `query_results_cache_max_age`    |

> [!NOTE]
> The default value applies in the following cases:
>
> * The policy isn't defined, and the client request option isn't set.
> * The policy is defined, the option isn't defined, and the client request option isn't set.
> * The policy is defined, the option is defined with `null` as its `Value`, and the client request option isn't set.

## Example

```json
"QueryConsistencyPolicy": {
  "QueryConsistency": {
    "IsRelaxable": true,
    "Value": "Weak"
  },
  "CachedResultsMaxAge": {
    "IsRelaxable": true,
    "Value": "05:00:00"
  }
}
```

## Related content

* [.show workload_group command](show-workload-group-command.md)
* [.create-or-alter workload_group command](create-or-alter-workload-group-command.md)
