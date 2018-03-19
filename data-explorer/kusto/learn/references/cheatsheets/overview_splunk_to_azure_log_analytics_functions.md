#Splunk to Azure Log Analytics - Functions  

The following table specifies the Splunk functions and the applicable Azure Log Analytics functions

|Splunk | Azure Log Analytics |Comment
|---|---|---
|strcat | strcat()| (1)
|split  | split() | (1)
|if     | iff()   | (1)
|tonumber | <ul style="list-style-type: none; padding: 0;"><li>todouble()</li><li>tolong()</li><li>toint()</li></ul> | (1)
|<ul style="list-style-type: none; padding: 0;"><li>upper</li><li>lower</li></ul> | <ul style="list-style-type: none; padding: 0;"><li>[toupper()](~/queryLanguage/query_language_toupperfunction.md)</li><li>[tolower()](~/queryLanguage/query_language_tolowerfunction.md)</li></ul>|(1)
| replace | replace() | (1), also note that while replace() takes three parameters in both Splunk and Azure Log Analytics, the parameters are different
| substr | substring() | (1), also note that Splunk uses 1-based indices, Azure Log Analytics notes 0-based indices
| tolower |  [tolower()](~/queryLanguage/query_language_tolowerfunction.md)| (1)  
| toupper | [toupper()](~/queryLanguage/query_language_toupperfunction.md) | (1)  
| match | [matches regex] (~/queryLanguage/query_language_whereoperator.md) |  (2)  
| regex | [matches regex] (~/queryLanguage/query_language_whereoperator.md) | technically in Splunk regex is an operator, in Azure Log Analytics it's a relational operator
| searchmatch | == | in splunk searchmatch allows searching for the exact string
| random | <ul style="list-style-type: none; padding: 0;"><li>rand()</li><li>rand(n)</li></ul> | Splunk's function returns a number from zero to 2<sup>31</sup>-1. Azure Log Analytics' returns a number between 0.0 and 1.0, or if a parameter provided, between 0 and n-1.
| now | now() | (1)
| relative_time | totimespan() | (1). In Azure Log Analytics, Splunk's equivalent of relative_time(datetimeVal, offsetVal) is datetimeVal + totimespan(offsetVal). For example, `search | eval n=relative_time(now(), "-1d@d")` becomes ` ...  | extend myTime = now() - totimespan("1d")`

(1) In Splunk, invoked via eval operator; in Azure Log Analytics, used as part of `extend`, `project`, etc
(2) In splunk it is invoked via the 'eval' operator, in Azure Log Analytics it is a relation operator of the 'where' operator