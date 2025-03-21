---
title:  Common tasks with KQL for Microsoft Sentinel
description:  This article describes commonly used tasks in Kusto Query Language (KQL) when working with Microsoft Sentinel.
ms.topic: concept-article
ms.reviewer: batamig
ms.date: 01/20/2025
monikerRange: "microsoft-sentinel"
#Customer intent: As a security analyst, I want to learn how to perform commonly used tasks with Kusto Query Language so that I can effectively analyze and manipulate data in Microsoft Sentinel for threat detection and incident response.

---
# Common tasks with KQL for Microsoft Sentinel

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [sentinel](../../includes/applies-to-version/sentinel.md)]

Kusto Query Language (KQL) is a powerful tool for querying and analyzing data in Microsoft Sentinel. As a security analyst, mastering KQL can significantly enhance your ability to detect threats and respond to incidents effectively. This article provides a comprehensive guide to performing common tasks with KQL, helping you to manipulate and analyze data efficiently.

In this tutorial, we cover the basics of KQL, including understanding query structure, getting, limiting, sorting, and filtering data, summarizing data, and joining tables. Additionally, we explore advanced concepts such as using the `evaluate` operator and `let` statements to create more complex and maintainable queries.

## Prerequisites

Before reading this article, make sure that you've familiarized yourself with the basics of Kusto Query Language (KQL). If you're new to KQL, see:

