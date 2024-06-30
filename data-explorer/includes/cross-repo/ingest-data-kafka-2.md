---
ms.topic: include
ms.date: 06/19/2024
---

## Query and review data

### Confirm data ingestion

1. Wait for data to arrive in the `Storms` table. To confirm the transfer of data, check the row count:

    ```kusto
    Storms | count
    ```

1. Confirm that there are no failures in the ingestion process:

    ```kusto
    .show ingestion failures
    ```

    Once you see data, try out a few queries.

### Query the data

1. To see all the records, run the following [query](/azure/data-explorer/kusto/query/tutorials/learn-common-operators):

    ```kusto
    Storms
    ```

1. Use `where` and `project` to filter specific data:

    ```kusto
    Storms
    | where EventType == 'Drought' and State == 'TEXAS'
    | project StartTime, EndTime, Source, EventId
    ```

1. Use the [`summarize`](/azure/data-explorer/kusto/query/summarize-operator) operator:

    ```kusto
    Storms
    | summarize event_count=count() by State
    | where event_count > 10
    | project State, event_count
    | render columnchart
    ```

    :::image type="content" source="/azure/data-explorer/includes/media/ingest-data-kafka/kusto-query.png" alt-text="Screenshot of Kafka query column chart results in Azure Data Explorer.":::

For more query examples and guidance, see [Write queries in KQL](/azure/data-explorer/kusto/query/tutorials/learn-common-operators) and [Kusto Query Language documentation](/azure/data-explorer/kusto/query/index).

## Reset

To reset, do the following steps:

1. Stop the containers (`docker-compose down -v`)
1. Delete (`drop table Storms`)
1. Re-create the `Storms` table
1. Recreate table mapping
1. Restart containers (`docker-compose up`)

## Clean up resources

To delete the Azure Data Explorer resources, use [az cluster delete](/cli/azure/kusto/cluster#az-kusto-cluster-delete) or [az Kusto database delete](/cli/azure/kusto/database#az-kusto-database-delete):

```azurecli-interactive
az kusto cluster delete -n <cluster name> -g <resource group name>
az kusto database delete -n <database name> --cluster-name <cluster name> -g <resource group name>
```

## Tuning the Kafka Sink connector

Tune the [Kafka Sink](https://github.com/Azure/kafka-sink-azure-kusto/blob/master/README.md) connector to work with the [ingestion batching policy](/azure/data-explorer/kusto/management/batching-policy):

* Tune the Kafka Sink `flush.size.bytes` size limit starting from 1 MB, increasing by increments of 10 MB or 100 MB.
* When using Kafka Sink, data is aggregated twice. On the connector side data is aggregated according to flush settings, and on the Azure Data Explorer service side according to the batching policy. If the batching time is too short and no data can be ingested by both connector and service, batching time must be increased. Set batching size at 1 GB and increase or decrease by 100 MB increments as needed. For example, if the flush size is 1 MB and the batching policy size is 100 MB, after a 100-MB batch is aggregated by the Kafka Sink connector, a 100-MB batch will be ingested by the Azure Data Explorer service. If the batching policy time is 20 seconds and the Kafka Sink connector flushes 50 MB in a 20-second period - then the service will ingest a 50-MB batch.
* You can scale by adding instances and [Kafka partitions](https://kafka.apache.org/documentation/). Increase `tasks.max` to the number of partitions. Create a partition if you have enough data to produce a blob the size of the `flush.size.bytes` setting. If the blob is smaller, the batch is processed when it reaches the time limit, so the partition won't receive enough throughput. A large number of partitions means more processing overhead.
