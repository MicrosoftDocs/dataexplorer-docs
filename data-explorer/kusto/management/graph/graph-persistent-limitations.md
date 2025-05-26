---
title: Persistent graph limitations in Kusto
description: Learn about the current limitations of the persistent graph feature in Kusto, including snapshot limits and creation time constraints.
ms.reviewer: herauch
ms.topic: reference
ms.date: 05/24/2025
---

# Persistent graph limitations (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in Public Preview. Functionality and syntax are subject to change before General Availability.

This article describes the current limitations of graph models and snapshots in Kusto.

## Snapshot limitations

Persistent graphs in Kusto have the following limitations:

- **Regular database limit**: Maximum of 5,000 graph snapshots per database
- **Free virtual cluster limit**: Maximum of 500 graph snapshots per database
- **Snapshot creation time**: Limited to 1 hour

## Next steps

- [Graph model overview](graph-model-overview.md)
- [.create graph model](graph-model-create.md)
- [.alter graph model](graph-model-alter.md)
