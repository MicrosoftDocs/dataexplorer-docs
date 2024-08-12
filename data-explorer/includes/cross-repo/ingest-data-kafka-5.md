---
ms.topic: include
ms.date: 08/12/2024
---

## Tuning the Kafka Sink connector

Tune the [Kafka Sink](https://github.com/Azure/kafka-sink-azure-kusto/blob/master/README.md) connector to work with the [ingestion batching policy](/azure/data-explorer/kusto/management/batching-policy):

* Tune the Kafka Sink `flush.size.bytes` size limit starting from 1 MB, increasing by increments of 10 MB or 100 MB.
* When using Kafka Sink, data is aggregated twice. On the connector side data is aggregated according to flush settings, and on the service side according to the batching policy. If the batching time is too short so data can't be ingested by both connector and service, batching time must be increased. Set batching size at 1 GB and increase or decrease by 100 MB increments as needed. For example, if the flush size is 1 MB and the batching policy size is 100 MB, the Kafka Sink connector aggregates data into a 100-MB batch. That batch is then ingested by the service. If the batching policy time is 20 seconds and the Kafka Sink connector flushes 50 MB in a 20-second period, then the service ingests a 50-MB batch.
* You can scale by adding instances and [Kafka partitions](https://kafka.apache.org/documentation/). Increase `tasks.max` to the number of partitions. Create a partition if you have enough data to produce a blob the size of the `flush.size.bytes` setting. If the blob is smaller, the batch is processed when it reaches the time limit, so the partition doesn't receive enough throughput. A large number of partitions means more processing overhead.
