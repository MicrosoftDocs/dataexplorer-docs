q# Scalar types and functions

[Kusto](https://kusdoc2.azurewebsites.net/docs/index.html) is a powerful database service optimized for searches over large logs of diagnostic telemetry. Scalar expressions are part of the [Kusto query language](./query-essentials/readme.md). 

"Scalar" means values like numbers or strings that can occupy a single cell in a Kusto table. Scalar expressions are built from scalar functions and operators and evaluate to scalar values. `sqrt(score)/100 > target+2` is a scalar expression.

"Scalar" also includes arrays and composite objects, which can also be stored in a single database cell.

Scalar expressions are distinct from [queries](./queries.md), whose results are tables.

# Scalar Types

# Scalar comparisons

||
---|---
`<` |Less
`<=`|Less or Equals
`>` |Greater
`>=`|Greater or Equals
`<>`|Not Equals
`!=`|Not Equals 
`in`| Right operand is a (dynamic) array and left operand is equal to one of its elements.
`!in`| Right operand is a (dynamic) array and left operand is not equal to any of its elements.

# Reference: scalar functions

"Scalar" denotes values that can occupy a single cell in a Kusto table. (Scalar expressions are distinct from [queries](./queries.md), whose results are tables.)
