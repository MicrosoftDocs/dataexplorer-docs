# ai_embed_text plugin (Preview)

The `ai_embed_text` plugin allows embedding of text via language models, enabling various AI-related scenarios such as RAG application and semantic search.
Currently the plugin only supports Azure Open AI embedding models accessed by managed identity.

## Prerequisites
* Configure Azure Open AI Service with Managed Identity ([link](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/managed-identity)).
* Alter Managed Identity Policy and Callout Policy to allow communication with Azure OpenAI services (below).

## Syntax

`evaluate` `ai_embed_text` `(` *Text*, *ConnectionString* [, *Options*, *IncludeErrorMessages*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name                   | Type      | Required           | Description |
|------------------------|-----------|--------------------|-------------|
| *Text*                 | `string`  | :heavy_check_mark: | The text to be embedded. This can be a column reference or a constant scalar. |
| *ConnectionString*     | `string`  | :heavy_check_mark: | Connection string in the format `uri;auth`, specifying the AI model endpoint and authentication method. |
| *Options*              | `dynamic` |                    | Options that control calls to the embedding model endpoint. |
| *IncludeErrorMessages* | `bool`    |                    | Flag to output errors, adding an extra column to the output table. This requires `IncludeSuccesfulOnly` to be set to `false` in order to view the errors. |

## Options

These options control the way the request is made.

| Name                    | Type       | Description |
|-------------------------|------------|-------------|
| `RecordsPerRequest`     | `int`      | Number of records to process per request. Default: `1`. |
| `CharsPerRequest`       | `int`      | Maximum number of characters to process per request. Default: `0` (unlimited). Note that Azure OpenAI counts tokens, that translate to approximately 4 chars each. |
| `RetriesOnThrottling`   | `int`      | Number of retries on throttling. Default: `0` |
| `GlobalTimeout`         | `timespan` | Maximum time to wait for a response from the AI model. Default: `null` |
| `ModelParameters`       | `dynamic`  | Additional parameters specific to the AI model, such as dimensions or a user identifier for monitoring purposes. Default: `null`|
| `ReturnSuccessfulOnly`  | `bool`     | Whether to return only successfully processed items. Default: `false` |

## Managed Identity Configuration
Make sure your cluster has the appropriate [managed identity policy](https://learn.microsoft.com/en-us/kusto/management/managed-identity-policy?view=azure-data-explorer).

Use the following Kusto command to alter cluster policy for Managed Identity usage:

<!-- csl -->
````kusto
.alter-merge cluster policy managed_identity
```
[
  {
    "ObjectId": "system",
    "AllowedUsages": "AzureAI"
  }
]
```
````

## Callout Policy Configuration
Make sure your cluster has to appropriate [callout policy](https://learn.microsoft.com/en-us/kusto/management/callout-policy?view=azure-data-explorer).

Use the following Kusto command to alter cluster policy for Managed Identity usage:

<!-- csl -->
````kusto
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
````

## Examples

### Constant Text
<!-- csl -->
```kusto
let expression = 'Embed this text using AI';
let connectionString = 'https://myaccount.openai.azure.com/openai/deployments/text-embedding-3-small/embeddings?api-version=2024-06-01;managed_identity=system';
evaluate ai_embed_text(expression, connectionString)
```
### Textual Column
<!-- csl -->
```kusto
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
```

## Best Practices

Azure OpenAI Embedding models are subject to heavy throttling, and frequent calls to this plugin can quickly reach throttling limits. To manage this:

* Control the size of each request by adjusting the number of records (`RecordsPerRequest`) and characters per request (`CharsPerRequest`).
* Configure retries on throttling to handle rate limits more gracefully.

Enabling the output of underlying errors (`IncludeErrorMessages`) can assist in understanding and resolving issues related to throttling.

The Azure OpenAI Embedding endpoint is costly at scale. Therefore, we return partial results, so that we do not lose the values that were succesfuly embeded. For records we failed, we either return an empty embedding value, or omit it from the result, depending on the `ReturnSuccefulOnly` flag.

Another useful option is the `GlobalTimeout`. Since the execution time is influenced by the input size, it's often hard to predict. Setting a `GlobalTimeout` that is lower than the _Kusto server timeout_ acts as a safeguard, ensuring the user doesn't lose progress on successful calls up to that point. 
