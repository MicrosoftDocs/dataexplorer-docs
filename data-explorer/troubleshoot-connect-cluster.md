---
title: Troubleshoot Azure Data Explorer cluster connection failures
description: This article describes troubleshooting steps for connecting to a cluster in Azure Data Explorer.
ms.reviewer: mblythe
ms.topic: how-to
ms.date: 01/21/2025
---

# Troubleshoot: Failure to connect to a cluster in Azure Data Explorer

If you're not able to connect to a cluster in Azure Data Explorer, follow these steps.

1. Ensure the connection string is correct. It should be in the form: `https://<ClusterName>.<Region>.kusto.windows.net`, such as the following example:  `https://docscluster.westus.kusto.windows.net`.

1. Ensure you have adequate permissions. Otherwise, you get a response of *unauthorized*.

    For more information about permissions, see [Manage database permissions](manage-database-permissions.md). If necessary, work with your cluster administrator so they can add you to the appropriate role.

1. If you're connecting from an external tenant, ensure the cluster has correct permissions.

    For more information about cross tenant scenarios, see [Allow cross-tenant queries and commands](cross-tenant-query-and-commands.md).

1. Ensure your cluster is active. Clusters can automatically stop due to [auto-stop settings](auto-stop-clusters.md).
  
    1. From the [Azure portal](https://ms.portal.azure.com/), navigate to **Azure Data Explorer Clusters** and view your cluster.

    1. If the value in the **State** column is **Stopped**, select your cluster to open the overview page.

    1. From the **Command bar**, select **Start**. Then try reconnecting.

1. Verify that the cluster wasn't deleted by reviewing your subscription activity log.

1. Check the [Azure service health dashboard](https://azure.microsoft.com/status/). Look for the status of Azure Data Explorer in the region where you're trying to connect to a cluster.

    If the status isn't **Good** (green check mark), try connecting to the cluster after the status improves.

1. If you still need assistance solving your issue, open a support request in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).
