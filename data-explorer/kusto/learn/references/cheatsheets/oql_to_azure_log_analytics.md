## Legacy to new Azure Log Analytics Query Language cheat sheet

This document provides a comparison of common queries between the legacy query language and the new Azure Log Analytics query language.
You can use this as a quick reference in your transition to using Azure Log Analytics.

Description								| Legacy Query                           																								|New Azure Log Analytics Query
----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------
Return all data from a table	     	|<code>Type=Event</code>       																											|<code>Event</code>
Return specific columns from a table	|<code>Type=Event &#124; select Source, EventLog, EventID</code>																		|<code>Event <br>&#124; project Source, EventLog, EventID</code>
Return 100 records from a table			|<code>Type=Event &#124; top 100</code>																									|<code>Event <br>&#124; take 100</code>
String comparison: equality				|<code>Type=Event Computer=srv01.contoso.com</code>																						|<code>Event <br>&#124; where Computer == "srv01.contoso.com"</code>
String comparison: substring			|<code>Type=Event Computer=contains("contoso")</code>																					|<code>Event <br>&#124; where Computer contains "contoso"</code>
String comparison: regex				|<code>Type=Event Computer=RegEx("@contoso@") </code>																					|<code>Event <br>&#124; where Computer matches regex ".contoso"</code>
Date comparison: last 1 day				|<code>Type=Event TimeGenerated > NOW-1DAYS</code>																						|<code>Event <br>&#124; where TimeGenerated > ago(1d)</code>
Date comparison: date range				|<code>Type=Event TimeGenerated>2017-05-01 <br>TimeGenerated<2017-05-31</code>															|<code>Event <br>&#124; where TimeGenerated between (datetime(2017-05-01) .. datetime(2017-05-31))</code>
Int comparison: number range			|<code>Type=Event EventID:[529..537]</code>																								|<code>Event <br>&#124; where EventID between (500 .. 1500)</code>
Boolean comparison						|<code>Type=Heartbeat IsGatewayInstalled=false</code>																					|<code>Heartbeat <br>&#124; where IsGatewayInstalled == false</code>
Sort									|<code>Type=Event &#124; sort Computer asc, EventLog desc, EventLevelName asc</code>													|<code>Event <br>&#124; sort by Computer asc, EventLog desc, EventLevelName asc</code>
Distinct								|<code>Type=Event &#124; dedup Computer &#124; select Computer</code>																	|<code>Event <br>&#124; summarize by Computer, EventLog</code>
Measure, Aggregation					|<code>Type=Event &#124; measure count() as Count by Computer</code>																	|<code>Event <br>&#124; summarize Count = count() by Computer</code>
Aggregation by interval					|<code>Type=Perf CounterName="% Processor Time" <br>&#124; measure avg(CounterValue) by Computer interval 5minute</code>				|<code>Perf <br>&#124; where CounterName=="% Processor Time" <br>&#124; summarize avg(CounterValue) by Computer, bin(TimeGenerated, 5min)</code>
Aggregation with limit					|<code>Type=Event &#124; measure count() by Computer &#124;top 10</code>																|<code>Event <br>&#124; summarize AggregatedValue = count() by Computer <br>&#124; limit 10</code>
Extend, iff								|<code>Type=Perf CounterName="% Processor Time" <br>&#124; EXTEND if(map(CounterValue,0,50,0,1),"HIGH","LOW") <br>as UTILIZATION</code>	|<code>Perf <br>&#124; where CounterName == "% Processor Time" <br>&#124; extend Utilization = iff(CounterValue > 50, "HIGH", "LOW")</code>
Union									|<code>Type=Event or Type=Syslog</code>					 																				|<code>union Event, Syslog</code>
Join									|<code>Type=NetworkMonitoring &#124; join inner AgentIP (Type=Heartbeat) ComputerIP</code>												|<code>NetworkMonitoring <br>&#124; join kind=inner (search Type == "Heartbeat") on $left.AgentIP == $right.ComputerIP</code>

