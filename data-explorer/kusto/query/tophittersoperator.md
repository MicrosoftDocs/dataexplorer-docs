# top-hitters operator

Returns an approximation of the first *N* results (assuming skewed distribution of the input).

    T | top-hitters 25 of Page by Views 

**Syntax**

*T* `| top-hitters` *NumberOfRows* `of` *sort-key* `[` `by` *expression* `]`

**Arguments**

* *NumberOfRows*: The number of rows of *T* to return. You can specify any numeric expression.
* *sort-key*: The name of the column by which to sort the rows.
* *expression*: (optional) An expression which will be used for the top-hitters estimation. 
    * *expression*: top-hitters will return *NumberOfRows* rows which have an approximated maximum of sum(*expression*). Expression can be a column, or any other expression that evaluates to a number. 
    *  If *expression* is not mentioned, top-hitters algorithm will count the occurences of the *sort-key*.  

**Notes**

`top-hitters` is an approximation algorithm and should be used when running with large data. 
The approximation of the the top-hitters is based on the [Count-Min-Sketch](https://en.wikipedia.org/wiki/Count%E2%80%93min-sketch) algorithm.  

**Example**

## Getting top hitters (most frequent items) 

The next example shows how to find top-5  languages with most pages in Wikipedia (accessed after during April 2016). 

<!-- csl: https://demo3.kusto.windows.net:443/Wiki -->
```
PageViews
| where Timestamp > datetime(2016-04-01) and Timestamp < datetime(2016-05-01) 
| top-hitters 5 of Language 
```

|Language|approximate-count-Language|
|---|---|
|en|1539954127|
|zh|339827659|
|de|262197491|
|ru|227003107|
|fr|207943448|

## Getting top hitters (based on column value) ***

The next example shows how to find most viewed English pages of Wikipedia of the year 2016. 
The query uses 'Views' (integer number) to calculate page popularity (number of views). 

<!-- csl: https://demo3.kusto.windows.net:443/Wiki -->
```
PageViews
| where Timestamp > datetime(2016-01-01)
| where Language == "en"
| where Page !has 'Special'
| top-hitters 10 of Page by Views
```

|Page|approximate-sum-Views|
|---|---|
|Main-Page|1325856754|
|Web-scraping|43979153|
|Java-(programming-language)|16489491|
|United-States|13928841|
|Wikipedia|13584915|
|Donald-Trump|12376448|
|YouTube|11917252|
|The-Revenant-(2015-film)|10714263|
|Star-Wars:_The-Force-Awakens|9770653|
|Portal:Current-events|9578000|
