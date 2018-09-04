---
title: Admin permissions required - Azure Kusto | Microsoft Docs
description: This article describes Admin permissions required in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Admin permissions required

|Command |Permissions role Required  |Comments 
|---|---|---
|AdminThenQueryCommand |The 'AdminCommand' will run under the correct permissions. The 'QueryCommand' is running on a temporary table so no need to check permissions.
|.show capacity|Everyone (cluster access) | 
|.show cluster|Everyone (cluster access) | 
|.attach database|ClusterAdmin | 
|.create database|ClusterAdmin | 
|.detach database|DatabaseAdmin | 
|.save (command)|DatabaseAdmin | 
|DatabaseSetAccessModeCommand |ClusterAdmin | 
|.show databases|Everyone (cluster access) |Show only databases the user has permissions for 
|.ingest (command)|TableIngestor |For a non-existing table TableAdmin permissions are required |
|DiagnosticsShowCommand |Everyone (cluster access) | 
|.echo (command)|ClusterAdmin | 
|.alter policy of encoding|ClusterAdmin | 
|.show policy of encoding|Everyone (cluster access) | 
|.show extents|Everyone (cluster access) |Show only extents of tables the user has permissions for 
|.drop extents|DatabaseAdmin/TableAdmin |Drop extents with query restricted to table admin 
|.drop extent tags|TableAdmin | 
|.merge extents|ClusterAdmin | 
|.show freshness|DatabaseViewer | 
|.show memory|Everyone (cluster access) | 
|.show operations|Everyone (cluster access) | A user can query for his own operations, an admin can query for all operations |
|.show ingestion failures|Everyone (cluster access) | A user can query for his own ingestion failures, an admin can query for all ingestion failures |
|.show queries|Everyone (cluster access) | A user can query for his own queries, an admin can query for all queries |
|.show journal|Everyone (cluster access) | A user can query for his own journal entries, an admin can query for all journal entries |
|ResultsTraceCommand |Acoording to  'InnerQueryOrCommand' should be ClusterViewer | 
|.show schema|Everyone (cluster access) |Show only databases the user has permissions for 
|.append table |TableAdmin | 
|.create table|DatabaseUser | 
|.drop table|TableAdmin | 
|.create tables|DatabaseUser | 
|.set table|DatabaseUser | 
|.set-or-append table|DatabaseUser (table doesn't exist) or TableAdmin (table exists)| 
|.show table|DatabaseViewer | 
|.show tables|DatabaseViewer | 
|TraceLevelControlCommand |ClusterAdmin | 
|VersionShowCommand |Everyone (cluster access) | 
|ClusterAlterAuthorizedPrincipalsCommand |ClusterAdmin |Set/add/drop  cluster users/admins/viewers 
|ClusterShowPrincipalsCommand |ClusterUser | 
|ColumnAlterCommand |TableAdmin | 
|ColumnDropCommand |TableAdmin | 
|ColumnRenameCommand |TableAdmin | 
|DatabaseAlterAuthorizedPrincipalsCommand |DatabaseAdmin |Set/add/drop  database X users/admins/viewers 
|DatabaseExtentContainer ... commands |ClusterAdmin |Add/drop/recycle/set state/show commands 
|DatabaseSetPrettyNameCommand |DatabaseAdmin | 
|DatabaseShowPrincipalsCommand |DatabaseUser | 
|DataExportPushCommand |DatabaseViewer | 
|DataExportToBlobCommand |DatabaseViewer | 
|DiagnosticsShowCommand |Everyone (cluster access) | 
|ExtentDetailsShowCommand |DatabaseViewer | 
|ExtentRebuildByQueryCommand |DatabaseAdmin | 
|ExtentsAttachByMetadataCommand |ClusterAdmin | 
|ExtentsDropByQueryCommand |ClusterAdmin | 
|ExtentsShowMetadataCommand |Everyone (cluster access) | 
|RetentionPolicy alter/drop |DatabaseAdmin | 
|RetentionPolicyShowCommand |Everyone (cluster access) | 
|RunningQueryCancelCommand |DatabaseUser | 
|TableCreateCommand |DatabaseUser | 
|TableAlterCommand |TableAdmin | 
|TableDropCommand |TableAdmin | 
|TableRenameCommand |TableAdmin | 
|TableShowPrincipalsCommand |DatabaseUser | 
|TableAlterAuthorizedPrincipalsCommand |TableAdmin |Set/add/drop table X admins |
|FunctionCreateCommand |DatabaseUser | 
|FunctionAlterCommand |FunctionAdmin | 
|FunctionDropCommand |FunctionAdmin | 
|FunctionShowPrincipalsCommand |DatabaseUser | 
|FunctionAlterAuthorizedPrincipalsCommand |FunctionAdmin |Set/add/drop function X admins |
|FunctionsShowCommand|DatabaseViewer |
|FunctionShowSchemaCommand|DatabaseUser |
|UserRolesShowCommand |ClusterUser | 