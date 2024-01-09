---
ms.topic: include
ms.date: 07/12/2022
---

This function uses a variant of the [HyperLogLog (HLL) algorithm](https://en.wikipedia.org/wiki/HyperLogLog),
which does a stochastic estimation of set cardinality. The algorithm provides a "knob" that can be used to balance accuracy and execution time per memory size:

|Accuracy|Error (%)|Entry count   |
|--------|---------|--------------|
|       0|      1.6|2<sup>12</sup>|
|       1|      0.8|2<sup>14</sup>|
|       2|      0.4|2<sup>16</sup>|
|       3|     0.28|2<sup>17</sup>|
|       4|      0.2|2<sup>18</sup>|

> [!NOTE]
> The "entry count" column is the number of 1-byte counters in the HLL implementation.

The algorithm includes some provisions for doing a perfect count (zero error), if the set cardinality is small enough:

* When the accuracy level is `1`, 1000 values are returned
* When the accuracy level is `2`, 8000 values are returned

The error bound is probabilistic, not a theoretical bound. The value is the standard deviation of error distribution (the sigma), and 99.7% of the estimations will have a relative error of under 3 x sigma.

The following image shows the probability distribution function of the relative
estimation error, in percentages, for all supported accuracy settings:

:::image type="content" border="false" source="../kusto/query/media/dcount-aggfunction/hll-error-distribution.png" alt-text="Graph showing the hll error distribution.":::
