---
title: Kusto UI (Deep Link) REST API - Azure Kusto | Microsoft Docs
description: This article describes Kusto UI (Deep Link) REST API in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto UI (Deep Link) REST API


The UI REST API provides a way to craft a simple URL that, when clicked by users
(for example, in an email message or through a browser), opens up a Kusto UI tool
and preconfigures it for a specific cluster, database, and query. This API is not
authenticated (no need to send the `Authorization` HTTP header) as authentication
happens after following the redirect.

In the most simple way, issuing a `GET /` operation against this endpoint results
in a redirect that opens Kusto.Explorer with the cluster that was the target of
the request being the connection scope. Additionally, one can point at the relevant
database name by appending it to the path. For example, the URL
(https://help.kusto.windows.net/Samples)[https://help.kusto.windows.net/Samples] will have 
the browser send a `GET /Samples` command to the `help` cluster and will result
in a redirect that opens Kusto.Explorer with this database as default.

The UI REST API also supports a number of query parameters:
* The `query` query parameter, if provided, causes the UI to automatically execute
  the specified query. The query can appear unencoded (other than the necessary
  HTTP query parameter encoding of course), or it can be gzipped and base64-encoded.
* The `uri` query parameter, if provided, can be used to override the cluster URI
  that is automatically generated otherwise.
* The `web` query parameter, if provided, can be used to determine to which UI
  redirection should happen. By default, redirection is done to Kusto.Explorer.
  Setting this query parameter to `1` will redirect to Kusto.WebExplorer.
* The `name` query parameter, if provided, controls the name assigned to the
  UI's display of the connection. The name is generated automatically from the
  cluster URI if unspecified.

**Security note**: For security reasons, deep-linking is disabled for control commands.

## Deep Linking to Kusto.Explorer REST API

This REST API performs redirection that installs and runs the
Kusto.Explorer desktop client tool with specially-crafted startup
parameters that open a connection to a specific Kusto engine cluster
and execute a query against that cluster.

- Path: `/[`*DatabaseName*`][?[query=`*Query*`][&uri=`*Uri*`][&name=`*ConnectionName*`]]`
- Verb: `GET`
- Actions: Open Kusto.Explorer with context and auto-run query (see [Deep-linking with Kusto.Explorer](https://kusdoc2.azurewebsites.net/docs/tools/kusto-explorer.html#deep-linking-queries))
- Arguments: The URI may include the following optional arguments:
	* The name of the database that Kusto.Explorer sets as the default (*DatabaseName*)
	* The URI of the Kusto service that Kusto.Explorer should connect-to; by default, it is set to the cluster's URI (*Uri*)
	* The query to run on startup (*Query*)
	* The name of the connection in Kusto.Explorer (*ConnectionName*).

This action redirects the user's browser to start Kusto.Explorer on the local machine

## Deep Linking to Kusto.WebExplorer

Similar to deep-linking to Kusto.Explorer, it is possible to deep-link
to Kusto.WebExplorer (that is, create a URL that starts up Kusto.WebExplorer
and runs a specific query on the specified Kusto cluster).

In the following:

* *Cluster* is the DNS host name of the cluster (for example: `help.kusto.windows.net`)
* *DatabaseName* is the name of the database (note that it is case-sensitive).
* *EncodedQuery* is the query, encoded in the following way: (a) first it is compressed via gzip,
  and (b) then it is encoded using base64 encoding.
* *Query* is the query text (no encoding other than the one required by the HTTP protocol).

To open Kusto.WebExplorer in a specific cluster/database context, issue an HTTP `GET` for:

- `https://aka.ms/kwe?cluster=` *Cluster* `&database=` *DatabaseName*

To open Kusto.WebExplorer in a specific cluster/database context and run a query, issue
an HTTP `GET` for any of the following:

- `https://aka.ms/kwe?cluster=` *Cluster* `&database=` *DatabaseName* `&q=` *EncodedQuery*
- `https://aka.ms/kwe?cluster=` *Cluster* `&database=` *DatabaseName* `&query=` *Query*
- `https://web.kusto.windows.net/clusters/` *Cluster* `/databases/` *DatabaseName* `?q=` *EncodedQuery*
- `https://web.kusto.windows.net/clusters/` *Cluster* `/databases/` *DatabaseName* `?query=` *Query*

## Deep linking to Lens Explorer

[Lens Explorer](https://kusdoc2.azurewebsites.net/docs/tools/lens.html) supports deep links as well.
For full documentation of this feature, please see [this link](https://microsoft.sharepoint.com/teams/WAG/EngSys/Monitor/AmdWiki/Lens%20V2%20Query%20Deep%20Link.aspx).

The base URI to `GET` is `https://lens/msftcloudes.com/v2/#/discover/query//results`,
with the following HTTP query parameters supports:

- `datasource`: Indicates the kind of data source, its URI and database. For example,
  the `https://lens.kusto.windows.net/LensDb2` Kusto cluster/database is encoded
  as `datasource=(cluster:lens.kusto.windows.net,database:LensDb2,type:Kusto)`.
  (The format is [Rison](https://github.com/Nanonid/rison))
- `plaintextquery`: The Kusto query to run, in plain-text. For example:
  `plaintextquery=CalculatedKpiDetailsTest%20%7C%20limit%20500%0A`.
- `query`: Alternative to `plaintextquery`, this parameter provides the query
  as a base64 encoding of the gzipped query text.
- `runquery`: Whether to run the query and display the results. For example:
  `runquery=1`.
- `originator`: An optional parameter indicating the source that generated the link .

## Deep Linking to Application Insights Analytics

Teams that use Application Insights Analytics get an experience similar to Kusto.WebExplorer's,
but tailored for the Application Insights schema. Application Insights Analytics supports a
deep-linking REST API similar (but not identical) to Kusto.WebExplorer's:

* `https://analytics.applicationinsights.io/subscriptions/` *SubscriptionId* `/resourcegroups/` *ResourceGroup* 
`/components/` *ApplicationName* `?source=` *ApplicationScenario* `&q=` *EncodedQuery*

Where:

* *SubscriptionId* is the Azure subscription the Application Insights application
  belongs to.
* *ResourceGroup* is the Azure resource group the Application Insights application
  belongs to.
* *ApplicationName* is the application name.
* *ApplicationScenario* is an arbitrary string that the caller can send to
  identify the scenario in which the query is executed. This string is used
  primarily for telemetry by the Application Insights team itself.
* *EncodedQuery* is the query, encoded in the following way: (a) first it is compressed via gzip,
  and (b) then it is encoded using base64 encoding.

  Sample code that generates *EncodedQuery* is available for [Javascript](https://mseng.visualstudio.com/AppInsights/AppAnalytics%20UX%20Team/_git/MASI-LogAnalyticsUX?path=%2FLogAnalyticsPortalWebRole%2FScripts%2Fdev%2Futils%2Fcompression.js&version=GBmaster&_a=contents)
  and [C#](https://mseng.visualstudio.com/DefaultCollection/Kusto/_versionControl?path=%24%2FKusto%2FStgExt%2FSrc%2FClient%2FKusto.Data%2FCommon%2FCslCommandGenerator.cs&version=T&_a=contents)
  (search for the function `EncodedQueryAsBase64Url`).