---
title: Graph model policies in Kusto
description: This article describes the policies associated with graph models in Kusto
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/27/2025
---

# Graph model policies (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

This article describes the policies that can be applied to Graph models in Kusto.

## Caching policy

The caching policy determines how Graph models are cached in memory for query execution. Caching improves query performance at the cost of increased memory usage.

### Setting the caching policy

```kusto
.alter graph model <graph_model_name> policy caching hot = <timespan>
```

Where:
- `<graph_model_name>` is the name of the Graph model
- `<timespan>` is the duration for which the Graph model should remain in hot cache (e.g., `7d` for 7 days)

### Caching policy options

The caching policy supports the following options:

| Option | Default | Description |
|--------|---------|-------------|
| `hot` | `1d` (1 day) | The period for which the Graph model remains in the hot cache after being accessed |
| `dataHotSpan` | `null` | If not null, the lookback period from the current time for which source data is kept hot |

### Examples

```kusto
// Set a graph model to remain in hot cache for 14 days
.alter graph model UserInteractions policy caching hot = 14d

// Set data hot span policy to keep last 7 days of source data hot
.alter graph model UserInteractions policy caching dataHotSpan = 7d
```

### Clearing the caching policy

To clear the caching policy and revert to default settings:

```kusto
.delete graph model <graph_model_name> policy caching
```

## Retention policy

The retention policy determines how long a Graph model is kept in the database before being automatically deleted.

### Setting the retention policy

```kusto
.alter graph model <graph_model_name> policy retention soft_delete_period = <timespan>
```

Where:
- `<graph_model_name>` is the name of the Graph model
- `<timespan>` is the duration for which the Graph model should be retained before being automatically deleted (e.g., `365d` for 365 days)

### Retention policy options

The retention policy supports the following options:

| Option | Default | Description |
|--------|---------|-------------|
| `soft_delete_period` | `null` (unlimited) | The period for which a Graph model is retained before being automatically deleted |

### Examples

```kusto
// Set a graph model to be retained for 90 days
.alter graph model TemporaryAnalysis policy retention soft_delete_period = 90d
```

### Clearing the retention policy

To clear the retention policy and revert to unlimited retention:

```kusto
.delete graph model <graph_model_name> policy retention
```

## Auto refresh policy

The auto refresh policy allows Graph models to be automatically rebuilt at specified intervals using their definition queries.

### Setting the auto refresh policy

```kusto
.alter graph model <graph_model_name> policy auto_refresh frequency = <timespan>
```

Where:
- `<graph_model_name>` is the name of the Graph model
- `<timespan>` is the interval between automatic refreshes (e.g., `1d` for daily refresh)

### Auto refresh policy options

The auto refresh policy supports the following options:

| Option | Default | Description |
|--------|---------|-------------|
| `frequency` | `null` (disabled) | The interval between automatic refreshes |
| `disable_affected_policies` | `false` | If set to `true`, disables the auto refresh during cluster outages or other issues |

### Examples

```kusto
// Set a graph model to auto-refresh daily
.alter graph model DailyUserGraph policy auto_refresh frequency = 1d

// Set auto-refresh every 12 hours with affected policy disabling
.alter graph model ActiveUserGraph policy auto_refresh frequency = 12h, disable_affected_policies = true
```

### Clearing the auto refresh policy

To clear the auto refresh policy and disable automatic refreshes:

```kusto
.delete graph model <graph_model_name> policy auto_refresh
```

## Related content

* [Graph model overview](graph-model-overview.md)
* [Graph model limitations](graph-model-limitations.md)
* [.create graph model](graph-model-create.md)
* [.show graph model policies](graph-model-show-policies.md)