---
ms.topic: include
ms.date: 08/12/2024
---
[Apache Kafka](http://kafka.apache.org/documentation/) is a distributed streaming platform for building real-time streaming data pipelines that reliably move data between systems or applications. [Kafka Connect](https://docs.confluent.io/3.0.1/connect/intro.html#kafka-connect) is a tool for scalable and reliable streaming of data between Apache Kafka and other data systems. The [Kusto Kafka Sink](https://github.com/Azure/kafka-sink-azure-kusto/blob/master/README.md) serves as the connector from Kafka and doesn't require using code. Download the sink connector jar from the [Git repo](https://github.com/Azure/kafka-sink-azure-kusto/releases) or [Confluent Connector Hub](https://www.confluent.io/hub/microsoftcorporation/kafka-sink-azure-kusto).

This article shows how to ingest data with Kafka, using a self-contained Docker setup to simplify the Kafka cluster and Kafka connector cluster setup.

For more information, see the connector [Git repo](https://github.com/Azure/kafka-sink-azure-kusto/blob/master/README.md) and [version specifics](https://github.com/Azure/kafka-sink-azure-kusto/blob/master/README.md#13-major-version-specifics).
