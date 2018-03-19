# Understanding Diffpatterns - comparing patterns
#### (10 min to read)

<br/>
> [!Note]
> Before you start...
> If you haven't completed the [Understanding Basket](~/learn/tutorials/smart analytics/basket.md) tutorial yet, we recommend that you do so. 

In this tutorial, we learn how to use diffpatterns, a powerful dignostic tool in the Analytics language. diffpatterns oprates on a table with column that has two values, for example, 'True' and 'False'. The name of this column is passed to diffpatterns as a parameter.

diffpatterns will process the rows corresponding to each of the two set of rows with 'basket' analysis, and find the mutual patterns in row values. The output is mutual patterns, with their occurrences and percentage in each of the sets. This gives you a quick way to know which ptterns are over- or under-represented in each of the sets.

Suppose that you come to work in the morning and would like to see of there are failed requests  which happened during the passing day, April 25th, 2017, and analyze them. Let's first see how many success vs. fail we have:

```AIQL
requests 
| where timestamp > datetime(04-25-2017) and timestamp <= datetime(04-26-2017) 
| summarize count() by success
```

A simple zoom in on the rows with success\==False gives you some more information,but it does not tell you what is particular to these rows, comparing to rows with success==True.

```AIQL
requests 
| where timestamp > datetime(04-25-2017) and timestamp <= datetime(04-26-2017) 
| where success == "False" 
```
However, if you run diffpatterns you will see a concise comparison between the sets.

```AIQL
requests 
| where timestamp > datetime(04-25-2017) and timestamp <= datetime(04-26-2017) 
| evaluate diffpatterns(success, "True", "False")
```
Now you can see that some rows correspond to patterns which exist only in failed requests (marked below), while others represent successful requests.

<p><img src="~/learn/tutorials/images/smart analytics/diffpatterns.png" alt="Log Analytics diffpatterns"></p>