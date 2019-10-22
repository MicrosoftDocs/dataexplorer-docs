---
title: Power BI and Kusto - Azure Data Explorer | Microsoft Docs
description: This article describes Power BI and Kusto in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 07/22/2019

---
# Power BI and Kusto

Power BI integration with Azure Data Explorer allows one to use Power BI to query and visualize
data stored by Azure Data Explorer, as long as the user has access to that data.

## Create a Power BI Dashboard based on Kusto data

Here's how you do it:
1. Open Kusto.Explorer and type in a query and run it. Make sure the results are what you were looking for.

2. Click on the `Query to Power BI` button in the top bar.

![alt text](./Images/KustoTools-PowerBI/step2.png "step2")

3. You should see the following notification:

![alt text](./Images/KustoTools-PowerBI/step3.png "step3")

4. Open Power BI Desktop(download from here: [https://powerbi.microsoft.com/desktop](https://powerbi.microsoft.com/desktop)). 
* Click the `Get Data` button.

![alt text](./Images/KustoTools-PowerBI/step4.png "step4")

5. Scroll down the list of sources and choose `Blank Query`.

![alt text](./Images/KustoTools-PowerBI/step5.png "step5")

6. Right click on the Query1 item and click `Advanced Editor`.

![alt text](./Images/KustoTools-PowerBI/step6.png "step6")

7. Paste the M query Kusto Explorer previously stored in the clipboard and click `Done`.

![alt text](./Images/KustoTools-PowerBI/step7.png "step7")

8. You'll be asked to authenticate. Click on `Edit Credentials` button.

![alt text](./Images/KustoTools-PowerBI/step8.png "step8")

9. Choose `Organizational account`, click `Sign-in`, complete the sign-in process and eventually connect.

![alt text](./Images/KustoTools-PowerBI/step9.png "step9")

10. If you completed the authentication successfully you should see the data.

11. Repeat steps #1-#10 to get more queries into the designer. You can rename the queries to more meaningful names.

12. Click the `Close & Load` button.

![alt text](./Images/KustoTools-PowerBI/step12.png "step12")

13. Only once you move to the `Report` tab the data is being loaded into the Power BI model.

![alt text](./Images/KustoTools-PowerBI/step13.png "step13")

14. You can create a report in the designer or you can build the a report later in Power BI portal.

15. Save the file to the local disk (`File->Save As`).

16. Open your browser an go to [https://app.powerbi.com](https://app.powerbi.com).

17. Click on `GetData` button.

![alt text](./Images/KustoTools-PowerBI/step17.png "step17")

18. Click on `Files`.

![alt text](./Images/KustoTools-PowerBI/step18.png "step18")

19. Choose `Local File`.

![alt text](./Images/KustoTools-PowerBI/step19.png "step19")

20. Locate your file and click `Open`

21. Congratulations! Now you can create reports and pin tiles to dashboards. For further Power BI reading, we recommend starting [here](https://docs.microsoft.com/en-us/power-bi/service-desktop-files)

22. If you wish to configure scheduled refresh for this dataset then:
* When asked to choose authentication type choose `oAuth2` and `Sign In`
* Choose connect directly option in Gateway conenction

    You can find more details on PowerBI scheduled refresh in the [following article](https://powerbi.microsoft.com/en-us/documentation/powerbi-refresh-scheduled-refresh). 

![alt text](./Images/KustoTools-PowerBI/step22.png "step22")

## Use Power BI to track your Kusto cluster

There are two options:

1. You can use the [Kusto Main Dashboard](https://msit.powerbi.com/groups/me/dashboards/e930ab4d-1a0a-49df-88c7-ca80d731896a)
   (which covers all Kusto clusters) and drill-down to your own cluster.
2. You can use the [Kusto - Ingestion and Usage Power BI Content Pack](https://msit.powerbi.com/groups/me/getdata/myorg/0f596762-70fd-43f1-b634-dcc3acc763fc)
   to get the data and tailor it to your own needs. 

## Create a Power BI Dashboard based on Kusto data

There are two options:

1. You can [use Kusto.Explorer to create your query](powerbi.md#create-a-power-bi-dashboard-based-on-kusto-data), and then copy it to Power BI. Use this option if you prefer working in [Kusto Explorer](../tools/kusto-explorer.md) and writing
[Kusto queries](../query/index.md) yourself.
2. You can [use the Power BI Kusto Connector (Preview)](powerbi-connector.md) to retrieve and manipulate your data
from within Power BI. Use this option if you prefer working in Power BI, without having to write Kusto queries.

## Use Query Parameters in Power BI Desktop

It"s possible to use Query Parameters in conjunction with Kusto query by manually editing the Power BI query copied from Kusto Explorer.

Say you have the following query:

    let Source = Json.Document(Web.Contents("...",[Query=[#"csl"="T | where Column == 'Text'",#"x-ms-app"="PowerQuery"], ...

and you define a parameter with the name "MyParameter", then you can use it by changing the query below to:
    
    let Source = Json.Document(Web.Contents("...",[Query=[#"csl"="T | where Column == '"&MyParameter&"'",#"x-ms-app"="PowerQuery"], ...

It"s easier to use the parameter in steps following the KustoQuery step, for example filtering rows based on the parameter.

For more details on how to use Query Parameters in Power BI Desktop read the [following article](https://powerbi.microsoft.com/en-us/blog/deep-dive-into-query-parameters-and-power-bi-templates/)

## Change the timeout of a Power BI query

When generating a Power BI query in Kusto Explorer, the timeout used in the query is taken from tools->options->connections->query server timeout. It's also possible to edit the generated query manually and change both client and server timeouts:

```
let KustoQuery = 
    let Source = Json.Document(Web.Contents("...",#"x-ms-app"="PowerQuery",#"properties"="{""Options"":{""servertimeout"":""00:04:00""}}"], Timeout=#duration(0,0,4,0)])),
    ...
in KustoQuery
```



## Limitations and known issues

There are a number of limitations and known issues one must consider when
using Power BI to query Kusto:

1. **Do not use Power BI to issue control commands to Kusto.**
   Power BI includes a data refresh scheduler, capable of periodically issuing
   queries against a data source (such as Kusto) with no user present. This mechanism
   should not be used to schedule control commands to Kusto, as Power BI assumes
   all queries are read-only (and therefore idempotent) and does not guarantee
   exactly-once queries.

2. **Power BI can only send short (&lt;2000) queries to Kusto.**
   If running a query in Power BI results in an error of: _"DataSource.Error: Web.Contents failed to get contents from..."_, most likely the reason is that the query is longer than 2000 characters. Power BI uses Power Query to query Kusto, and does so by issuing a HTTP GET
   request which encodes the query as part of the URI being retrieved. This means
   that Kusto queries issued by Power BI are limited to the maximum length of
   a request URI (2000 characters, minus some small offset). The workaround is
   to define a [stored function](../management/functions.md) in Kusto,
   and have Power BI use that function in the query.
   <br>(Why isn't HTTP POST used instead? Turns out Power Query currently
   only supports anonymous HTTP POST requests.)




## Using Query Parameters

You can use Query Parameters to modify your query dynamically:

1. Open the relevant query with the Advanced Editor 
2. Find the following section of the query:
   
   ```Query=[#"csl"="<<your query>>>"...```
   
   For example:

   ```Query=[#"csl"="StormEvents | where State == 'ALABAMA' | take 100"```

3. Replace the relevant part of the query with your parameter. Splitting the query into multiple parts, and concatenate them back using the & sign, along with the parameter.

   For example, in the query above, we'll take the ```State == 'ALABAMA'``` part, and split it to: ```State == '``` and ```'``` and we'll place the ```State``` parameter between them:
   
   ```Query=[#"csl"="StormEvents | where State == '" & State & " ' | take 100"```

4. If your query contains double-quotes, make sure to encode them correctly. For example, if we have the query: 

   ```"StormEvents | where State == "ALABAMA" | take 100"```

   If will appear in the Advanced Editor as (notice the 2 double-quotes):

   ```"StormEvents | where State == ""ALABAMA"" | take 100"```

   And it should be replaced with (notice the 3 double-quotes):

   ```"StormEvents | where State == """ & State """ | take 100"```