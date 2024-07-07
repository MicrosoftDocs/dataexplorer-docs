---
ms.topic: include
ms.date: 07/07/2024
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
