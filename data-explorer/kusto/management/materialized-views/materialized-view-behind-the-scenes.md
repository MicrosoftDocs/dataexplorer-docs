# Materialized views: behind the scenes

A Materialized View is made of a *materialized* part - a physical Azure Data Explorer table holding aggregated records from the source table, 
which have already been processed; And a *delta* - the newly ingested records in the source table which haven't been processed yet. 
The materialized part always holds the minimal possible number of records - a single record per the dimension's combination (as in the actual 
aggregation result).

Querying the Materialized View *combines* the materialized part with the delta part, providing an up-to-date result of the aggregation query. 

The offline materialization process constantly ingests new records from the delta part to the materialized table and/or replaces 
existing records. The latter is done by rebuilding extents which hold records to replace. 
Both processes (ingestion and extents rebuild) require available ingestion capacity. Therefore, clusters in which the 
available ingestion capacity is very low may not be able to materialize the view frequently enough, which will negatively 
impact the materialized view performance (queries will perform slower, as the delta part becomes bigger). 

If records in the *delta* part constantly intersect with all data shards in the *materialized* part, each materialization cycle 
will require rebuilding the entire *materialized* part, and may not keep up with the pace (the ingestion rate will be higher than the materialization
 rate). In that case, the view will become unhealthy and the *delta* part will constantly grow. This is a known and built-in limitation of the feature. You can monitor the amount of extent rebuilds in each 
materialization cycle using metrics, described in the [Materialized views monitoring](materialized-view-monitoring.md) article.