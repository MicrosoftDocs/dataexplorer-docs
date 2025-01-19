# .alter entity_group 

Alters an existing entity group and stores it inside the database metadata. 

    
**Syntax**

`.alter` `entity_group` [`ifnotexists`] *EntityGroupName* `(` EntityReference1 , ... `)`

**Output**    
    
|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the entity group. 
|Entities  |String | An array of the entities defined into the entity group.

> [!NOTE]
> * If the entity group doesn't exist, an error is returned. For creating a new entity group, see [.create entity_group](entity-group-create.md)
> * Requires [database admin permission](../management/access-control/role-based-authorization.md)

**Examples** 

```kusto
.alter entity_group MyEntityGroup  (cluster('c1').database('d1'))
```

|Name|Entities|
|---|---|
|MyEntityGroup|["cluster('c1').database('d1')"]|
