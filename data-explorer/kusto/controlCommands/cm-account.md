---
title: Cluster Management -  Kusto Accounts - Azure Kusto | Microsoft Docs
description: This article describes Cluster Management -  Kusto Accounts in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Cluster Management: Kusto Accounts

## show account services 

```kusto
.show account <AccountName> services
.show account <AccountName> service configurations
```

Shows the status for the collection of Kusto clusters (or configuration only, if specified) which relate to the given account name.
The status is comprised of the results of [.show service](../controlCommands/CM-service.md#show-service) for each of the services in the account.
Requires [AccountAdmin permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

**Examples**

```kusto
.show account Aria services
```
    
## show account subscriptions 

```kusto
.show account <AccountName> subscriptions
.show accounts subscriptions
```

Shows metadata and the resources availability for the collection of Azure subscriptions which are used under the given account.
Requires [AccountAdmin permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

**Example**

```kusto
.show accounts subscriptions
```
    
**Example result:**

|AccountName |SubscriptionId |SubscriptionName |AvailableCores |AvailableStorageAccounts |AvailableHostedServices |CurrentCores |CurrentStorageAccounts |CurrentHostedServices |AzureAccountAdmin |AzureServiceAdmin| KustoServiceCount |KustoServiceNames
|---|---|---|---|---|---|---|---|---|---|---|---|---
|Kusto | a0cd6542-7eaf-43d2-bbdf-b678a869aad1| BIA_OneSi_Stage0_KustoDev| 180| 92| 14| 170| 8| 6| guyy@microsoft.com| sskone@microsoft.com | 3| Engine-KuskusProd,Engine-KuskusDF,Mgmt-KuskusDF
|Kusto | f3101802-8c4f-4e6e-819d-a3b5794d33dd| BIA_OneSi_Stage0_KustoDev| 245| 0| 41| 105| 20| 59| guyy@microsoft.com| sskone@microsoft.com | 1| Mgmt-KuskusNative
|Aria | cddfb24d-a040-480b-b211-7df364addb10| BIA_OneSi_Stage0_KustoDev| 1126| 15| 17| 74| 5| 3| guyy@microsoft.com| sskone@microsoft.com | 2| Engine-Aria,Mgmt-Aria

## show account audit log

```kusto
.show account <AccountName> audit log
.show account <AccountName> audit log from '<StartDate>'
.show account <AccountName> audit log from '<StartDate>' to '<EndDate>'

```

Shows CM operations performed on any service within the given account, according to the provided parameters:
* AccountName: Name of the account
* [optional] StartDate: Lower time limit for filtering operations
* [optional] EndDate: Upper time limit for filtering operations
* If only start time is specified, the command returns operations from the given start time and up to now.
* If no time limits are specified, the command returns operations from the last 24 hours.

**Examples**

```kusto
.show account Aria audit log
.show account Aria audit log from '2017-01-30T12:00'
.show account Aria audit log from '2017-01-30T12:00' to '2017-01-30T12:30'
.show account Aria audit log from '2017-01-30T12:00' | where ServiceName startswith "Ingest"

```

**Example result:**

|OperationId| OperationKind| ServiceName| ServiceType| StartTime| Duration| State| StateDetails| ClientActivityId| Text| AdditionalParameters| PrincipalIdentity 
|---|---|---|---|---|---|---|---|---|---|---|---
|6f81d006-6272-4517-a8c8-f4a3ccd2d7f9| ServiceInstall| Ingest-aria| DataManagement| 2017-01-30 12:04:52.1356147| 00:09:30.3938061| Completed| | KE.RunCommand;7ee6f155-b111-4023-ba55-f8a1e49dcbca| .install service Aria| {"ProductVersion":"KustoMain_2017.01.30.4"}| user@microsoft.com 
|00630d84-c96f-42fc-a838-d33a25246a42| DatabaseCreate| ariarta | Engine| 2017-01-30 15:05:29.2719236| 00:00:14.9580636| Completed| | KD2RunCommand;ff86bb45-0c77-4085-8ad3-f633eceee81b| .create database test in service [ariarta]| | user@microsoft.com

## List user roles

```kusto
.show principal roles
```
List all roles for the current user (the user who executed the command). Minimum permissions: the user should have access to at least one account in the cluster, or be cm viewer.

```kusto
.show principal "addObjectPrefix=AADObjectid" roles
```
List all roles for the specified principal (user, application) AADObjectid. The command runs in cluster context, meaning it returns all accounts and cluster level roles the principal has access to.
Required permissions: cluster viewer.

**Examples**

```kusto
.show principal "aaduser=imikeoein@fabrikam.com" roles
.show principal @'dstsapp=<App ID>' roles
```