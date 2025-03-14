---
title: ai_chat_completion plugin (Preview)
description: Learn how to use the ai_chat_completion plugin to chat with large language models, enabling various AI-related scenarios such as RAG application and semantic search.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/12/2024
monikerRange: "azure-data-explorer"
---
# ai_chat_completion plugin (Preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The `ai_chat_completion` plugin enables generating chat completions using language models, supporting various AI-related scenarios such as conversational AI and interactive systems. The plugin works against the chat endpoint in Azure OpenAI Service and is accessed using managed identity or the user's identity (impersonate).

## Prerequisites

* An Azure Open AI Service with the correct role ([Cognitive Services OpenAI User](/azure/ai-services/openai/how-to/role-based-access-control)) assinged for the identity to be used.
* A callout policy in place allowing calls to AI services [Callout Policy](#configure-callout-policy).
* Optional: If Managed Identity is to be used, configure [Managed Identity Policy](#configure-managed-identity) configured to allow communication with Azure OpenAI services.

## Syntax

`evaluate` `ai_chat_completion` `(`*Chat*, *ConnectionString* [`,` *Options* [`,` *IncludeErrorMessages*]]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *Messages* | `dynamic` | :heavy_check_mark: | An array of messages comprising the conversation so far. The value can be a column reference or a constant scalar. |
| *ConnectionString* | `string` | :heavy_check_mark: | The connection string for the language model in the format `<ModelDeploymentUri>;<AuthenticationMethod>`; replace `<ModelDeploymentUri>` and `<AuthenticationMethod>` with the AI model deployment URI and the authentication method respectively. |
| *Options* | `dynamic` |  | The options that control calls to the chat model endpoint. See [Options](#options). |
| *IncludeErrorMessages* | `bool` |  | Indicates whether to output errors in a new column in the output table. Default value: `false`. |

## Options

The following table describes the options that control the way the requests are made to the chat model endpoint.

| Name | Type | Description |
|--|--|--|
| `RecordsPerRequest` | `int` | Specified the number of concurrent requests to send to the Azure OpenAI service per query execution node (between `1` and `10`). Default: `1`. |
| `CharsPerRequest` | `int` | Limits the total number of input tokens used across concurrent requests on a single node. Default: `0` (unlimited). Azure OpenAI counts tokens, with each token approximately translating to four characters. |
| `RetriesOnThrottling` | `int` | Specifies the number of retry attempts when throttling occurs. Default value: `0`. |
| `GlobalTimeout` | `timespan` | Specifies the maximum time to wait for a response from the AI chat model. Default value: `null`. |
| `ModelParameters` | `dynamic` | Parameters specific to the AI chat model. Model parameters that can be specified are: `temperature`, `top_p`, `stop`, `max_tokens`, `max_completion_tokens`, `presence_penalty`, `frequency_penalty`, `user`, `seed`. Other supplied model parameters will be ignored. Default value: `null`. |
| `ReturnSuccessfulOnly` | `bool` | Indicates whether to return only the successfully processed items. Default value: `false`. If the *IncludeErrorMessages* parameter is set to `true`, this option is always set to `false`. |

## Configure Callout Policy
We need to allow the cluster to make callouts with the specific type for AI services.

[Callout](../management/callout-policy.md): Authorize the AI model endpoint domain.

Configure the callout policy:

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

## Configure Managed Identity
Optionally, we can use managed identities for authentication.
To do that, we need to allow the use of managed identities with this specific intent.

[Managed Identity](../management/managed-identity-policy.md): Allow the system-assigned managed identity to authenticate to Azure OpenAI services.

Configure the managed identity:

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

## Returns

Returns the following new chat completion columns:

* A column with the **_chat_completion** suffix that contains the chat completion values.
* If configured to return errors, a column with the **_chat_completion_error** suffix, which contains error strings or is left empty if the operation is successful.

Depending on the input type, the plugin returns different results:

* **Column reference**: Returns one or more records with additional columns prefixed by the reference column name. For example, if the input column is named **PromptData**, the output columns are named **PromptData_chat_completion** and, if configured to return errors, **PromptData_chat_completion_error**.
* **Constant scalar**: Returns a single record with additional columns that are not prefixed. The column names are **_chat_completion** and, if configured to return errors, **_chat_completion_error**.

## Examples

The following example uses a "system prompt" to set the context for all subsequent chat messages in the input to the Azure OpenAI chat completion model.

<!-- csl -->
```kusto
let connectionString = 'https://myaccount.openai.azure.com/openai/deployments/gpt4o/chat/completions?api-version=2024-06-01;managed_identity=system';
let messages = dynamic([{'role':'system', 'content': 'You are a KQL writing assistant'},{'role':'user', 'content': 'How can I restrict results to just 10 records?'}]);
evaluate ai_chat_completion(messages, connectionString);
```

Or, using the user's identity (impersonation)
<!-- csl -->
```kusto
let connectionString = 'https://myaccount.openai.azure.com/openai/deployments/gpt4o/chat/completions?api-version=2024-06-01;impersonate';
let messages = dynamic([{'role':'system', 'content': 'You are a KQL writing assistant'},{'role':'user', 'content': 'How can I restrict results to just 10 records?'}]);
evaluate ai_chat_completion(messages, connectionString);
```

## Best practices

Azure OpenAI chat models are subject to heavy throttling, and frequent calls to this plugin can quickly reach throttling limits.

To efficiently use the `ai_chat_completion` plugin while minimizing throttling and costs, follow these best practices:

* **Control request size**: Adjust the number of records (`RecordsPerRequest`) and characters per request (`CharsPerRequest`).
* **Control query timeout**: Set `GlobalTimeout` to a value lower than the query [timeout](../set-timeout-limits.md) to ensure progress isn't lost on successful calls up to that point.
* **Handle rate limits more gracefully**: Set retries on throttling (`RetriesOnThrottling`).

## Related content

* [ai_embed_text()](ai-embed-text-plugin.md)
* [ai_chat_completion_prompt()](ai-chat-completion-prompt-plugin.md)