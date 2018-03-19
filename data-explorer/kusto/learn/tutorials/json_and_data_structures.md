# Working with JSON and Data Structures
#### (15 min to read)

<br/>
> [!Note]
> Before you start...<br/>
> If you haven't completed the [Charts and diagrams](~/learn/tutorials/charts.md) tutorial yet, we recommend that you do so.

Nested objects are objects that contain other objects (which can also contain other objects) in an array or a map of key-value pairs, and they are represeted as JSON strings.
This tutorial reviews how JSON is used to retrieve data and analyze nested object effectively.

## Working with JSON strings
While a JSON object can be stored as an actual object (known as a "dynamic" data type - see the next section for details), often we simply want to store JSON objects as a string. 

In order to access a specific JSON element in a known path, use _extractjson_.
Path expressions use:
1. "$" to refer to the root folder
2. Names or indexes of elements. Both the [bracket] notation and dot notation are supported.

We'll work with the following JSON object in the examples below:
```JSON
{
    "hosts":
    [
        {
            "location": "North_DC",
            "status": "running",
            "rate": 5
        },
        {
            "location": "South_DC",
            "status": "stopped",
            "rate": 3
        }
    ]
}
```

Using _extractjson_ we can easily retrieve the status value of a specific host object, like this: 
```AIQL
let hosts_report='{"hosts": [{"location":"North_DC", "status":"running", "rate":5},{"location":"South_DC", "status":"stopped", "rate":3}]}';
print hosts_report
| extend status = extractjson("$.hosts[0].status", hosts_report)
```

or with the brackets notation:
```AIQL
let hosts_report='{"hosts": [{"location":"North_DC", "status":"running", "rate":5},{"location":"South_DC", "status":"stopped", "rate":3}]}';
print hosts_report 
| extend status = extractjson("$['hosts'][0]['status']", hosts_report)
```

If no arrays are involved, the dot notation can be used, and is much easier to read:
```AIQL
let hosts_report='{"location":"North_DC", "status":"running", "rate":5}';
print hosts_report 
| extend status = hosts_report.status
```


## Working with objects

### mvexpand
In case you'd like to access several elements in your json structure, it's much better to access it as a dynamic object.
If not stored as "dynamic" data originally, use _parsejson_ to cast text data to a dynamic object:
```AIQL
let hosts_object = parsejson('{"hosts": [{"location":"North_DC", "status":"running", "rate":5},{"location":"South_DC", "status":"stopped", "rate":3}]}');
print hosts_object 
| extend status0=hosts_object.hosts[0].status, rate1=hosts_object.hosts[1].rate
```

Once converted to a dynamic type, we can use additional functions to analyze our data:
### arraylength
To count the number of elements in an array, use *"arraylength"*:
```AIQL
let hosts_object = parsejson('{"hosts": [{"location":"North_DC", "status":"running", "rate":5},{"location":"South_DC", "status":"stopped", "rate":3}]}');
print hosts_object 
| extend hosts_num=arraylength(hosts_object.hosts)
```

### mvexpand
To pull apart the properties of an object into separate rows, use _mvexpand_:
```AIQL
let hosts_object = parsejson('{"hosts": [{"location":"North_DC", "status":"running", "rate":5},{"location":"South_DC", "status":"stopped", "rate":3}]}');
print hosts_object 
| mvexpand hosts_object.hosts[0]
```
<p><img src="~/learn/tutorials/images/json/mvexpand.png" alt="Log Analytics mvexpand"></p>

### buildschema
To find the minimum schema that admits all values of an object:
```AIQL
let hosts_object = parsejson('{"hosts": [{"location":"North_DC", "status":"running", "rate":5},{"location":"South_DC", "status":"stopped", "rate":3}]}');
print hosts_object 
| summarize buildschema(hosts_object)
```

The output is a schema, in a JSON format as well:
```json
{
    "hosts":
    {
        "indexer":
        {
            "location": "string",
            "rate": "int",
            "status": "string"
        }
    }
}
```
We can see it describes the names of the object fields and their matching data-types. For example, there is a field named "rate", and its type is "int".
Notice that indexer is used to mark where you should use a numeric index.

Sometimes, different nested objects have a different schema. What would be the schema of the following object?
```AIQL
'{"hosts": [{"location":"North_DC", "status":"running", "rate":5},{"status":"stopped", "rate":"3", "range":100}]}'
```

Here it is:
<p><img src="~/learn/tutorials/images/json/buildschema.png" alt="Log Analytics buildschema"></p>

## Next steps
Continue with our advanced tutorials:
* [Advanced query writing](~/learn/tutorials/advanced_query_writing.md)
* [Joins - cross analysis](~/learn/tutorials/joins.md)