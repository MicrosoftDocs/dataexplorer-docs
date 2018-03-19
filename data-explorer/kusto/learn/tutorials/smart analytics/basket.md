# Understanding Basket - finding frequent patterns
#### (10 min to read)

<br/>
In this tutorial, we learn how to use a machine learning operator - basket - to extract meaningful insights from a large dataset.
We will do so without having to run statistical methods, or even fully understand the schema and possible value.
Machine learning will automate this for us, using the basket() construct, which implements the apriori algorithm.
Basket can be used manually or with subsequent automation.


Let's investigate the exceptions during a week, in which we know that a livesite issue happened.

```AIQL
exceptions
| where timestamp between (datetime(03-01-2017)..datetime(03-7-2017))
| summarize count() by bin (timestamp, 1h)
| render timechart
```

The query takes the week of March 1st and counts the number of exceptions for every hour.
Finally, it renders the result as chart.
We can clearly see a spike in the number of exceptions during March 4th.

<p><img src="~/learn/tutorials/images/smart analytics/basket_spike.jpg" alt="Log Analytics basket spike"></p>

Let us look at the raw data itself, and try to understad what happened

```AIQL
exceptions
| where timestamp between (datetime(03-04-2017)..datetime(03-05-2017))
```

If you run this query, you will have more than 4000 results. 
Even if we do see something which makes sense on the first or second out of 81 screens, 
what are the chances that this is what we have been looking for?

One way to go about this is to try and understand the schema, query the data using this understanding, 
identify dominant values, guess what the dominant combinations are, validate, and so on.

Or, we can use machine learning with "evaluate basket()":

```AIQL
exceptions
| where timestamp between (datetime(03-04-2017)..datetime(03-05-2017))
| evaluate basket()
```

<p><img src="~/learn/tutorials/images/smart analytics/basket_results.jpg" alt="Log Analytics basket results"></p>


53 patterns only have been extracted from the thousands of rows. 
The patterns returned are guaranteed to include all the patterns appearing in 5% or more of the rows (you may override this parameter). 
You can see, for example, that the first pattern covers 78% of the exceptions!
At this point you may be already familiar with Autocluster.
The difference between basket and butocluster is that basket deterministically returns all frequent patterns, 

> [!Note]
> If you are familiar with plugin autocluster, note that autocluster heuristically finds a small number of clusters with similar rows,
> while basket may return a large number of patterns. Basket is therefore typically used in subsequent automation, while autocluster - for interactive use.
