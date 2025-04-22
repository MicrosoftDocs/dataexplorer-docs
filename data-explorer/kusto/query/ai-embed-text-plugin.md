---
title: ai_embed_text plugin (preview)
description: Learn how to use the ai_embed_text plugin to embed text via language models, enabling various AI-related scenarios such as RAG application and semantic search.
ms.reviewer: alexans
ms.topic: reference
ms.date: 04/20/2025
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# ai_embed_text plugin (Preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

::: moniker range="azure-data-explorer"
The `ai_embed_text` plugin allows embedding of text using language models, enabling various AI-related scenarios such as Retrieval Augmented Generation (RAG) applications and semantic search. The plugin uses the Azure OpenAI Service embedding models and can be accessed using either a managed identity or the user's identity (impersonation).
::: moniker-end
::: moniker range="microsoft-fabric"
The `ai_embed_text` plugin allows embedding of text using language models, enabling various AI-related scenarios such as Retrieval Augmented Generation (RAG) applications and semantic search. The plugin uses the Azure OpenAI Service embedding models and can be accessed using either the user's identity (impersonation).
::: moniker-end

## Prerequisites

* An Azure OpenAI Service configured with at least the ([Cognitive Services OpenAI User](/azure/ai-services/openai/how-to/role-based-access-control)) role assigned to the identity being used.
* A [Callout Policy](#configure-callout-policy) configured to allow calls to AI services.
::: moniker range="azure-data-explorer"
* When using managed identity to access Azure OpenAI Service, configure the [Managed Identity Policy](#configure-managed-identity) to allow communication with the service.
::: moniker-end

## Syntax

`evaluate` `ai_embed_text` `(`*text*, *connectionString* [`,` *options* [`,` *IncludeErrorMessages*]]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *text* | `string` | :heavy_check_mark: | The text to embed. The value can be a column reference or a constant scalar. |
| *connectionString* | `string` | :heavy_check_mark: | The connection string for the language model in the format `<ModelDeploymentUri>;<AuthenticationMethod>`; replace `<ModelDeploymentUri>` and `<AuthenticationMethod>` with the AI model deployment URI and the authentication method respectively. |
| *options* | `dynamic` |  | The options that control calls to the embedding model endpoint. See [Options](#options). |
| *IncludeErrorMessages* | `bool` |  | Indicates whether to output errors in a new column in the output table. Default value: `false`. |

## Options

The following table describes the options that control the way the requests are made to the embedding model endpoint.

| Name | Type | Description |
|--|--|--|
| `RecordsPerRequest` | `int` | Specifies the number of records to process per request. Default value: `1`. |
| `CharsPerRequest` | `int` | Specifies the maximum number of characters to process per request. Default value: `0` (unlimited). Azure OpenAI counts tokens, with each token approximately translating to four characters. |
| `RetriesOnThrottling` | `int` | Specifies the number of retry attempts when throttling occurs. Default value: `0`. |
| `GlobalTimeout` | `timespan` | Specifies the maximum time to wait for a response from the embedding model. Default value: `null` |
| `ModelParameters` | `dynamic` | Parameters specific to the embedding model, such as embedding dimensions or user identifiers for monitoring purposes. Default value: `null`. |
| `ReturnSuccessfulOnly` | `bool` | Indicates whether to return only the successfully processed items. Default value: `false`. If the *IncludeErrorMessages* parameter is set to `true`, this option is always set to `false`. |

## Configure Callout Policy

The `azure_openai` [callout policy](../management/callout-policy.md) enables external calls to Azure AI services.

To configure the callout policy to authorize the AI model endpoint domain:

<!-- csl -->
~~~kusto
.alter-merge cluster policy callout
```
[
  {
    "CalloutType": "azure_openai",
    "CalloutUriRegex": "https://[A-Za-z0-9\\-]{3,63}\\.openai\\.azure\\.com/.*",
    "CanCall": true
  }
]
```
~~~

::: moniker range="azure-data-explorer"

## Configure Managed Identity

When using managed identity to access Azure OpenAI Service, you must configure the [Managed Identity policy](../management/managed-identity-policy.md) to allow the system-assigned managed identity to authenticate to Azure OpenAI Service.

To configure the managed identity:

<!-- csl -->
~~~kusto
.alter-merge cluster policy managed_identity
```
[
  {
    "ObjectId": "system",
    "AllowedUsages": "AzureAI"
  }
]
```
~~~

::: moniker-end

## Returns

Returns the following new embedding columns:

* A column with the **_embedding** suffix that contains the embedding values
* If configured to return errors, a column with the **_embedding_error** suffix, which contains error strings or is left empty if the operation is successful.

Depending on the input type, the plugin returns different results:

* **Column reference**: Returns one or more records with additional columns are prefixed by the reference column name. For example, if the input column is named **TextData**, the output columns are named **TextData_embedding** and, if configured to return errors, **TextData_embedding_error**.
* **Constant scalar**: Returns a single record with additional columns that are not prefixed. The column names are **_embedding** and, if configured to return errors, **_embedding_error**.

## Examples

The following example embeds the text `Embed this text using AI` using the Azure OpenAI Embedding model.

::: moniker range="azure-data-explorer"

### [Managed Identity](#tab/managed-identity)

<!-- csl -->
```kusto
let expression = 'Embed this text using AI';
let connectionString = 'https://myaccount.openai.azure.com/openai/deployments/text-embedding-3-small/embeddings?api-version=2024-06-01;managed_identity=system';
evaluate ai_embed_text(expression, connectionString)
```

### [Impersonation](#tab/impersonation)

<!-- csl -->
```kusto
let connectionString = 'https://myaccount.openai.azure.com/openai/deployments/text-embedding-3-small/embeddings?api-version=2024-06-01;impersonate';
evaluate ai_embed_text(expression, connectionString)
```

---
::: moniker-end
::: moniker range="microsoft-fabric"
<!-- csl -->
```kusto
let connectionString = 'https://myaccount.openai.azure.com/openai/deployments/text-embedding-3-small/embeddings?api-version=2024-06-01;impersonate';
evaluate ai_embed_text(expression, connectionString)
```
::: moniker-end

The following example embeds multiple texts using the Azure OpenAI Embedding model.

::: moniker range="azure-data-explorer"

### [Managed Identity](#tab/managed-identity)

<!-- csl -->
~~~kusto
let connectionString = 'https://myaccount.openai.azure.com/openai/deployments/text-embedding-3-small/embeddings?api-version=2024-06-01;managed_identity=system';
let options = dynamic({
  "RecordsPerRequest": 10,
  "CharsPerRequest": 10000,
  "RetriesOnThrottling": 1,
  "GlobalTimeout": 2m
});
datatable(TextData: string)
[
    "First text to embed",
    "Second text to embed",
    "Third text to embed"
]
| evaluate ai_embed_text(TextData, connectionString, options , true)
~~~

### [Impersonation](#tab/impersonation)

<!-- csl -->
~~~kusto
let connectionString = 'https://myaccount.openai.azure.com/openai/deployments/text-embedding-3-small/embeddings?api-version=2024-06-01;impersonate';
let options = dynamic({
  "RecordsPerRequest": 10,
  "CharsPerRequest": 10000,
  "RetriesOnThrottling": 1,
  "GlobalTimeout": 2m
});
datatable(TextData: string)
[
  "First text to embed",
  "Second text to embed",
  "Third text to embed"
]
| evaluate ai_embed_text(TextData, connectionString, options , true)
~~~

---
::: moniker-end
::: moniker range="microsoft-fabric"
<!-- csl -->
~~~kusto
let connectionString = 'https://myaccount.openai.azure.com/openai/deployments/text-embedding-3-small/embeddings?api-version=2024-06-01;impersonate';
let options = dynamic({
  "RecordsPerRequest": 10,
  "CharsPerRequest": 10000,
  "RetriesOnThrottling": 1,
  "GlobalTimeout": 2m
});
datatable(TextData: string)
[
  "First text to embed",
  "Second text to embed",
  "Third text to embed"
]
| evaluate ai_embed_text(TextData, connectionString, options , true)
~~~
::: moniker-end

## Best practices

Azure OpenAI embedding models are subject to heavy throttling, and frequent calls to this plugin can quickly reach throttling limits.

To efficiently use the `ai_embed_text` plugin while minimizing throttling and costs, follow these best practices:

* **Control request size**: Adjust the number of records (`RecordsPerRequest`) and characters per request (`CharsPerRequest`).
* **Control query timeout**: Set `GlobalTimeout` to a value lower than the query [timeout](../set-timeout-limits.md) to ensure progress isn't lost on successful calls up to that point.
* **Handle rate limits more gracefully**: Set retries on throttling (`RetriesOnThrottling`).

## Related content

* [series_cosine_similarity()](series-cosine-similarity-function.md)
