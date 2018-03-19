#Splunk to Azure Log Analytics - Operators  

Note: *For the purpose of this document the splunk field 'rule' maps to a table in Azure Log Analytics and the ingestion_time() column maps to Splunk default timestamp*

**<u>Search</u>**      
Splunk:  **search** `search Session.Id="c8894ffd-e684-43c9-9125-42adc25cd3fc" earliest=-24h`   
Azure Log Analytics:  **find** `find Session.Id=="c8894ffd-e684-43c9-9125-42adc25cd3fc" and ingestion_time()> ago(24h)`   
comment: In Splunk you can omit the 'search' keyword and specify an unquoted string. In Azure Log Analytics you must start each search with "find", an unquoted string is a column name and the lookup value must be a quoted string

**<u>Filter</u>**  
Splunk:  **search** `Event.Rule="330009.2" Session.Id="c8894ffd-e684-43c9-9125-42adc25cd3fc" _indextime>-24h`  
Azure Log Analytics:  **where** `Office_Hub_OHubBGTaskError | where Session_Id == "c8894ffd-e684-43c9-9125-42adc25cd3fc" and ingestion_time() > ago(24h)`  
comment: Azure Log Analytics queries start from a tabular result set where the filter is applied to, in Splunk filtering is the default operation on the current index. Please note that you can also use `where` operator in Splunk as well but it is not recommended  

**<u>Getting n events/rows for inspection</u>**  
Splunk:  **head** `Event.Rule=330009.2 | head 100`    
Azure Log Analytics:  **limit** `Office_Hub_OHubBGTaskError| limit 100`    
comment:  Azure Log Analytics also support "take" as an alias to "limit". In Splunk, if the results are ordered, head will return the first n results. In Azure Log Analytics limit is not ordered, it's the first n rows that were found      

**<u>Getting the first n events/rows ordered by a field/column</u>**  
Splunk:  **head** `Event.Rule="330009.2" | sort Event.Sequance | head 20`    
Azure Log Analytics:  **top** `Office_Hub_OHubBGTaskError|  top 20 by Event_Sequence`    
comment:  For bottom results, in Splunk you use `tail` in Azure Log Analytics you can specify the ordering direction (`asc`)       

**<u>Extending the result set with new fields/columns</u>**  
Splunk:  **eval** `Event.Rule=330009.2 |  eval state= if(Data.Exception = "0", "success", "error")`    
Azure Log Analytics:  **extend** `Office_Hub_OHubBGTaskError| extend state = iif(Data_Exception == 0,"success" ,"error")`  
comment: Splunk also has an 'eval' function which is not to be confused with the 'eval' operator, 'eval', both the 'eval' operator in Splunk and the 'extend' operator in Azure Log Analytics only support scalar functions and arithmetic operators    

**<u>Rename</u>**  
Splunk:  **rename** `Event.Rule=330009.2 | rename Date.Exception as execption`     
Azure Log Analytics:  **extend** `Office_Hub_OHubBGTaskError| extend execption = Date_Exception`    
comment: Azure Log Analytics uses the same operator to rename and to create a new field, Splunk has two operators (eval and rename)  

**<u>Format results/Projection</u>**  
Splunk:  **table** `Event.Rule=330009.2 | table rule, state`   
Azure Log Analytics:  **project, project-away** `Office_Hub_OHubBGTaskError| project exception, state`   
comment: Splunk does not seem to have an operator similar to project-away, users can use the UI to filter away fields.  

**<u>Aggregation</u>**  
Splunk:  **stats** `search (Rule=120502.*) | stats count by OSEnv, Audience`   
Azure Log Analytics:  **summarize** `Office_Hub_OHubBGTaskError | summarize count() by App_Platform, Release_Audience`   
comment: please see the aggregation functions section for the different aggregation functions  

**<u>Join</u>**   
Splunk:  **join** `Event.Rule=120103* | stats by Client.Id, Data.Alias | join Client.Id max=0 [search earliest=-24h Event.Rule="150310.0" Data.Hresult=-2147221040]`     
Azure Log Analytics:  **join** `cluster("OAriaPPT").database("Office PowerPoint").Office_PowerPoint_PPT_Exceptions  
| where  Data_Hresult== -2147221040 
|join kind = inner (Office_System_SystemHealthMetadata 
| summarize by Client_Id, Data_Alias  
)on Client_Id`  
comment: join in Splunk has severe limitations, first the sub query has a limit set in the deployment configuration file of 10,000 results, in addition it has a very limited join flavors. 

**<u>Sort</u>**  
Splunk:  **sort** `Event.Rule=120103* | sort Data.Hresult | reverse`   
Azure Log Analytics:  **order by** `Office_Hub_OHubBGTaskError | order by Data_Hresult,  desc`   
comment: In Splunk to sort in ascending order one must use the operator *reverse*, Azure Log Analytics also supports defining where to put nulls (at the beginning or at the end)

**<u>Multivalue expand</u>**   
Splunk:  **mvexpand** | `mvexpand foo`   
Azure Log Analytics:  **mvexpand** | `mvexpand foo`  
comment: similar operator  

**<u>Results facets, interesting fields</u>**   
Splunk:  **fields** `Event.Rule=330009.2 | fields App.Version, App.Platform`  
Azure Log Analytics:  **facets** `Office_Excel_BI_PivotTableCreate  | facet by App_Branch, App_Version`  
comment: In the Log Analytics portal only the first column is exposed. All columns are available through the API.

**<u>De-duplicate</u>**   
Splunk:  **dedup** `Event.Rule=330009.2 | dedup device_id sortby -batterylife`     
Azure Log Analytics:  **summarize arg_max()** `Office_Excel_BI_PivotTableCreate | summarize arg_max(batterylife, *) by device_id`  
comment: to reverse the order of which record gets chosen, one can use **summarize arg_min()** instead.
