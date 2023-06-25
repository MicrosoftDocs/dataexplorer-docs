---
title: .clear cluster cache external-artifacts command
description: Learn how to use the `.clear cluster cache external-artifacts` command to clear cached external-artifacts of language plugins.
ms.reviewer: 
ms.topic: reference
ms.date: 
---
# .clear cluster cache external-artifacts command

Clears cached external-artifacts of language plugins.  
This command can be typically used in cases where you update your external-artifact files in your external storage, while the cache still holds the old ones. In such a case this command clears the cache entries and ensures your next queries run with the updated artifacts.  
learn more about [language extensions on your cluster](../language-extensions.md).

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.clear` `cluster` `cache` `external-artifacts` *ArrayOfArtifactsURIs*


## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ArrayOfArtifactsURIs* | `string` | &check;  | An array with one or more external-artifact URI |


## Returns

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|ExternalArtifactUri|`string`|The external artifact URI
|State|`string`|The result of the clear operation on the external artifact.

## Example

```kusto
.clear cluster cache external-artifacts ("https://kustoscriptsamples.blob.core.windows.net/samples/R/sample_script.r", "https://kustoscriptsamples.blob.core.windows.net/samples/python/sample_script.py")
```

|ExternalArtifactUri|State|
|---|---|
|https://kustoscriptsamples.blob.core.windows.net/samples/R/sample_script.r|Cleared successfully on all nodes
|https://kustoscriptsamples.blob.core.windows.net/samples/python/sample_script.py|Cleared successfully on all nodes

	
	
	
