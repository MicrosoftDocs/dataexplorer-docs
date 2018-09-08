---
title: Encoding policy - Azure Kusto | Microsoft Docs
description: This article describes Encoding policy in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Encoding policy

TODO: add info

## show encoding policy

**Syntax**

`.show` *EntityType* *EntityIdentifier* `policy` `encoding`

Where:

* *EntityType* can be either `database` or `table` or `column` and determines
  the type of *EntityIdentifier*.
* *EntityIdentifier* is the identifier for the entity. Column references must
  include the table name scope. A wildcard (`*` is allowed here).

**Example**

```kusto
.show database Samples policy encoding
```

## alter encoding policy

**Syntax**

`.alter` *EntityType* *EntityIdentifier* `policy` `encoding` *EncodingPolicyToSet*

`.alter-merge` *EntityType* *EntityIdentifier* `policy` `encoding` *EncodingPolicyDelta*

Where:

* *EntityType* can be either `database` or `table` or `column` and determines
  the type of *EntityIdentifier*.
* *EntityIdentifier* is the identifier for the entity. Column references must include
  the table name scope.
* *EncodingPolicyToSet* is the new encoding policy to set on the entity,
  replacing the existing encoding policy (if any).
* *EncodingPolicyDelta* includes only the changes to make on the existing entity's
  encoding policy.

**Example**

The following example shows a set of steps to modify the encoding policy
of column `MyColumn` in table `MyTable` that is of type `string` or `guid`
and that holds a row-identity value that is never searched as free-text.

```kusto
// Disable the term index for the column, since we're not searching for terms in it
.alter-merge column MyTable.MyColumn policy encoding @'{ "BuildColumnTermIndex": false }'

// Consider the whole value as a single token without breaking it into terms
.alter-merge column MyTable.MyColumn policy encoding @'{ "ColumnIndexTextTokenizerName": "trivial", "ColumnIndexRangeGranularity": 32 }'

// For columns of type guid, switch to a more-appropriate compression algorithm
.alter-merge column MyTable.MyColumn policy encoding @'{ "BlockCompressionAlgorithm": "MINIZ" }'
```

## delete encoding policy

**Syntax**

`.delete`  *EntityType* *EntityIdentifier* `policy` `encoding`

Where:

* *EntityType* can be either `database` or `table` or `column` and determines
  the type of *EntityIdentifier*.
* *EntityIdentifier* is the identifier for the entity. Column references must
  include the table name scope.