---
title: Graph sample datasets and examples
description: Graph examples  
ms.topic: conceptual
ms.service: azure-data-explorer
ms.author: <alias>
author: <github>
ms.date: 08/14/2025
---

# Graph sample datasets and examples

This page lists existing persistent graphs and shows how to query them with KQL. These examples demonstrate querying pre-built graph models without requiring any creation or setup steps.

## Usage notes

Use `graph("ModelName")` with the model name to reference existing persistent graphs. All examples assume the graphs already exist in your environment and are accessible through their model names.

### Simple

Purpose: Basic graph operations and learning fundamental graph query patterns.

```kusto
graph("Simple")
| graph-match (n)-[e]->(m)
project source = n, target = m, relationship = e
| take 10
```

### LDBC_SNB_Interactive

Purpose: Social network traversals and friend-of-friend exploration.

```kusto
graph("LDBC_SNB_Interactive")
| graph-match (p)-[k*1..2]->(f)
where all(k, label == 'KNOWS')
project person = p, friend = f
| take 10
```

### LDBC_Financial

Purpose: Financial transaction analysis and fraud detection patterns.

```kusto
graph("LDBC_Financial")
| graph-match (account)-[t*1..3]->(target)
where all(t, label == 'TRANSFER')
project source_account = account, target_account = target
| take 10
```

### BloodHound_Entra

Purpose: Azure Active Directory privilege escalation and attack path analysis.

```kusto
graph("BloodHound_Entra")
| graph-match (user)-[path*1..4]->(resource)
project user_principal = user, accessed_resource = resource
| take 10
```

### BloodHound_AD

Purpose: On-premises Active Directory security analysis and privilege mapping.

```kusto
graph("BloodHound_AD")
| graph-match (user)-[path*1..4]->(resource)
project user_account = user, accessed_resource = resource
| take 10
```

## Related content

- [Graph semantics overview](./graph-semantics-overview.md)
- [Graph operators](./graph-operators.md)
- [Graph best practices](./graph-best-practices.md)
- [Persistent graph overview](../management/graph/graph-persistent-overview.md)
