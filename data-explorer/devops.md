---
title: Azure DevOps task for Azure Data Explorer
description: In this article, you learn to create a release pipeline and deploy your schema changes to your database.
ms.reviewer: shfeldma
ms.topic: how-to
ms.date: 07/17/2024

#Customer intent: I want to use Azure DevOps to create a release pipeline and deploy
---

# Azure DevOps Task for Azure Data Explorer

[Azure DevOps Services](https://azure.microsoft.com/services/devops/) provides development collaboration tools such as high-performance pipelines, free private Git repositories, configurable Kanban boards, and extensive automated and continuous testing capabilities. [Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines/) is an Azure DevOps capability that enables you to manage CI/CD to deploy your code with high-performance pipelines that work with any language, platform, and cloud.
[Azure Data Explorer - Pipeline Tools](https://marketplace.visualstudio.com/items?itemName=Azure-Kusto.PublishToADX) is the Azure Pipelines task that enables you to create release pipelines and deploy your database changes to your Azure Data Explorer databases. It's available for free in the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).
This extension includes the following basic tasks:

* Azure Data Explorer Command - Run Admin Commands against an Azure Data Explorer cluster
* Azure Data Explorer Query - Run Queries against an Azure Data Explorer cluster and parse the results
* Azure Data Explorer Query Server Gate - Agentless task to Gate releases depending on the query outcome

    :::image type="content" source="media/devops/extension-task-types.png" alt-text="Screenshot of the task types available in the Pipeline Tools extension.":::

This document describes a simple example on the use of the **Azure Data Explorer - Pipeline Tools** task to deploy your schema changes to your database. For complete CI/CD pipelines, refer to [Azure DevOps documentation](/azure/devops/user-guide/what-is-azure-devops#vsts).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* Azure Data Explorer cluster setup:
    * Create Microsoft Entra app by [provisioning a Microsoft Entra application](provision-entra-id-app.md).
    * Grant access to your Microsoft Entra App on your Azure Data Explorer database by [managing Azure Data Explorer database permissions](manage-database-permissions.md).
* Azure DevOps setup:
    * [Sign up for a free organization](/azure/devops/user-guide/sign-up-invite-teammates).
    * [Create an organization](/azure/devops/organizations/accounts/create-organization).
    * [Create a project in Azure DevOps](/azure/devops/organizations/projects/create-project).
    * [Code with Git](/azure/devops/user-guide/code-with-git).
* Extension Installation:
    * If you're the Azure DevOps instance owner, install the extension from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=Azure-Kusto.PublishToADX), otherwise contact your Azure DevOps instance [owner](/azure/devops/organizations/security/look-up-organization-owner) and ask them to install it.

        :::image type="content" source="media/devops/get-extension.png" alt-text="Screenshot of getting the Pipeline Tools extension in the Visual Studio Marketplace.":::

        :::image type="content" source="media/devops/extension-install.png" alt-text="Screenshot of installing the Pipeline Tools extension from the Visual Studio Marketplace.":::

## Prepare your content for release

You can use the following methods to execute admin commands against a cluster within a task:

:::image type="content" source="media/devops/source-control-options.png" alt-text="Screenshot showing the command source control options.":::

* Use a search pattern to get multiple command files from a local agent folder (Build sources or Release artifacts)

    :::image type="content" source="media/devops/local-folder-option.png" alt-text="Screenshot showing  the local folder option.":::

* Write commands inline

    :::image type="content" source="media/devops/inline-option.png" alt-text="Screenshot showing the inline command option.":::

* Specify a file path to get command files directly from git source control (recommended)

    :::image type="content" source="media/devops/git-option.png" alt-text="Screenshot showing git source control files option.":::

    Create the following sample folders (*Functions*, *Policies*, *Tables*) in your Git repository. Copy the files from [the samples repo](https://github.com/Azure/azure-kusto-docs-samples/tree/master/DevOps_release_pipeline) into the respective folders and commit the changes. The sample files are provided to execute the following workflow.

    :::image type="content" source="media/devops/create-folders.png" alt-text="Screenshot showing the folders to create in the repo.":::

    > [!TIP]
    > When creating your own workflow, we recommend making your code idempotent. For example, use [`.create-merge table`](/kusto/management/create-merge-table-command) instead of [`.create table`](/kusto/management/create-table-command), and use [`.create-or-alter`](/kusto/management/create-alter-function) function instead of [`.create`](/kusto/management/create-function) function.

## Create a release pipeline

1. Sign in to your [Azure DevOps organization](https://dev.azure.com/).
1. Select **Pipelines** > **Releases** from left-hand menu and select **New pipeline**.

    :::image type="content" source="media/devops/new-pipeline.png" alt-text="Screenshot showing how to start a new pipeline.":::

1. The **New release pipeline** window opens. In the **Pipelines** tab, in the **Select a template** pane, select **Empty job**.

    :::image type="content" source="media/devops/select-template.png" alt-text="Screenshot showing how to select a template.":::

1. Select **Stage** button. In **Stage** pane, add the **Stage name**. Select **Save** to save your pipeline.

    :::image type="content" source="media/devops/stage-name.png" alt-text="Screenshot showing how to name the pipeline stage.":::

1. Select **Add an artifact** button. In the **Add an artifact** pane, select the repository where your code exists, fill out relevant information, and select **Add**. Select **Save** to save your pipeline.

    :::image type="content" source="media/devops/add-artifact.png" alt-text="Screenshot showing how to add an artifact.":::

1. In the **Variables** tab, select **+ Add** to create a variable for **Endpoint URL** that is used in the task. Write the **Name** and the **Value** of the endpoint. Select **Save** to save your pipeline.

    :::image type="content" source="media/devops/create-variable.png" alt-text="Screenshot showing how to create a pipeline variable.":::

    To find your endpoint URL, go to the overview page of your Azure Data Explorer cluster in the Azure portal and copy the cluster URI. Construct the variable URI in the following format `https://<ClusterURI>?DatabaseName=<DBName>`.  For example, https:\//kustodocs.westus.kusto.windows.net?DatabaseName=SampleDB

    :::image type="content" source="media/devops/adx-cluster-uri.png" alt-text="Screenshot showing how to add a value for the Azure Data Explorer cluster URI.":::

### Create a task deploy the folders

1. In the **Pipeline** tab, select on **1 job, 0 task** to add tasks.

    :::image type="content" source="media/devops/add-task.png" alt-text="Screenshot showing adding a task to the pipeline.":::

1. Repeat the following steps to create command tasks to deploy files from the **Tables**, **Functions**, and **Policies** folders:

    :::image type="content" source="media/devops/add-admin-commands.png" alt-text="Screenshot showing how to add an Azure Data Explorer admin command.":::

    1. In the **Tasks** tab, select **+** by **Agent job** and search for **Azure Data Explorer**.
    1. Under **Run Azure Data Explorer Command**, select **Add**.
    1. Select **Kusto Command** and update the task with the following information:
        * **Display name**: Name of the task. For example, **`Deploy <FOLDER>`** where `<FOLDER>` is the name of the folder for the deployment task you're creating.
        * **File path**: For each folder, specify the path as `*/<FOLDER>/*.csl` where `<FOLDER>` is the relevant folder for the task.
        * **Endpoint URL**: Specify the `EndPoint URL` variable created in previous step.
        * **Use Service Endpoint**: Select this option.
        * **Service Endpoint**: Select an existing service endpoint or create a new one (**+ New**) providing the following information in the **Add Azure Data Explorer service connection** window:

            | Setting | Suggested value |
            |--|--|
            | **Authentication method** | [Set up Federated Identity Credentials (FIC)](#use-federated-identity-credentials-fic-authentication-in-an-azure-data-explorer-service-connection) (recommended), or Select Service Principal Authentication (SPA). |
            | **Connection name** | Enter a name to identify this service endpoint |
            | **Cluster Url** | Value can be found in the overview section of your Azure Data Explorer Cluster in the Azure portal |
            | **Service Principal Id** | Enter the Microsoft Entra App ID (created as prerequisite) |
            | **Service Principal App Key** | Enter the Microsoft Entra App Key (created as prerequisite) |
            | **Microsoft Entra tenant ID** | Enter your Microsoft Entra tenant (such as microsoft.com or contoso.com) |

        Select **Allow all pipelines to use this connection** checkbox and then select **OK**.

        :::image type="content" source="media/devops/add-service-endpoint.png" alt-text="Screenshot showing how to add a service connection.":::

1. Select **Save** and then in the **Tasks** tab, verify that there are three tasks: **Deploy Tables**, **Deploy Functions**, and **Deploy Policies**.

    :::image type="content" source="media/devops/deploy-all-folders.png" alt-text="Screenshot showing how to deploy all folders.":::

### Create a Query task

If necessary, create a task to run a query against the cluster. Running queries in a Build or Release pipeline can be used to validate a dataset and have a step succeed or fail based on the query results. The tasks success criteria can be based on a row count threshold or a single value depending on what the query returns.

1. In the **Tasks** tab, select **+** by **Agent job** and search for **Azure Data Explorer**.

1. Under **Run Azure Data Explorer Query**, select **Add**.
1. Select **Kusto Query** and update the task with the following information:

    * **Display name**: Name of the task. For example, **Query cluster**.
    * **Type**: Select **Inline**.
    * **Query**: Enter the query you want to run.
    * **Endpoint URL**: Specify the `EndPoint URL` variable created earlier.
    * **Use Service Endpoint**: Select this option.
    * **Service Endpoint**: Select a service endpoint.

    :::image type="content" source="media/devops/query-task.png" alt-text="Screenshot showing how to create a query task.":::

1. Under Task Results, select the task's success criteria based on the results of your query, as follows:

    * If your query returns rows, select **Row Count** and provide the criteria you require.

        :::image type="content" source="media/devops/row-count.png" alt-text="Screenshot showing the query returns rows and set the row count thresholds.":::

    * If your query returns a value, select **Single Value** and provide the expected result.

        :::image type="content" source="media/devops/single-value.png" alt-text="Screenshot showing the query returns a single value and set the expected value.":::

### Create a Query Server Gate task

If necessary, create a task to run a query against a cluster and gate the release progress pending Query Results Row Count. The Server Query Gate task is an agentless job, meaning that the query runs directly on the Azure DevOps Server.

1. In the **Tasks** tab, select **+** by **Agentless job** and search for **Azure Data Explorer**.

1. Under **Run Azure Data Explorer Query Server Gate**, select **Add**.
1. Select **Kusto Query Server Gate** and then select **Server Gate Test**.

    :::image type="content" source="media/devops/query-gate-add.png" alt-text="Screenshot showing how to select a Server Gate task.":::

1. Configure the task providing the following information:

    * **Display name**: Name of the gate.
    * **Service Endpoint**: Select a service endpoint.
    * **Database name**: Specify the database name.
    * **Type**: Select **Inline query**.
    * **Query**: Enter the query you want to run.
    * **Maximum threshold**: Specify the maximum row count for the query's success criteria.

    :::image type="content" source="media/devops/query-gate.png" alt-text="Screenshot showing how to configure a Server Gate task.":::

> [!NOTE]
> You should see results like the following When running the release.
>
> :::image type="content" source="media/devops/query-gate-look.png" alt-text="Screenshot showing an example Query Gate task results.":::

### Run the release

1. Select **+ Release** > **Create release** to create a release.

    :::image type="content" source="media/devops/create-release.png" alt-text="Screenshot showing how to create a release.":::

1. In the **Logs** tab, check the deployment status is successful.

    :::image type="content" source="media/devops/deployment-successful.png" alt-text="Screenshot showing a successful deployment.":::

Now the creation of a release pipeline for deployment to preproduction is complete.

## Keyless authentication support for Azure Data Explorer DevOps tasks

The extension supports keyless authentication for Azure Data Explorer clusters. Keyless authentication allows you to authenticate to Azure Data Explorer clusters without using a key and is more secure and easier to manage than using a key.

### Use Federated Identity Credentials (FIC) authentication in an Azure Data Explorer service connection

1. In your DevOps instance, go to **Project Settings** > **Service connections** > **New service connection** > **Azure Data Explorer**.
1. Select **Federated Identity Credentials**, and enter your cluster URL, service principal ID, tenant ID, a service connection name, and then select **Save**.
1. In the Azure portal, open the Microsoft Entra app for the specified service principal.
1. Under **Certificates & secrets**, select **Federated credentials**.

    :::image type="content" source="media/devops/credential.png" alt-text="Screenshot showing the federated credentials tab of the Microsoft Entra app.":::

1. Select **Add credential** and then for **Federated credential scenario**, select **Other issuer**, and fill out the settings using the following information:

    * **Issuer**: `<https://vstoken.dev.azure.com/{System.CollectionId}>` where `{System.CollectionId}` is the collection ID of your Azure DevOps organization.
        You can find the collection ID in the following ways:

        * In the Azure DevOps classic release pipeline, select **Initialize job**. The collection ID is displayed in the logs.

    * **Subject identifier**: `<sc://{DevOps_Org_name}/{Project_Name}/{Service_Connection_Name}>` where `{DevOps_Org_name}` is the Azure DevOps organization name, `{Project_Name}` is the project name, and `{Service_Connection_Name}` is the service connection name you created earlier.

        > [!NOTE]
        > If there is space in your service connection name, you can using it with space in the field. For example: `sc://MyOrg/MyProject/My Service Connection`.

    * **Name**: Enter a name for the credential.

    :::image type="content" source="media/devops/credential-setting.png" alt-text="Screenshot showing how to create a new service connection with Federated Identity Credentials.":::

1. Select **Add**.

### Use Federated Identity Credentials or Managed Identity in an Azure Resource Manager (ARM) service connection

1. In your DevOps instance, go to **Project Settings** > **Service connections** > **New service connection** > **Azure Resource Manager**.

    :::image type="content" source="media/devops/resource-new.png" alt-text="Screenshot showing how to add an Azure Resource Monitor service connection.":::

1. Under **Authentication method**, select **Workload Identity Federation (automatic)**. Alternatively, you can use the manual **Workload Identity Federation (manual)** option to specify the Workload Identity Federation details, or use the **Managed Identity** option. For more information about setting up a managed identity using Azure Resource Management, see [Azure Resource Manager (ARM) Service Connections](/azure/devops/pipelines/library/connect-to-azure?view=azure-devops&preserve-view=true).

    :::image type="content" source="media/devops/resource-types.png" alt-text="Screenshot showing the authentication option for an Azure Resource Monitor service connection":::

1. Fill out the required details, select **Verify**, and then select **Save**.

## Yaml Pipeline configuration

The tasks can be configured both via Azure DevOps Web UI and via Yaml code within the [pipeline schema](/azure/devops/pipelines/yaml-schema).

### Admin command sample usage

```yaml
steps:
- task: Azure-Kusto.PublishToADX.PublishToADX.PublishToADX@4
  displayName: '<Task Name>'
  inputs:
    targetType: 'inline'
    script: '<inline Script>'
    waitForOperation: true
    kustoUrls: '$(CONNECTIONSTRING):443?DatabaseName=""'
    authType: 'armserviceconn'
    connectedServiceARM: '<ARM Service Endpoint Name>'
    serialDelay: 1000
  continueOnError: true
  condition: ne(variables['ProductVersion'], '') ## Custom condition Sample
```

### Query sample usage

```yaml
steps:
- task: Azure-Kusto.PublishToADX.ADXQuery.ADXQuery@4
  displayName: '<Task Display Name>'
  inputs:
    targetType: 'inline'
    script: |
     let badVer=
     RunnersLogs | where Timestamp > ago(30m)
         | where EventText startswith "$$runnerresult" and Source has "ShowDiagnostics"
         | extend State = extract(@"Status='(.*)', Duration.*",1, EventText)
         | where State == "Unhealthy"
         | extend Reason = extract(@'"NotHealthyReason":"(.*)","IsAttentionRequired.*',1, EventText)
         | extend Cluster = extract(@'Kusto.(Engine|DM|CM|ArmResourceProvider).(.*).ShowDiagnostics',2, Source)
         | where Reason != "Merge success rate past 60min is < 90%"
         | where Reason != "Ingestion success rate past 5min is < 90%"
         | where Reason != "Ingestion success rate past 5min is < 90%, Merge success rate past 60min is < 90%"
         | where isnotempty(Cluster)
         | summarize max(Timestamp) by Cluster,Reason
         | order by  max_Timestamp desc
         | where Reason startswith "Differe"
         | summarize by Cluster
     ;
      DimClusters | where Cluster in (badVer)
     | summarize by Cluster , CmConnectionString , ServiceConnectionString ,DeploymentRing
     | extend ServiceConnectionString = strcat("#connect ", ServiceConnectionString)
     | where DeploymentRing == "$(DeploymentRing)"
    kustoUrls: 'https://<ClusterName>.kusto.windows.net?DatabaseName=<DataBaneName>'
    authType: 'kustoserviceconn'
    connectedServiceName: '<connection service name>'
    minThreshold: '0'
    maxThreshold: '10'
  continueOnError: true
```
