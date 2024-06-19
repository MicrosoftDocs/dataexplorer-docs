---
title: KQL docs navigation guide
description: Learn how to understand which version of KQL documentation you are viewing and how to switch to a different version.
ms.topic: conceptual
ms.date: 06/19/2024
---
# KQL docs navigation guide

The behavior of KQL may vary when using this language in different products. When you view any KQL documentation article by using our Learn website, the currently chosen product name is visible above the table of contents (TOC). You can switch between products using a drop-down list.

If you want to see the documentation for a different version of KQL, click the expander arrow located at the end of the current version moniker. Then select any product you want. When you select a different product, the displayed documentation suddenly changes to show the differences for the newly chosen version. There might or might not be any changes, and both cases are common.

## HTTPS parameter view=

Each article whose web address begins with `https://learn.microsoft.com/kusto/` has a parameter named `?view=` appended to its address. This parameter value is the versioning moniker code.

The moniker code in the https address always matches the moniker name that is displayed in the versioning control.

## Applies to products

Most of the KQL articles have the words **Applies to** under their title. On the same line, there follows a handy listing of products with indicators of which products are relevant for this article. For example, a certain function could be applicable to Fabric and Azure Data Explorer, but not Azure Monitor.

