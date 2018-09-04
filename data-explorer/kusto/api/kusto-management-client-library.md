---
title: Kusto Management Client Library - Azure Kusto | Microsoft Docs
description: This article describes Kusto Management Client Library in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto Management Client Library

## Overview
The Kusto Management Library is a .NET library which is meant to provide account admins with programmatic cluster management capabilities.

The Kusto.Manage.dll assembly provides the `ClusterManagementClient` type, implementing the `IClusterManagementClient` interface:
1. The interface exposed in the library interacts with the Kusto Cluster Management Service, by sending [CSL commands](https://kusdoc2.azurewebsites.net/docs/controlCommands/cluster.html) as strings, and getting results back via an IDataReader).
2. For each long-running operation, the interface provides with a both synchronous and asynchronous methods, which can be used per the user's preference.
  * Async operations allow the user's flow to continue, without blocking. 
  * Sync operations use the timeout set when initializing the `ClusterManagementClient` (or the default timeout of 30 minutes, if it is not set during initialization).
    * Up until this timeout, polling is done in the background against the Cluster Management service in order to track the operation's status, until completion.   

**Note**: *running operations against the Cluster Management service is a privileged action, one is required to be an AccountAdmin and potentially a TargetClusterAdmin in order to pass authorization checks. For this reason, using the Kusto Management library also requires special permissions. For further details, see [Cluster Management Authorization Model](https://kusdoc2.azurewebsites.net/docs/controlCommands/roles.html)*

## The Interface
```csharp
public interface IClusterManagementClient
{
    /// <summary>
    /// <para>Shows information for a given service by its name.</para>
    /// <para>The information contains:</para>
    /// <para>    1. The name of the service.</para>
    /// <para>    2. The amount of cloud service instances, grouped by instances status.</para>
    /// <para>    3. Detailed status of all cloud service instances.</para>
    /// <para>    4. The available compute and storage resources available in the Azure subscription, hosting the cloud service.</para>
    /// <para>    5. The service's public URL.</para>
    /// <para>    6. The service's configuration (as defined and managed by the Kusto Cluster Management service).</para>
    /// <para>    7. The cloud service's Autoscale setting, if such exists.</para>
    /// <para>    8. The cloud service's Deployment details (Name, Label and ID).</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    ServiceShowCmCommandResult ShowService(string serviceName);

    /// <summary>
    /// <para>Shows information for a given service by its name.</para>
    /// <para>The information contains:</para>
    /// <para>    1. The name of the service.</para>
    /// <para>    2. The amount of cloud service instances, grouped by instances status.</para>
    /// <para>    3. Detailed status of all cloud service instances.</para>
    /// <para>    4. The available compute and storage resources available in the Azure subscription, hosting the cloud service.</para>
    /// <para>    5. The service's public URL.</para>
    /// <para>    6. The service's configuration (as defined and managed by the Kusto Cluster Management service).</para>
    /// <para>    7. The cloud service's Autoscale setting, if such exists.</para>
    /// <para>    8. The cloud service's Deployment details (Name, Label and ID).</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    Task<ServiceShowCmCommandResult> ShowServiceAsync(string serviceName);


    /// <summary>
    /// <para>Shows the configuration (as defined and managed by the Kusto Cluster Management service) of a given service by its name.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    ServiceConfigurationShowCmCommandResult ShowServiceConfiguration(string serviceName);

    /// <summary>
    /// <para>Shows the configuration (as defined and managed by the Kusto Cluster Management service) of a given service by its name.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    Task<ServiceConfigurationShowCmCommandResult> ShowServiceConfigurationAsync(string serviceName);

    /// <summary>
    /// <para>Shows details of the given operation Id.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// </summary>
    /// <param name="operationId">The Id of the operation.</param>
    OperationsShowCommandResult ShowOperations(Guid operationId);

    /// <summary>
    /// <para>Shows details of the given operation Id.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// </summary>
    /// <param name="operationId">The Id of the operation.</param>
    Task<OperationsShowCommandResult> ShowOperationsAsync(Guid operationId);

    /// <summary>
    /// <para>Checks the avilability and validity of an given name to be used for creating a new Kusto service.</para>
    /// <para>The result contains a boolean indicating availability, and an optional message explaining the unavailability, for such cases..</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// </summary>
    /// <param name="name">The name of the service.</param>
    ServiceCheckNameAvailabilityCmCommandResult CheckServiceNameAvailability(string name);

    /// <summary>
    /// <para>Checks the avilability and validity of an given name to be used for creating a new Kusto service.</para>
    /// <para>The result contains a boolean indicating availability, and an optional message explaining the unavailability, for such cases..</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// </summary>
    /// <param name="name">The name of the service.</param>
    Task<ServiceCheckNameAvailabilityCmCommandResult> CheckServiceNameAvailabilityAsync(string name);

    /// <summary>
    /// <para>Creates a new service according to the provided <paramref name="serviceCreateParameters"/>:</para>
    /// <para>    1. Name of the service (alphanumeric characters, 3-12 characters long).</para>
    /// <para>    2. The type of the service (Engine | DataManagement).</para>
    /// <para>    3. The Azure subscription ID (must have the Kusto management certificate uploaded to it beforehand).</para>
    /// <para>    4. The Azure geo-location in which the service and its resources should be created (see https://azure.microsoft.com/en-us/regions/).</para>
    /// <para>    5. The name of the Kusto Account to which the service should be added to.</para>
    /// <para>    6. The name of the Pipeline the service is related to (Geneva | Vortex | LogAnalytics | Independent | Aria | ApplicationInsights).</para>
    /// <para>    7. [optional] The level of environment in which the service belongs to (Production | Development | Lab).</para>
    /// <para>    8. [optional] The virtual machine size to use for the service's instances (see: https://azure.microsoft.com/en-us/documentation/articles/cloud-services-sizes-specs/).</para>
    /// <para>    9. [optional] The number of instances for the service.</para>
    /// </summary>
    /// <param name="serviceCreateParameters">The parameters for creating the service.</param>
    OperationsShowCommandResult CreateService(ServiceCreateParameters serviceCreateParameters);

    /// <summary>
    /// <para>Creates a new service according to the provided <paramref name="serviceCreateParameters"/>:</para>
    /// <para>    1. Name of the service (alphanumeric characters, 3-12 characters long).</para>
    /// <para>    2. The type of the service (Engine | DataManagement).</para>
    /// <para>    3. The Azure subscription ID (must have the Kusto management certificate uploaded to it beforehand).</para>
    /// <para>    4. The Azure geo-location in which the service and its resources should be created (see https://azure.microsoft.com/en-us/regions/).</para>
    /// <para>    5. The name of the Kusto Account to which the service should be added to.</para>
    /// <para>    6. The name of the Pipeline the service is related to (Geneva | Vortex | LogAnalytics | Independent | Aria | ApplicationInsights).</para>
    /// <para>    7. [optional] The level of environment in which the service belongs to (Production | Development | Lab).</para>
    /// <para>    8. [optional] The virtual machine size to use for the service's instances (see: https://azure.microsoft.com/en-us/documentation/articles/cloud-services-sizes-specs/).</para>
    /// <para>    9. [optional] The number of instances for the service.</para>
    /// </summary>
    /// <param name="serviceCreateParameters">The parameters for creating the service.</param>
    Task<OperationsShowCommandResult> CreateServiceAsync(ServiceCreateParameters serviceCreateParameters);

    /// <summary>
    /// <para>Uninstalls a service (removes the cloud service deployment) by its name.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    OperationsShowCommandResult UninstallService(string serviceName);

    /// <summary>
    /// <para>Uninstalls a service (removes the cloud service deployment) by its name.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    Task<OperationsShowCommandResult> UninstallServiceAsync(string serviceName);

    /// <summary>
    /// <para>Deletes a service and its underlying resources, by its name.</para>
    /// <para><c>By default, nothing is deleted</c>, unless explicitly mentioned in <paramref name="serviceDeleteParameters"/>:</para>
    /// <para>One can choose to delete any combination of:</para>
    /// <para>    1. The cloud service (deployment and hosted service).</para>
    /// <para>    2. The storage accounts associated to the service.</para>
    /// <para>    3. The DNS mapping of the service.</para>
    /// <para>    4. The configuration of the service.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// </summary>
    /// <param name="serviceDeleteParameters">The parameters for deleting the service and its resources.</param>
    OperationsShowCommandResult DeleteService(ServiceDeleteParameters serviceDeleteParameters);

    /// <summary>
    /// <para>Deletes a service and its underlying resources, by its name.</para>
    /// <para><c>By default, nothing is deleted</c>, unless explicitly mentioned in <paramref name="serviceDeleteParameters"/>:</para>
    /// <para>One can choose to delete any combination of:</para>
    /// <para>    1. The cloud service (deployment and hosted service).</para>
    /// <para>    2. The storage accounts associated to the service.</para>
    /// <para>    3. The DNS mapping of the service.</para>
    /// <para>    4. The configuration of the service.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// </summary>
    /// <param name="serviceDeleteParameters">The parameters for deleting the service and its resources.</param>
    Task<OperationsShowCommandResult> DeleteServiceAsync(ServiceDeleteParameters serviceDeleteParameters);

    /// <summary>
    /// <para>Stops a service (and all of its instances) by its name.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    OperationsShowCommandResult StopService(string serviceName);

    /// <summary>
    /// <para>Stops a service (and all of its instances) by its name.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    Task<OperationsShowCommandResult> StopServiceAsync(string serviceName);

    /// <summary>
    /// <para>Restarts a service (and all of its instances) by its name. (see: https://msdn.microsoft.com/en-us/library/azure/gg441298.aspx)</para>
    /// <para>The service can either be in "Running" or "Stopped" state before invoking this method.</para>
    /// <para>This method runs asynchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    /// <param name="instanceId">[optional] The name of a specific instance to restart.</param>
    OperationsShowCommandResult RestartService(string serviceName, string instanceId = null);

    /// <summary>
    /// <para>Restarts a service (and all of its instances) by its name. (see: https://msdn.microsoft.com/en-us/library/azure/gg441298.aspx)</para>
    /// <para>The service can either be in "Running" or "Stopped" state before invoking this method.</para>
    /// <para>This method runs asynchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    /// <param name="instanceId">[optional] The name of a specific instance to restart.</param>
    Task<OperationsShowCommandResult> RestartServiceAsync(string serviceName, string instanceId = null);

    /// <summary>
    /// <para>Reimages a service (and all of its instances) by its name. (see: https://msdn.microsoft.com/en-us/library/azure/gg441292.aspx)</para>
    /// <para>The service can either be in "Running" or "Stopped" state before invoking this method.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// <para>IMPORTANT: When run against an Engine service, this clears the local disk cache and increases warm-up time once the operation is complete.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    /// <param name="instanceId">[optional] The name of a specific instance to reimage.</param>
    OperationsShowCommandResult ReimageService(string serviceName, string instanceId = null);

    /// <summary>
    /// <para>Reimages a service (and all of its instances) by its name. (see: https://msdn.microsoft.com/en-us/library/azure/gg441292.aspx)</para>
    /// <para>The service can either be in "Running" or "Stopped" state before invoking this method.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// <para>IMPORTANT: When run against an Engine service, this clears the local disk cache and increases warm-up time once the operation is complete.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    /// <param name="instanceId">[optional] The name of a specific instance to reimage.</param>
    Task<OperationsShowCommandResult> ReimageServiceAsync(string serviceName, string instanceId = null);

    /// <summary>
    /// <para>Rebuilds a service (and all of its instances) by its name. (see: https://msdn.microsoft.com/en-us/library/azure/dn627518.aspx)</para>
    /// <para>The service can either be in "Running" or "Stopped" state before invoking this method.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// <para>IMPORTANT: When run against an Engine service, this clears the local disk cache and increases warm-up time once the operation is complete.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    /// <param name="instanceId">[optional] The name of a specific instance to rebuild.</param>
    OperationsShowCommandResult RebuildService(string serviceName, string instanceId = null);

    /// <summary>
    /// <para>Rebuilds a service (and all of its instances) by its name. (see: https://msdn.microsoft.com/en-us/library/azure/dn627518.aspx)</para>
    /// <para>The service can either be in "Running" or "Stopped" state before invoking this method.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// <para>IMPORTANT: When run against an Engine service, this clears the local disk cache and increases warm-up time once the operation is complete.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    /// <param name="instanceId">[optional] The name of a specific instance to rebuild.</param>
    Task<OperationsShowCommandResult> RebuildServiceAsync(string serviceName, string instanceId = null);

    /// <summary>
    /// <para>Updates a service's configuration, by its name.</para>
    /// <para>By default, configuration values aren't updated, unless explicitly mentioned in <paramref name="serviceConfigurationAlterParameters"/>:</para>
    /// <para>One can choose to update any combination of:</para>
    /// <para>    1. Virtual machine size of the service instances (see https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-size-specs/).</para>
    /// <para>    2. The number of service instances.</para>
    /// <para>    3. Set the service's Autoscale configuration (see https://msdn.microsoft.com/en-us/library/azure/dn931928.aspx).</para>
    /// <para>    4. Drop the service's Autoscale configuration (if exists).</para>
    /// </summary>
    /// <param name="serviceConfigurationAlterParameters">The parameters for updating the service's configuration.</param>
    OperationsShowCommandResult AlterServiceConfiguration(ServiceConfigurationAlterParameters serviceConfigurationAlterParameters);

    /// <summary>
    /// <para>Updates a service's configuration, by its name.</para>
    /// <para>By default, configuration values aren't updated, unless explicitly mentioned in <paramref name="serviceConfigurationAlterParameters"/>:</para>
    /// <para>One can choose to update any combination of:</para>
    /// <para>    1. Virtual machine size of the service instances (see https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-size-specs/).</para>
    /// <para>    2. The number of service instances.</para>
    /// <para>    3. Set the service's Autoscale configuration (see https://msdn.microsoft.com/en-us/library/azure/dn931928.aspx).</para>
    /// <para>    4. Drop the service's Autoscale configuration (if exists).</para>
    /// </summary>
    /// <param name="serviceConfigurationAlterParameters">The parameters for updating the service's configuration.</param>
    Task<OperationsShowCommandResult> AlterServiceConfigurationAsync(ServiceConfigurationAlterParameters serviceConfigurationAlterParameters);

    /// <summary>
    /// <para>Sets the number of running instances for the given service.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    /// <param name="instancesCount">The required number of instances to set.</param>
    OperationsShowCommandResult SetServiceInstancesCount(string serviceName, int instancesCount);

    /// <summary>
    /// <para>Sets the number of running instances for the given service.</para>
    /// <para>This method runs asynchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// </summary>
    /// <param name="serviceName">The name of the service.</param>
    /// <param name="instancesCount">The required number of instances to set.</param>
    Task<OperationsShowCommandResult> SetServiceInstancesCountAsync(string serviceName, int instancesCount);

    /// <summary>
    /// <para>Creates a new database for an existing Engine service, according to the provided <paramref name="databaseCreateParameters"/>:</para>
    /// <para>    1. Name of the Engine service.</para>
    /// <para>    2. Name of the database.</para>
    /// <para>    3. [optional] the Azure subscription ID in which storage accounts should reside <c>(must have the Kusto management certificate uploaded to it beforehand)</c>.</para>
    /// <para>    4. [optional] the base name for the storage accounts to be used.</para>
    /// <para>    5. [optional] the number of storage accounts to be used.</para>
    /// <para>    6. [optional] the extents merge policy to be set on the database.</para>
    /// <para>    7. [optional] the data retention policy to be set on the database.</para>
    /// <para>    8. [optional] an array of AAD objects to be defined as database users.</para>
    /// <para>    9. [optional] an array of AAD objects to be defined as database admins.</para>
    /// <para>    10. [optional] a pretty name for the database.</para>
    /// <para>    11. [optional] a boolean indicating whether or not to prefix storage account names by a 3 lowercase alphanumeric string.</para>
    /// </summary>
    /// <param name="databaseCreateParameters">The parameters for creating the database.</param>
    OperationsShowCommandResult CreateDatabase(DatabaseCreateParameters databaseCreateParameters);

    /// <summary>
    /// <para>Creates a new database for an existing Engine service, according to the provided <paramref name="databaseCreateParameters"/>:</para>
    /// <para>    1. Name of the Engine service.</para>
    /// <para>    2. Name of the database.</para>
    /// <para>    3. [optional] the Azure subscription ID in which storage accounts should reside <c>(must have the Kusto management certificate uploaded to it beforehand)</c>.</para>
    /// <para>    4. [optional] the base name for the storage accounts to be used.</para>
    /// <para>    5. [optional] the number of storage accounts to be used.</para>
    /// <para>    6. [optional] the extents merge policy to be set on the database.</para>
    /// <para>    7. [optional] the data retention policy to be set on the database.</para>
    /// <para>    8. [optional] an array of AAD objects to be defined as database users.</para>
    /// <para>    9. [optional] an array of AAD objects to be defined as database admins.</para>
    /// <para>    10. [optional] a pretty name for the database.</para>
    /// <para>    11. [optional] a boolean indicating whether or not to prefix storage account names by a 3 lowercase alphanumeric string.</para>
    /// </summary>
    /// <param name="databaseCreateParameters">The parameters for creating the database.</param>
    Task<OperationsShowCommandResult> CreateDatabaseAsync(DatabaseCreateParameters databaseCreateParameters);

    /// <summary>
    /// <para> Reserves a delete database command from an existing Engine service, according to the provided parameters.</para>
    /// <para> This is the first phase of the delete database command in which the command is only reserved.</para>
    /// <para> The command returns information about the database and a token. To commit the action call DeleteDatabaseCommit with verification token returned.</para>
    /// <para>    1. Name of the Engine service.</para>
    /// <para>    2. Name of the database to be deleted.</para>
    /// <para>    3. [optional] whether to physically delete the database's storage containers or not.</para>
    /// <para>       Warning: This is a non-reversible process, data will be lost forever.</para>
    /// </summary>
    DatabaseDeleteCommandResult DeleteDatabaseReserve(string databaseName, string serviceName, bool deleteStorageContainers = false);

    /// <summary>
    /// <para> Reserves a delete database command from an existing Engine service, according to the provided parameters.</para>
    /// <para> This is the first phase of the delete database command in which the command is only reserved.</para>
    /// <para> The command returns information about the database and a token. To commit the action call DeleteDatabaseCommit with verification token returned.</para>
    /// <para>    1. Name of the Engine service.</para>
    /// <para>    2. Name of the database to be deleted.</para>
    /// <para>    3. [optional] whether to physically delete the database's storage containers or not.</para>
    /// <para>       Warning: This is a non-reversible process, data will be lost forever.</para>
    /// </summary>
    Task<DatabaseDeleteCommandResult> DeleteDatabaseReserveAsync(string databaseName, string serviceName, bool deleteStorageContainers = false);

    /// <summary>
    /// <para> Commits the reserved delete database command from an existing Engine service, according to the provided parameters.</para>
    /// <para> This is the second phase of the delete database command in which the command is actually commited.</para>
    /// <para>    1. Name of the Engine service.</para>
    /// <para>    2. Name of the database to be deleted.</para>
    /// <para>    3. The verification token returned when calling DeleteDatabaseReserve.</para>
    /// <para>    4. [optional] whether to physically delete the database's storage containers or not.</para>
    /// <para>       Warning: This is a non-reversible process, data will be lost forever.</para>
    /// </summary>
    OperationsShowCommandResult DeleteDatabaseCommit(string databaseName, string serviceName, string verificationToken, bool deleteStorageContainers = false);

    /// <summary>
    /// <para> Commits the reserved delete database command from an existing Engine service, according to the provided parameters.</para>
    /// <para> This is the second phase of the delete database command in which the command is actually commited.</para>
    /// <para>    1. Name of the Engine service.</para>
    /// <para>    2. Name of the database to be deleted.</para>
    /// <para>    3. The verification token returned when calling DeleteDatabaseReserve.</para>
    /// <para>    4. [optional] whether to physically delete the database's storage containers or not.</para>
    /// <para>       Warning: This is a non-reversible process, data will be lost forever.</para>
    /// </summary>
    Task<OperationsShowCommandResult> DeleteDatabaseCommitAsync(string databaseName, string serviceName, string verificationToken, bool deleteStorageContainers = false);

    /// <summary>
    /// <para>Executes a CSL sync command.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// </summary>
    /// <param name="command">The name of the service.</param>
    IDataReader ExecuteControlCommand(string command);

    /// <summary>
    /// <para>Executes a CSL sync command.</para>
    /// </summary>
    /// <param name="command">The name of the service.</param>
    Task<IDataReader> ExecuteControlCommandAsync(string command);

    /// <summary>
    /// <para>Executes a CSL async command, and then waits for it to complete with some timeout.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// </summary>
    /// <param name="command">The name of the service.</param>
    OperationsShowCommandResult ExecuteAsyncControlCommand(string command);

    /// <summary>
    /// <para>Executes a CSL async command, and then waits for it to complete with some timeout.</para>
    /// <para>This method runs synchronously against the Kusto Cluster Management service.</para>
    /// <para>An operation result is returned when operation succeeds or fails.</para>
    /// </summary>
    /// <param name="command">The name of the service.</param>
    Task<OperationsShowCommandResult> ExecuteAsyncControlCommandAsync(string command);

    /// <summary>
    /// <para>Creates a new cluster according to the provided <paramref name="clusterCreateParameters"/>:</para>
    /// <para>    1. Name of the service (alphanumeric characters, 3-12 characters long).</para>
    /// <para>    2. The Pc Code to be used when creating it.</para>
    /// <para>    3. The Azure geo-location in which the service and its resources should be created (see https://azure.microsoft.com/en-us/regions/).</para>
    /// <para>    4. The name of the Kusto Account to which the service should be added to.</para>
    /// <para>    5. The name of the Pipeline the service is related to (Geneva | Vortex | LogAnalytics | Independent | Aria | ApplicationInsights).</para>
    /// <para>    6. [optional] The level of environment in which the service belongs to (Production | Development | Lab).</para>
    /// </summary>
    /// <param name="clusterCreateParameters">The parameters for creating the cluster.</param>
    OperationsShowCommandResult CreateCluster(ClusterCreateParameters clusterCreateParameters);

    /// <summary>
    /// <para>Creates a new cluster according to the provided <paramref name="clusterCreateParameters"/>:</para>
    /// <para>    1. Name of the service (alphanumeric characters, 3-12 characters long).</para>
    /// <para>    2. The Pc Code to be used when creating it.</para>
    /// <para>    3. The Azure geo-location in which the service and its resources should be created (see https://azure.microsoft.com/en-us/regions/).</para>
    /// <para>    4. The name of the Kusto Account to which the service should be added to.</para>
    /// <para>    5. The name of the Pipeline the service is related to (Geneva | Vortex | LogAnalytics | Independent | Aria | ApplicationInsights).</para>
    /// <para>    6. [optional] The level of environment in which the service belongs to (Production | Development | Lab).</para>
    /// </summary>
    /// <param name="clusterCreateParameters">The parameters for creating the cluster.</param>
    Task<OperationsShowCommandResult> CreateClusterAsync(ClusterCreateParameters clusterCreateParameters);
}
```

## Examples
### Example: Initializing the *ClusterManagementClient* 

```csharp
const string cmServiceUrl = "https://manage-kusto.kusto.windows.net:443;Fed=True";

// if no operation timeout is used, the default of 30 minutes is used
var cmClient = new ClusterManagementClient(cmServiceUrl);
```

### Example: Getting the status of a Kusto service (sync)

```csharp
const string serviceName = "Engine-Aria";
var service = cmClient.ShowService(serviceName);

// do something with the result:
Console.WriteLine("Service Name = {0}", service.ServiceName);
Console.WriteLine("Instances Count by Status = {0}", service.InstancesCountByStatus);
Console.WriteLine("Subscription Available Resources = {0}", service.SubscriptionAvailableResources);
```

### Example: Creating a new database in an existing Kusto Engine service (sync/async)

```csharp
const string serviceName = "Engine-Aria";
const string databaseName = "MyCoolDatabase";

// generate the parameters to be used for creating the database
var databaseCreateParameters = new DatabaseCreateParameters(databaseName, serviceName)
{
    DatabaseAdminsAadGroupIds = new[] {"be91d9e9-086d-4e18-86a2-badc06f59e38"},
    DatabaseUsersAadGroupIds = new[] {"be91d9e9-086d-4e18-86a2-badc06f59e38"},
    DataRetentionPolicy = new DataRetentionPolicy(TimeSpan.FromDays(1), TimeSpan.FromDays(2), TimeSpan.FromHours(1), 0, 0)
};

// sync:
var syncResult = cmClient.CreateDatabase(databaseCreateParameters);

// or async:
var asyncResult = await cmClient.CreateDatabaseAsync(databaseCreateParameters);
```

## Changelog
```text
Version 4.0.2-beta (05 AUG 2018)
* Use priority ranked resources in ingest client

Version 4.0.0 (19 JUL 2018)
* Upgrade WindowsAzure.Storage to version 9.3.0

Version 3.1.4 (15 JUL 2018)
* Bug fix: fix a memory leak when performing dSTS-based authentication.

Version 3.1.3 (09 JUL 2018)
* Better error messages for AAD Application authentication
* Support for overriding dSTS namespace expansion in app.config

Version 3.1.2 (17 JUN 2018)
* Upgrade ADAL's version from 3.19.4 to 3.19.8

Version 3.1.1 (10 JUN 2018)
* Introducing Kusto managed streaming ingest client

Version 3.1.0 (04 JUN 2018)
* Upgrade ADAL's version from 3.16.1 to 3.19.4 in order to support AAD application authentication by subject and issuer names (additional information: http://aadwiki/index.php?title=Subject_Name_and_Issuer_Authentication).
* Support dMSI-based authentication.

Version 3.0.20 (22 MAR 2018)
* Align version number with Kusto.Ingest library.

Version 3.0.19 (21 MAR 2018)
* Kusto.Cloud.Platform.Data.ExtendedDataReader: add support for writing collections to CSV files.

Version 3.0.18 (22 FEB 2018)
* Add support for ".show service <ServiceName> purges command"

Version 3.0.17 (1 FEB 2018)
* Include missing assemblies in package.

Version 3.0.15 (30 JAN 2018)
* Add support for a single-phase purge command

Version 3.0.14 (31 DEC 2017)
* Upgrade depenedency of Kusto.Client to version 3.0.14

Version 3.0.9 (08 NOV 2017)
* Add support for EntityNotFoundException.

Version 3.0.8 (01 NOV 2017)
* Added Throttled operation state.

Version 3.0.7 (01 OCT 2017)
* Support explicit authority ID for AAD user authentication scenario.

Version 3.0.6 (1 OCT 2017)
* Added the purge command flavors

Version 3.0.5 (13 SEP 2017)
* Fix hang when issuing multiple async requests requiring AAD authentication

Version 3.0.4 (12 SEP 2017):
* Fix ADAL reference to version 3.16.1.

Version 3.0.3 (10 SEP 2017):
* Upgrade ADAL's version from 3.12.0 to 3.16.1

Version 3.0.2 (06 SEP 2017):
* Support Windows Hello for dSTS-based authentication (for Microsoft internal principals)

Version 3.0.1 (05 JULY 2017):
* Fix Microsoft.WindowsAzure.Storage dependency declaration

Version 3.0.0 (05 JULY 2017):
* Upgrade Newtonsoft.Json to version 10.0.3 and Microsoft.WindowsAzure.Storage to version 8.1.4

Version 2.4.0 (02 JUL 2017):
* Bug fix - .tt file breaks package

Version 2.3.9 (20 JUNE 2017):
* Bug fix - fix hang when running inside 'Orleans' framework

Version 2.3.8 (15 JUNE 2017):
* NetworkCache: Added support for setting timer start refreshing time and cache refreshing timeout.

Version 2.3.7 (22 MAY 2017):
* KCSB - block sending corporate credentials when using basic authentication.

Version 2.3.6 (7 MAY 2017):
* Extend kusto ingestion error codes with 'NoError'.

Version 2.3.5 (27 APR 2017):
* Add kusto ingestion error codes.

Version 2.3.4 (09 APR 2017):
* Bug fix - support AAD token acquisition based-on application client ID and certificate thumbprint.

Version 2.3.3 (30 MAR 2017):
* Add Kusto Connection String validation.

Version 2.3.2 (16 MAR 2017):
* Target client library to .net 4.5 to enable customers that cannot use higher versions to use Kusto client.

Version 2.3.1 (13 FEB 2017):
* Support AAD Multi-Tenant access to Kusto for applications.

Version 2.3.0 (12 FEB 2017):
* Support AAD Multi-Tenant access to Kusto.

Version 2.2.10 (8 DEC 2016):
* Added Async version to all functions.

Version 2.2.9 (24 NOV 2016):
* Extend Azure Storage retry policy in order to handle IO exceptions.

Version 2.2.8 (16 NOV 2016):
* Extend Azure Storage retry policy in order to handle web and socket exceptions.

Version 2.2.7 (16 NOV 2016):
* Support Multi-Factor Authentication enforcement for AAD-based authentication.

Version 2.2.6 (2 NOV 2016):
* Explicit polling time to create database.

Version 2.2.5 (22 SEP 2016):
* Fix potential deadlock in 'ExecuteQuery' when running in IIS.

Version 2.2.4 (20 SEP 2016):
* Fix potential deadlock during AAD token acquisition.

Version 2.2.3 (18 SEP 2016):
* Security bug fix (client credentials leak to traces).

Version 2.2.2 (12 SEP 2016):
* Add create cluster command.

Version 2.2.1 (5 SEP 2016):
* Support dSTS-based application authentication.

Version 2.2.0 (4 SEP 2016):
* Add ExecuteControlCommand and ShowOperations functions.

Version 2.1.11 (17 AUG 2016):
* Fix typo.

Version 2.1.10 (17 AUG 2016):
* Add delete database command.

Version 2.1.9 (24 JUL 2016):
* Fix UI potential deadlock during AAD token acquisition.

Version 2.1.8 (20 JUL 2016):
* Upgrade ADAL's version from 2.14.2011511115 to 3.12.0

Version 2.1.7 (19 JUL 2016):
* Supporting dSTS-based authentication for Microsoft internal principals. More details can be found at https://kusto.azurewebsites.net/docs/concepts/security-authn-dsts.html.
```