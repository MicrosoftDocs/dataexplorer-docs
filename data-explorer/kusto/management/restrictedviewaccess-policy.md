---
title: RestrictedViewAccess policy - Azure Data Explorer | Microsoft Docs
description: This article describes RestrictedViewAccess policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 01/09/2019

---
# RestrictedViewAccess policy

The *RestrictedViewAccess* policy is documented [here](../concepts/restrictedviewaccesspolicy.md).

Control commands for enabling or disabling the policy on table(s) in the database are the following:

To enable/disable the policy:
```kusto
.alter table TableName policy restricted_view_access true|false
```

To enable/disable the policy of multiple tables:
```kusto
.alter tables (TableName1, ..., TableNameN) policy restricted_view_access true|false
```

To view the policy:
```kusto
.show table TableName policy restricted_view_access  

.show table * policy restricted_view_access  
```

To delete the policy (equivalent to disabling):
```kusto
.delete table TableName policy restricted_view_access  
```