---
title: 'Add cluster principals for Azure Data Explorer'
description: In this article, you learn how to add cluster principals for Azure Data Explorer.
ms.reviewer: lugoldbe
ms.topic: how-to
ms.date: 05/08/2023
---

# Add cluster principals for Azure Data Explorer

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. In this article, you'll learn how to add cluster principals for Azure Data Explorer by using C#, Python, or an Azure Resource Manager (ARM) template.

> For code samples based on previous SDK versions, see the [archived article](/previous-versions/azure/data-explorer/add-cluster-principal).

## Prerequisites

The prerequisites vary based on the method used to add the principal. Choose the relevant tab for your preferred method.

### [C#](#tab/csharp)

The following list outlines the prerequisites to add a cluster principal with C#.

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* [Visual Studio 2022 Community Edition](https://www.visualstudio.com/downloads/). Turn on **Azure development** during the Visual Studio setup.
* [A Microsoft Entra Application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). Save the **Directory (tenant) ID**, **Application ID**, and **Client Secret**.
* Install [Azure.ResourceManager.Kusto](https://www.nuget.org/packages/Azure.ResourceManager.Kusto/).
* Install [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/) for authentication.

### [Python](#tab/python)

The following list outlines the prerequisites to add a cluster principal with Python.

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* [A Microsoft Entra Application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). Save the **Directory (tenant) ID**, **Application ID**, and **Client Secret**.
* Install the [azure-common](https://pypi.org/project/azure-common/) and [azure-mgmt-kusto](https://pypi.org/project/azure-mgmt-kusto/) packages.

### [ARM](#tab/arm)

The following list outlines the prerequisites to add a cluster principal with an ARM template.

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).

---

## Add a cluster principal

### [C#](#tab/csharp)

Run the following code to add a cluster principal:

```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; //Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; //Application ID
var clientSecret = "PlaceholderClientSecret"; //Client Secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
var credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
var resourceManagementClient = new ArmClient(credentials, subscriptionId);
var resourceGroupName = "testrg";
//The cluster that is created as part of the Prerequisites
var clusterName = "mykustocluster";
var subscription = await resourceManagementClient.GetDefaultSubscriptionAsync();
var resourceGroup = (await subscription.GetResourceGroupAsync(resourceGroupName)).Value;
var cluster = (await resourceGroup.GetKustoClusterAsync(clusterName)).Value;
var clusterPrincipalAssignments = cluster.GetKustoClusterPrincipalAssignments(); 
var clusterPrincipalAssignmentName = "mykustoclusterprincipalassignment";
var principalId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; //User email, application ID, or security group name
var role = KustoClusterPrincipalRole.AllDatabasesAdmin; //AllDatabasesAdmin or AllDatabasesViewer
var tenantIdForPrincipal = new Guid("xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx");
var principalType = KustoPrincipalAssignmentType.App; //User, App, or Group
var clusterPrincipalAssignmentData = new KustoClusterPrincipalAssignmentData
{
    ClusterPrincipalId = principalId, Role = role, PrincipalType = principalType, TenantId = tenantIdForPrincipal
};
await clusterPrincipalAssignments.CreateOrUpdateAsync(
    WaitUntil.Completed, clusterPrincipalAssignmentName, clusterPrincipalAssignmentData
);
```

|**Setting** | **Suggested value** | **Field description**|
|---|---|---|
| tenantId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | Your tenant ID. Also known as directory ID.|
| subscriptionId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The subscription ID that you use for resource creation.|
| clientId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client ID of the application that can access resources in your tenant.|
| clientSecret | *PlaceholderClientSecret* | The client secret of the application that can access resources in your tenant. |
| resourceGroupName | *testrg* | The name of the resource group containing your cluster.|
| clusterName | *mykustocluster* | The name of your cluster.|
| clusterPrincipalAssignmentName | *mykustoclusterprincipalassignment* | The name of your cluster principal resource.|
| principalId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The principal ID, which can be user email, application ID, or security group name.|
| role | *AllDatabasesAdmin* | The role of your cluster principal, which can be 'AllDatabasesAdmin', 'AllDatabasesMonitor', or 'AllDatabasesViewer'.|
| tenantIdForPrincipal | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The tenant ID of the principal.|
| principalType | *App* | The type of the principal, which can be 'User', 'App', or 'Group'|

### [Python](#tab/python)

Run the following code to add a cluster principal:

```Python
from azure.mgmt.kusto import KustoManagementClient
from azure.mgmt.kusto.models import ClusterPrincipalAssignment
from azure.common.credentials import ServicePrincipalCredentials

#Directory (tenant) ID
tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Application ID
client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Client Secret
client_secret = "xxxxxxxxxxxxxx"
subscription_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
credentials = ServicePrincipalCredentials(
        client_id=client_id,
        secret=client_secret,
        tenant=tenant_id
    )
kusto_management_client = KustoManagementClient(credentials, subscription_id)

resource_group_name = "testrg"
#The cluster that is created as part of the Prerequisites
cluster_name = "mykustocluster"
principal_assignment_name = "clusterPrincipalAssignment1"
#User email, application ID, or security group name
principal_id = "xxxxxxxx"
#AllDatabasesAdmin, AllDatabasesMonitor or AllDatabasesViewer
role = "AllDatabasesAdmin"
tenant_id_for_principal = tenantId
#User, App, or Group
principal_type = "App"

#Returns an instance of LROPoller, check https://learn.microsoft.com/python/api/msrest/msrest.polling.lropoller?view=azure-python
poller = kusto_management_client.cluster_principal_assignments.create_or_update(resource_group_name=resource_group_name, cluster_name=cluster_name, principal_assignment_name= principal_assignment_name, parameters=ClusterPrincipalAssignment(principal_id=principal_id, role=role, tenant_id=tenant_id_for_principal, principal_type=principal_type))
```

|**Setting** | **Suggested value** | **Field description**|
|---|---|---|
| tenant_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | Your tenant ID. Also known as directory ID.|
| subscription_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The subscription ID that you use for resource creation.|
| client_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client ID of the application that can access resources in your tenant.|
| client_secret | *xxxxxxxxxxxxxx* | The client secret of the application that can access resources in your tenant. |
| resource_group_name | *testrg* | The name of the resource group containing your cluster.|
| cluster_name | *mykustocluster* | The name of your cluster.|
| principal_assignment_name | *clusterPrincipalAssignment1* | The name of your cluster principal resource.|
| principal_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The principal ID, which can be user email, application ID, or security group name.|
| role | *AllDatabasesAdmin* | The role of your cluster principal, which can be 'AllDatabasesAdmin', 'AllDatabasesMonitor', or 'AllDatabasesViewer'.|
| tenant_id_for_principal | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The tenant ID of the principal.|
| principal_type | *App* | The type of the principal, which can be 'User', 'App', or 'Group'|

### [ARM template](#tab/arm)

The following example shows an Azure Resource Manager template for adding a cluster principal.  You can [edit and deploy the template in the Azure portal](/azure/azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal#edit-and-deploy-the-template) by using the form.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
		"clusterPrincipalAssignmentName": {
            "type": "string",
            "defaultValue": "principalAssignment1",
            "metadata": {
                "description": "Specifies the name of the principal assignment"
            }
        },
        "clusterName": {
            "type": "string",
            "defaultValue": "mykustocluster",
            "metadata": {
                "description": "Specifies the name of the cluster"
            }
        },
		"principalIdForCluster": {
            "type": "string",
            "metadata": {
                "description": "Specifies the principal id. It can be user email, application (client) ID, security group name"
            }
        },
		"roleForClusterPrincipal": {
            "type": "string",
			"defaultValue": "AllDatabasesViewer",
            "metadata": {
                "description": "Specifies the cluster principal role. It can be 'AllDatabasesAdmin', 'AllDatabasesMonitor' or 'AllDatabasesViewer'"
            }
        },
		"tenantIdForClusterPrincipal": {
            "type": "string",
            "metadata": {
                "description": "Specifies the tenantId of the principal"
            }
        },
		"principalTypeForCluster": {
            "type": "string",
			"defaultValue": "User",
            "metadata": {
                "description": "Specifies the principal type. It can be 'User', 'App', 'Group'"
            }
        }
    },
    "variables": {
    },
    "resources": [{
            "type": "Microsoft.Kusto/Clusters/principalAssignments",
            "apiVersion": "2019-11-09",
            "name": "[concat(parameters('clusterName'), '/', parameters('clusterPrincipalAssignmentName'))]",
            "properties": {
                "principalId": "[parameters('principalIdForCluster')]",
                "role": "[parameters('roleForClusterPrincipal')]",
				"tenantId": "[parameters('tenantIdForClusterPrincipal')]",
				"principalType": "[parameters('principalTypeForCluster')]"
            }
        }
    ]
}
```

---

## Next steps

* [Add database principals](add-database-principal.md)
