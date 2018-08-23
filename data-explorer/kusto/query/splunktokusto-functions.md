#Splunk to Kusto - Functions  

The following table specifies the Splunk functions and the applicable Kusto functions

|Splunk | Kusto |Comment
|---|---|---
|strcat | strcat()| (1)
|split  | split() | (1)
|if     | iff()   | (1)
|tonumber | <ul style="list-style-type: none; padding: 0;"><li>todouble()</li><li>tolong()</li><li>toint()</li></ul> | (1)
|<ul style="list-style-type: none; padding: 0;"><li>upper</li><li>lower</li></ul> | <ul style="list-style-type: none; padding: 0;"><li>[toupper()](https://kusdoc2.azurewebsites.net/docs/queryLanguage/toupperfunction.html)</li><li>[tolower()](https://kusdoc2.azurewebsites.net/docs/queryLanguage/tolowerfunction.html)</li></ul>|(1)
| replace | replace() | (1), also note that while replace() takes three parameters in both Splunk and Kusto, the parameters are different
| substr | substring() | (1), also note that Splunk uses 1-based indices, Kusto notes 0-based indices
| tolower |  | (1)  
| toupper | [toupper()](https://kusdoc2.azurewebsites.net/docs/queryLanguage/toupperfunction.html) | (1)  
| match | [matches regex] (https://kusdoc2.azurewebsites.net/docs/queryLanguage/whereoperator.html) |  (2)  
| regex | [matches regex] (https://kusdoc2.azurewebsites.net/docs/queryLanguage/whereoperator.html) | technically in Splunk regex is an operator, in Kusto it's a relational operator
| searchmatch | == | in splunk searchmatch allows searching for the exact string
| random | <ul style="list-style-type: none; padding: 0;"><li>rand()</li><li>rand(n)</li></ul> | Splunk's function returns a number from zero to 2<sup>31</sup>-1. Kusto's returns a number between 0.0 and 1.0, or if a parameter provided, between 0 and n-1.
| now | now() | (1)
| relative-time | totimespan() | (1). In Kusto, Splunk's equivalent of relative-time(datetimeVal, offsetVal) is datetimeVal + totimespan(offsetVal). For example, `search | eval n=relative-time(now(), "-1d@d")` becomes ` ...  | extend myTime = now() - totimespan("1d")`

(1) In Splunk, invoked via eval operator; in Kusto, used as part of `extend`, `project`, etc
(2) In splunk it is invoked via the 'eval' operator, in Kusto it is a relation operator of the 'where' operator
