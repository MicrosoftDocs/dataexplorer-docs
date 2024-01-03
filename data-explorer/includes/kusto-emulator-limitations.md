---
ms.service: azure
ms.topic: include
ms.date: 08/14/2022
---

## Limitations

In general, this offering isn't suited for production workloads.

- Provided *as-is*, without any support or warranties
- Doesn't provide any security features, including:
  - Authentication
  - Access control
  - Encrypted connections; connection is through an HTTP connection
  - Encryption at rest
- No managed pipelines, including:  
  - Event Hubs
  - IoT Hub
  - Event Grid
- No support for ingestion endpoints, including Kusto.Ingest SDKs
- No streaming ingestion
- Although ingested data can be stored externally to the container, we don't recommend persisting data for long periods of time for the following reasons:
  - There's no guarantee the [extent](../kusto/management/extents-overview.md) format will be compatible between versions of the Kusto emulator
  - Extents aren't [merged](../kusto/management/merge-policy.md) and therefore can become fragmented as data get ingested
  - Retention policies can be set but won't be honored
- The [Python plugin](../kusto/query/python-plugin.md?pivots=azuredataexplorer) isn't supported
