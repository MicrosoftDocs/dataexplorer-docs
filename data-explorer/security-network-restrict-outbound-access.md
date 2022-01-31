---
title: Restrict outbound access from Azure Data Explorer
description: 'In this article you will learn how to restrict the outbound access access from Azure Data Explorer to other services.'
author: herauch
ms.author: herauch
ms.reviewer: eladb
ms.service: data-explorer
ms.topic: how-to
ms.date: 01/21/2022
---

# Howto restrict outbound access from Azure Data Explorer (public preview)

foo bar

## Callout policies

description + link

## restrictOutboundNetworkAccess and AllowedFQDNList

set to enabled -> the immutable callout policies will not be used and the allowedFQDN list will be used instead. Changing the callout policy through the data plane will not be possible. Only through ARM

## Next steps

> [!div class="nextstepaction"]
> [Deploy Azure Data Explorer into your Virtual Network](vnet-deployment.md)
