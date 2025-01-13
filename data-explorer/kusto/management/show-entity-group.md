# .show entity_group(s)

Lists all the [stored entity groups](entity-groups.md) in the currently-selected database.
To return only one specific entity group, see [.show entity_group](#show-entity_group).

## .show entity_groups

```kusto
.show entity_groups
```

Requires [database user permission](../management/access-control/role-based-authorization.md).
 
|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the entity group. 
|Entities|String|The value of the entity group as an array that includes the entities.
 
**Output example** 

|Name|Entities|
|---|---|
|eg1|["cluster('c1').database('d1')"]|
|eg2|["cluster('c2').database('d2')"]|


## .show entity_group

```kusto
.show entity_group MyEntityGroup1
```

Lists the details of one specific stored entity group. 
For a list of **all** entity groups, see [.show entity_groups](#show-entity_groups).

**Syntax**

`.show` `entity_group` *EntityGroupName*

**Output**

|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the entity group. 
|Entities|String|The value of the entity group as an array that includes the entities.
 
> [!NOTE] 
> * If the entity group does not exist, an error is returned.
> * Requires [database user permission](../management/access-control/role-based-authorization.md).
 
**Example** 

```kusto
.show entity_group eg1
```

|Name|Entities|
|---|---|
|eg1|["cluster('c1').database('d1')"]|
