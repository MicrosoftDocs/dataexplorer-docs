---
ms.topic: include
ms.date: 10/07/2019
---

## Clean up resources

To delete the data connection, use the following command:

```csharp
kustoManagementClient.DataConnections.Delete(resourceGroupName, clusterName, databaseName, dataConnectionName);
```