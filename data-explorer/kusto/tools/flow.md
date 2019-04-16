---
title: Microsoft Flow Azure Kusto Connector (Preview) - Azure Data Explorer | Microsoft Docs
description: This article describes Microsoft Flow Azure Kusto Connector (Preview) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 04/15/2019
---
# Microsoft Flow Azure Kusto Connector (Preview)

The Microsoft Flow Azure Kusto connector allows users to run Kusto queries and commands automatically as part of a scheduled or triggered task, using [Microsoft Flow](https://flow.microsoft.com/).

Common usage scenarios include:

* Sending daily reports containing tables and charts
* Setting notifications based on query results
* Scheduling control commands on clusters
* Exporting and importing data between Azure Data Explorer and other databases 

## Limitations

1. Results returned to the client are limited to 500,000 records. The overall memory for those records cannot exceed 64 MB and 7 minutes execution time.
2. Currently, the connector does not support the [fork](../query/forkoperator.md) and [facet](../query/facetoperator.md) operators.
3. Flow works best on Internet Explorer and Chrome.

##  Login 

1. Login to [Microsoft Flow](https://flow.microsoft.com/).

1. When connecting to the Azure Kusto connector for the first time, you will be prompted to sign in.

1. Click on the **Sign in** button and enter your credentials to start using Azure Kusto Flow.

![alt text](./Images/KustoTools-Flow/flow-signin.png "flow-signin")

## Authentication

Authentication to Azure Kusto Flow connector can be performed using user credentials or an AAD application.



### AAD Application Authentication

You can authenticate to Azure Kusto Flow with an AAD application using the following steps:

> Note: Make sure your application is an [AAD application](../management/access-control/how-to-provision-aad-app.md) and is authorized to execute queries on your cluster.

1. Click the three dots at the top right of the Azure Kusto connector:
![alt text](./Images/KustoTools-Flow/flow-addconnection.png "flow-addconnection")

1. Select "Add new connection" and then click on 'Connect with Service Principal'.
![alt text](./Images/KustoTools-Flow/flow-signin.png "flow-signin")

1. Fill in the application ID, application key and tenant ID.

For example, Microsoft tenant ID is: 72f988bf-86f1-41af-91ab-2d7cd011db47.
The Connection Name value is a string of your choice meant for recognizing the new connection added.
![alt text](./Images/KustoTools-Flow/flow-appauth.png "flow-appauth")

Once authentication is completed, you would be able to see that your flow is using the new connection added.
![alt text](./Images/KustoTools-Flow/flow-appauthcomplete.png "flow-appauthcomplete")

From now on this flow will run using the application credentials.

## Find the Azure Kusto connector

To use the Azure Kusto connector you need to first add a trigger. 
A trigger can be defined based on a recurring time period or as response to a previous flow action.

1. [Create a new flow.](https://flow.microsoft.com/manage/flows/new)
2. Add 'Schedule - Recurrence' as the first step.
3. Type 'Azure Kusto' in the search box of the second step.

Now you should be able to see 'Azure Kusto' as seen in the image below.

![alt text](./Images/KustoTools-Flow/flow-actions.png "flow-actions")

## Azure Kusto Flow Actions

When searching for the Azure Kusto connector in Flow, you will see 3 possible actions you can add to your flow.

The following section describes the capabilities and parameters for each Azure Kusto Flow action.

![alt text](./Images/KustoTools-Flow/flow-actions.png "flow-actions")

### Azure Kusto - Run query and visualize results

> Note: If your query starts with a dot (meaning it's a [control command](../management/index.md)) please use [Run control command and visualize results](./flow.md#azure-kusto---run-control-command-and-visualize-results)

To visualize Kusto query result as a table or as a chart, you can use the 'Azure Kusto - Run query and visualize results' action. 
The results of this action can be later sent over email. You could use this flow, for instance, in case you would like to get daily ICM reports. 

![alt text](./Images/KustoTools-Flow/flow-runquery.png "flow-runquery")

In this example the results of the query are returned as an HTML table.

### Azure Kusto - Run control command and visualize results

Similar to the 'Azure Kusto - Run query and visualize results' action, you can also run a [control command](../management/index.md) using the 'Azure Kusto - Run control command and visualize results' action.
The results of this action can be later sent over email as a table or a chart.

![alt text](./Images/KustoTools-Flow/flow-runcontrolcommand.png "flow-runcontrolcommand")

In this example the results of the control command are rendered as a pie chart.

### Azure Kusto - Run query and list results

> Note: In case your query starts with a dot (meaning it's a [control command](../management/index.md)) please use [Run control command and visualize results](./flow.md#azure-kusto---run-control-command-and-visualize-results)

This action sends a query to Kusto cluster. The actions that are added afterwards iterate over each line of the results of the query.

The following example triggers a query every minute and sends an email based on the query results. The query checks the number of lines in the database, and then sends an email only if the number of lines is greater than 0. 

![alt text](./Images/KustoTools-Flow/flow-runquerylistresults.png "flow-runquerylistresults")

Note that in case the column has several lines, the following connector would run for each line in the column.

## Email Kusto query results

To send email reports do the following steps: 

![alt text](./Images/KustoTools-Flow/flow-sendemail.png "flow-sendemail")

1. Click '+ New step', then 'Add an action'.
2. In the search box, enter 'Office 365 Outlook - Send an email'.
3. Set the 'To' to your email address, the 'Subject' to some text, and add 'Body' from dynamic content to the 'Body' field.
4. Click 'Advanced options' add 'Attachment Name' to the 'Attachments Name' field, 'Attachment Content' to the 'Attachments Content' field and make sure that 'Is HTML' is set to 'Yes'.
5. At the top bar, set the 'Flow name' for this flow.
6. Click 'Create flow' and you're done!

## How to make sure flow succeeded?

Go to [Microsoft Flow Home Page](https://flow.microsoft.com/), click on [My flows](https://flow.microsoft.com/manage/flows) and then click on the i button.

![alt text](./Images/KustoTools-Flow/flow-myflows.png "flow-myflows")

All flow runs are listed with status, start time and duration.

![alt text](./Images/KustoTools-Flow/flow-runs.png "flow-runs")

When opening the last run of the flow, if all steps of the flow are marked with a green V then the flow ended successfully.
Otherwise, expand the step that was marked with a red exclamation mark to view error details.

![alt text](./Images/KustoTools-Flow/flow-failed.png "flow-failed")

Some errors can be easily solved on your own, for example query syntax errors:

![alt text](./Images/KustoTools-Flow/flow-syntaxerror.png "flow-syntaxerror")



## Having a Timeout Exception?

Your flow can fail and return "RequestTimeout" exception if it runs more than 7 minutes.

Notice that 7 minutes is the maximum time flow queries can run before there will be a timeout exception.

[Click here](#limitations) to see Microsoft Flow limitations.

The same query may run successfully in Kusto Explorer where the time is not limited and can be changed.

The "RequestTimeout" exception is shown in the image below:

![alt text](./Images/KustoTools-Flow/flow-requesttimeout.png "flow-requesttimeout")

To fix the issue you can follow these steps:
1. Read more about [Query best practices](../query/best-practices.md).
2. Try to make your query more efficient in order to make it run faster, or separate it into chunks, each chunk can run on a different part of the query.

## Usage Examples

This section contains several common examples of using the Azure Kusto Flow connector.

### Example 1 - Azure Kusto Flow and SQL

You can use Azure Kusto flow to query the data and then accumulate it into an SQL DB. 
> Note: SQL insert is being  done seperately per row, please use this only for low amounts of output data. 

![alt text](./Images/KustoTools-Flow/flow-sqlexample.png "flow-sqlexample")

### Example 2 - Push data to Power BI dataset

Azure Kusto Flow connector can be used together with the Power BI connector to push data from Kusto queries to Power BI streaming datasets.

To begin, create a new 'Kusto - Run query and list results' action.

![alt text](./Images/KustoTools-Flow/flow-listresults.png "flow-listresults")

Click on 'New step', select 'Add an action' and search for 'Power BI'. Click on 'Power BI - Add rows to a dataset'. 

![alt text](./Images/KustoTools-Flow/flow-powerbiconnector.png "flow-powerbiconnector")

Fill in the Workspace, Dataset and Table to which data will be pushed.
Add a Payload containing your dataset schema and the relevant Kusto query results from the dynamic content window. 

![alt text](./Images/KustoTools-Flow/flow-powerbifields.png "flow-powerbifields")

Note that Flow will automatically apply the Power BI action for each row of the Kusto query result table. 

![alt text](./Images/KustoTools-Flow/flow-powerbiforeach.png "flow-powerbiforeach")

### Example 3 - Conditional Queries

The results of Kusto queries can be used as input or conditions for the next Flow actions.

In the following example, we query Kusto for incidents occurred in the last day. For each incident resolved, we post a slack message about it and create a push notification.
For each incident that is still active we query Kusto for more information about similar incidents, send that information as an email and open a related TFS task.

Follow these instructions to create a similar Flow.

Create a new 'Kusto - Run query and list results' action.
Click on 'New step' and select 'Add a condition' 

![alt text](./Images/KustoTools-Flow/flow-listresults.png "flow-listresults")

Choose from the dynamic content window the parameter you want to use as a condition for next actions.
Select the type of Relationship and Value to set a specific condition on the given parameter.

![alt text](./Images/KustoTools-Flow/flow-condition.png "flow-condition")

Note that Flow will apply this condition on each row of the query result table.

Add actions for when the condition is true and false.

![alt text](./Images/KustoTools-Flow/flow-conditionactions.png "flow-conditionactions")

You can use result values from the Kusto query as input for the next actions by selecting them from the dynamic content window.
Below we added 'Slack - Post Message' action and 'Visual Studio - Create a new work item' action containing data from the Kusto query.

![alt text](./Images/KustoTools-Flow/flow-slack.png "flow-slack")

![alt text](./Images/KustoTools-Flow/flow-visualstudio.png "flow-visualstudio")

In this example, if an incident is still active we query Kusto again to get information on how incidents from the same source were solved in the past.

![alt text](./Images/KustoTools-Flow/flow-conditionquery.png "flow-conditionquery")

We visualize this information as a pie chart and email it to our team.

![alt text](./Images/KustoTools-Flow/flow-conditionemail.png "flow-conditionemail")

### Example 4 - Email multiple Azure Kusto Flow charts

Create a new Flow with "Recurrence" trigger, and define the interval of the Flow and the frequency. 

Add a new step, with one or more 'Kusto - Run query and visualize results' actions. 

![alt text](./Images/KustoTools-Flow/flow-severalqueries.png "flow-severalqueries")

For each 'Kusto - Run query and visualize result' define the following fields:

Cluster Name, Database Name, Query and Chart Type (Html Table/ Pie Chart/ Time Chart/ Bar Chart/ Enter Custom Value).

![alt text](./Images/KustoTools-Flow/flow-visualizeresultsmultipleattachments.png "flow-visualizeresultsmultipleattachments")

After finishing with 'Kusto - Run query and visualize result' actions, add "Send an email" action. 

Make sure to insert in the "Body" field the required body, in order to attach the visualize result of the query to the body of the email.
In addition, in order to add an attachment to the email, add 'Attachment Name' and 'Attachment Content'.

Make sure to select "Yes" under "is HTML" field.

![alt text](./Images/KustoTools-Flow/flow-emailmultipleattachments.png "flow-emailmultipleattachments")

Results:

![alt text](./Images/KustoTools-Flow/flow-resultsmultipleattachments.png "flow-resultsmultipleattachments")

![alt text](./Images/KustoTools-Flow/flow-resultsmultipleattachments2.png "flow-resultsmultipleattachments2")

### Example 5 - Send a different email to different contacts

You can leverage Azure Kusto Flow to send different customized emails to different contacts. The email addresses as well as the email contents are a result of a Kusto query.

See example below:

![alt text](./Images/KustoTools-Flow/flow-dynamicemailkusto.png "flow-dynamicemailkusto")

![alt text](./Images/KustoTools-Flow/flow-dynamicemail.png "flow-dynamicemail")

### Example 6 - Create Custom HTML Table

You can leverage Azure Kusto Flow to create and use custom HTML elements such as a custom HTML table.

The following example demonstrates how to create a custom HTML table. The HTML table will have its rows colored by log level (the same as in the Kusto Explorer).

Follow these instructions to create a similar Flow:

Create a new 'Kusto - Run query and list results' action.

![alt text](./Images/KustoTools-Flow/flow-listresultforhtmltable.png "flow-listresultforhtmltable")

Loop over the query results and create the HTML table body. Firstly, create a variable which will hold the HTML string - click on 'New step', select 'Add an action' and search for 'Variables'. Click on 'Variables - Initialize variable'. Initialize a string variable as follows:

![alt text](./Images/KustoTools-Flow/flow-initializevariable.png "flow-initializevariable")

Loop over the results - click on 'New step' and choose 'Add an action'. Search for 'Variables'. Select 'Variables - Append to string variable'. Choose the variable name that you initialized before, and create your HTML table rows using the query results. When choosing the query results, 'Apply to each' is automaitcally added.

In the example below, the following if expression is used to define the style of each row:

if(equals(items('Apply_to_each')?['Level'], 'Warning'), 'Yellow', if(equals(items('Apply_to_each')?['Level'], 'Error'), 'red', 'white'))

![alt text](./Images/KustoTools-Flow/flow-createhtmltableloopcontent.png "flow-createhtmltableloopcontent")

Finally, create the full HTML content. Add a new action outside 'Apply to each'. In the following example the action used is 'Send an email'. Define your HTML table using the variable from the previous steps. If you are sending an email, click on 'Show advanced options' and choose 'Yes' under 'Is HTML'

![alt text](./Images/KustoTools-Flow/flow-customhtmltablemail.png "flow-customhtmltablemail")

and here is the result:

![alt text](./Images/KustoTools-Flow/flow-customhtmltableresult.png "flow-customhtmltableresult")






