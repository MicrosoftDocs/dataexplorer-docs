---
title: ai_embed_text plugin (Preview)
description: Learn how to use the ai_embed_text plugin to embed text via language models, enabling various AI-related scenarios such as RAG application and semantic search.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/12/2024
monikerRange: "azure-data-explorer"
---
# ai_embed_text plugin (Preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The `ai_embed_text` plugin allows embedding of text using language models, enabling various AI-related scenarios such as Retrieval Augmented Generation (RAG) applications and semantic search. The plugin supports Azure OpenAI Service embedding models accessed using managed identity.

## Prerequisites

* An Azure OpenAI Service configured with [managed identity](/azure/ai-services/openai/how-to/managed-identity)
* [Managed identity and callout policies](#configure-managed-identity-and-callout-policies) configured to allow communication with Azure OpenAI services

## Syntax

`evaluate` `ai_embed_text` `(`*Text*, *ConnectionString* [`,` *Options*`]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *Text* | `string` | :heavy_check_mark: | The text to be embedded. The value can be a column reference or a constant scalar. |
| *ConnectionString* | `string` | :heavy_check_mark: | Connection string for the language model in the format `<ModelDeploymentUri>;<AuthenticationMethod>`; replace `<ModelDeploymentUri>` and `<AuthenticationMethod>` with the AI model deployment URI and the authentication method respectively. |
| *Options* | `dynamic` |  | Options that control calls to the embedding model endpoint. See [Options](#options). |

## Options

The following table describes the options that control the way the requests are made to the embedding model endpoint.

| Name | Type | Description |
|--|--|--|
| `RecordsPerRequest` | `int` | Specifies the number of records to process per request. Default value: `1`. |
| `CharsPerRequest` | `int` | Specifies the maximum number of characters to process per request. Default value: `0` (unlimited). Azure OpenAI counts tokens, with each token approximately translating to four characters. |
| `RetriesOnThrottling` | `int` | Specifies the number of retry attempts when throttling occurs. Default value: `0`. |
| `GlobalTimeout` | `timespan` | Specifies the maximum time to wait for a response from the embedding model. Default value: `null` |
| `ModelParameters` | `dynamic` | Parameters specific to the embedding model, such as embedding dimensions or user identifiers for monitoring purposes. Default value: `null`. |
| `ReturnSuccessfulOnly` | `bool` | Indicates whether to return only the successfully processed items. Default value: `false`. |

## Configure managed identity and callout policies

To use the `ai_embed_text` plugin, you must configure the following policies:

* [managed identity](../management/managed-identity-policy.md): Allow the system-assigned managed identity to authenticate to Azure OpenAI services.
* [callout](../management/callout-policy.md): Authorize the AI model endpoint domain.

To configure these policies, use the commands in the following steps:

1. Configure the managed identity:

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

1. Configure the callout policy:

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

## Examples

The following example embeds the text `Embed this text using AI` using the Azure OpenAI Embedding model.

<!-- csl -->
```kusto
let expression = 'Embed this text using AI';
let connectionString = 'https://myaccount.openai.azure.com/openai/deployments/text-embedding-3-small/embeddings?api-version=2024-06-01;managed_identity=system';
evaluate ai_embed_text(expression, connectionString)
```

The following example embeds multiple texts using the Azure OpenAI Embedding model.

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

## Best practices

Azure OpenAI embedding models are subject to heavy throttling. Frequent calls to this plugin can quickly reach throttling limits.

To efficiently use the `ai_embed_text` plugin while minimizing throttling, you can follow these best practices:

* Control the size of each request by adjusting the number of records (`RecordsPerRequest`) and characters per request (`CharsPerRequest`).
* Configure retries on throttling to handle rate limits more gracefully.
* Configure the output of underlying errors to help understand and resolve issues related to throttling by setting `ReturnSuccessfulOnly` to true.
* Return partial results to avoid losing successfully embedded values. For failed records, either return an empty embedding value or omit it from the result, depending on the `ReturnSuccessfulOnly` flag.
* Use the `GlobalTimeout` option to set a timeout lower than the query [timeout](../set-timeout-limits.md), ensuring progress isn't lost on successful calls up to that point.

These practices help manage costs and improve the efficiency of embedding operations.

## Related content

* [series_cosine_similarity()](series-cosine-similarity-function.md)
