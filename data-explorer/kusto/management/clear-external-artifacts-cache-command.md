---
title: .clear cluster cache external-artifacts command
description: Learn how to use the `.clear cluster cache external-artifacts` command to clear cached external-artifacts of language plugins.
ms.reviewer: 
ms.topic: reference
ms.date: 06/26/2023
---
# .clear cluster cache external-artifacts command

Clears cached external-artifacts of language plugins.  

This command is useful when you update external-artifact files stored in external storage, as the cache may retain the previous versions. In such scenarios, executing this command will clear the cache entries and ensure that subsequent queries run with the latest version of the artifacts.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.clear` `cluster` `cache` `external-artifacts` `(` *ArtifactURI* [`,` ... ] `)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ArtifactURI* | `string` | &check;  | The URI for the external-artifact to clear from the cache. |

## Returns

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|ExternalArtifactUri|`string`|The external artifact URI.
|State|`string`|The result of the clear operation on the external artifact.

## Example

```kusto
.clear cluster cache external-artifacts ("https://kustoscriptsamples.blob.core.windows.net/samples/R/sample_script.r", "https://kustoscriptsamples.blob.core.windows.net/samples/python/sample_script.py")
```

|ExternalArtifactUri|State|
|---|---|
|https://kustoscriptsamples.blob.core.windows.net/samples/R/sample_script.r|Cleared successfully on all nodes
|https://kustoscriptsamples.blob.core.windows.net/samples/python/sample_script.py|Cleared successfully on all nodes

## Related content

* [Manage language extensions in your Azure Data Explorer cluster](../../language-extensions.md)
* [Python plugin](../query/pythonplugin.md)
* [R plugin](../query/rplugin.md)
