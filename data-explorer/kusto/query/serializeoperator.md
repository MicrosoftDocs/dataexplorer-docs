# serialize operator

Freezes the order of the input row set arbitrarily, so that [window functions](./windowsfunctions.md)
could be applied to it.

    T | serialize rn=row-number()

**Syntax**

`serialize` [*Name1* `=` *Expr1* [`,` *Name2* `=` *Expr2*]...]

* The *Name*/*Expr* pairs are similar to those in the [extend operatpr](./extendoperator.md).

**Example**

<!-- csl -->
```
Traces
| where ActivityId == "479671d99b7b"
| serialize

Traces
| where ActivityId == "479671d99b7b"
| serialize rn = row-number()
```
