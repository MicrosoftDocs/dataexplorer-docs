---
title:  dax_request plugin
description: Learn how to use the dax_request plugin to send a DAX query to a DAX server network endpoint. 
ms.reviewer: gabil
ms.topic: reference
ms.date: 10/14/2026
monikerRange: "microsoft-fabric || azure-data-explorer"
---

# dax_request plugin

The `dax_request` plugin runs a Data Analysis Expressions (DAX) query against a Power BI semantic model and returns the results as a table. Process the returned table with standard Kusto Query Language (KQL) operators. Invoke the plugin with the [evaluate operator](evaluate-operator.md).

The plugin uses the Power BI [Execute DAX Queries API](/power-bi/developer/execute-dax-queries-arrow/overview), which returns results in Apache Arrow format. The plugin preserves supported column types when it converts the response to a KQL table.

## Prerequisites

* The semantic model must be in a workspace assigned to a Fabric or Power BI Premium capacity.
* The **Dataset Execute Queries REST API**, **Allow XMLA endpoints and Analyze in Excel with on-premises semantic models** tenant settings must be enabled.
* You must have [Build and Read permissions](/power-bi/connect-data/service-datasets-permissions) on the semantic model.
* The [cluster callout policy](#configure-and-callout-policy) must allow `dax` callouts to `api.powerbi.com`. To change this policy, you need `AllDatabasesAdmin` or `Ops` permissions.

## Syntax

`evaluate` ``dax_request`` `(`*ConnectionString*`,`*DaxQuery*`)` [`:` *OutputSchema*]

Learn more about syntax conventions in the [Syntax conventions for reference documentation](syntax-conventions.md).

## Parameters

| Name | Type | Required| Description |
|---|---|---|---|
| ConnectionString | `string` | Yes | The semantic model URL followed by `;Impersonate`. For the supported URL formats, see [Connection string](#connection-string). |
| DaxQuery | `string` | Yes | The DAX query to execute against the semantic model. |
| OutputSchema | - | - | The names and types of the expected output columns. Use the syntax `(`*ColumnName*`:`*ColumnType* [`,` ...]`)`. |

> ![NOTE]
> Specifying *OutputSchema* is recommended. It lets Kusto determine the plugin’s output columns and types without sending the DAX query to Power BI during schema discovery. The Power BI request is instead deferred to query execution, alongside the rest of the KQL query. The plugin returns an error if the returned schema is incompatible with the declared schema.

## Connection string

The connection string consists of the semantic model URL and the `;Impersonate` authentication directive. Use one of the following formats:

* Semantic model in a workspace:
    `https://api.powerbi.com/v1.0/myorg/groups/`*WorkspaceId*`/datasets/`*SemanticModelId*`;Impersonate`

* Semantic model in My workspace:
    `https://api.powerbi.com/v1.0/myorg/datasets/`*SemanticModelId*`;Impersonate`

The `myorg` path segment is literal. `*WorkspaceId*` and `*SemanticModelId*` must be globally unique identifiers (GUIDs). Don't include a query string, fragment, or trailing path after *SemanticModelId*.

## Authentication and authorization

The plugin uses Microsoft Entra on-behalf-of authentication. The engine obtains a token for the requesting user and sends the DAX query in that user's security context. The user must have [Build and Read permissions](/power-bi/connect-data/service-datasets-permissions) on the semantic model. Any row-level security or object-level security configured for the user applies to the query.

Use `;Impersonate` as the authentication directive. Managed identity, service principal, and application key authentication aren't supported.

> [!IMPORTANT]
> Use an [obfuscated string literal](scalar-data-types/string.md) for any string that contains confidential information. Obfuscated values don't appear in Kusto tracing.

## Configure and callout policy

The plugin makes an external call to Power BI. Because the default callout policy blocks `dax` callouts, a cluster administrator must explicitly allow the Power BI endpoint.

The following command merges a restrictive `dax` rule into the existing [cluster callout policy](../management/callout-policy.md):

```kusto
.alter-merge cluster policy callout @'[{
  "CalloutType": "dax",
  "CalloutUriRegex": "api\\.powerbi\\.com.*",
  "CanCall": true
}]'
```

Verify the policy:

```kusto
.show cluster policy callout
```

## Returns

The plugin returns the DAX query result as a KQL table. It preserves supported Arrow data types. For example, Arrow `int64`, `double`, `utf8`, and `date-time` values map to Kusto `long`, `real`, `string`, and `datetime`, respectively.

Power BI returns bracketed column names, such as `[Category]`. In KQL, reference these names with the `['...']` syntax, such as `['[Category]']`.

> [!WARNING]
> The plugin uses the default row limit of the [Power BI Execute DAX Queries API](/rest/api/power-bi/datasets/execute-dax-queries#request-body) (`resultSetRowCountLimit`). If the DAX query produces more rows than this limit the returned table can be incomplete without an error. Filter or aggregate data in the DAX query to keep the result within the limit. Filtering or aggregating afterward in KQL does not recover omitted rows.

## Examples

### Return all rows from a table

The following example queries the `Sales` table. The returned result is subject to the API’s default row limit.

```kusto
evaluate dax_request(
  'https://api.powerbi.com/v1.0/myorg/groups/<workspace-id>/datasets/<semantic-model-id>;Impersonate',
  'EVALUATE Sales')
```

### Process DAX results with Kusto

The following example selects two columns in DAX, summarizes the result in KQL, and filters by category:

```kusto
evaluate dax_request(
  'https://api.powerbi.com/v1.0/myorg/groups/<workspace-id>/datasets/<semantic-model-id>;Impersonate',
  'EVALUATE SELECTCOLUMNS(Sales, "Category", Sales[Category], "Amount", Sales[Amount])')
| summarize TotalAmount = sum(['[Amount]']) by ['[Category]']
| where ['[Category]'] == 'Electronics'
```

> [!TIP]
> Filter and aggregate data in DAX when possible to reduce the amount of data returned to Kusto.

### Specify an output schema

The following example declares the expected output schema so that Kusto can determine the schema without contacting Power BI during query analysis. The declared schema must match the live result schema.

```kusto
evaluate dax_request(
  'https://api.powerbi.com/v1.0/myorg/groups/<workspace-id>/datasets/<semantic-model-id>;Impersonate',
  'EVALUATE ROW("cnt", COUNTROWS(Sales), "sumAmt", SUM(Sales[Amount]))')
  : (['[cnt]']:long, ['[sumAmt]']:real)
```

## Troubleshooting

| Error | Cause and resolution |
|---|---|
| Invalid connection string | Confirm that the URL uses a supported format, the workspace and semantic model IDs are valid GUIDs, and the string ends with `;Impersonate`. |
| Callout isn't permitted | Configure the cluster callout policy to allow `dax` calls to `api.powerbi.com`. |
| Authentication or authorization error | Confirm that the required tenant settings are enabled and that the requesting user has Build permission on the semantic model. |
| HTTP request error | Ensure Power BI service availability, endpoint accessibility, and the semantic model URL. |
