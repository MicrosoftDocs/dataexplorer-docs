# Understanding Autocluster - finding patterns in categorical data
#### (10 min to read)

<br/>
In this tutorial, we demonstrate how to use autocluster, a language capability which helps you to summarize your query results into natural clusters. The algorithm is heuristic and produces a small number of clusters, typically for interactive consumption.

Suppose that you would like to take a look at the exceptions logged in the system during the passing day, in order to investigate them. Run this query:
```AIQL
exceptions 
| where timestamp > datetime(04-25-2017) and timestamp <= datetime(04-26-2017)
```

There are many many exceptions! How can we make senes out of the query? We can use autocluater.
```AIQL
exceptions 
| where timestamp > datetime(04-19-2017) and timestamp <= datetime(04-26-2017) 
| evaluate autocluster_v2()
```

Autocluster groups the exceptions into natural groups, saving you the need to understand which columns are grouping them today. If you'd like to start your investigation from a smaller set of clusters, you can override default parameters to create a smaller set of clusters, where each cluster is larger, by setting seize_weight to a value greater than 0.5
```AIQL
exceptions 
| where timestamp > datetime(04-19-2017) and timestamp <= datetime(04-26-2017) 
| evaluate autocluster_v2(0.85)
```

Let's look at another example, this time from the requests table:
```AIQL
requests 
| where timestamp > datetime(04-23-2017) and timestamp <= datetime(04-26-2017) 
| evaluate autocluster_v2()
```

If you want more clusters, you can put a size_weight value of less than 0.5:
```AIQL
requests 
| where timestamp > datetime(04-23-2017) and timestamp <= datetime(04-26-2017) 
| evaluate autocluster_v2(0.10)
```
<p><img src="~/learn/tutorials/images/smart analytics/autocluster.jpg" alt="autocluster"></p>

Autocluster is your querying buddy, which will save you a lot of time in figuring out what to do next in your root-cause analysis process in AI Analytics. At this point you may be already familiar with 'evaluate basket'.
The difference between basket and autocluster is that basket deterministically returns all frequent patterns, 
while autocluster heuristically finds a small number of clusters with similar rows. Basket is therefore most recommended to use in subsequent automated use, while autocluster - for interactive use.