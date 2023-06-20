---
title:  UI deep links
description: This article describes UI deep links in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 10/30/2019
---
# UI deep links

UI deep links are URIs that, when opened in a web browser, result in automatically
opening a UI tool (such as Kusto.Explorer or Kusto.WebExplorer) in a way that pre-selects
the desired Kusto cluster (and optionally database).

For example, when a user clicks [https://help.kusto.windows.net/Samples?query=print%20123](https://help.kusto.windows.net/Samples?query=print%20123),
Kusto.WebExplorer will open to the `help.kusto.windows.net` cluster, select the `Samples`
database as the default database, and run the associated query.

UI deep links work by having the user browser receive a redirect response when issuing
a GET request to the URI, and depend on the browser settings to allow processing of
this redirection. (For example, a UI deep link to Kusto.Explorer requires the browser
to be configured to allow ClickOnce applications to start.)

The UI deep link must be a valid URI, and has the following format:

`https://` *Cluster* `/` [*DatabaseName*] [`?` *Query*]

Where:

* *Cluster* is the base address of the cluster itself.
  This part is mandatory, but can be overridden by specifying
  the query parameter `uri` in *Query*.

* *DatabaseName* is the name of the database in *Cluster* to use
  as the default database. It is optional. (Note that if the *Query*
  specifies an actual query to run, a database must be selected for
  the query to run.)

* *Query* can be used to specify additional parameters to control
  the behavior of the UI deep link. It is optional. All query parameters
  that are not explicitly mentioned are passed as-is to the redirect URI,
  so that tool-specific query parameters can be used.

  |Parameter |Description|
  |----------|-----------|
  |`web`     |Selects the UI tool. By default, or if set to `1`, Kusto.WebExplorer is used. If set to `0`, Kusto.Explorer will be used. If set to `3`, Kusto.WebExplorer will be used with no pre-existing tabs.|
  |`query`   |The text of the query or management command to start with when opening the UI tool.|
  |`querysrc`|A URI pointing at a web resource that holds the text of the query or management command to start with when opening the UI tool.|
  |`name`    |The name of the connection to the cluster.|

  The value of `query` can use standard HTTP query parameter encoding.
  Alternatively, it can be encoded using the transformation `base64(gzip(text))`,
  which makes it possible to compress long queries or management commands
  to git in the default browser URI length limits.

## Examples

Here are a few examples for links:

* `https://help.kusto.windows.net/`: When a user agent (such as a browser) issues
  a `GET /` request it'll be redirected to the default UI tool configured
  to query the `help` cluster.
* `https://help.kusto.windows.net/Samples`: When a user agent (such as a browser) issues
  a `GET /Samples` request it'll be redirected to the default UI tool configured
  to query the `help` cluster `Samples` database.
* `http://help.kusto.windows.net/Samples?query=StormEvents`: When a user (such as a browser) issues
  a `GET /Samples?query=StormEvents` request it'll be redirected to the default UI tool configured
  to query the `help` cluster `Samples` database, and issue the `StormEvents` query.

> [!NOTE]
> The deep link URIs don't require authentication since authentication
> is performed by the UI tool used for redirection.
> Any `Authorization` HTTP header, if provided, is ignored.

> [!IMPORTANT]
> For security reasons, UI tools do not automatically execute management commands,
> even if `query` or `querysrc` are specified in the deep link.

## Deep linking to Kusto.Explorer

This REST API performs redirection that installs and runs the
Kusto.Explorer desktop client tool with specially-crafted startup
parameters that open a connection to a specific Kusto engine cluster
and execute a query against that cluster.

See [Deep-linking with Kusto.Explorer](../../tools/kusto-explorer-using.md#deep-linking-queries)
for a description of the redirect URI syntax for starting up Kusto.Explorer.

## Deep linking to Kusto.WebExplorer

In addition to the query parameters mentioned above,
the following parameters may appear in UI deep links
to Kusto.WebExplorer:

|Parameter   |Description|
|------------|-----------|
|`login_hint`|Sets the user login name (email) of the user.|
|`tenant`    |Sets the Azure Active Directory tenant ID of the user.|

By specifying the `login_hint` and `tenant` of the user, one may instruct
Kusto.WebExplorer to login a user from another AAD tenant.

Redirection will be to the following URI:

`https://` *BaseAddress* `/clusters/` *Cluster* [`/databases/` *DatabaseName*] [`?` *Query*]

## Specifying the query or management command in the URI

When the URI query string parameter `query` is specified, it must be encoded
according to the URI query string encoding HTML rules. Alternatively, the text of
the query or management command can be compressed by gzip, and then encoded
via base64 encoding. This allows you to send longer queries or control
commands (since the latter encoding method results in shorter URIs).

## Specifying the query or management command by indirection

If the query or management command is very long, even encoding it using gzip/base64 will exceed the maximum URI length of the user agent. Alternatively, the URI query string parameter
`querysrc` is provided, and its value is a short URI pointing at a web resource
that holds the query or management command text.

For example, this can be the URI for a file hosted by Azure Blob Storage.

> [!NOTE]
> If the deep link is to the web application UI tool, the web service providing
> the query or management command (that is, the service providing the `querysrc` URI)
> must be configured to support CORS for `dataexplorer.azure.com`.
>
> Additionally, if authentication/authorization information is required by that
> service, it must be provided as part of the URI itself.
>
> For example, if `querysrc` points at a blob in Azure Blob Storage, one must
> configure the storage account to support CORS, and either make the blob itself
> public (so it can be downloaded without security claims) or add an appropriate
> Azure Storage SAS to the URI. CORS configuration can be done from the
> [Azure portal](https://portal.azure.com/) or from
> [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).
> See [CORS support in Azure Storage](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services).
