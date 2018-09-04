---
title: Cluster Management -  Kusto Services - Azure Kusto | Microsoft Docs
description: This article describes Cluster Management -  Kusto Services in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Cluster Management: Kusto Services

## show service

```kusto
.show service [ServiceName] configuration
```

Shows the status and configuration of the service by its name.

Requires [AccountAdmin permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

**Examples**

```kusto
.show service Aria 
.show service ingest-Aria configuration
```

**Return output**

|Output parameter |Type |Description 
|---|---|---
|ServiceName  |String |The name of the service, as defined in the Kusto service model (e.g. Engine-Kuskus, Mgmt-Kuskus).
|AccountName  |String |The name of the account to which the service belongs. 
|InstancesCountByStatus  |String |The amount of cloud service instances, grouped by instances status (if hosted in Cloud Services). 
|InstancesDetails  |String |Detailed status of all cloud service instances (if hosted in Cloud Services).
|SubscriptionMetadata  |String |Metadata about the Azure subscription hosting the service, including the available compute and storage resources in the subscription/region.
|PublicUrl  |String |The service's public URL. 
|ServiceConfiguration  |String |The service's configuration (as defined and managed by the Cluster Management service). 
|AutoscaleSetting  |String |The cloud service's Autoscale setting, if such exists. 
|DeploymentDetails  |String |The cloud service's Deployment details (Name, Label & more) (if hosted in Cloud Services). 
|HostedServiceDetails  |String |The cloud service's details (Name, Date created, Location & more) (if hosted in Cloud Services).  
|State  |String |The Kusto service's state (Online \ Offline \ InMaintenance) (if hosted in Cloud Services)
|StateDetails  |String |Details on the Kusto service's state.
|ServiceHealthState  |String |The Health of the Service Fabric service (see possible values below).
|VirtualMachineScaleSetVMs  |String |Details of all the VMs in the service VMSS (if hosted in AzureServiceFabric).
|NodesDetails  |String |Details of all the ServiceFabric nodes (if hosted in AzureServiceFabric).
|NodesCountByHealthState  |String |The amount of ServiceFabric nodes, grouped by node status (if hosted in AzureServiceFabric)..
|DeploymentKind  |String |The hosting environment of the service (`AzurePaas1` for Cloud Services, `AzureVMSS` for Azure VMSS).

**VirtualMachineScaleSetVMs** provides the following information on each VMSS Virtual Machine:

* Name: Name of the virtual machine.
* InstanceId: InstanceId of the virtual machine.
* SkuName: Name of the SKU of the virtual machine (e.g. 2012-R2-Datacenter).
* EnableAutomaticUpdates: Whether Windows updates are automatically installed on the VM.
* DataDisks: Name and Disk size (in GBs) of data disks attached to the virtual machine.

**Example:**

```kusto
.show service LXPERF02
```

**Example result:**

|ServiceName|AccountName|InstancesCountByStatus|InstancesDetails|SubscriptionMetadata|PublicUrl|ServiceConfiguration|AutoscaleSetting|DeploymentDetails|HostedServiceDetails|State|StateDetails|ServiceDetails|ServiceHealthState|VirtualMachineScaleSetVMs|NodesDetails|NodesCountByHealthState| DeploymentKind
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|Engine-lxperf02|AppInsights Application Analytics|`{ "ReadyRole": 5 }`|`[ { "InstanceName": "Kusto.Azure.Svc_IN_0", "InstanceSize": "Standard_D14_v2", "InstanceStatus": "ReadyRole", "InstanceStateDetails": "", "InstanceUpgradeDomain": 0, "InstanceFaultDomain": 0, "RoleName": "Kusto.Azure.Svc", "IPAddress": "100.107.42.25", "PowerState": "Started" }, ...]`|`{ "SubscriptionID": "b14452a3-616a-4ad3-bda2-643b86edf121", "SubscriptionName": "S1_Log_Analytics_Kusto_USE_02_PERF", "MaxCoreCount": "350", "CurrentCoreCount": "96", "MaxStorageAccounts": "100", "CurrentStorageAccounts": "44", "MaxHostedServices": "20", "CurrentHostedServices": "2", "AccountAdminLiveEmailId": "admin@microsoft.com", "ServiceAdminLiveEmailId": "admin@microsoft.com", "Available Standard_D14_v2 Instances": "15" }`|https://lxperf02.kusto.windows.net|`{ "SubscriptionId": "b144...f121",  "Name": "Engine-lxperf02", ... }`||`{ "CreatedTime": "2016-02-18T10:19:49+00:00", "DeploymentSlot": "Production", "ExtendedProperties": {}, "Label": "kucomputelxperf02production20160913210642", "LastModifiedTime": "2016-09-19T10:27:21Z", "Locked": false, "Name": "fe17aab3-07c3-44cc-9ba5-7535244aa752", "PersistentVMDowntime": { "EndTime": "2017-09-16T08:49:44+00:00", "StartTime": "2016-09-16T08:49:44+00:00", "Status": "PersistentVMUpdateScheduled" }, "PrivateId": "96f0d0ed32f34344a78c171d5ddcf752", "SdkVersion": "2.8.6485.4", "Status": "Running", "UpgradeDomainCount": 5, "Uri": "http://kucompute-lxperf02.cloudapp.net/" }`|`{ "ServiceName": "kucompute-lxperf02", "Uri": "https://management.core.windows.net/b14452a3-616a-4ad3-bda2-643b86edf121/services/hostedservices/kucompute-lxperf02", "Properties": { "DateCreated": "2016-02-18T10:10:21+00:00", "DateLastModified": "2016-03-23T22:26:07+00:00", "Description": "", "ExtendedProperties": { "ResourceGroup": "kucompute-lxperf02", "ResourceLocation": "East US" }, "Label": "kustoazuresvc", "Location": "East US", "Status": "Created" }}`|Online|ProductVersion: KustoRelease_2016.09.13.4|N/A|N/A|N/A|N/A|N/A|AzurePaas1

**Example:**

```kusto
.show service LXPERF05 
```

**Example result:**

|ServiceName|AccountName|InstancesCountByStatus|InstancesDetails|SubscriptionMetadata|PublicUrl|ServiceConfiguration|AutoscaleSetting|DeploymentDetails|HostedServiceDetails|State|StateDetails|ServiceDetails|ServiceHealthState|VirtualMachineScaleSetVMs|NodesDetails|NodesCountByHealthState| DeploymentKind
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|Engine-lxperf05|KustoTest|N/A|N/A|`{ "SubscriptionID": "f310...33dd", "SubscriptionName": "Kusto...", "MaxCoreCount": "1000", "CurrentCoreCount": "290", ... }`|https://lxperf05.kusto.windows.net|`{ "SubscriptionId": "f310...33dd", "Name": "Engine-lxperf05", ... }`|N/A|N/A|N/A|Online|ProductVersion: KustoRelease-9020.2016-09-12 14-33-31|`[ { "NodeName": "_KEngine_3", "IpAddressOrFQDN": "10.0.0.7", "NodeType": "KEngine", "CodeVersion": "5.2.207.9590", "ConfigVersion": "9", "NodeStatus": "Up", "NodeUpTime": "3.21:55:36", "HealthState": "Ok", "IsSeedNode": false, "UpgradeDomain": "3", "FaultDomain": "fd:/3", "NodeId": "1d396a994fbc3e244cc228a16b075fa", "NodeInstanceId": "131184156384624561", "NodeDeactivationInfo": "System.Fabric.Query.NodeDeactivationResult" } ... ]`|`[ { "Name": "KEngine_0", "InstanceId": "0", "SkuName": "Standard_D14_V2", "EnableAutomaticUpdates": true, "DataDisks": [] } ... ]`|`{ "ApplicationName": "fabric:/Engine.Application", "DefaultMoveCost": "Zero", "Kind": "Stateless", "Metrics": [], "ServiceName": "fabric:/Engine.Application/Engine.Service", "ServiceTypeName": "Engine.Service" }`|Ok|`{ "Ok": 4 }`|AzureServiceFabric

## show service audit log

```kusto
.show service <ServiceName> audit log
.show service <ServiceName> audit log from '<StartDate>'
.show service <ServiceName> audit log from '<StartDate>' to '<EndDate>'

```

Shows CM operations performed on a given service, according to the provided parameters:
* ServiceName: Name of the service
* [optional] StartDate: Lower time limit for filtering service operations
* [optional] EndDate: Upper time limit for filtering service operations
* If only start time is specified, the command returns operations from the given start time and up to now.
* If no time limits are specified, the command returns operations from the last 24 hours.

**Examples**

```kusto
.show service Aria audit log
.show service Aria audit log from '2017-01-30T12:00'
.show service Aria audit log from '2017-01-30T12:00' to '2017-01-30T12:30'
```

**Example result:**

|OperationId| OperationKind| ServiceName| ServiceType| StartTime| Duration| State| StateDetails| ClientActivityId| Text| AdditionalParameters| PrincipalIdentity 
|---|---|---|---|---|---|---|---|---|---|---|---
|6f81d006-6272-4517-a8c8-f4a3ccd2d7f9| ServiceInstall| Ingest-aria| DataManagement| 2017-01-30 12:04:52.1356147| 00:09:30.3938061| Completed| | KE.RunCommand;7ee6f155-b111-4023-ba55-f8a1e49dcbca| .install service Aria| {"ProductVersion":"KustoMain_2017.01.30.4"}| user@microsoft.com 

## check service name availability

```kusto
.check service name availability [Name]
```

Checks the availability and validity of a given name to be used for creating a new service.
 
Requires [CmUser permissions](). 

**Example**

```kusto
.check service name availability MyCoolName
```

**Return output**

|Output parameter |Type |Description 
|---|---|---
|Name  |String |The provided name. 
|IsAvailable  |Boolean |Whether the name is valid and available, or not. 
|Message  |String |The reason as per why the name is invalid, in case it is. 

## create service

```kusto
.create service [ServiceName] [ifNotExists] with(
    ServiceType='<Engine | DataManagement | ClusterManagement | Bridge>',
    Location='<Azure Geo-Location>',
    Pipeline='<Geneva | LogAnalytics | Aria | Independent>',
    AccountName='<Account Name>',
    [PcCode='<The Azure PC-Code>',]
    [SubscriptionID='<Azure subscription ID (GUID)>',]
    [Environment='<Production | Development | Lab>',]
    [DeploymentKind='<AzurePaas1 | AzureVMSS>',]
    [VmSize='<Virtual machine size>',]
    [InstancesCount='<Number of instances>',]
    [CleanupOnFailure='<true | false>',]
    [ProductVersion='<Product version to install>',]
    [AddRequestorAsClusterAdmin='<true | false>',]
	[DeployRunners='<true | false>',]
    [NumberOfDatabaseStorageAccounts='<Number of default database storage accounts>',]
    [EngineURI='<The URI of the target engine service, which a DataManagement service should communicate with>',]
    [BlobStorageAccountAmount='<Number of intermediate blob storage accounts the Data Management service should use>',]
    [IsSecondaryCluster='<true | false>',]
    [QueueStorageAccountAmount='<Number of storage accounts the Data Management service should use>',]
    [QueueName='<Name for the queues in the source storage accounts>',]
    [LogAnalyticsId='<LogAnalytics ID>',]
    [GenevaEnvironment='<Geneva Environment Name>',]
    [MdsAccount='<A JSON object representing array of Geneva Mds account names>']
)   
```

Requires [AccountAdmin permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

Creates a new service according to the provided parameters:
* ServiceName: Name of the service (alphanumeric characters, 3-22 characters long).
* ServiceType: The type of the service (Engine | DataManagement).
* Location: The Azure geo-location in which the service and its resources should be created (see https://azure.microsoft.com/en-us/regions/).
* Pipeline: The name of the Pipeline the service is related to (Geneva | Vortex | LogAnalytics | Independent | Aria | ApplicationInsights).
* AccountName: The name of the Kusto Account to which the service should be added to.
* [optional] ifNotExists: if specified, then attempting to create a service when there's already an existing service with the same name becomes a void operation that succeeds. Otherwise a failure is returned in such cases.
* [optional] PcCode: The Azure PC-code.
* [optional] SubscriptionID: Azure subscription ID.
  * (must have the Kusto management certificate uploaded to it beforehand).
* [optional] Environment: The level of environment in which the service belongs to (Production | Development | Lab).
* [optional] DeploymentKind: The hosting environment in which the service will be hosted (AzurePaas1 (Azure Cloud Services) | AzureVMSS).
* [optional] VmSize: The virtual machine size to use for the service's instances (see: https://azure.microsoft.com/en-us/documentation/articles/cloud-services-sizes-specs/).
* [optional] InstancesCount: The number of instances for the service.
* [optional] CleanupOnFailure: Whether or not to dispose of underlying Azure resources (storage accounts, hosted service) in case service creation fails. Defaults to 'true'.
* [optional] ProductVersion: Product version to install.
* [optional] AddRequestorAsClusterAdmin: Whether or not to add the requestor as cluster admin. Defaults to 'false'.
* [optional] DeployRunners: Whether or not to deploy the runners for the service. Defaults to 'true'.
* [optional, Only for Engine services] NumberOfDatabaseStorageAccounts: The number of default database storage accounts to use. Default, if unspecified, is 1.
* [optional, Only for Data Management services] EngineURI: The URI of the target engine service, which a DataManagement service should communicate with. Default, if unspeficied, is https://[ServiceName].kusto.windows.net.
* [optional, Only for Data Management services] BlobStorageAccountAmount: The number of intermediate storage accounts to use for blob storage during ingestion operations. Default, if unspecified, is 2.
* [optional, Only for Data Management services] IsSecondaryCluster: Whether or not to run the service as a secondary DataManagement service. Defaults to 'false'.
* [optional, Only for Data Management services] QueueStorageAccountAmount: The number of storage accounts. Default, if unspecified, is 2.
  * Geneva - Intermediate storage accounts to use for queue storage during ingestion operations.
  * Aria - Source storage accounts.
* [optional, only for Aria Data Management services] QueueName: The name of the queues in the source storage accounts. Default, if unspecified, is 'ariasource'
* [required, only for Geneva Data Management services] LogAnalyticsId: The Geneva LogAnalytics ID.
* [required, only for Geneva Data Management services] GenevaEnvironment: The Geneva environment name. Supported values are: Smoke, Test, Stage, DiagnosticsProd, RunnersProd, BillingProd, FirstPartyProd, ExternalProd, CaFairFax, CaMooncake, WpsTest, WpsProd.
* [required, only for Geneva Data Management services] MdsAccounts: The Geneva Mds account names.

**Note:** PcCode or SubscriptionID must be specified, but not both.

**Examples**

```kusto
.create service CoolService with(
    ServiceType='Engine',
    SubscriptionID='0cd4cae7-a9c6-4613-b13b-166125812504',
    Location='West Europe',
    Pipeline='Independent',
    AccountName='KustoTest',
    Environment='Development'
)   
```

**Return output**

|OperationId 
|--
|3827def6-0773-4f2a-859e-c02cf395deaf

Running the command is done asynchronously - the result is an operation ID (GUID), which one can run .show operations <operation ID> with, to view the command's status.

.show operations 3827def6-0773-4f2a-859e-c02cf395deaf

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status 
|--|--|--|--|--|--|--|--
|3827def6-0773-4f2a-859e-c02cf395deaf |ServiceCreate | |2015-01-06 08:47:01.0000000 |2015-01-06 08:47:01.0000000 |0001-01-01 00:00:00.0000000 |InProgress |Started deployment of service: 'Engine-CoolService'

## suspend service

```kusto
.suspend service [ServiceName]
```

Suspends the service so that there are no compute costs while preserving data.

Requires [AccountAdmin permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

**Examples**

```kusto
.suspend service KustoDev
```

**Return output**

|OperationId 
|--
|0e0859cb-47aa-4be5-9fcc-99b6db64e73e

Running the command is done asynchronously - the result is an operation ID (GUID), which one can run .show operations <operation ID> with, to view the command's status.

```kusto
.show operations 0e0859cb-47aa-4be5-9fcc-99b6db64e73e
```

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status 
|--|--|--|--|--|--|--|--
|0e0859cb-47aa-4be5-9fcc-99b6db64e73e |ServiceSuspend | |2018-01-30 08:47:01.0000000 |2018-01-30 08:47:01.0000000 |0001-01-01 00:00:00.0000000 |InProgress

## suspend cluster

```kusto
.suspend cluster [ClusterName] 
```

Suspends an existing cluster (Engine and DataManagement services), by its name. When cluster is suspended, there are no compute costs.

Requires [AccountAdmin permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

**Examples**

```kusto
.suspend cluster TestCluster
```

**Return output**

|OperationId 
|--
|3827def6-0773-4f2a-859e-c02cf395deaf

Running the command is done asynchronously - the result is an operation ID (GUID), which one can run `.show operations <operation ID>` with, to view the command's status.

```kusto
.show operations 3827def6-0773-4f2a-859e-c02cf395deaf
```

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status 
|--|--|--|--|--|--|--|--
|3827def6-0773-4f2a-859e-c02cf395deaf |ClusterSuspend | |2015-01-06 08:47:01.0000000 |2015-01-06 08:47:01.0000000 |0001-01-01 00:00:00.0000000 |InProgress |Suspend cluster 'TestCluster'

## resume service

```kusto
.resume service [ServiceName]
```

Stops service suspension and installs the service. Effects only services in "suspended" state.

Requires [AccountAdmin permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

**Examples**

```kusto
.resume service KustoDev
```

**Return output**

|OperationId 
|--
|f00e4eb8-fa98-4019-a5ae-e7e9c0941a49

Running the command is done asynchronously - the result is an operation ID (GUID), which one can run .show operations <operation ID> with, to view the command's status.

```kusto
.show operations f00e4eb8-fa98-4019-a5ae-e7e9c0941a49
```

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status
|--|--|--|--|--|--|--|--
|f00e4eb8-fa98-4019-a5ae-e7e9c0941a49 |ServiceResume | |2018-01-30 08:47:01.0000000 |2018-01-30 08:47:01.0000000 |0001-01-01 00:00:00.0000000 |InProgress |Installing service KustoDev

## resume cluster

```kusto
.resume cluster [ClusterName] 
```

Resumes an existing cluster (Engine and DataManagement services), by its name.

Requires [AccountAdmin permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

**Examples**

```kusto
.resume cluster TestCluster
```

**Return output**

|OperationId 
|--
|3827def6-0773-4f2a-859e-c02cf395deaf

Running the command is done asynchronously - the result is an operation ID (GUID), which one can run `.show operations <operation ID>` with, to view the command's status.

```kusto
.show operations 3827def6-0773-4f2a-859e-c02cf395deaf
```

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status 
|--|--|--|--|--|--|--|--
|3827def6-0773-4f2a-859e-c02cf395deaf |ClusterResume | |2015-01-06 08:47:01.0000000 |2015-01-06 08:47:01.0000000 |0001-01-01 00:00:00.0000000 |InProgress |Resume cluster 'TestCluster'

## delete service

```kusto
.delete service [ServiceName] with(
    [deletecompute='<true|false>',]
    [deletestorageaccounts='<true|false>',]
    [deletednsmapping='<true|false>',]
    [deleteconfiguration='<true|false>']
)
```

Deletes an existing service, by its name.
One has the option of specifying which artifacts to delete (by default all of the following are retained and are *not* deleted):
   * Compute resources: Hosted Service or Resource Group (depending on the service hosting environment)
   * DNS Mapping (e.g. from [name].kusto.windows.net to [prefixed-name].cloudapp.net).
   * Storage Account(s) used by the service
     **NOTE:** *Specifying this is irreversible - data will be lost upon running it.* 
   * Service Configuration in the Service Model

Requires [AccountAdmin permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

**Examples**

```kusto
.delete service KustoDev with(deletehostedservice='true')
```

**Return output**

|OperationId 
|--
|3827def6-0773-4f2a-859e-c02cf395deaf

Running the command is done asynchronously - the result is an operation ID (GUID), which one can run `.show operations <operation ID>` with, to view the command's status.

```kusto
.show operations 3827def6-0773-4f2a-859e-c02cf395deaf
```

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status 
|--|--|--|--|--|--|--|--
|3827def6-0773-4f2a-859e-c02cf395deaf |ServiceDelete | |2015-01-06 08:47:01.0000000 |2015-01-06 08:47:01.0000000 |0001-01-01 00:00:00.0000000 |InProgress |Deleting service 'Engine-Aria'

## delete cluster

```kusto
.delete cluster [ClusterName] with(
    [deletecompute='<true|false>',]
    [deletestorageaccounts='<true|false>',]
    [deletednsmapping='<true|false>',]
    [deleteconfiguration='<true|false>']
)
```

Deletes an existing cluster (Engine and DataManagement services), by its name.
One has the option of specifying which artifacts to delete (by default all of the following are retained and are *not* deleted):
   * Compute resources: Hosted Service or Resource Group (depending on the service hosting environment)
   * DNS Mapping (e.g. from [name].kusto.windows.net to [prefixed-name].cloudapp.net).
   * Storage Account(s) used by the service
     **NOTE:** *Specifying this is irreversible - data will be lost upon running it.* 
   * Service Configuration in the Service Model

Requires [AccountAdmin permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

**Examples**

```kusto
.delete cluster TestCluster with(deletehostedservice='true')
```

**Return output**

|OperationId 
|--
|3827def6-0773-4f2a-859e-c02cf395deaf

Running the command is done asynchronously - the result is an operation ID (GUID), which one can run `.show operations <operation ID>` with, to view the command's status.

```kusto
.show operations 3827def6-0773-4f2a-859e-c02cf395deaf
```

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status 
|--|--|--|--|--|--|--|--
|3827def6-0773-4f2a-859e-c02cf395deaf |ClusterDelete | |2015-01-06 08:47:01.0000000 |2015-01-06 08:47:01.0000000 |0001-01-01 00:00:00.0000000 |InProgress |Deleting service 'Engine-Aria'

## Purge records from service
See [GDPR](https://kusdoc2.azurewebsites.net/docs/concepts/compliance-gdpr.html).

## add service to load balancer

```kusto
.add service [ServiceName] to load balancer [LoadBalancerName]
```

Adds an existing service to load balancer.
* ServiceName:      Name of the service to attach to load balancer. 
                    All load balancer services must reside in the same Kusto account.
* LoadBalancerName: Name of Azure load balancer (a.k.a. traffic manager).                    

If the load balancer doesn't exist, it will be created and mapped to a DNS cname of the form: \[LoadBalancerName\].\[KustoMfaDomainName\]. 
For example, for a load balancer 'MyLoadBalancer' the corresponding DNS cname will be: 'MyLoadBalancer.kustomfa.windows.net'
This DNS cname may be used to reference the load balancer, using standard Kusto authentication and authorization process.
In other words, accessing the load balancer via its DNS cname yields similar user experience to accessing one of the underlying services directly.
Access to the load balancer will be statistically evenly distributed between the attached services. For details, please refer to Microsoft Azure Traffic Manager documentation available online.

The following limitations apply when adding services to load balancers: 
* \[LoadBalancerName\] must be globally unique within Kusto MFA domain zone.
* Up to five services can be added to a single load balancer.
* Each service can be added to up to three load balancers.
* This command is subject to [query throttling policy] (querythrottlingpolicy.md): a single concurrent command is allowed

Requires [AccountAdmin permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

**Examples**

```kusto
.add service KUSTOLAB to load balancer kustolbtest
```

**Return output**

OperationId |RootActivityId |OperationInfo
|--|--|--
9a34d5b5-85be-4ac1-bbbd-36f400c7b1de |7c3a70a5-7c8b-49e1-8fdb-e10e24043e51 |.show operations 9a34d5b5-85be-4ac1-bbbd-36f400c7b1de

Running the command is done asynchronously. The result is an operation ID (GUID). Using this id when running the command: '.show operations <operation ID>' allows to view the command's status.
Upon successful completion, the status contains the DNS cname that can be used to reference the load balancer.

```kusto
.show operations 9a34d5b5-85be-4ac1-bbbd-36f400c7b1de
```

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status |RootActivityId |ShouldRetry |Database
|--|--|--|--|--|--|--|--|--|--|--
9a34d5b5-85be-4ac1-bbbd-36f400c7b1de |LoadBalancerPoolServiceAdd | |2017-10-25 11:39:03.3951398 |2017-10-25 11:39:19.5300033 |00:00:16.1348635 |Completed |Successfully added service 'Engine-kustolab to Load Balancer 'kustolbtest' accessible by DNS cname: 'kustolbtest.kustomfa.windows.net' |f1f12234-6f51-4c84-adf0-c24347ddf455 |False |CM

## drop service from load balancer

```kusto
.drop service [ServiceName] from load balancer [LoadBalancerName]
```

Drops (detaches) a service from load balancer.
* ServiceName:      Name of the service to drop from load balancer. 
* LoadBalancerName: Name of Azure load balancer (a.k.a. traffic manager).

If the dropped service is the only service under the load balancer, the load balancer will be deleted, and the corresponding DNS mapping will be removed. 
This command is subject to [query throttling policy] (querythrottlingpolicy.md): a single concurrent command is allowed

Requires [AccountAdmin permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

**Examples**

```kusto
.drop service KUSTOLAB from load balancer kustolbtest
```

**Return output**

OperationId |RootActivityId |OperationInfo
|--|--|--
0a15e8de-9b92-4acd-9100-a2ca234847a4 |14b21e22-47dc-4071-b1df-1aae148844d7 |.show operations 0a15e8de-9b92-4acd-9100-a2ca234847a4

Running the command is done asynchronously. The result is an operation ID (GUID). Using this id when running the command: '.show operations <operation ID>' allows to view the command's status.

```kusto
.show operations 0a15e8de-9b92-4acd-9100-a2ca234847a4
```

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status |RootActivityId |ShouldRetry |Database
|--|--|--|--|--|--|--|--|--|--|--
0a15e8de-9b92-4acd-9100-a2ca234847a4 |LoadBalancerPoolServiceDrop | |2017-10-25 13:24:22.2565727 |2017-10-25 13:26:17.8442399 |00:01:55.5876672 |Completed | |14b21e22-47dc-4071-b1df-1aae148844d7 |False |CM

## add dm service eventhub ingestion source

 ```kusto
.add dm service [ServiceName] eventhub ingestion source <IngestionSourceName> with(
    EventHubNamespaceConnectionString='<A connection string to the event hub namespace>', 
    EventHubName='<The name of the eventhub to ingest from>', 
    EventHubResourceId='<The event hub resource id to ingest from>', 
    EventHubConsumerGroupName='<Name of consumer group to ingest from>', 
    TargetDatabase='<Kusto Target database>',
	[SharedAccessKeyName='<EventHub's shared access key name>',]
    [TargetTable='<Kusto Target table>',]
    [Format='<Data format>',]
    [IngestionMappingReference='<Ingestion mapping reference>']
) [ifnotexists]
```

Adds a new eventhub ingestion source for event hub and storage account, owned by the client.
  
Parameters: 
* ObtainerName: Name of the ingestion source to add.
* EventHubNamespaceConnectionString: A connection string to the EventHub namespace. Required when adding a new ingestion source, or when EventHub properties are specified.
* EventHubName: The name of the EventHub to ingest from. Required when adding a new ingestion source, or when EventHub properties are specified.
* EventHubResourceId: The resource id of the EventHub to ingest from. Required when adding a new ingestion source, or when EventHub properties are specified.
* EventHubConsumerGroupName: Name of consumer group to ingest from. Required when adding a new ingestion source.
* TargetDatabase: Kusto Target database. Required when adding a new ingestion source.
* [optional] SharedAccessKeyName: EventHub's shared access key name with at least listener claim. If not specified, will use the first found.
* [optional] TargetTable: Kusto Target table. Left empty by default.
* [optional] Format: Data format. Supported formats are `json` and `csv`. Default is `json`.
* [optional] IngestionMappingReference: Reference to ingestion mapping. Left empty by default.
* [optional] ifnotexists: If specified, then attempting to create an ingestion source when there's already an existing one with the same name alters it's properties. Otherwise a failure is returned in such cases.

**Examples**
```kusto
.add dm service ingest-Playground eventhub ingestion source MyIngestionSourceName with(
    EventHubName='MyEventHubName', 
    EventHubResourceId='/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.EventHub/namespaces/{namespaceName}/eventhubs/{eventHubName}', 
    EventHubNamespaceConnectionString='Endpoint=sb://my-eventhub-namespace.servicebus.windows.net/;SharedAccessKeyName=<RootManageSharedAccessKeyName>;SharedAccessKey=<Key>', 
    EventHubConsumerGroupName='$Default', 
    TargetDatabase='MyDatabase'
)
```

Adds a new ingestion source to the DM service.

```kusto
.add dm service ingest-Playground iothub ingestion source MyIngestionSourceName with(
    PartitionCount=2, 
    EventHubName='MyEventHubName', 
    EventHubResourceId='/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Devices/IotHubs/{iotHubName} ', 
    EventHubNamespaceConnectionString='Endpoint=sb://my-eventhub-namespace.servicebus.windows.net/;SharedAccessKeyName=<RootManageSharedAccessKeyName>;SharedAccessKey=<Key>', 
    EventHubConsumerGroupName='$Default', 
    TargetDatabase='MyDatabase'
)
```

Adds a new ingestion source to the DM service.

```kusto
.alter dm service ingest-Playground eventhub ingestion source MyIngestionSourceName with(
    TargetTable='MyNewTable'
)
```

Alters an existing eventhub ingestion source.

**Return output**

|OperationId 
|--
|d36343d0-43cb-4bb0-858a-c00e0dea0ec6

Running the command is done asynchronously - the result is an operation ID (GUID), which one can run .show operations <operation ID> with, to view the command's status.

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status 
|--|--|--|--|--|--|--|--
|d36343d0-43cb-4bb0-858a-c00e0dea0ec6 |DmServiceEventHubDataObtainerAddCommand | |2016-02-02 12:31:29.6311482 |2016-02-02 12:35:30.6719651 |00:04:01.0408169 |InProgress | 


## drop dm service eventhub ingestion source
```kusto
.drop dm service <DmServiceName> ingestion source <IngestionSourceName> [with(DeleteStorageAccounts='<true | false>')]
```

For an existing Data Management service - drops an existing ingestion source, and if specified, deletes its underlying storage accounts. Defaults to not deleting storage accounts

Parameters:
* [optional] DeleteStorageAccounts: Whether to delete underlying storage accounts or not. Default, if unspecified, is false.

**Examples**

```kusto
.drop dm service ingest-Playground ingestion source MyIngestionSourceName
```

**Return output**

|OperationId 
|--
|d36343d0-43cb-4bb0-858a-c00e0dea0ec6

Running the command is done asynchronously - the result is an operation ID (GUID), which one can run .show operations <operation ID> with, to view the command's status.

```kusto
.show operations d36343d0-43cb-4bb0-858a-c00e0dea0ec6
```

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status 
|--|--|--|--|--|--|--|--
|d36343d0-43cb-4bb0-858a-c00e0dea0ec6 |DmServiceDataObtainerDrop | |2016-02-02 12:31:29.6311482 |2016-02-02 12:35:30.6719651 |00:04:01.0408169 |InProgress | 