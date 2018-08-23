#Splunk to Kusto - Operators  

Note: *For the purpose of this document the splunk field 'rule' maps to a table in kusto and the ingestion-time() column maps to Splunk default timestamp*

**<u>Search</u>**      
Splunk:  **search** `search Session.Id="c8894ffd-e684-43c9-9125-42adc25cd3fc" earliest=-24h`   
Kusto:  **find** `find Session.Id=="c8894ffd-e684-43c9-9125-42adc25cd3fc" and ingestion-time()> ago(24h)`   
comment: In Splunk you can omit the 'search' keyword and specify an unquoted string. In Kusto you must start each search with "find", an unquoted string is a column name and the lookup value must be a quoted string

**<u>Filter</u>**  
Splunk:  **search** `Event.Rule="330009.2" Session.Id="c8894ffd-e684-43c9-9125-42adc25cd3fc" _indextime>-24h`  
Kusto:  **where** `Office-Hub-OHubBGTaskError | where Session-Id == "c8894ffd-e684-43c9-9125-42adc25cd3fc" and ingestion-time() > ago(24h)`  
comment: Kusto queries start from a tabular result set where the filter is applied to, in Splunk filtering is the default operation on the current index. Please note that you can also use `where` operator in Splunk as well but it is not recommended  

**<u>Getting n events/rows for inspection</u>**  
Splunk:  **head** `Event.Rule=330009.2 | head 100`    
Kusto:  **limit** `Office-Hub-OHubBGTaskError| limit 100`    
comment:  Kusto also support "take" as an alias to "limit". In Splunk, if the results are ordered, head will return the first n results. In Kusto limit is not ordered, it's the first n rows that were found      

**<u>Getting the first n events/rows ordered by a field/column</u>**  
Splunk:  **head** `Event.Rule="330009.2" | sort Event.Sequance | head 20`    
Kusto:  **top** `Office-Hub-OHubBGTaskError|  top 20 by Event-Sequence`    
comment:  For bottom results, in Splunk you use `tail` in Kusto you can specify the ordering direction (`asc`)       

**<u>Extending the result set with new fields/columns</u>**  
Splunk:  **eval** `Event.Rule=330009.2 |  eval state= if(Data.Exception = "0", "success", "error")`    
Kusto:  **extend** `Office-Hub-OHubBGTaskError| extend state = iif(Data-Exception == 0,"success" ,"error")`  
comment: Splunk also has an 'eval' function which is not to be confused with the 'eval' operator, 'eval', both the 'eval' operator in Splunk and the 'extend' operator in Kusto only support scalar functions and arithmetic operators    

**<u>Rename</u>**  
Splunk:  **rename** `Event.Rule=330009.2 | rename Date.Exception as execption`     
Kusto:  **extend** `Office-Hub-OHubBGTaskError| extend execption = Date-Exception`    
comment: Kusto uses the same operator to rename and to create a new field, Splunk has two operators (eval and rename)  

**<u>Format results/Projection</u>**  
Splunk:  **table** `Event.Rule=330009.2 | table rule, state`   
Kusto:  **project, project-away** `Office-Hub-OHubBGTaskError| project exception, state`   
comment: Splunk does not seem to have an operator similar to project-away, users can use the UI to filter away fields.  

**<u>Aggregation</u>**  
Splunk:  **stats** `search (Rule=120502.*) | stats count by OSEnv, Audience`   
Kusto:  **summarize** `Office-Hub-OHubBGTaskError | summarize count() by App-Platform, Release-Audience`   
comment: please see the aggregation functions section for the different aggregation functions  

**<u>Join</u>**   
Splunk:  **join** `Event.Rule=120103* | stats by Client.Id, Data.Alias | join Client.Id max=0 [search earliest=-24h Event.Rule="150310.0" Data.Hresult=-2147221040]`     
Kusto:  **join** `cluster("OAriaPPT").database("Office PowerPoint").Office-PowerPoint-PPT-Exceptions  
| where  Data-Hresult== -2147221040 
|join kind = inner (Office-System-SystemHealthMetadata 
| summarize by Client-Id, Data-Alias  
)on Client-Id`  
comment: join in Splunk has severe limitations, first the sub query has a limit set in the deployment configuration file of 10,000 results, in addition it has a very limited join flavors. 

**<u>Sort</u>**  
Splunk:  **sort** `Event.Rule=120103* | sort Data.Hresult | reverse`   
Kusto:  **order by** `Office-Hub-OHubBGTaskError | order by Data-Hresult,  desc`   
comment: In Splunk to sort in ascending order one must use the operator *reverse*, Kusto also supports defining where to put nulls (at the beginning or at the end)

**<u>Multivalue expand</u>**   
Splunk:  **mvexpand** | `mvexpand foo`   
Kusto:  **mvexpand** | `mvexpand foo`  
comment: similar operator  

**<u>Results facets, interesting fields</u>**   
Splunk:  **fields** `Event.Rule=330009.2 | fields App.Version, App.Platform`  
Kusto:  **facets** `Office-Excel-BI-PivotTableCreate | facet by App-Branch, App-Version`  
comment: In Kusto only the first column is exposed in Kusto Explorer, you can get the rest using the API  

**<u>De-duplicate</u>**   
Splunk:  **dedup** `Event.Rule=330009.2 | dedup device-id sortby -batterylife`     
Kusto:  **summarize arg-max()** `Office-Excel-BI-PivotTableCreate | summarize arg-max(batterylife, *) by device-id`  
comment: to reverse the order of which record gets chosen, one can use **summarize arg-min()** instead.
