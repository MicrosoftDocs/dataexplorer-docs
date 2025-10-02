---
ms.service: azure
ms.topic: include
ms.date: 10/01/2025
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
- The dedicated ingestion endpoint (that is, `https://ingest-<YourClusterName><Region>.kusto.windows.net`) and the Kusto. Ingest APIs that depend on it aren't supported
- Although ingested data can be stored externally to the container, we don't recommend persisting data for long periods of time for the following reasons:
  - There's no guarantee the [extent](/kusto/management/extents-overview?view=azure-data-explorer&preserve-view=true) format or the metadata format are compatible between versions of the Kusto emulator
  - Extents aren't [merged](/kusto/management/merge-policy?view=azure-data-explorer&preserve-view=true) and therefore can become fragmented as data get ingested
  - Retention and partitioning policies can be set but aren't honored
- The [Python plugin](/kusto/query/python-plugin?view=azure-data-explorer&preserve-view=true?view=azure-data-explorer&preserve-view=true) isn't supported
