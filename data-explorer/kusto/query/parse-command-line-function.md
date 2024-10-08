---
title:  parse_command_line()
description: Learn how to use the parse_command_line() function to parse a unicode command-line string.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 08/11/2024
---
# parse_command_line()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Parses a Unicode command-line string and returns a [dynamic](scalar-data-types/dynamic.md) array of the command-line arguments.

## Syntax

`parse_command_line(`*command_line*, *parser_type*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *command_line*| `string` |  :heavy_check_mark: | The command line value to parse.|
| *parser_type*| `string` |  :heavy_check_mark: | The only value that is currently supported is `"windows"`, which parses the command line the same way as [CommandLineToArgvW](/windows/win32/api/shellapi/nf-shellapi-commandlinetoargvw).|

## Returns

A dynamic array of the command-line arguments.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwXBYQrAIAgG0Ku479cGO1IQkUKBadjA6++9HdM+2i2O1O5rNeOq0+SG9OFUMETVKT2UrwK8hJzGngfPD3VSsFI8AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print parse_command_line("echo \"hello world!\"", "windows")
```

**Output**

|Result|
|---|
|["echo","hello world!"]|
