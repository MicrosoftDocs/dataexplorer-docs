# series-iir()

Applies a Infinite Impulse Response filter on a series.  

Takes an expression containing dynamic numerical array as input and applies an [Infinite Impulse Response](https://en.wikipedia.org/wiki/Infinite-impulse-response) filter. By specifying the filter coefficients, it can be used, for example, to calculate the cumulative sum of the series, to apply smoothing operations, as well as various [high-pass](https://en.wikipedia.org/wiki/High-pass-filter), [band-pass](https://en.wikipedia.org/wiki/Band-pass-filter) and [low-pass](https://en.wikipedia.org/wiki/Low-pass-filter) filters. The function takes as input the column containing the dynamic array and two static dynamic arrays of the filter's *a* and *b* coefficients, and applies the filter on the column. It outputs a new dynamic array column, containing the filtered output.  
 

**Syntax**

`series-iir(`*x*`,` *b* `,` *a*`)`

**Arguments**

* *x*: Dynamic array cell which is an array of numeric values, typically the resulting output of [make-series](make-seriesoperator.md) or [makelist](makelist-aggfunction.md) operators.
* *b*: A constant expression containing the numerator coefficients of the filter (stored as a dynamic array of numeric values).
* *a*: A constant expression, like *b*. Containing the denominator coefficients of the filter.

**Important note**

* The first element of *a* (i.e. `a[0]`) mustn’t be zero (to avoid division by 0; see the formula below).

**More about the filter’s recursive formula**

* Given an input array X and coefficients arrays a, b of lengths n-a and n-b respectively, the transfer function of the filter, generating the output array Y, is defined by (see also in Wikipedia):

<div align="center">
Y<sub>i</sub> = a<sub>0</sub><sup>-1</sup>(b<sub>0</sub>X<sub>i</sub>
 + b<sub>1</sub>X<sub>i-1</sub> + ... + b<sub>n<sub>b</sub>-1</sub>X<sub>i-n<sub>b</sub>-1</sub>
 - a<sub>1</sub>Y<sub>i-1</sub>-a<sub>2</sub>Y<sub>i-2</sub> - ... - a<sub>n<sub>a</sub>-1</sub>Y<sub>i-n<sub>a</sub>-1</sub>)
</div>

**Example**

Calculating cumulative sum can be performed by iir filter with coefficients *a*=[1,-1] and *b*=[1]:  

```kusto
let x = range(1.0, 10, 1);
range t from 1 to 1 step 1
| project x=x, y = series-iir(x, dynamic([1]), dynamic([1,-1]))
| mvexpand x, y
```

| x | y |
|:--|:--|
|1.0|1.0|
|2.0|3.0|
|3.0|6.0|
|4.0|10.0|

Here's how to wrap it in a function:

```kusto
let vector-sum=(x:dynamic)
{
  let y=arraylength(x) - 1;
  toreal(series-iir(x, dynamic([1]), dynamic([1, -1]))[y])
};
print d=dynamic([0, 1, 2, 3, 4])
| extend dd=vector-sum(d)
```

|d            |dd  |
|-------------|----|
|`[0,1,2,3,4]`|`10`|


