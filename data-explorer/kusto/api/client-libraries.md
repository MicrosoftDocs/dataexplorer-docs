---
title:  Client libraries overview
description: This article lists the Client libraries in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 07/23/2023
---
# Kusto client libraries

The following table lists the different libraries provided for query, ingestion, and ARM/RP management.
Use these libraries for Azure APIs and to programmatically interact with your cluster.

> For previous SDK versions, see the [archived article](/previous-versions/azure/data-explorer/kusto/api/client-libraries).

| Language/Functionality | Query | Ingestion | ARM/RP Management |
|--|--|--|--|
| .NET (4.7.2, Core 2.1, Standard 2.0) | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Data/) | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Ingest/) | [NuGet](https://www.nuget.org/packages/Azure.ResourceManager.Kusto/) |
| .NET Standard 2.0 (deprecated) | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Data.NETStandard/) | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Ingest.NETStandard/) |  |
| Java | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-data) [GitHub](https://github.com/Azure/azure-kusto-java/tree/master/data) | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-ingest) [GitHub](https://github.com/Azure/azure-kusto-java/tree/master/ingest) | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.kusto.v2020_09_18) |
| Python | [Pypi](https://pypi.org/project/azure-kusto-data/)    [GitHub](https://github.com/Azure/azure-kusto-python/tree/master/azure-kusto-data) | [Pypi](https://pypi.org/project/azure-kusto-ingest/)      [GitHub](https://github.com/Azure/azure-kusto-python/tree/master/azure-kusto-ingest) | [Pypi](https://pypi.org/project/azure-mgmt-kusto/) |
| R | [CRAN](https://cran.r-project.org/web/packages/AzureKusto/index.html) |  |  |
| Go | [GitHub](https://github.com/Azure/azure-kusto-go) | [GitHub](https://github.com/Azure/azure-kusto-go/tree/master/kusto/ingest) | [GitHub](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/resourcemanager/kusto) |
| Ruby |  |  | [Gems]( https://rubygems.org/gems/azure_mgmt_kusto) |
| PowerShell | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/) | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/) | [Package](https://www.powershellgallery.com/packages/Az.Kusto/) |
| Azure   CLI |  |  | [Azure CLI](/cli/azure/install-azure-cli) |
| REST   API | [REST](rest/index.md) | [REST](rest/index.md) | [GitHub](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/azure-kusto/resource-manager/Microsoft.Kusto) |
| TypeScript(Node.JS/Browser) | [npm](https://www.npmjs.com/package/azure-kusto-data) [GitHub](https://github.com/Azure/azure-kusto-node/tree/master/packages/azure-kusto-data) | [npm](https://www.npmjs.com/package/azure-kusto-ingest)       [GitHub](https://github.com/Azure/azure-kusto-node/tree/master/packages/azure-kusto-ingest) | [npm](https://www.npmjs.com/package/azure-arm-kusto) |

## Tools and Integrations

* LightIngest: [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/)  
* Kafka: [GitHub](https://github.com/Azure/kafka-sink-azure-kusto)  
* Logstash: [GitHub](https://github.com/Azure/logstash-output-kusto) 
* Spark: [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-spark_3.0) [GitHub](https://github.com/Azure/azure-kusto-spark)
