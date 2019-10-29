---
title: Kusto data in Excel - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto data in Excel in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# Kusto data in Excel

In addition to the ability to export query results to Excel, you can also add Kusto query as Excel data source for additional calculations or visualizations.

## Define Kusto query as Excel data source

Here's how you do it:

(1) Open Kusto.Explorer and type in a query and run it. Make sure the results are what you were looking for.

(2) Click on the `Query to Power BI` button in the top bar.

![alt text](./Images/KustoTools-PowerBI/step2.png "step2")

(3) You should see the following notification:

![alt text](./Images/KustoTools-PowerBI/step3.png "step3")

(4) In the "Data" tab in Excel click on "New Query" -> "From Other Data Sources" -> "Blank Query":

![alt text](./Images/KustoTools-Excel/ExcelMenu.png "ExcelMenu")

(5)  Click on the `Advanced Editor` menu button.

![alt text](./Images/KustoTools-Excel/AdvancedEditor.png "AdvancedEditor")

(6) Paste the M query Kusto Explorer previously stored in the clipboard and click `Done`.

![alt text](./Images/KustoTools-PowerBI/step7.png "step7")

(7) You'll be asked to authenticate. Click on `Edit Credentials` button.

![alt text](./Images/KustoTools-PowerBI/step8.png "step8")

(8) Choose `Organizational account`, click `Sign-in`, complete the sign-in process and eventually connect.

![alt text](./Images/KustoTools-PowerBI/step9.png "step9")

(9) Repeat steps #1-#8 to get more queries into the designer. You can rename the queries to more meaningful names.

(10) Click the `Close & Load` button.

![alt text](./Images/KustoTools-PowerBI/step12.png "step12")

(11) Congratulations! your data is now in Excel, you can refresh the query by using the `Refresh` button:

![alt text](./Images/KustoTools-Excel/ExcelData.png "ExcelData")