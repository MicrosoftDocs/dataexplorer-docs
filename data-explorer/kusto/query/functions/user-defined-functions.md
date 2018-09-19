---
title: User-Defined Functions - Azure Data Explorer | Microsoft Docs
description: This article describes User-Defined Functions in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# User-Defined Functions

Kusto supports user-defined functions, which can be defined as either a part of
the query itself (**ad-hoc functions**) or stored in a persistent manner as part
of the database metadata (**stored functions**).

A user-defined function has:
1. A name
2. A a strongly-typed list of input parameters
3. A strongly-typed return value

The name of a user-defined function must follow the [identifier naming rules](../schema-entities/entity-names.md#identifier-naming-rules).
It must be unique in the scope of definition.

Input parameters to the function may be either scalar or tabular expressions.
Each parameter is uniquely named and has a type specification.
Furthermore, scalar parameters might be provided with a default value, which will
be used implicitly when the function's caller does not provide a value for that
parameter.

The return value may be a scalar or a tabular value.

A function's inputs and output determine how and where it can be used:

* A function taking no inputs, or taking scalar inputs only, and producing
  a scalar output, is called a **scalar function** and it may be used whenever
  a scalar expression is allowed. In particular, a scalar user-defined function may
  only use the row context in which it is defined, and can only refer to
  tables (and views) that are in the accessible schema.
* A function taking no inputs, or taking at least one tabular input,
  and producing a tabular output, is called a **tabular function** and it may be
  used whenever a tabular expression is allowed.

An example for a scalar function:

```kusto
let Add7 = (arg0:long = 5) { arg0 + 7 };
range x from 1 to 10 step 1
| extend x_plus_7 = Add7(x), five_plus_seven = Add7()
```

An example for a tabular function that takes no arguments:

```kusto
let tenNumbers = () { range x from 1 to 10 step 1};
tenNumbers
| extend x_plus_7 = x + 7
```

An example for a tabular function that takes a tabular
input and a scalar input:

```kusto
let MyFilter = (T:(x:long), v:long) {
  T | where x >= v 
};
MyFilter((range x from 1 to 10 step 1), 9)
```

|x|
|---|
|9|
|10|

An example for a tabular function that takes a tabular
input with no column specified. Any table can be passed
to a function, no table's column can be referenced inside the function.

```kusto
let MyDistinct = (T:(*)) {
  T | distinct * 
};
MyDistinct((range x from 1 to 3 step 1))
```

|x|
|---|
|1|
|2|
|3|

## Declaring user-defined functions

The declaration of a user-defined function provides the name
of the function, its schema (what parameters, if any, it accepts),
and the body of the function. Lambda functions do not have a name,
but must be immediately bound to a name via a `let` statement, so
they can be regarded the same as user-defined stored functions.
For example, the following declaration is for a lambda that
accepts two arguments (a `string` called `s` and a `long` called
`i`) and returns the product of the first (after converting it
into a number) and the second; it then binds the lambda to the
name `f`:

```kusto
let f=(s:string, i:long) {
    tolong(s) * i
};
```

The **function body** must include an expression that returns
some value (which can be a scalar value or a tabular value).
Additionally, it may include other `let` statements (preceding
the result expression) and may even declare other functions.

**Example: User-defined function that uses a let statement**

The following example binds the name `Test` to a user-defined
function (lambda) that in its turn makes use of three let
statements. The output is `70`:

```kusto
let Test1 = (id: int) {
  let Test2 = 10;
  let Test3 = 10 + Test2 + id;
  let Test4 = (arg: int) {
      let Test5 = 20;
      Test2 + Test3 + Test5 + arg
  };
  Test4(10)
};
range x from 1 to Test1(10) step 1
| count
```

**Example: User-defined function that defines a default value for a parameter**

The following example shows a function that accepts three arguments, the latter
two of which have a default value and do not have to be present at the call site.

```kusto
let f = (a:long, b:string = "b.default", c:long = 0) {
  strcat(a, "-", b, "-", c)
};
print f(12, c=7) // Returns "12-b.default-7"
```

## Invoking a user-defined function

A user-defined function that takes no arguments can be invoked by its
name, or by its name with an empty argument list in parentheses. For example:

```kusto
// Bind the identifier a to a user-defined function (lambda) that takes
// no arguments and returns a constant of type long:
let a=(){123};
// Invoke the function in two equivalent ways:
range x from 1 to 10 step 1
| extend y = x * a, z = x * a() 
```

```kusto
// Bind the identifier T to a user-defined function (lambda) that takes
// no arguments and returns a random two-by-two table:
let T=(){
  range x from 1 to 2 step 1
  | project x1 = rand(), x2 = rand()
};
// Invoke the function in two equivalent ways:
// (Note that the second invocation must be itself wrapped in
// an additional set of parentheses, as the union operator
// differentiates between "plain" names and expressions)
union T, (T())
```

A user-defined function that takes one or more scalar arguments can be invoked
by using the table name, and a concrete argument list in parentheses:

```kusto
let f=(a:string, b:string) {
  strcat(a, " (la la la)", b)
};
print f("hello", "world")
```

A user-defined function that takes one or more table arguments (and any number
of scalar arguments) can be invoked by using the table name, and a concrete argument list
in parentheses:

```
let MyFilter = (T:(x:long), v:long) {
  T | where x >= v 
};
MyFilter((range x from 1 to 10 step 1), 9)
```

The operator `invoke` can also be used to invoke a user-defined function that
takes one or more table arguments and returns a table. This comes handy when
the first concrete table argument to the function is the source of the `invoke`
operator:

```kusto
let append_to_column_a=(T:(a:string), what:string) {
    T | extend a=strcat(a, " ", what)
};
datatable (a:string) ["sad", "really", "sad"]
| invoke append_to_column_a(":-)")
```

## Default values

Functions may provide default values to some of their parameters. The following
rules apply:

1. Default values may be provided for scalar parameters only.
2. Default values are always literals (constants). They cannot be arbitrary
   calculations.
3. Parameters with no default value, if there are any, always preceded parameters
   that do have a default value, if there are any.
4. Callers must provide the value of all parameters with no default values,
   arranged in the same order as in the function declaration.
5. Callers do not need to provide the value for parameters with default values,
   but may do so if they elect to.
6. Callers may provide arguments in an order that does not match the parameters
   order. To do so, they must name their arguments.

For example, the following returns a table with two identical records; note how
in the first invocation of `f` the arguments are completely "scrambled", and
therefore each one is explicitly given a name:

```kusto
let f = (a:long, b:string = "b.default", c:long = 0) {
  strcat(a, "-", b, "-", c)
};
union
  (print x=f(c=7, a=12)), // "12-b.default-7"
  (print x=f(12, c=7))    // "12-b.default-7"
```

|x|
|---|
|12-b.default-7|
|12-b.default-7|

## View functions

User-defined functions that take no arguments and return a tabular expression
can be marked as views. Marking a user-defined function as a **view** means
that the function behaves like a table whenever wildcard table name resolution
is done. The following example shows two user-defined functions, `T_view` and
`T_notview`, and shows how only the first one is resolved by the wildcard
reference in the `union`:

```kusto
let T_view = view () { print x=1 };
let T_notview = () { print x=2 };
union T*
```

## Restrictions on the use of user-defined functions

The following restricts apply:

1. User-defined functions cannot pass into a 
   [toscalar()](../toscalarfunction.md) invocation
   information that depends on the row-context in which the
   function is called.

2. User-defined functions that return a tabular expression cannot
   be invoked with an argument that varies with the row context.

In fact, the only place a user-defined function may be invoked
with an argument that varies with the row context is when the
user-defined function is composed of scalar functions only and
does not make use of `toscalar()`.

These restrictions are best illustrated with some examples.

**Restriction 1**

```kusto
// Supported:
// f is a scalar function that doesn't reference any tabular expression
let Table1 = datatable(xdate:datetime)[datetime(1970-01-01)];
let Table2 = datatable(Column:long)[1235];
let f = (hours:long) { now() + hours*1h };
Table2 | where Column != 123 | project d = f(10)

// Supported:
// f is a scalar function that references the tabular expression Table1,
// but is invoked with no reference to the current row context f(10):
let Table1 = datatable(xdate:datetime)[datetime(1970-01-01)];
let Table2 = datatable(Column:long)[1235];
let f = (hours:long) { toscalar(Table1 | summarize min(xdate) - hours*1h) };
Table2 | where Column != 123 | project d = f(10)

// Not supported:
// f is a scalar function that references the tabular expression Table1,
// and is invoked with a reference to the current row context f(Column):
let Table1 = datatable(xdate:datetime)[datetime(1970-01-01)];
let Table2 = datatable(Column:long)[1235];
let f = (hours:long) { toscalar(Table1 | summarize min(xdate) - hours*1h) };
Table2 | where Column != 123 | project d = f(Column)
```

**Restriction 2**

```kusto
// Not supported:
// f is a tabular function that is invoked in a context
// that expects a scalar value.
let Table1 = datatable(xdate:datetime)[datetime(1970-01-01)];
let Table2 = datatable(Column:long)[1235];
let f = (hours:long) { range x from 1 to hours step 1 | summarize makelist(x) };
Table2 | where Column != 123 | project d = f(Column)
```

## Features that are currently unsupported by user-defined functions

For completeness, here are some commonly-requested features
for user-defined functions that are currently not supported:

1. **Function overloading**:
   There is currently no way to overload a function (i.e.,
   create multiple functions with the same name and different
   input schema).
2. **Default values**:
   The default value for a scalar parameter to a function must be
   a scalar literal (constant). Furthermore, stored functions cannot
   have a default value of type `dynamic`.