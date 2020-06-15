---
title: bag_merge() - Azure Data Explorer 
description: This article describes bag_merge() in Azure Data Explorer.
services: data-explorer
author: elgevork
ms.author: elgevork
ms.reviewer: 
ms.service: data-explorer
ms.topic: reference
ms.date: 06/14/2020
---
# bag_merge()

Merges input dynamic property-bag objects into a dynamic property-bag object.

**Syntax**

`bag_merge(`*dynamic object*`,`*dynamic object*`)`

**Arguments**

* Input dynamic objects separated by commas. Function supports 2 to 64 input dynamic objects.

**Returns**

Returns a `dynamic` property-bag, resulted from merging of all the input property-bag objects.
If a key appears in more than one input objects, an arbitrary value (out of the possible values for this key) will be chosen.

**Example**

Expression:

`print result = bag_merge(dynamic({ 'A1':12, 'B1':2, 'C1':3}), dynamic({ 'A2':81, 'B2':82, 'A1':1}))`

Evaluates to:

`{
  "A1": 12,
  "B1": 2,
  "C1": 3,
  "A2": 81,
  "B2": 82
}`
