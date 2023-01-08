---
title: parse_command_line() - Azure Data Explorer
description: This article describes parse_command_line() in Azure Data Explorer.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 06/28/2020
---
# parse_command_line()

Parses a Unicode command-line string and returns a [dynamic](scalar-data-types/dynamic.md) array of the command-line arguments.

## Syntax

`parse_command_line(`*command_line*, *parser_type*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *command_line*| string | &check; | The command line value to parse.|
| *parser_type*| string | &check; | The only value that is currently supported is `"windows"`, which parses the command line the same way as [CommandLineToArgvW](/windows/win32/api/shellapi/nf-shellapi-commandlinetoargvw).|

## Returns

A dynamic array of the command-line arguments.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwXBYQrAIAgG0Ku479cGO1IQkUKBadjA6++9HdM+2i2O1O5rNeOq0+SG9OFUMETVKT2UrwK8hJzGngfPD3VSsFI8AAAA" target="_blank">Run the query</a>

```kusto
print parse_command_line("echo \"hello world!\"", "windows")
```

**Output**

|Result|
|---|
|["echo","hello world!"]|
