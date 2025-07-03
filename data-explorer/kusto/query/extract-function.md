---
title:  extract()
description: Learn how to use the extract() function to get a match for a regular expression from a source string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/16/2024
---
# extract()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Get a match for a [regular expression](regex.md) from a source string.

Optionally, convert the extracted substring to the indicated type.

## Syntax

`extract(`*regex*`,` *captureGroup*`,` *source* [`,` *typeLiteral*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *regex* | `string` |  :heavy_check_mark: | A [regular expression](regex.md).|
| *captureGroup* | `int` |  :heavy_check_mark: | The capture group to extract. 0 stands for the entire match, 1 for the value matched by the first '('parenthesis')' in the regular expression, and 2 or more for subsequent parentheses.|
| *source* | `string` |  :heavy_check_mark:| The string to search.|
| *typeLiteral* | `string` | | If provided, the extracted substring is converted to this type. For example, `typeof(long)`.

## Returns

If *regex* finds a match in *source*: the substring matched against the indicated capture group *captureGroup*, optionally converted to *typeLiteral*.

If there's no match, or the type conversion fails: `null`.

## Examples

The following example extract the username, email, age from the string. The [regular expression](regex.md) are used to extract the information.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEISa0oUbBVUAotTi2yUvDKz8hzyU%2FVUXDNTczMsVLIAvJT8lMdUisScwtyUvWS83N1FBzTU60UjCyVrLkKijLzShRAWv0Sc1OBxgANK0pMLtGAGqcRHacTq62ppKNgqAO2SVOHC2yyZwqSYgclqG0aMcHamjooqoF2oaiMSdEGyhtA5QFR4bA2wQAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let Text = "User: JohnDoe, Email: johndoe@example.com, Age: 29";
print UserName = extract("User: ([^,]+)", 1, Text),
EmailId = extract(@"Email: (\S+),", 1, Text),
Age = extract(@"\d+", 0, Text)
```

**Output**

| UserName | EmailId | Age |
| --- | --- | --- |
| JohnDoe | johndoe@example.com	| 29 |

The following example extracts the month from the string `Dates` and returns a table with the date string and the month as int type.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WNsQrCMBCG9zzFkSmBBJKrIiiCg6uTozrU9tRKSUp6g6K%2Bu2lFxLvh%2BD%2BO72%2BJYV0y9bCEuuS8x5bUQLacmnCeQz9eLXYC8kg%2FtR4tOpxI8yHorZsNpPgS76wrBoJSHBZi9Isn0I0p1LCJgS%2B5LsdUVqxW0qp9%2FcCXttKAN%2FBrN8D3juJJNYG1zoouxStV%2FPcy%2Bt4n%2F34nyAAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let Dates = datatable(DateString: string)
[
    "15-12-2024",
    "21-07-2023",
    "10-03-2022"
];
Dates
| extend Month = extract(@"-(\d{2})-", 1, DateString, typeof(int))
| project DateString, Month
```

**Output**

| DateString | Month |
| --- | --- |
| 15-12-2024 | 12 |
| 21-07-2023 | 7 |
| 10-03-2022 | 3 |

## Related content

* [extract-all function](extract-all-function.md)
* [extract-json function](extract-json-function.md)
* [parse operator](parse-operator.md)
* [regular expression](regex.md)
