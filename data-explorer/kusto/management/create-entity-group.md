# .create entity_group

Creates a stored entity group which is a reusable [`let` statement](../query/letstatement.md)
entity group with the given name. The entity group definition is persisted with the database metadata.

    
**Syntax**

`.create` `entity_group` [`ifnotexists`] *EntityGroupName* `(` EntityReference1 , ... `)`

**Output**    
    
|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the entity group. 
|Entities  |String | An array of the entities defined into the entity group.

> [!NOTE]
> * If entity group already exists:
>    * If `ifnotexists` flag is specified, the command is ignored (no change applied).
>    * If `ifnotexists` flag is NOT specified, an error is returned.
>    * For altering an existing entity group, see [.alter entity_group](entity-group-alter.md)
> * Requires [database admin permission](../management/access-control/role-based-authorization.md).

**Examples** 

```kusto
.create entity_group MyEntityGroup  (cluster('c1').database('d1'), cluster('c2').database('d2'))
```

|Name|Entities|
|---|---|
|MyEntityGroup|["cluster('c1').database('d1')","cluster('c2').database('d2')"]|