* [Kusto Query Language (KQL) overview](../index.md)
* [Syntax conventions for reference documentation](../syntax-conventions.md)
* [Scalar data types](../scalar-data-types/index.md)
* [Demo environment](../kql-learning-resources.md#demo-environment)

## Understanding query structure basics

A good place to start learning Kusto Query Language is to understand the overall query structure. The first thing you notice when looking at a Kusto query is the use of the pipe symbol (` | `). The structure of a Kusto query starts with getting your data from a data source and then passing the data across a "pipeline," and each step provides some level of processing and then passes the data to the next step. At the end of the pipeline, you get your final result. In effect, this is our pipeline:

`Get Data | Filter | Summarize | Sort | Select`

This concept of passing data down the pipeline makes for an intuitive structure, as it's easy to create a mental picture of your data at each step.

To illustrate this, let's take a look at the following query, which looks at Microsoft Entra sign-in logs. As you read through each line, you can see the keywords that indicate what's happening to the data. We've included the relevant stage in the pipeline as a comment in each line.

> [!NOTE]
> You can add comments to any line in a query by preceding them with a double slash (` // `).

```kusto
SigninLogs                              // Get data
| evaluate bag_unpack(LocationDetails)  // Ignore this line for now; we'll come back to it at the end.
| where RiskLevelDuringSignIn == 'none' // Filter
   and TimeGenerated >= ago(7d)         // Filter
| summarize Count = count() by city     // Summarize
| sort by Count desc                    // Sort
| take 5                                // Select
```

Because the output of every step serves as the input for the following step, the order of the steps can determine the query's results and affect its performance. It's crucial that you order the steps according to what you want to get out of the query.

A good rule of thumb is to filter your data early, so you are only passing relevant data down the pipeline. This greatly increases performance and ensures that you aren't accidentally including irrelevant data in summarization steps. For more information, see [Best practices for Kusto Query Language queries](../best-practices.md).

Hopefully, you now have an appreciation for the overall structure of a query in Kusto Query Language. Now let's look at the actual query operators themselves, which are used to create a query.

## Getting, limiting, sorting, and filtering data

The core vocabulary of Kusto Query Language - the foundation that allows you to accomplish most of your tasks - is a collection of operators for filtering, sorting, and selecting your data. The remaining tasks require you to stretch your knowledge of the language to meet your more advanced needs. Let's expand a bit on some of the commands we used [in our earlier example](#understanding-query-structure-basics) and look at `take`, `sort`, and `where`.

For each of these operators, we examine its use in our previous *SigninLogs* example, and learn either a useful tip or a best practice.

### Getting data

The first line of any basic query specifies which table you want to work with. In the case of Microsoft Sentinel, this is likely to be the name of a log type in your workspace, such as *SigninLogs*, *SecurityAlert*, or *CommonSecurityLog*. For example:

`SigninLogs`

In Kusto Query Language, log names are case sensitive, so `SigninLogs` and `signinLogs` are interpreted differently. Take care when choosing names for your custom logs, so they're easily identifiable and not too similar to another log.

### Limiting data: *take* / *limit*

The [*take*](../take-operator.md) operator (and the identical *limit* operator) is used to limit your results by returning only a given number of rows. It's followed by an integer that specifies the number of rows to return. Typically, it's used at the end of a query after you have determined your sort order, and in such a case it returns the given number of rows at the top of the sorted order.

Using `take` earlier in the query can be useful for testing a query, when you don't want to return large datasets. However, if you place the `take` operation before any `sort` operations, `take` returns rows selected at random - and possibly a different set of rows every time the query is run. Here's an example of using take:

```kusto
SigninLogs
      | take 5
```

:::image type="content" source="../media/kql-tutorials/common-tasks-microsoft-sentinel/table-take-5.png" alt-text="Screenshot of sample results for the 'take' operator.":::

> [!TIP]
> When working on a brand-new query where you may not know what the query looks like, it can be useful to put a `take` statement at the beginning to artificially limit your dataset for faster processing and experimentation. Once you are happy with the full query, you can remove the initial `take` step.

### Sorting data: *sort* / *order*

The [*sort*](../sort-operator.md) operator (and the identical *order* operator) is used to sort your data by a specified column. In the following example, we ordered the results by *TimeGenerated* and set the order direction to descending with the *desc* parameter, placing the highest values first; for ascending order we would use *asc*.

> [!NOTE]
> The default direction for sorts is descending, so technically you only have to specify if you want to sort in ascending order. However, specifying the sort direction in any case makes your query more readable.

```kusto
SigninLogs
| sort by TimeGenerated desc
| take 5
```

As we mentioned, we put the `sort` operator before the `take` operator. We need to sort first to make sure we get the appropriate five records.

:::image type="content" source="../media/kql-tutorials/common-tasks-microsoft-sentinel/table-take-sort.png" alt-text="Screenshot of sample results for the 'sort' operator, with a 'take' limit.":::

#### *Top*

The [*top*](../top-operator.md) operator allows us to combine the `sort` and `take` operations into a single operator:

```kusto
SigninLogs
| top 5 by TimeGenerated desc
```

In cases where two or more records have the same value in the column you're sorting by, you can add more columns to sort by. Add extra sorting columns in a comma-separated list, located after the first sorting column, but before the sort order keyword. For example:

```kusto
SigninLogs
| sort by TimeGenerated, Identity desc
| take 5
```

Now, if *TimeGenerated* is the same between multiple records, it then tries to sort by the value in the *Identity* column.

> [!NOTE]
> **When to use `sort` and `take`, and when to use `top`**
>
> * If you're only sorting on one field, use `top`, as it provides better performance than the combination of `sort` and `take`.
>
> * If you need to sort on more than one field (like in the last example), `top` can't do that, so you must use `sort` and `take`.

### Filtering data: *where*

The [*where*](../where-operator.md) operator is arguably the most important operator, because it's the key to making sure you're only working with the subset of data that is relevant to your scenario. You should do your best to filter your data as early in the query as possible because doing so improves query performance by reducing the amount of data that needs to be processed in subsequent steps; it also ensures that you're only performing calculations on the desired data. See this example:

```kusto
SigninLogs
| where TimeGenerated >= ago(7d)
| sort by TimeGenerated, Identity desc
| take 5
```

The `where` operator specifies a variable, a comparison (*scalar*) operator, and a value. In our case, we used `>=` to denote that the value in the *TimeGenerated* column needs to be greater than (that is, later than) or equal to seven days ago.

There are two types of comparison operators in Kusto Query Language: string and numerical. String operators support permutations for case sensitivity, substring locations, prefixes, suffixes, and much more.

The `==` operator is both a numeric and string operator, meaning it can be used for both numbers and text. For example, both of the following statements would be valid where statements:

* `| where ResultType == 0`
* `| where Category == 'SignInLogs'`

For more information, see [Numerical operators](../numerical-operators.md) and [String operators](../datatypes-string-operators.md).

**Best Practice:** In most cases, you probably want to filter your data by more than one column, or filter the same column in more than one way. In these instances, there are two best practices you should keep in mind.

You can combine multiple `where` statements into a single step by using the *and* keyword. For example:

```kusto
SigninLogs
| where Resource == ResourceGroup
    and TimeGenerated >= ago(7d)
```

When you have multiple filters joined into a single `where` statement using the *and* keyword, you get better performance by putting filters that only reference a single column first. So, a better way to write the previous query would be:

```kusto
SigninLogs
| where TimeGenerated >= ago(7d)
    and Resource == ResourceGroup
```

In this example, the first filter mentions a single column (*TimeGenerated*), while the second references two columns (*Resource* and *ResourceGroup*).

## Summarizing data

[*Summarize*](../summarize-operator.md) is one of the most important tabular operators in Kusto Query Language, but it also is one of the more complex operators to learn if you're new to query languages in general. The job of `summarize` is to take in a table of data and output a *new table* that is aggregated by one or more columns.

### Structure of the summarize statement

The basic structure of a `summarize` statement is as follows:

`| summarize <aggregation> by <column>`

For example, the following would return the count of records for each *CounterName* value in the *Perf* table:

```kusto
Perf
| summarize count() by CounterName
```

:::image type="content" source="../media/kql-tutorials/common-tasks-microsoft-sentinel/table-summarize-count.png" alt-text="Screenshot of sample results of the 'summarize' operator with a 'count' aggregation.":::

Because the output of `summarize` is a new table, any columns not explicitly specified in the `summarize` statement aren't passed down the pipeline. To illustrate this concept, consider this example:

```kusto
Perf
| project ObjectName, CounterValue, CounterName
| summarize count() by CounterName
| sort by ObjectName asc
```

On the second line, we're specifying that we only care about the columns *ObjectName*, *CounterValue*, and *CounterName*. We then summarized to get the record count by *CounterName* and finally, we attempt to sort the data in ascending order based on the *ObjectName* column. Unfortunately, this query fails with an error (indicating that the *ObjectName* is unknown) because when we summarized, we only included the *Count* and *CounterName* columns in our new table. To avoid this error, we can add *ObjectName* to the end of our `summarize` step, like this:

```kusto
Perf
| project ObjectName, CounterValue , CounterName
| summarize count() by CounterName, ObjectName
| sort by ObjectName asc
```

The way to read the `summarize` line in your head would be: "summarize the count of records by *CounterName*, and group by *ObjectName*." You can continue adding columns, separated by commas, to the end of the `summarize` statement.

:::image type="content" source="../media/kql-tutorials/common-tasks-microsoft-sentinel/table-summarize-group.png" alt-text="Screenshot of results of summarize operator with two arguments.":::

Building on the previous example, if we want to aggregate multiple columns at the same time, we can achieve this by adding aggregations to the `summarize` operator, separated by commas. In the example below, we're getting not only a count of all the records but also a sum of the values in the *CounterValue* column across all records (that match any filters in the query):

```kusto
Perf
| project ObjectName, CounterValue , CounterName
| summarize count(), sum(CounterValue) by CounterName, ObjectName
| sort by ObjectName asc
```

:::image type="content" source="../media/kql-tutorials/common-tasks-microsoft-sentinel/table-summarize-multiple.png" alt-text="Screenshot of results of summarize operator with multiple aggregations.":::

#### Renaming aggregated columns

This seems like a good time to talk about column names for these aggregated columns. [At the start of this section](#summarizing-data), we said the `summarize` operator takes in a table of data and produces a new table, and only the columns you specify in the `summarize` statement continues down the pipeline. Therefore, if you were to run the above example, the resulting columns for our aggregation would be *count_* and *sum_CounterValue*.

The Kusto engine automatically creates a column name without us having to be explicit, but often, you find that you prefer your new column have a friendlier name. You can easily rename your column in the `summarize` statement by specifying a new name, followed by ` = ` and the aggregation, like so:

```kusto
Perf
| project ObjectName, CounterValue , CounterName
| summarize Count = count(), CounterSum = sum(CounterValue) by CounterName, ObjectName
| sort by ObjectName asc
```

Now, our summarized columns are named *Count* and *CounterSum*.

:::image type="content" source="../media/kql-tutorials/common-tasks-microsoft-sentinel/friendly-column-names.png" alt-text="Screenshot of friendly column names for aggregations.":::

There's more to the `summarize` operator than we can cover here, but you should invest the time to learn it because it's a key component to any data analysis you plan to perform on your Microsoft Sentinel data.

### Aggregation reference

The are many aggregation functions, but some of the most commonly used are `sum()`, `count()`, and `avg()`. For more information, see [Aggregation function types at a glance](../aggregation-functions.md).

## Selecting: adding and removing columns

As you start working more with queries, you might find that you have more information than you need on your subjects (that is, too many columns in your table). Or you might need more information than you have (that is, you need to add a new column that contains the results of analysis of other columns). Let's look at a few of the key operators for column manipulation.

### *Project* and *project-away*

[*Project*](../project-operator.md) is roughly equivalent to many languages' *select* statements. It allows you to choose which columns to keep. The order of the columns returned match the order of the columns you list in your `project` statement, as shown in this example:

```kusto
Perf
| project ObjectName, CounterValue, CounterName
```

:::image type="content" source="../media/kql-tutorials/common-tasks-microsoft-sentinel/table-project.png" alt-text="Screenshot of results of project operator.":::

As you can imagine, when you're working with wide datasets, you might have lots of columns you want to keep, and specifying them all by name would require much typing. For those cases, you have [*project-away*](../project-away-operator.md), which lets you specify which columns to remove, rather than which ones to keep, like so:

```kusto
Perf
| project-away MG, _ResourceId, Type
```

> [!TIP]
> It can be useful to use `project` in two locations in your queries, at the beginning and again at the end. Using `project` early in your query can help improve performance by stripping away large chunks of data you don't need to pass down the pipeline. Using it again at the end lets you get rid of any columns that may have been created in previous steps and aren't needed in your final output.
>

### *Extend*

[*Extend*](../extend-operator.md) is used to create a new calculated column. This can be useful when you want to perform a calculation against existing columns and see the output for every row. Let's look at a simple example where we calculate a new column called *Kbytes*, which we can calculate by multiplying the MB value (in the existing *Quantity* column) by 1,024.

```kusto
Usage
| where QuantityUnit == 'MBytes'
| extend KBytes = Quantity * 1024
| project DataType, MBytes=Quantity, KBytes
```

On the final line in our `project` statement, we renamed the *Quantity* column to *Mbytes*, so we can easily tell which unit of measure is relevant to each column.

:::image type="content" source="../media/kql-tutorials/common-tasks-microsoft-sentinel/table-extend.png" alt-text="Screenshot of results of extend operator.":::

It's worth noting that `extend` also works with already calculated columns. For example, we can add one more column called *Bytes* that is calculated from *Kbytes*:

```kusto
Usage
| where QuantityUnit == 'MBytes'
| extend KBytes = Quantity * 1024
| extend Bytes = KBytes * 1024
| project DataType, MBytes=Quantity, KBytes, Bytes
```

:::image type="content" source="../media/kql-tutorials/common-tasks-microsoft-sentinel/table-extend-twice.png" alt-text="Screenshot of results of two extend operators.":::

## Joining tables

Much of your work in Microsoft Sentinel can be carried out by using a single log type, but there are times when you want to correlate data together or perform a lookup against another set of data. Like most query languages, Kusto Query Language offers a few operators used to perform various types of joins. In this section, we look at the most-used operators, `union` and `join`.

### *Union*

[*Union*](../union-operator.md) simply takes two or more tables and returns all the rows. For example:

```kusto
OfficeActivity
| union SecurityEvent
```

This would return all rows from both the *OfficeActivity* and *SecurityEvent* tables. `Union` offers a few parameters that can be used to adjust how the union behaves. Two of the most useful are *withsource* and *kind*:

```kusto
OfficeActivity
| union withsource = SourceTable kind = inner SecurityEvent
```

The *withsource* parameter lets you specify the name of a new column whose value in a given row is the name of the table from which the row came. In the example, we named the column SourceTable, and depending on the row, the value is either *OfficeActivity* or *SecurityEvent*.

The other parameter we specified was *kind*, which has two options: *inner* or *outer*. In the example, we specified *inner*, which means the only columns that are kept during the union are those that exist in both tables. Alternatively, if we had specified *outer* (which is the default value), then all columns from both tables would be returned.

### *Join*

[*Join*](../join-operator.md) works similarly to `union`, except instead of joining tables to make a new table, we're joining *rows* to make a new table. Like most database languages, there are multiple types of joins you can perform. The general syntax for a `join` is:

```kusto
T1
| join kind = <join type>
(
               T2
) on $left.<T1Column> == $right.<T2Column>
```

After the `join` operator, we specify the *kind* of join we want to perform followed by an open parenthesis. Within the parentheses is where you specify the table you want to join, and any other query statements on *that* table you wish to add. After the closing parenthesis, we use the *on* keyword followed by our left (*$left.\<columnName>* keyword) and right (*$right.\<columnName>*) columns separated with the == operator. Here's an example of an *inner join*:

```kusto
OfficeActivity
| where TimeGenerated >= ago(1d)
    and LogonUserSid != ''
| join kind = inner (
    SecurityEvent
    | where TimeGenerated >= ago(1d)
        and SubjectUserSid != ''
) on $left.LogonUserSid == $right.SubjectUserSid
```

> [!NOTE]
> If both tables have the same name for the columns on which you are performing a join, you don't need to use *$left* and *$right*; instead, you can just specify the column name. Using *$left* and *$right*, however, is more explicit and generally considered to be a good practice.

> [!TIP]
> **It's a best practice** to have your smallest table on the left. In some cases, following this rule can give you huge performance benefits, depending on the types of joins you are performing and the size of the tables.

For more information, see [join operator](../join-operator.md).

## Evaluate

You might remember that back [in the first example](#understanding-query-structure-basics), we saw the [*evaluate*](../evaluate-operator.md) operator on one of the lines. The `evaluate` operator is less commonly used than the ones we have touched on previously. However, knowing how the `evaluate` operator works is well worth your time. Once more, here's that first query, where you see `evaluate` on the second line.

```kusto
SigninLogs
| evaluate bag_unpack(LocationDetails)
| where RiskLevelDuringSignIn == 'none'
   and TimeGenerated >= ago(7d)
| summarize Count = count() by city
| sort by Count desc
| take 5
```

This operator allows you to invoke available plugins (built-in functions). Many of these plugins are focused around data science, such as [*autocluster*](../autocluster-plugin.md), [*diffpatterns*](../diffpatterns-plugin.md), and [*sequence_detect*](../sequence-detect-plugin.md), allowing you to perform advanced analysis and discover statistical anomalies and outliers.

The plugin used in the example is called [*bag_unpack*](../bag-unpack-plugin.md), and it makes it simple to take a chunk of dynamic data and convert it to columns. Remember, [dynamic data](../scalar-data-types/dynamic.md) is a data type that looks similar to JSON, as shown in this example:

```json
{
"countryOrRegion":"US",
"geoCoordinates": {
"longitude":-122.12094116210936,
"latitude":47.68050003051758
},
"state":"Washington",
"city":"Redmond"
}
```

In this case, we wanted to summarize the data by city, but *city* is contained as a property within the *LocationDetails* column. To use the *city* property in our query, we had to first convert it to a column using *bag_unpack*.

Going back to our original pipeline steps, we saw this:

`Get Data | Filter | Summarize | Sort | Select`

Now that we've considered the `evaluate` operator, we can see that it represents a new stage in the pipeline, which now looks like this:

`Get Data | `***`Parse`***` | Filter | Summarize | Sort | Select`

There are many other examples of operators and functions that can be used to parse data sources into a more readable and manipulable format. You can learn about them - and the rest of the Kusto Query Language - in [Kusto Query Language learning resources](../kql-learning-resources.md) and in the [workbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/advanced-kql-framework-workbook-empowering-you-to-become-kql/ba-p/3033766).

## Let statements

Now that we've covered many of the major operators and data types, let's wrap up with the [*let* statement](../let-statement.md), which is a great
way to make your queries easier to read, edit, and maintain.

*Let* allows you to create and set a variable, or to assign a name to an expression. This expression could be a single value, but it could also be a whole query. Here's a simple example:

```kusto
let aWeekAgo = ago(7d);
SigninLogs
| where TimeGenerated >= aWeekAgo
```

Here, we specified a name of *aWeekAgo* and set it to be equal to the output of a *timespan* function, which returns a *datetime* value. We then terminate the *let* statement with a semicolon. Now we have a new variable called *aWeekAgo* that can be used anywhere in our query.

As we mentioned, you can use a *let* statement take a whole query and give the result a name. Since query results, being tabular expressions, can be used as the inputs of queries, you can treat this named result as a table for the purposes of running another query on it. Here's a slight modification to the previous example:

```kusto
let aWeekAgo = ago(7d);
let getSignins = SigninLogs
| where TimeGenerated >= aWeekAgo;
getSignins
```

In this case, we created a second *let* statement, where we wrapped our whole query into a new variable called *getSignins*. Just like before, we terminate the second *let* statement with a semicolon. Then we call the variable on the final line, which runs the query. Notice that we were able to use *aWeekAgo* in the second *let* statement. This is because we specified it on the previous line; if we were to swap the *let* statements so that *getSignins* came first, we would get an error.

Now we can use *getSignins* as the basis of another query (in the same window):

```kusto
let aWeekAgo = ago(7d);
let getSignins = SigninLogs
| where TimeGenerated >= aWeekAgo;
getSignins
| where level >= 3
| project IPAddress, UserDisplayName, Level
```

*Let* statements give you more power and flexibility in helping to organize your queries. *Let* can define scalar and tabular values as well as create user-defined functions. They truly come in handy when you're organizing more complex queries that might be doing multiple joins.

## Next step

Take advantage of a Kusto Query Language workbook right in Microsoft Sentinel itself - the **Advanced KQL for Microsoft Sentinel** workbook. It gives you step-by-step help and examples for many of the situations you're likely to encounter during your day-to-day security operations, and also points you to lots of ready-made, out-of-the-box examples of analytics rules, workbooks, hunting rules, and more elements that use Kusto queries. Launch this workbook from the **Workbooks** page in Microsoft Sentinel.

For more information, see:

* [Advanced KQL Framework Workbook - Empowering you to become KQL-savvy](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/advanced-kql-framework-workbook-empowering-you-to-become-kql/ba-p/3033766) (Blog)
* [Visualize and monitor your data by using workbooks in Microsoft Sentinel](/azure/sentinel/monitor-your-data?tabs=azure-portal)
* [Useful resources for working with Kusto Query Language in Microsoft Sentinel](/azure/sentinel/kusto-resources)
