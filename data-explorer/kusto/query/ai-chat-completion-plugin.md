---
title: ai_chat_completion plugin (preview)
description: Learn how to use the ai_chat_completion plugin to chat with large language models, enabling AI-related scenarios such as RAG application and semantic search.
ms.reviewer: alexans
ms.topic: reference
ms.date: 04/20/2025
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# ai_chat_completion plugin (preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

::: moniker range="azure-data-explorer"
The `ai_chat_completion` plugin enables generating chat completions using language models, supporting AI-related scenarios such as conversational AI and interactive systems. The plugin uses the in Azure OpenAI Service chat endpoint and can be accessed using either a managed identity or the user's identity (impersonation).
::: moniker-end
::: moniker range="microsoft-fabric"
The `ai_chat_completion` plugin enables generating chat completions using language models, supporting AI-related scenarios such as conversational AI and interactive systems. The plugin uses the in Azure OpenAI Service chat endpoint and can be accessed using the user's identity (impersonation).
::: moniker-end

## Prerequisites

* An Azure OpenAI Service configured with at least the ([Cognitive Services OpenAI User](/azure/ai-services/openai/how-to/role-based-access-control)) role assigned to the identity being used.
* A [Callout Policy](#configure-callout-policy) configured to allow calls to AI services.
::: moniker range="azure-data-explorer"
* When using managed identity to access Azure OpenAI Service, configure the [Managed Identity Policy](#configure-managed-identity) to allow communication with the service.
::: moniker-end

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
| `RetriesOnThrottling` | `int` | Specifies the number of retry attempts when throttling occurs. Default value: `0`. |
| `GlobalTimeout` | `timespan` | Specifies the maximum time to wait for a response from the AI chat model. Default value: `null`. |
| `ModelParameters` | `dynamic` | Parameters specific to the AI chat model. Possible values: `temperature`, `top_p`, `stop`, `max_tokens`, `max_completion_tokens`, `presence_penalty`, `frequency_penalty`, `user`, `seed`. Any other specified model parameters are ignored. Default value: `null`. |
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

Returns the following new chat completion columns:

* A column with the **_chat_completion** suffix that contains the chat completion values.
* If configured to return errors, a column with the **_chat_completion_error** suffix, which contains error strings or is left empty if the operation is successful.

Depending on the input type, the plugin returns different results:

* **Column reference**: Returns one or more records with additional columns prefixed by the reference column name. For example, if the input column is named **PromptData**, the output columns are named **PromptData_chat_completion** and, if configured to return errors, **PromptData_chat_completion_error**.
* **Constant scalar**: Returns a single record with additional columns that are not prefixed. The column names are **_chat_completion** and, if configured to return errors, **_chat_completion_error**.

## Examples

The following example uses a *system prompt* to set the context for all subsequent chat messages in the input to the Azure OpenAI chat completion model.

::: moniker range="azure-data-explorer"

### [Managed Identity](#tab/managed-identity)

<!-- csl -->
```kusto
let connectionString = 'https://myaccount.openai.azure.com/openai/deployments/gpt4o/chat/completions?api-version=2024-06-01;managed_identity=system';
let messages = dynamic([{'role':'system', 'content': 'You are a KQL writing assistant'},{'role':'user', 'content': 'How can I restrict results to just 10 records?'}]);
evaluate ai_chat_completion(messages, connectionString);
```

### [Impersonation](#tab/impersonation)

<!-- csl -->
```kusto
let connectionString = 'https://myaccount.openai.azure.com/openai/deployments/gpt4o/chat/completions?api-version=2024-06-01;impersonate';
let messages = dynamic([{'role':'system', 'content': 'You are a KQL writing assistant'},{'role':'user', 'content': 'How can I restrict results to just 10 records?'}]);
evaluate ai_chat_completion(messages, connectionString);
```

---
::: moniker-end
::: moniker range="microsoft-fabric"
<!-- csl -->
```kusto
let connectionString = 'https://myaccount.openai.azure.com/openai/deployments/gpt4o/chat/completions?api-version=2024-06-01;impersonate';
let messages = dynamic([{'role':'system', 'content': 'You are a KQL writing assistant'},{'role':'user', 'content': 'How can I restrict results to just 10 records?'}]);
evaluate ai_chat_completion(messages, connectionString);
```
::: moniker-end

## Related content

* [ai_embed_text()](ai-embed-text-plugin.md)
* [ai_chat_completion_prompt()](ai-chat-completion-prompt-plugin.md)
