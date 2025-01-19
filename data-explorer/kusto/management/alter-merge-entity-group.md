# .alter-merge entity_group

Alters and merges an existing entity group with the provided list of entities and stores it inside the database metadata. 

    
**Syntax**

`.alter-merge` `entity_group` *EntityGroupName* `(` EntityReference1 , ... `)`

**Output**    
    
|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the entity group. 
|Entities  |String | An array of the entities defined into the entity group.

> [!NOTE]
> * If the entity group doesn't exist, an error is returned. For creating a new entity group, see [.create entity_group](entity-group-create.md)
> * Requires [database admin permission](../management/access-control/role-based-authorization.md)

**Examples** 

Running the following command to create a new entity group:

```kusto
.create entity_group MyEntityGroup  (cluster('c1').database('d1'))
```

|Name|Entities|
|---|---|
|MyEntityGroup|["cluster('c1').database('d1')"]|


Then running the following command to edit the existing entity group MyEntityGroup and add the entity `cluster('c2').database('d2')` :

```kusto
.alter-merge entity_group MyEntityGroup  (cluster('c2').database('d2'))
```

|Name|Entities|
|---|---|
|MyEntityGroup|["cluster('c1').database('d1')","cluster('c2').database('d2')"]|

