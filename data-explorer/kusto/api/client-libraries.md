---
title: Client libraries overview - Azure Data Explorer | Microsoft Docs
description: This article describes Client libraries overview in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/30/2019
---
# Client libraries overview

The following table lists the different libraries provided for query, ingestion, and ARM/RP management. Using these libraries is the recommended way to make use of Azure APIs and invoke Azure Data Explorer functionality programmatically. 


|    Language\Functionality    	|    Query    	|    Ingestion    	|    ARM/RP Management    	|
|------------------------------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------	|------------------------------------------------------------------------------------------------------------------------------	|
|    .Net    	|    [Nuget](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Data/)        	|    [Nuget](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Ingest/)    	|    [Nuget](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/1.0.0)     	|
|    .Net Standard    	|    [Nuget](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Data.NETStandard/)    	|    [Nuget](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Ingest.NETStandard/)    	|        	|
|    Java    	|    [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-data) [GitHub](https://github.com/Azure/azure-kusto-java/tree/master/data)    	|    [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-ingest) [GitHub](https://github.com/Azure/azure-kusto-java/tree/master/ingest)    	|    [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.kusto.v2019_01_21/azure-mgmt-kusto)    	|
|    Javascript    	|         	|         	|    [npm](https://www.npmjs.com/package/@azure/arm-kusto)     	|
|    NodeJS    	|    [npm](https://www.npmjs.com/package/azure-kusto-data) [GitHub](https://github.com/Azure/azure-kusto-node/tree/master/azure-kusto-data)    	|    [npm](https://www.npmjs.com/package/azure-kusto-ingest)       [GitHub](https://github.com/Azure/azure-kusto-node/tree/master/azure-kusto-ingest)    	|    [npm](https://www.npmjs.com/package/azure-arm-kusto/v/2.0.0)    	|
|    Python    	|    [Pypi](https://pypi.org/project/azure-kusto-ingest/)    [GitHub](https://github.com/Azure/azure-kusto-python/tree/master/azure-kusto-data)    	|    [Pypi](https://pypi.org/project/azure-kusto-data/)      [GitHub](https://github.com/Azure/azure-kusto-python/tree/master/azure-kusto-ingest)    	|    [Pypi](https://pypi.org/project/azure-mgmt-kusto/0.3.0/)    	|
|    R    	|    [CRAN](https://cran.r-project.org/web/packages/AzureKusto/index.html)           	|         	|        	|
|    Go    	|         	|         	|        [GitHub](https://github.com/Azure/azure-sdk-for-go/tree/master/services/kusto/mgmt/2019-01-21/kusto)    	|
|    Ruby    	|         	|         	|    [Gems](https://rubygems.org/gems/azure_mgmt_kusto/versions/0.17.1)     	|
|    Powershell    	|    [Nuget](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/)    	|    [Nuget](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/)    	|    [Package](https://www.powershellgallery.com/packages/Az.Kusto/)     	|
|    Azure   CLI    	|         	|         	|    [Azure Cli](https://docs.microsoft.com/cli/azure/install-azure-cli-windows?view=azure-cli-latest)     	|
|    REST   API    	|    [REST](/azure/kusto/api/rest/)    	|    [REST](/azure/kusto/api/rest/)    	|     [GitHub](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/azure-kusto/resource-manager/Microsoft.Kusto)     	|
|    TypeScript    	|         	|         	|        [Npm](https://www.npmjs.com/package/@azure/arm-kusto/v/2.0.0)    	|
|  	|  	|  	|  	|


## Tools and Integrations

* LightIngest: [Nuget](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/) 
* One-click Ingestion kit: [GitHub](https://github.com/Azure/azure-kusto-ingestion-tools) 
* Kafka: [GitHub](https://github.com/Azure/kafka-sink-azure-kustoLogstash)
* Logstash: [GitHub](https://github.com/Azure/logstash-output-kusto) 
* Spark: [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/spark-kusto-connector)