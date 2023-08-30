---
title: Use Dynamic M query parameters with Azure Data Explorer for Power BI
description: In this article, you'll learn how to filter data in a dynamic M query linked to a KQL function.
ms.reviewer: gabil
ms.topic: how-to
ms.date: 09/12/2022
---

# Use Dynamic M query parameters with Azure Data Explorer for Power BI

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Power BI is a business analytics solution that lets you visualize your data and share the results across your organization. With [Dynamic M parameters](/power-bi/connect-data/desktop-dynamic-m-query-parameters), you can create Power BI reports that give viewers the ability to use filters or slicers to set values for KQL query parameters.

In this article, you'll start with a new Power BI project and use the sample data to create a report that uses a slicer to filter data, in a dynamic M query linked to a KQL function.

## Prerequisites

You need the following to complete this article:

* A Microsoft account or an Azure Active Directory user identity to sign in to the [help cluster](https://dataexplorer.azure.com/clusters/help/databases/Samples).
* [Power BI Desktop](https://powerbi.microsoft.com/get-started/) (select **DOWNLOAD FREE**)
* [Enabling Dynamic M query parameters](/power-bi/connect-data/desktop-dynamic-m-query-parameters#enabling-dynamic-m-query-parameters)

## Add direct query connection to KQL function

First, set up a connector for Power BI.

1. In Power BI Desktop, on the **Home** tab, select **Get Data** then **More**.

    :::image type="content" source="media/power-bi-dynamic-m/get-data-more.png" alt-text="Screenshot of Get data menu, showing get more option.":::

1. Search for *Azure Data Explorer*, select **Azure Data Explorer** then **Connect**.

    :::image type="content" source="media/power-bi-dynamic-m/search-get-data.png" alt-text="Screenshot of search screen, showing the selection of the connector.":::

1. On the connector screen, fill out the form with the following information.

    :::image type="content" source="media/power-bi-dynamic-m/cluster-database-table.png" alt-text="Screenshot of the connect screen, showing the cluster, database, and table options.":::

    | Setting | Value | Field description
    |---|---|---
    | Cluster | *https://help.kusto.windows.net* | The URL for the help cluster. For other clusters, the URL is in the form *https://\<ClusterName\>.\<Region\>.kusto.windows.net*. |
    | Database | Leave blank | A database that is hosted on the cluster you're connecting to. We'll select this in a later step. |
    | Table name | Leave blank | One of the tables in the database, or a query like `StormEvents | take 1000`. We'll select this in a later step. |
    | Advanced options | Leave blank | Options for your queries, such as result set size.
    | Data connectivity mode | *DirectQuery* | Determines whether Power BI imports the data or connects directly for Dynamic M queries. |

    > [!NOTE]
    > In **Import** mode, data is moved to Power BI. In **DirectQuery** mode, data is queried directly from your cluster.
    >
    > Use **Import** mode when:
    >
    > * Your dataset is small.
    > * You don't need near real-time data.
    > * Your data is already aggregated or you perform [aggregation in Kusto](./kusto/query/aggregation-functions.md)
    >
    > Use **DirectQuery** mode when:
    >
    > * Your dataset is very large.
    > * You need near real-time data.

    **Advanced options**

    | Setting | Sample value | Field description
    |---|---|---
    | Limit query result record number| `300000` | The maximum number of records to return in the result |
    | Limit query result data size | `4194304` | The maximum data size in bytes to return in the result |
    | Disable result set truncation | `true` | Enable/disable result truncation by using the notruncation request option |
    | Additional set statements | `set query_datascope=hotcache` | Sets query options for the duration of the query. Query options control how a query executes and returns results. |

1. If you don't already have a connection to the help cluster, sign in. Sign in with an organizational account, then select **Connect**.

    :::image type="content" source="media/power-bi-dynamic-m/sign-in.png" alt-text="Screenshot of the authentication screen, showing the sign in option.":::

1. On the **Navigator** screen, do the following:
    1. Expand the **Samples** database.
    1. Select the **EventsByStates** function.
    1. For **EventTypeParam**, enter *High Wind*, and then select **Apply** to preview the data.
    1. Select **Transform Data**.

    :::image type="content" source="media/power-bi-dynamic-m/select-function.png" alt-text="Screenshot of Navigation screen, showing the selection of a function.":::

    The function opens as a dynamic M query in Power Query Editor, where we proceed to create a parameter to use with the dynamic M query.

    > [!NOTE]
    > The EventsByStates function is a read only sample function that you can use to test the functionality of the Dynamic M query parameters. It defines the final version which supports multiple and select all values for the parameter. If you want to test the single selection functionality in your own cluster and progressively test the functionality, you can start with the following single selection definition of the function.
    >
    > ```kusto
    > .create-or-alter function EventsByStates (EventTypeParam:string)
    > {
    >   StormEvents
    >   | where EventType == EventTypeParam
    >   | summarize Events=count() by EventType, State
    > }
    > ```

1. In the Power Query Editor, do the following:
    1. Select **Manage Parameters** > **New Parameter**.
    1. Fill out the details with the following information, and then select **OK**.

        | Setting |Suggested value | Description |
        | --- | --- | --- |
        | Name | *Type_Param* | The name of the parameter. We recommend adding a suffix, such as *_Param*, that lets you easily recognize and differentiate it from other parameters you might create. |
        | Type | *Text* | The type of the parameter. The type of the parameter must match the type declared in the KQL function. Text in Power BI is equivalent to string in KQL. |
        | Current Value | *High Wind* | The value of the parameter. You must provide a default value for this field. |

    :::image type="content" source="media/power-bi-dynamic-m/new-parameter.png" alt-text="Screenshot of Manage Parameters screen, showing the creation of a new parameter.":::

1. Back on the **Navigation** screen, replace the M function's parameter value with the new parameter.

    :::image type="content" source="media/power-bi-dynamic-m/replace-function-parameter.png" alt-text="Screenshot of Navigation screen, showing the replacement of the M function parameter.":::

1. Optionally, repeat the steps to create more parameters and replace them in the Dynamic M query.

1. Create a table with values for the report slicer.

    > [!NOTE]
    > The table will list the event types that you want to filter by. You can either import the table or create a new table and manually enter the data.

    1. On the **Home** tab, select **Recent Sources**, and then select the help cluster.

        :::image type="content" source="media/power-bi-dynamic-m/select-help-cluster.png" alt-text="Screenshot of Home screen, showing the selection of the help cluster.":::

    1. On the **Navigator** screen, expand the **Samples** database, select the **StormEvents** table, and then select **OK**.

        :::image type="content" source="media/power-bi-dynamic-m/select-table.png" alt-text="Screenshot of Navigation screen, showing the selection of a table.":::
    1. On the **Connection Settings** dialog box, select **Import**, and then select **OK**.

        :::image type="content" source="media/power-bi-dynamic-m/connect-with-import.png" alt-text="Screenshot of Connection Settings dialog box, showing the selection of the import option.":::

    1. Right-click the **EventType** column, and then select **Remove Other Columns**.
    1. Right-click the **EventType** column again, and then select **Remove Duplicates**.
    1. Optionally add another column to define the [sort order](/power-bi/create-reports/desktop-sort-by-column) for the slicer values.
    1. Rename the table to *SlicerValues*.

        :::image type="content" source="media/power-bi-dynamic-m/rename-table.png" alt-text="Screenshot of the table, showing the Slicer Values table.":::

1. On the **Home** tab, select **Close & Apply**.

    > [!NOTE]
    > A dialog box warning about security risk appears. Click **OK** to continue.
    > The reason the dialog appears is because Power BI is adding a second data source. For more information, see [Power BI Desktop privacy levels](/power-bi/admin/desktop-privacy-levels).  However, the way the data sources are used in this example is perfectly safe.

1. Bind the **EventType** column in the **SlicerValues** table to the parameter.
    1. Select the **Model** view on the left.
    1. In the **SlicerValues** table, select the **EventType** column.
    1. In the **Properties** pane, expand **Advanced**.
    1. Under **Bind to Parameter**, select **Type_Param**. This binds the **EventType** column to the parameter.

    > [!NOTE]
    > A dialog box warning about security risk appears. Click **Continue** to continue.
    > The reason the dialog appears is because Power BI is sending data from one source to another. For more information, see [Power BI Desktop privacy levels](/power-bi/admin/desktop-privacy-levels).  However, the way the parameter is used in this example is perfectly safe.

    :::image type="content" source="media/power-bi-dynamic-m/bind-parameter.png" alt-text="Screenshot of Model View, showing the binding of the EventType column to the parameter.":::

## Visualize data in a report

Now that you have data in Power BI Desktop, you can create reports based on that data. You'll create a simple report with a table showing the summary of events by state and a slicer to filter the table by event type.

1. Select the **Report** view on the left.
1. Add the table to the report.
    1. In the **Visualization** pane, select **Table**. A blank table is added to the report canvas.
    1. In the **Fields** pane, expand **EventsByStates**, and select **State** and **Events**. You now have a table showing the summary of events by state.
1. Add the slicer to the report.
    1. In the **Visualization** pane, select **Slicer**. A blank slicer is added to the report canvas.
    1. In the **Fields** pane, expand **SlicerValues**, and select **EventType**. You now have a slicer showing the event types.

    :::image type="content" source="media/power-bi-dynamic-m/report-single-select.png" alt-text="Screenshot of Report View, showing the table and related slicer.":::

    The report is now ready to be viewed. Notice that when selecting event type values in the slicer, the table based on the M query is filtered by the event type that is bound to the M query's parameter.

1. Save the report.

### Accepting multiple parameter values

If you want filter on multiple parameter values in the slicer, you can achieve this by adjusting the properties of the **EventType** column and modifying the KQL function, as follows:

1. Adjust the properties of the **EventType** column in the **SlicerValues** table.
    1. Select the **Model** view on the left.
    1. In the **SlicerValues** table, select the **EventType** column.
    1. In the **Properties** pane, expand **Advanced**, and turn on the **Multi-select** setting.

    :::image type="content" source="media/power-bi-dynamic-m/multiple-select.png" alt-text="Screenshot of Model View, showing the multi-select setting.":::

1. Modify the KQL function, setting the parameter type to dynamic and changing the `where` condition to check the list of parameter values.

    ```kusto
    .create-or-alter function EventsByStates (EventTypeParam:dynamic)
    {
      StormEvents
      | where EventType in (EventTypeParam)
      | summarize Events=count() by EventType, State
    }
    ```

You can now head back to the report and select multiple event types in the slicer.

### Accepting all parameter values

If you want filter on all parameter values in the slicer, you can achieve this by adjusting the properties of the **EventType** column, modifying the KQL function, and updating the slicer control, as follows:

1. Adjust the properties of the **EventType** column in the **SlicerValues** table.
    1. Select the **Model** view on the left.
    1. In the **SlicerValues** table, select the **EventType** column.
    1. In the **Properties** pane, expand **Advanced**, and turn on the **Select all** setting.
    1. Optionally, change the **Select all value** setting. In this example, you'll use the default value of *__SelectAll__*.

    :::image type="content" source="media/power-bi-dynamic-m/select-all.png" alt-text="Screenshot of Model View, showing the select all setting.":::

1. Update the slicer control to show the **Select all** option.
    1. Select the **Report** view on the left.
    1. Select the EventType slicer.
    1. In the **Visualizations** pane, select **Format**, expand **Selection controls**, and turn on the **Show "Select all" option** setting. The event type slicer shows the select all option at the top of the list.

1. Modify the KQL function, setting the parameter type to dynamic and changing the `where` condition to check for the *__SelectAll__* value or the list of parameter values.

    ```kusto
    .create-or-alter function EventsByStates (EventTypeParam:dynamic)
    {
      StormEvents
      | where ("__SelectAll__" in (EventTypeParam)) or (EventType in (EventTypeParam))
      | summarize Events=count() by EventType, State
    }
    ```

You can now head back to the report and select all event types in the slicer.

:::image type="content" source="media/power-bi-dynamic-m/slicer-select-all.png" alt-text="Screenshot of Report View, showing the slicer with the select all option.":::

## Considerations and limitations

There are some considerations and limitations to consider when using dynamic M query parameters:

* A single parameter can't be bound to multiple fields nor vice-versa.
* The following parameter types aren't supported:
    * Any
    * Duration
    * True / False
    * Binary
* The following filters aren't supported:
    * Relative time slicer or filter
    * Relative date
    * Hierarchy slicer
    * Multi-field include filter
    * Exclude filter / Not filters
    * Cross-highlighting
    * Drill-down filter
    * Cross drill filter
    * Top N filter

## Clean up resources

If you no longer need the report you created for this article, delete the Power BI Desktop (.pbix) file.

## Next steps

[Tips for using the Azure Data Explorer connector for Power BI to query data](power-bi-best-practices.md#tips-for-using-the-azure-data-explorer-connector-for-power-bi-to-query-data)
