---
ms.topic: include
ms.date: 02/15/2024
---

3. Configure the sink parameters such as database and table:

    ```java
    KustoWriteOptions kustoWriteOptions = KustoWriteOptions.builder()
        .withDatabase("<Database name>").withTable("<Table name>").build();
    ```

    You can add more options, as described in the following table:

    | Option                | Description                                            | Default Value   |
    |-----------------------|--------------------------------------------------------|------------------|
    | IngestionMappingRef   | References an existing [ingestion mapping](/azure/data-explorer/kusto/management/mappings).      |           |
    | FlushImmediately      | Flushes data immediately, and may cause performance issues. This method isn't recommended.  |
    | BatchIntervalMs       | Controls how often data is flushed.     | 30 seconds     |
    | BatchSize             | Sets the batch size for buffering records before flushing. | 1,000 records |
    | ClientBatchSizeLimit  | Specifies the size in MB of aggregated data before ingestion. | 300 MB |
    | PollForIngestionStatus | If true, the connector polls for ingestion status after data flush. | false |
    | DeliveryGuarantee     | Determines delivery guarantee semantics. To achieve exactly once semantics, use WriteAheadSink. | AT_LEAST_ONCE |

1. Write streaming data with one of the following methods:

   * **SinkV2**: This is a stateless option that flushes data on checkpoint, ensuring at least once consistency. We recommend this option for high-volume data ingestion.
   * **WriteAheadSink**: This method emits data to a KustoSink. It's integrated with Flink's checkpointing system and offers exactly once guarantees. Data is stored in an AbstractStateBackend and committed only after a checkpoint is completed.

    The following example uses SinkV2. To use WriteAheadSink, use the `buildWriteAheadSink` method instead of `build`:

    ```java
    KustoWriteSink.builder().setWriteOptions(kustoWriteOptions)
        .setConnectionOptions(kustoConnectionOptions).build("<Flink source datastream>" /*Flink source data stream, example messages de-queued from Kafka*/
        , 2 /*Parallelism to use*/);
    ```

The complete code should look something like this:

```java
import com.microsoft.azure.flink.config.KustoConnectionOptions;
import com.microsoft.azure.flink.config.KustoWriteOptions;

KustoConnectionOptions kustoConnectionOptions = KustoConnectionOptions.builder()
.setAppId("<Application ID>")
.setAppKey("<Application key>")
.setTenantId("<Tenant ID>")
.setClusterUrl("<Cluster URI>").build();

KustoWriteOptions kustoWriteOptions = KustoWriteOptions.builder()
    .withDatabase("<Database name>").withTable("<Table name>").build();

KustoWriteSink.builder().setWriteOptions(kustoWriteOptions)
    .setConnectionOptions(kustoConnectionOptions).build("<Flink source datastream>" /*Flink source data stream, example messages de-queued from Kafka*/
    , 2 /*Parallelism to use*/);
```

## Verify that data is ingested

Once the connection is configured, data is sent to your table. You can verify that the data is ingested by running a KQL query.

1. Run the following query to verify that data is ingested into the table:

    ```Kusto
    <MyTable>
    | count
    ```

1. Run the following query to view the data:

    ```Kusto
    <MyTable>
    | take 100
    ```
