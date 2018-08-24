# consume operator

Pulls all the data from its source tabular expression without actually doing anything with it.

  T | consume

The `consume` operator pulls all the data from its source tabular expression
without actually doing anything with it. It can be used for estimating the
cost of a query without actually delivering the results back to the client.
(The estimation is not exact for a variety of reasons; for example, `consume`
is calculated distributively, so `T | consume` will not even deliver the table's
data between the nodes of the cluster.)
 


