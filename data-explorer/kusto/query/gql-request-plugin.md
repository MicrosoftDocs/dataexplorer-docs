---
title: gql_request plugin
description: Run a GQL query against a Microsoft Fabric graph and process the returned table with Kusto Query Language operators.
ms.reviewer: gabil
ms.topic: reference
ms.date: 10/18/2026
monikerRange: "microsoft-fabric || azure-data-explorer"
---

# gql_request plugin

The `gql_request` plugin runs an [ISO Graph Query Language (GQL)](/fabric/graph/gql-language-guide) query against a graph in Microsoft Fabric and returns the results as a table. Process the returned table with standard Kusto Query Language (KQL) operators. Invoke the plugin with the [evaluate operator](evaluate-operator.md).

The plugin uses the Microsoft Fabric [GQL Query API](/fabric/graph/gql-query-api). You can optionally declare the expected output schema. Providing it avoids an additional GQL query during schema discovery.

> [!NOTE]
> This plugin uses Graph Query Language (GQL) to query Fabric graphs, not GraphQL, the API query language.

> [!NOTE]
> The `gql_request` plugin is in preview.

## Prerequisites

- A Microsoft Fabric graph that contains data. To create and load a sample graph, see [Graph quickstart](/fabric/graph/quickstart).
- Permission to query the graph in its Fabric workspace.
- The [cluster callout policy](#configure-the-callout-policy) must allow Fabric Graph GQL request callouts to `api.fabric.microsoft.com`. To change this policy, you need `AllDatabasesAdmin` or `Ops` permissions.

## Syntax

`evaluate` ``gql_request`` `(`*ConnectionString*`,`*GqlQuery*`)` [`:` *OutputSchema*]

Learn more about syntax conventions in the [Syntax conventions for reference documentation](syntax-conventions.md).

## Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| ConnectionString | `string` | Yes | The Fabric graph-model URL followed by `;Impersonate`. For the supported format, see [Connection string](#connection-string). |
| GqlQuery | `string` | Yes | The GQL query to run against the graph. |
| OutputSchema | - | - | The names and types of the expected output columns. Use the syntax `(`*ColumnName*`:`*ColumnType* [`,` ...]`)`. |

> [!NOTE]
> Specifying *OutputSchema* is recommended particularly when the GQL query might return no rows.
> It lets Kusto determine the plugin’s output columns and types without running the query during schema discovery.
> The plugin returns an error if the returned schema is incompatible with the declared schema.

## Connection string 

Specify the Fabric graph-model URL followed by the `;Impersonate` authentication directive:

`https://api.fabric.microsoft.com/v1/workspaces/<WorkspaceId>/GraphModels/<GraphModelId>;Impersonate`

`WorkspaceId` and `GraphModelId` must be valid GUIDs. 

## Authentication and authorization

The plugin uses Microsoft Entra on-behalf-of authentication. The engine obtains a token for the requesting user and queries the graph in that user's security context. The user must have permissions on the graph.

Use `;Impersonate` as the authentication directive. Managed identity, service principal, and application key authentication aren't supported.

> [!IMPORTANT]
> Use an [obfuscated string literal](scalar-data-types/string.md) for any string that contains confidential information. Obfuscated values don't appear in Kusto tracing.

## Configure the callout policy

The plugin makes an external call to Microsoft Fabric. Because the default callout policy blocks Fabric Graph GQL request callouts, a cluster administrator must explicitly allow the Fabric endpoint.

The following command merges a restrictive Fabric Graph GQL request rule into the existing [cluster callout policy](../management/callout-policy.md):

```kusto
.alter-merge cluster policy callout @'[{
    "CalloutType": "gql", 
    "CalloutUriRegex": "api\\.fabric\\.microsoft\\.com/.*", 
    "CanCall": true
}]'
```

Verify the policy:

```kusto
.show cluster policy callout
```

## Returns

The plugin returns the GQL query result as a KQL table.
If you specify *OutputSchema*, the returned columns must be compatible with the declared schema.
For predictable results, project the properties you need in the GQL query rather than returning whole nodes, edges, or paths.

## Examples

### Return rows from a graph

This example assumes the graph contains `Person` nodes with `firstName` and `lastName` properties.
It returns up to 100 names.

```kusto
evaluate gql_request(
  'https://api.fabric.microsoft.com/v1/workspaces/<workspace-id>/graphModels/<graph-model-id>;Impersonate',
  @'MATCH (p:Person)
    RETURN p.firstName AS firstName, p.lastName AS lastName
    LIMIT 100')
  : (firstName:string, lastName:string)
```

### Process GQL results with Kusto

The following example counts `Person` nodes with a `LIVES_IN` relationship to each `City`, then uses KQL to show cities with more than 10 people, ordered by count.
It assumes the graph contains `Person` and `City` nodes connected by `LIVES_IN` relationships.

```kusto
evaluate gql_request(
  'https://api.fabric.microsoft.com/v1/workspaces/<workspace-id>/GraphModels/<graph-model-id>;Impersonate',
  @'MATCH (p:Person)-[:LIVES_IN]->(c:City)
    RETURN c.name AS city, count(DISTINCT p) AS PersonCount')
  : (city:string, PersonCount:long)
| where PersonCount > 10
| order by PersonCount desc
```

This counts distinct people per city name; cities sharing a name are grouped together.

> [!TIP]
> Filter, project, and limit data in GQL when possible to reduce the amount of data returned to Kusto.

## Troubleshooting

The plugin distinguishes transport failures from GQL application errors. A GQL application error can arrive in an HTTP 200 response. The plugin evaluates the response status, includes available status codes, descriptions, and nested causes, and returns the failure as a query error.

The table below lists common errors returned by the plugin and their possible causes and resolutions.

| Error | Cause and resolution |
| --- | --- |
| Invalid connection string |  Confirm that the connection string follows the [supported format](#connection-string), the workspace and graph model IDs are valid GUIDs, and the string ends with `;Impersonate`. Don't include  `/executeQuery` , query parameters, or a fragment in the URL. The plugin constructs the API endpoint internally. |
| Output schema mismatch | Confirm that the declared column names and KQL types are compatible with the GQL result columns and types. |
| Unsupported GQL result type | Project individual scalar properties in the GQL query. For complex values, consider using GQL `TO_JSON_STRING` to return a string representation. |
| Callout isn't permitted | Configure the cluster callout policy to allow Fabric Graph GQL request calls to `api.fabric.microsoft.com`. |
| Authentication or authorization error | Confirm that the caller identity can access the workspace and graph. |
| HTTP request error | Check Microsoft Fabric service availability, endpoint accessibility and throttling responses. |
| GQL query error | Review the query error details, including the GQL status description, diagnostics, and nested cause when available. |

## Related content

- [evaluate operator](evaluate-operator.md)
- [GQL Query API reference](/fabric/graph/gql-query-api)
- [GQL language guide](/fabric/graph/gql-language-guide)
- [Cluster callout policy](../management/callout-policy.md)
- [String operators](scalar-data-types/string.md)
