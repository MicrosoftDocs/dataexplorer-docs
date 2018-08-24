#Splunk to Kusto - Structure and concepts

 | Concept  | Splunk | Kusto |  Comment
 | --- | --- | --- | ---
 | Deployment unit  | cluster |  cluster |  Kusto allows arbitrary cross cluster queries, Splunk does not
 | Data caches |  buckets  |  Caching and retention policies |  controls the period and caching level for the data, this settings directly impacts the performance of queries and cost of the deployment   
 | Logical partition of data  |  index  |  database  |  Allows logical separation of the data, both implementations allows union and joining across these partitions
 | Structured event metadata | N/A | table |  Splunk does not have the concept exposed to the search language of event metadata, Kusto has the concept of tables which has columns, each event instance is mapped to a row
 | Data record | event | row |  only terminology change
 | Data record attribute | field |  column |  same concept, in Kusto its predefined as part of the table structure in Splunk each event has its own set of fields  
 | Types | datatype |  datatype |  same concept, Kusto datatypes are more explicit as they are set on the columns, both has the ability to work dynamically with the data types (convert and query) and roughly equivalent set of datatypes including JSON support 
 | Query and search  | search | query |  these are essentially the same
 | Admin commands | admin CLI  | admin commands |  in Kusto these are part of the language prefixed with a ".", in Splunk the user has to use config files and CLI,  in a very few cases the query language can be used for such commands, for example to delete rows
 | Event ingestion time | System Time | ingestion-time() |  In Splunk each event gets a system timestamp of the time that the event was indexed, In Kusto user can define a policy called ingestion-time that exposes a system column that can be referenced through the ingestion-time() function


