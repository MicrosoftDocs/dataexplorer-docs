---
ms.topic: include
ms.date: 07/07/2024
---

## Tuning the Kafka Sink connector

Tune the [Kafka Sink](https://github.com/Azure/kafka-sink-azure-kusto/blob/master/README.md) connector to work with the [ingestion batching policy](/azure/data-explorer/kusto/management/batching-policy):

* Tune the Kafka Sink `flush.size.bytes` size limit starting from 1 MB, increasing by increments of 10 MB or 100 MB.
* When using Kafka Sink, data is aggregated twice. On the connector side data is aggregated according to flush settings, and on the Azure Data Explorer service side according to the batching policy. If the batching time is too short and no data can be ingested by both connector and service, batching time must be increased. Set batching size at 1 GB and increase or decrease by 100 MB increments as needed. For example, if the flush size is 1 MB and the batching policy size is 100 MB, after a 100-MB batch is aggregated by the Kafka Sink connector, a 100-MB batch will be ingested by the Azure Data Explorer service. If the batching policy time is 20 seconds and the Kafka Sink connector flushes 50 MB in a 20-second period - then the service will ingest a 50-MB batch.
* You can scale by adding instances and [Kafka partitions](https://kafka.apache.org/documentation/). Increase `tasks.max` to the number of partitions. Create a partition if you have enough data to produce a blob the size of the `flush.size.bytes` setting. If the blob is smaller, the batch is processed when it reaches the time limit, so the partition won't receive enough throughput. A large number of partitions means more processing overhead.
