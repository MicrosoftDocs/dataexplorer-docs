---
title: Run an update policy with a managed identity
description: This article describes how to use a managed identity for update policy in Azure Data Explorer.
ms.reviewer: atefsawaed
ms.topic: reference
ms.date: 08/15/2023
---
# Use a managed identity to run an update policy

The update policy must be configured with a [managed identity](../../managed-identities-overview.md) in the following scenarios:
- When the update policy query references tables in other databases.
- When the update policy query references tables with an enabled [row level security policy](./rowlevelsecuritypolicy.md).

An update policy configured with a managed identity is performed on behalf of the managed identity.

In this article, you learn how to configure a system-assigned or user-assigned managed identity and set up that identity to create an update policy.

## Prerequisites

* A cluster and database. [Create a cluster and database](../../create-cluster-and-database.md).
* [AllDatabasesAdmin](../access-control/role-based-access-control.md) permissions on the database.

## 1 - Configure a managed identity for update policy

There are two types of managed identities:

* **System-assigned**: A system-assigned identity is connected to your cluster and is removed when the cluster is removed. Only one system-assigned identity is allowed per cluster.

* **User-assigned**: A user-assigned managed identity is a standalone Azure resource. Multiple user-assigned identities can be assigned to your cluster.

Select one of the following tabs to set up your preferred managed identity type.

### [User-assigned](#tab/user-assigned)

1. Follow the steps to [Add a user-assigned identity](../../configure-managed-identities-cluster.md#add-a-user-assigned-identity).

1. In the Azure portal, in the left menu of your managed identity resource, select **Properties**. Copy and save the **Tenant Id** and **Principal Id** for use in the following steps.

    :::image type="content" source="../../media/update-policy/managed-identity-ids.png" alt-text="Screenshot of Azure portal area with managed identity ids." lightbox="../../media/update-policy/managed-identity-ids.png":::

1. Run the following [.alter-merge managed_identity policy](./alter-merge-managed-identity-policy-command.md) command, replacing `<objectId>` with the managed identity object ID from the previous step. This command sets a [managed identity policy](../management/managed-identity-policy.md) on the cluster that allows the managed identity to be used with the update policy.

    ````kusto
    .alter-merge cluster policy managed_identity ```[
        {
          "ObjectId": "<objectId>",
          "AllowedUsages": "AutomatedFlows"
        }
    ]```
    ````

    > [!NOTE]
    > To set the policy on a specific database, use `database <DatabaseName>` instead of `cluster`.

1. Run the following command to grant the managed identity [Database Viewer](../access-control/role-based-access-control.md) permissions over all databases referenced by the update policy query.

    ```kusto
    .add database <DatabaseName> viewers ('aadapp=<objectId>;<tenantId>')
    ```

    Replace `<DatabaseName>` with the relevant database, `<objectId>` with the managed identity **Principal Id** from step 2, and `<tenantId>` with the Azure Active Directory **Tenant Id** from step 2.

### [System-assigned](#tab/system-assigned)

1. Follow the steps to [Add a system-assigned identity](../../configure-managed-identities-cluster.md#add-a-system-assigned-identity).

1. Copy and save the **Object (principal) ID** for use in a later step.

1. Run the following [.alter-merge managed_identity policy](./alter-merge-managed-identity-policy-command.md) command. This command sets a [managed identity policy](../management/managed-identity-policy.md) on the cluster that allows the managed identity to be used with the update policy.

    ````kusto
    .alter-merge cluster policy managed_identity ```[
        {
          "ObjectId": "system",
          "AllowedUsages": "AutomatedFlows"
        }
    ]```
    ````

    > [!NOTE]
    > To set the policy on a specific database, use `database <DatabaseName>` instead of `cluster`.

1. Run the following command to grant the managed identity [Database Viewer](../access-control/role-based-access-control.md) permissions over all databases referenced by the update policy query.

    ```kusto
    .add database <DatabaseName> viewers ('aadapp=<objectId>')
    ```

    Replace `<DatabaseName>` with the relevant database and `<objectId>` with the managed identity **Object (principal) ID** from step 2.

---

## 2 - Create an update policy

Select one of the following tabs to create an update policy that will run on behalf of a user-assigned or system-assigned managed identity.

### [User-assigned](#tab/user-assigned)

Run the [.alter table policy update](alter-table-update-policy-command.md) command with the `ManagedIdentity` property set to the managed identity object ID.

For example, the following command alters the update policy of the table `MyTable` in `MyDatabase` database that references the table `OtherTable` in the database `OtherDatabase` on behalf of a user-assigned managed identity. `<objectId>` should be a managed identity object ID.

````kusto
.alter table MyDatabase.MyTable policy update
```
[
    {
        "IsEnabled": true,
        "Source": "MyTable",
        "Query": "UpdatePolicyFunction",
        "IsTransactional": false,
        "PropagateIngestionProperties": false,
        "ManagedIdentity": "<objectId>"
    }
]
```
````

### [System-assigned](#tab/system-assigned)

Run the [.alter table policy update](alter-table-update-policy-command.md) command with the `ManagedIdentity` property set to the managed identity object ID.

For example, the following command alters the update policy of the table `MyTable` in `MyDatabase` database that references the table `OtherTable` in the database `OtherDatabase` on behalf of your system-assigned managed identity.

````kusto
.alter table MyDatabase.MyTable policy update
```
[
    {
        "IsEnabled": true,
        "Source": "MyTable",
        "Query": "UpdatePolicyFunction",
        "IsTransactional": false,
        "PropagateIngestionProperties": false,
        "ManagedIdentity": "system"
    }
]
```
````
