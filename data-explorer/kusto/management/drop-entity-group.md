# .drop entity_group

Drops an entity group from the database.
    
**Syntax**

`.drop` `entity_group` *EntityGroupName*

**Output**    

This command returns a list of the remaining tables in the database.

|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the entity group. 
|Entities  |String | An array of the entities defined into the entity group.

**Examples** 

```kusto
.drop entity_group MyEntityGroup
```
