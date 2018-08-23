# make-dictionary() (aggregation function)

Returns a `dynamic` (JSON) property-bag (dictionary) of all the values of *Expr* in the group.

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

**Syntax**

`summarize` `make-dictionary(`*Expr*` [`,` *MaxListSize*]`)`

**Arguments**

* *Expr*: Expression of type `dynamic` that will be used for aggregation calculation.
* *MaxListSize* is an optional integer limit on the maximum number of elements returned (default is *128*).

**Returns**

Returns a `dynamic` (JSON) property-bag (dictionary) of all the values of *Expr* in the group which are property-bags (dictionaries).
Non-dictionary values will be skipped.
If a key appears in more than one row- an arbitrary value (out of the possible values for this key) will be chosen.

**See also**

See [bag-unpack()](/queryLanguage/bag-unpackplugin.md) plugin for expanding dynamic JSON objects into columns using property bag keys. 

**Examples**

<!-- csl -->
```
let T = datatable(prop:string, value:string)
[
    "prop01", "val-a",
    "prop02", "val-b",
    "prop03", "val-c",
];
T
| extend p = pack(prop, value)
| summarize dict=make-dictionary(p)

```

|dict|
|----|
|{ "prop01": "val-a", "prop02": "val-b", "prop03": "val-c" } |
