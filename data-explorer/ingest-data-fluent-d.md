---
title: Ingest log data with Fluentd into Azure Data Explorer
description: Learn how to ingest log data with Fluentd into Azure Data Explorer.
ms.reviewer: ramacg
ms.author: v-hzargari
author: hzargari-ms
ms.topic: article
ms.date: 12/29/2025
---

# Ingest log data with Fluentd into Azure Data Explorer

Log ingestion is the process of collecting, transforming, and preparing log data from applications, servers, containers, and cloud services so you can store, analyze, and monitor it. Logs capture information such as errors, warnings, usage patterns, and system performance. Reliable log ingestion ensures that operational and security data is available in near real-time for troubleshooting and insights.
This article explains how to send logs from Fluentd to Azure Data Explorer (Kusto), including installation, configuration, and validation steps.

## Overview

### What is Fluentd?

Fluentd is an open-source data collector you can use to unify log collection and routing across multiple systems. It supports more than 1,000 plugins and provides flexible options for filtering, buffering, and transforming data. You can use Fluentd in cloud‑native and enterprise environments for centralized log aggregation and forwarding.

### What is Azure Data Explorer?

Azure Data Explorer (ADX) is a fast, fully managed analytics service optimized for real‑time analysis of large volumes of structured, semi‑structured, and unstructured data. ADX uses Kusto Query Language (KQL) and is widely used for telemetry, monitoring, diagnostics, and interactive data exploration.

## Prerequisites

- Ruby installed on your machine.
- Access to an Azure Data Explorer cluster and database.
- Azure Active Directory application with permissions to ingest data.

## How to get started with Fluentd and Azure Data Explorer

1. **Install Fluentd** by using RubyGems:

    ```bash
    gem install fluentd
    ```

1. **Install the Fluentd Kusto plugin**:

    ```bash
    gem install fluent-plugin-kusto
    ```

1. **Configure Fluentd** by creating a configuration file (for example, `fluent.conf`) with the following content. Replace the placeholders with your Azure and plugin values:

    ```xml
    <match <tag-from-source-logs>>
      @type kusto
      endpoint https://<your-cluster>.<region>.kusto.windows.net
      database_name <your-database>
      table_name <your-table>
      logger_path <your-fluentd-log-file-path>
    
      # Authentication options
      auth_type <your-authentication-type>
    
      # AAD authentication
      tenant_id <your-tenant-id>
      client_id <your-client-id>
      client_secret <your-client-secret>
    
      # Managed identity authentication (optional)
      managed_identity_client_id <your-managed-identity-client-id>
    
      # Workload identity authentication (optional)
      workload_identity_tenant_id <your-workload-identity-tenant-id>
      workload_identity_client_id <your-workload-identity-client-id>
    
      # Non-buffered mode
      buffered false
      delayed false
    
      # Buffered mode
      # buffered true
      # delayed <true/false>
    
      <buffer>
        @type memory
        timekey 1m
        flush_interval 10s
      </buffer>
    </match>
    ```

1. **Prepare Azure Data Explorer for ingestion**:
    1. Create an ADX cluster and database. See [Create an Azure Data Explorer cluster and database](create-cluster-and-database.md).
    1. Create an Azure Active Directory application and grant permissions to ingest data into the ADX database. See [Create a Microsoft Entra application registration in Azure Data Explorer](provision-entra-id-app.md).

        > [!NOTE]
        > Save the app key and application ID for future use.

    1. Create a table for log ingestion. For example:

    ```kusto
    .create table LogTable (
      tag:string,
      timestamp:datetime,
      record:dynamic
    )
    ```

1. **Run Fluentd** with the configuration file:

    ```bash
    fluentd -c fluent.conf
    ```

1. **Validate log ingestion** by:
    1. **Checking the Fluentd log file**, confirming there are no errors, and that the ingestion requests are sent successfully. 

        :::image type="content" source="media/ingest-fluentd/log-example.png" alt-text="Screenshot of Fluentd log file showing successful ingestion requests":::

    1. **Querying the ADX table** to ensure logs are ingested correctly:

    ```kusto
    LogTable
    | take 10
    ```

## Related content

- [Data integrations overview](integrate-data-overview.md)
- [Kusto Query Language (KQL) overview](https://learn.microsoft.com/kusto/query/?view=azure-data-explorer)
