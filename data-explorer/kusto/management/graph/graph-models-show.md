---
title: .show graph_models command
description: Learn how to list all graph models in a database using the .show graph_models command with syntax, parameters, and examples.
ms.reviewer: herauch
ms.topic: reference
ms.date: 05/24/2025
---

# .show graph_models (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in public preview. Functionality and syntax are subject to change before General Availability.

Lists all graph models in the database, showing the latest version for each model by default.v

## Permissions

To run this command, the user needs [Database admin permissions](../../access-control/role-based-access-control.md).

## Syntax

`.show` `graph_models` [`with` `(`*Property* `=` *Value* [`,` ...]`)`]

`.show` `graph_models` [`with` `(`*Property* `=` *Value* [`,` ...]`)`] `details`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*Property*|String|❌|A property to control which versions to show. See [Properties](#properties).|
|*Value*|String|❌|The value of the corresponding property.|

### Properties

|Name|Type|Required|Description|
|--|--|--|--|
|`showAll`|Boolean|❌|If set to `true`, returns all versions of every graph model. If set to `false` or not specified, returns only the latest version of each graph model.|

## Returns

### Basic output format

When using `.show graph_models` without the `details` parameter, the command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|Name|String|The name of the graph model.|
|CreationTime|DateTime|The date and time when the graph model was created.|
|Id|Guid|A unique identifier (GUID) for the graph model version.|

### Detailed output format

When using `.show graph_models details`, the command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|Name|String|The name of the graph model.|
|CreationTime|DateTime|The date and time when the graph model was created.|
|Id|Guid|A unique identifier (GUID) for the graph model version.|
|SnapshotsCount|Long|The number of snapshots available for this graph model.|
|Model|Dynamic|A JSON object containing the graph model definition and properties.|
|AuthorizedPrincipals|Dynamic|A JSON array of principals authorized to access this graph model.|
|RetentionPolicy|Dynamic|A JSON object defining the retention policy for this graph model.|

## Examples

### Show the latest version of all graph models

```kusto
.show graph_models
```

**Output**

|Name|CreationTime|Id|
|---|---|---|
|SocialNetwork|2025-04-23T14:32:18Z|f8d7a45b-3c76-4d92-a814-9e3f62e18209|
|ProductRecommendations|2025-04-15T09:45:12Z|a1b2c3d4-e5f6-4a3b-8c7d-9e0f1a2b3c4d|
|NetworkTraffic|2025-04-12T15:42:18Z|b72a9c14-5e83-47df-b1c5-23e791d568fa|

### Show all versions of all graph models

```kusto
.show graph_models with (showAll = true)
```

**Output**

|Name|CreationTime|Id|
|---|---|---|
|SocialNetwork|2025-03-05T11:23:45Z|e4c8a743-1d2f-48e9-b7a5-96c31e2b4f0d|
|SocialNetwork|2025-03-28T09:18:32Z|7b29e4f6-5d81-42ab-93c7-8d615f0a92e3|
|SocialNetwork|2025-04-23T14:32:18Z|f8d7a45b-3c76-4d92-a814-9e3f62e18209|
|ProductRecommendations|2025-03-10T14:25:38Z|c6e9f875-2d3a-41b7-8c5e-9f1a2b3c4d5e|
|ProductRecommendations|2025-04-15T09:45:12Z|a1b2c3d4-e5f6-4a3b-8c7d-9e0f1a2b3c4d|
|NetworkTraffic|2025-03-10T13:24:56Z|5a9b8c7d-6e5f-4321-ba98-7c6d5e4f3a21|
|NetworkTraffic|2025-03-25T10:15:22Z|1f2e3d4c-5b6a-4897-ae32-1b2c3d4e5f67|
|NetworkTraffic|2025-04-12T15:42:18Z|b72a9c14-5e83-47df-b1c5-23e791d568fa|

### Show detailed information for the latest version of all graph models

```kusto
.show graph_models details
```

**Output**

|Name|CreationTime|Id|SnapshotsCount|Model|AuthorizedPrincipals|RetentionPolicy|
|---|---|---|---|---|---|---|
|SocialNetwork|2025-04-23T14:32:18Z|f8d7a45b-3c76-4d92-a814-9e3f62e18209|3|{}|[{"Type":"AAD User", "DisplayName":"Alex Johnson (upn: alex.johnson@contoso.com)", "ObjectId":"aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb", "FQN":"aaduser=aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb;aaaabbbb-0000-cccc-1111-dddd2222eeee", "Notes":"", "RoleAssignmentIdentifier":"a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1"}]|{"SoftDeletePeriod":"365000.00:00:00"}|
|ProductRecommendations|2025-04-15T09:45:12Z|a1b2c3d4-e5f6-4a3b-8c7d-9e0f1a2b3c4d|2|{}|[{"Type":"AAD User", "DisplayName":"Maria Garcia (upn: maria.garcia@contoso.com)", "ObjectId":"bbbbbbbb-1111-2222-3333-cccccccccccc", "FQN":"aaduser=bbbbbbbb-1111-2222-3333-cccccccccccc;aaaabbbb-0000-cccc-1111-dddd2222eeee", "Notes":"", "RoleAssignmentIdentifier":"a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1"}]|{"SoftDeletePeriod":"365000.00:00:00"}|
|NetworkTraffic|2025-04-12T15:42:18Z|b72a9c14-5e83-47df-b1c5-23e791d568fa|3|{}|[{"Type":"AAD User", "DisplayName":"Sam Wilson (upn: sam.wilson@contoso.com)", "ObjectId":"cccccccc-2222-3333-4444-dddddddddddd", "FQN":"aaduser=cccccccc-2222-3333-4444-dddddddddddd;aaaabbbb-0000-cccc-1111-dddd2222eeee", "Notes":"", "RoleAssignmentIdentifier":"a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1"}]|{"SoftDeletePeriod":"365000.00:00:00"}|

### Show detailed information for all versions of all graph models

```kusto
.show graph_models details with (showAll = true)
```

**Output**

|Name|CreationTime|Id|SnapshotsCount|Model|AuthorizedPrincipals|RetentionPolicy|
|---|---|---|---|---|---|---|
|SocialNetwork|2025-03-05T11:23:45Z|e4c8a743-1d2f-48e9-b7a5-96c31e2b4f0d|3|{}|[{"Type":"AAD User", "DisplayName":"Alex Johnson (upn: alex.johnson@contoso.com)", "ObjectId":"aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb", "FQN":"aaduser=aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb;aaaabbbb-0000-cccc-1111-dddd2222eeee", "Notes":"", "RoleAssignmentIdentifier":"a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1"}]|{"SoftDeletePeriod":"365000.00:00:00"}|
|SocialNetwork|2025-03-28T09:18:32Z|7b29e4f6-5d81-42ab-93c7-8d615f0a92e3|3|{}|[{"Type":"AAD User", "DisplayName":"Alex Johnson (upn: alex.johnson@contoso.com)", "ObjectId":"aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb", "FQN":"aaduser=aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb;aaaabbbb-0000-cccc-1111-dddd2222eeee", "Notes":"", "RoleAssignmentIdentifier":"a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1"}, {"Type":"AAD Group", "DisplayName":"Data Scientists (upn: data.scientists@contoso.com)", "ObjectId":"dddddddd-3333-4444-5555-eeeeeeeeeeee", "FQN":"aadgroup=dddddddd-3333-4444-5555-eeeeeeeeeeee;aaaabbbb-0000-cccc-1111-dddd2222eeee", "Notes":"Read-only access", "RoleAssignmentIdentifier":"a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1"}]|{"SoftDeletePeriod":"365000.00:00:00"}|
|SocialNetwork|2025-04-23T14:32:18Z|f8d7a45b-3c76-4d92-a814-9e3f62e18209|3|{}|[{"Type":"AAD User", "DisplayName":"Alex Johnson (upn: alex.johnson@contoso.com)", "ObjectId":"aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb", "FQN":"aaduser=aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb;aaaabbbb-0000-cccc-1111-dddd2222eeee", "Notes":"", "RoleAssignmentIdentifier":"a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1"}, {"Type":"AAD Group", "DisplayName":"Data Scientists (upn: data.scientists@contoso.com)", "ObjectId":"dddddddd-3333-4444-5555-eeeeeeeeeeee", "FQN":"aadgroup=dddddddd-3333-4444-5555-eeeeeeeeeeee;aaaabbbb-0000-cccc-1111-dddd2222eeee", "Notes":"Read-only access", "RoleAssignmentIdentifier":"a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1"}]|{"SoftDeletePeriod":"365000.00:00:00"}|
|ProductRecommendations|2025-03-10T14:25:38Z|c6e9f875-2d3a-41b7-8c5e-9f1a2b3c4d5e|2|{}|[{"Type":"AAD User", "DisplayName":"Maria Garcia (upn: maria.garcia@contoso.com)", "ObjectId":"bbbbbbbb-1111-2222-3333-cccccccccccc", "FQN":"aaduser=bbbbbbbb-1111-2222-3333-cccccccccccc;aaaabbbb-0000-cccc-1111-dddd2222eeee", "Notes":"", "RoleAssignmentIdentifier":"a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1"}]|{"SoftDeletePeriod":"365000.00:00:00"}|
|ProductRecommendations|2025-04-15T09:45:12Z|a1b2c3d4-e5f6-4a3b-8c7d-9e0f1a2b3c4d|2|{}|[{"Type":"AAD User", "DisplayName":"Maria Garcia (upn: maria.garcia@contoso.com)", "ObjectId":"bbbbbbbb-1111-2222-3333-cccccccccccc", "FQN":"aaduser=bbbbbbbb-1111-2222-3333-cccccccccccc;aaaabbbb-0000-cccc-1111-dddd2222eeee", "Notes":"", "RoleAssignmentIdentifier":"a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1"}, {"Type":"AAD Service Principal", "DisplayName":"ProductAnalytics App (app: product.analytics@contoso.com)", "ObjectId":"eeeeeeee-4444-5555-6666-ffffffffffff", "FQN":"aadapp=eeeeeeee-4444-5555-6666-ffffffffffff;aaaabbbb-0000-cccc-1111-dddd2222eeee", "Notes":"Automated reporting", "RoleAssignmentIdentifier":"a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1"}]|{"SoftDeletePeriod":"365000.00:00:00"}|

## Notes

- By default, this command returns only the latest version of each graph model.
- When using the `showAll` parameter set to `true`, you can see the complete version history of all graph models in your database.
- Use the `details` keyword to get detailed information about graph models, including the model definition, authorized principals, and retention policy.
- The basic output format (without `details`) provides a quick overview of available graph models.
- The detailed output format (with `details`) provides comprehensive information about the graph models, useful for administrative and audit purposes.
- The results are ordered alphabetically by graph model name, and then by creation date within each model when showing all versions.

## Related content

* [Graph model overview](graph-model-overview.md)
* [.show graph_model](graph-model-show.md)
* [.create-or-alter graph_model](graph-model-create-or-alter.md)
* [.drop graph_model](graph-model-drop.md)
