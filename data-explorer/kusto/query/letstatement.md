---
title: Let statement - Azure Data Explorer
description: This article describes the Let statement in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 11/09/2021
ms.localizationpriority: high
---
# Let statement

Use the `let` statement to set a variable name equal to a function or valid expression. When the variable appears thereafter, it represents the defined function or expression. The `let` statement can be used within a function or query. If the variable previously represented another value, for example in nested statements, the innermost `let` statement applies. 

`Let` statements let you break up a potentially complex expression into multiple parts, each represented by a variable. The `let` statement can also be used to create user-defined functions and [views](schema-entities/views.md). 

> [!NOTE]
> You must use a valid name for the `let` statement.

`Let` statements can include: 
 
* Scalar types
* Tabular types
* User-defined functions 

## Syntax

`let` *Name* `=` *ScalarExpression* 

`let` *Name* `=` *TabularExpression* 

`let` *Name* `=` *UserDefinedFunction*

**Syntax of UserDefinedFunction**

[`view`] `(` [ *TabularArguments* ]  [`,`] [ *ScalarArguments* ] `)` `{` *FunctionBody* `}`

**Syntax of TabularArguments**

 [*TabularArgName* `:` `(`[*AttributeName* `:` *AttributeType*] [`,` ... ]`)`] [`,` ... ][`,`]

[*TabularArgName* `:` `(` `*` `)`] 

**Syntax of ScalarArguments**

 [*ArgName* `:` *ArgType*] [`,` ... ]

|Field  |Definition  |Example  |
|---------|---------|---------|
|*Name*   | The variable name, must be a valid entity name. | You can escape the name, for example `["Name with spaces"]` |
|*ScalarExpression* | An expression with a scalar result.| `let one=1;`  |
|*TabularExpression*  | An expression with a tabular result. |  `Logs  \| where Timestamp > ago(1h)`  |
|*UserDefinedFunction* | An expression that yields a user defined function, an anonymous function declaration. |  `let f=(a:int, b:string) { strcat(b, ":", a) }`  |
| *view* | Appears only in a parameterless `let` statement with no arguments. When used, the `let` statement is included in queries with a `union` operator with wildcard selection of the tables/views. | |
| *TabularArgName*| The name of the tabular argument. Can appear in the *FunctionBody* and is bound to a particular value when the user defined function is invoked. | |
| *AttributeName* : *AttributeType*| The name and type of the attribute. Part of the table schema definition, which includes a set of attributes with their types. |  |
|*ArgName* | The name of the scalar argument. Can appear in the *FunctionBody* and is bound to a particular value when the user defined function is invoked.  | |
|*ArgType* | The type of the scalar argument. Currently the following are supported for user defined functions: `bool`, `string`, `long`, `datetime`, `timespan`, `real`, and `dynamic` (and aliases to these types).| |

> [!NOTE]
>
> * You can use `(*)` for the tabular expression.
> * When using a tabular expression as part of a user defined function, the columns can't be accessed as part of the function. 
> * Tabular arguments appear before scalar arguments.


## Examples

### Define scalar values

```kusto
let n = 10;  // number
let place = "Dallas";  // string
let cutoff = ago(62d); // datetime 
Events 
| where timestamp > cutoff 
    and city == place 
| take n
```

### Define scalar constant

The following example binds the name `x` to the scalar literal `1`, and then uses it in a tabular expression statement.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let x = 20;
range y from 0 to x step 5
```

This example is similar to the previous one, only the name of the let statement is given using the `['name']` notion.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let ['x'] = 20;
range y from 0 to x step 5
```

### Create user defined function with scalar calculation

This example uses the let statement with arguments for scalar calculation. The query defines function `MultiplyByN` for multiplying two numbers.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let MultiplyByN = (val:long, n:long) { val * n };
range x from 1 to 5 step 1 
| extend result = MultiplyByN(x, 5)
```

**Output**

|x|result|
|---|---|
|1|5|
|2|10|
|3|15|
|4|20|
|5|25|

### Create user defined function that trims input

The following example removes leading and trailing ones from the input.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let TrimOnes = (s:string) { trim("1", s) };
range x from 10 to 15 step 1 
| extend result = TrimOnes(tostring(x))
```

**Output**

|x|result|
|---|---|
|10|0|
|11||
|12|2|
|13|3|
|14|4|
|15|5|

### Use multiple let statements

This example defines two let statements where one statement (`foo2`) uses another (`foo1`).

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let foo1 = (_start:long, _end:long, _step:long) { range x from _start to _end step _step};
let foo2 = (_step:long) { foo1(1, 100, _step)};
foo2(2) | count
```

**Output**

|result|
|---|
|20|

### Use a view 

This example shows you how to use a let statement with the [`view`](schema-entities/views.md) keyword to create other tables.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let Range10 = view () { range MyColumn from 1 to 10 step 1 };
let Range20 = view () { range MyColumn from 1 to 20 step 1 };
search MyColumn == 5
```

**Output**

|$table|MyColumn|
|---|---|
|Range10|5|
|Range20|5|

### Use a materialize function

The [`materialize()`](materializefunction.md) function lets you cache subquery results during the time of query execution. When you use the `materialize()` function, the data is cached and any subsequent invocation of the result uses cached data.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let totalPagesPerDay = PageViews
| summarize by Page, Day = startofday(Timestamp)
| summarize count() by Day;
let materializedScope = PageViews
| summarize by Page, Day = startofday(Timestamp);
let cachedResult = materialize(materializedScope);
cachedResult
| project Page, Day1 = Day
| join kind = inner
(
    cachedResult
    | project Page, Day2 = Day
)
on Page
| where Day2 > Day1
| summarize count() by Day1, Day2
| join kind = inner
    totalPagesPerDay
on $left.Day1 == $right.Day
| project Day1, Day2, Percentage = count_*100.0/count_1
```

**Output**

|Day1|Day2|Percentage|
|---|---|---|
|2016-05-01 00:00:00.0000000|2016-05-02 00:00:00.0000000|34.0645725975255|
|2016-05-01 00:00:00.0000000|2016-05-03 00:00:00.0000000|16.618368960101|
|2016-05-02 00:00:00.0000000|2016-05-03 00:00:00.0000000|14.6291376489636|

### Multiple let statements

Multiple let statements can be used with the semicolon, `;`, delimiter between them, like in the following example.

> [!NOTE]
> The last statement must be a valid query expression. 

```kusto
let start = ago(5h); 
let period = 2h; 
T | where Time > start and Time < start + period | ...
```

### Nested let statements

Nested let statements are permitted, including within a user defined function expression. Let statements and arguments apply in both the current and inner scope of the function body.

```kusto
let start_time = ago(5h); 
let end_time = start_time + 2h; 
T | where Time > start_time and Time < end_time | ...
```