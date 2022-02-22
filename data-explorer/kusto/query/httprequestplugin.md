---
title: http_request plugin - Azure Data Explorer
description: This article describes http_request plugin in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 02/22/2022
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# http_request plugin / http_request_post plugin - Internal

::: zone pivot="azuredataexplorer"

The `http_request` and `http_request_post` plugins send an HTTP request (GET and
POST, respectively) and convert the response into a Kusto table.

> [!WARNING]
> Both plugins are disabled by default, as they allow queries to send data
> and the user's security token to external user-specified network endpoints.
> Once enabled, both plugins are further subject to the configured
> [callout policy](../management/calloutpolicy.md) (of type `webapi`) that allows the admin
> fine-grained control over which URIs the request might be sent to.

**Syntax**

`evaluate` `http_request` `(` *Uri* [`,` *RequestHeaders* [`,` *Options*]] `)`

`evaluate` `http_request_post` `(` *Uri* [`,` *RequestHeaders* [`,` *Options* [`,` *Content*]]] `)`

**Arguments**

* *Uri*: A constant value of type `string` indicating the HTTP or HTTPS Uri to
  invoke the request to. Mandatory.
* *RequestHeaders*: A constant value of type `dynamic` that holds a property bag
  in which every slot is an HTTP header to provide to the service. Optional.
* *Options*: A constant value of type `dynamic` that holds a property bag
  specifying additional properties of the request, as explained below. Optional.
* *Content*: A constant value of type `string` that holds the body content
  to send with the request. When this argument is used, the content
  will be encoded in `UTF-8` and the media type used in `Content-Type` is
  `application/json`.

**Returns**

Both plugins return a table that has a single record with two
`dynamic` columns:

* `ResponseHeaders`: A property bag indicating the response header.
* `ResponseBody`: The response body, parsed as a value of type `dynamic`.

**Authentication**

The http_request and http_request_post plugins support the following authentication
scenarios:

1. The query can specify authentication parameters as part of the *Uri* argument,
   if that is the way the web service accepts authentication.
1. The query can specify authentication parameters as part of the *RequestHeaders*
   argument, either by using the HTTP standard `Authorization` header, or any
   customer header supported by the web service.
1. The query can specify the value of the `Authorization` HTTP header in the
   *Options* argument.
1. The query can request AAD integrated authentication by using the *Options*
   argument. This requires setting the slot `Authentication` to
   `Active Directory Integrated`, and the slot `AadResourceId` to the
   AAD ResourceId value of the target web service.
   This authentication method mandates HTTPS (Kusto will not send an AAD token
   over an HTTP connection.)

> [!WARNING]
> Be extra careful not to send secret information, such as
> authentication tokens, over HTTP connections. Additionally, if the query includes
> such confidential information, make sure that the relevant parts of the
> query text are obfuscated so that they'll be omitted from any Kusto tracing.
> See [obfuscated string literals](./scalar-data-types/string.md#obfuscated-string-literals) for more details.

**Restrictions**

*Uri* must be a destination that is enabled for `webapi` callout
by the [Callout policy](../management/calloutpolicy.md). Otherwise,
an error is emitted.

Authenticated access mandates the use of HTTPS; attempts to use HTTP
with authentication enabled will result in an error.

<!-- Microsoft-internal content: -->

When authentication is performed using the caller's AAD token,
*Uri* must indicate a first-party AAD application, as explained
in [App OBO aka service principal](https://aadwiki.windows-int.net/index.php?title=App_OBO_aka._Service_Principal_OBO).
Authors of such web apps should make themselves familiar with that
doc page and in particular how OBO tokens are to be validated
and approved,
(Note that this restriction does not apply if the token to
use is provided by the query text.)

<!-- End of Microsoft-internal content -->

**Headers**

The *RequestHeaders* argument to the plugin can be used to add custom headers
to the outgoing HTTP request. In addition to the standard HTTP request headers
and the user-provided custom headers, the plugin also adds the following
custom headers:

|Name                    |Description|
|------------------------|-----------|
|`x-ms-client-request-id`|A correlation ID that identifies the request. Multiple invocations of the plugin in the same query will all have the same ID.|
|`x-ms-readonly`         |Indicates that the processor of this request should not make lasting changes due to it.|

> [!WARNING]
> The `x-ms-readonly` flag will be set for every HTTP request sent by the plugin
> that was triggered by a query and not a control command. Web services should
> treat any web request that has this flag set as one that does not make internal
> state changes, or refuse the request otherwise. This protects users from being
> sent seemingly-innocent queries that end up making unwanted changes by using
> Kusto as the launchpad for such attacks.

**Example**

The following example retrieves the a canonical list of country codes:

<!-- csl -->
```
evaluate http_request('http://services.groupkt.com/country/get/all')
| project CC=ResponseBody.RestResponse.result
| mv-expand CC limit 10000
| project
    name        = tostring(CC.name),
    alpha2_code = tostring(CC.alpha2_code),
    alpha3_code = tostring(CC.alpha3_code)
| where name startswith 'b'
```

name                              | alpha2_code  | alpha3_code
----------------------------------|--------------|-------------
Bahamas                           | BS           | BHS
Bahrain                           | BH           | BHR
Bangladesh                        | BD           | BGD
Barbados                          | BB           | BRB
Belarus                           | BY           | BLR
Belgium                           | BE           | BEL
Belize                            | BZ           | BLZ
Benin                             | BJ           | BEN
Bermuda                           | BM           | BMU
Bhutan                            | BT           | BTN
Bolivia (Plurinational State of)  | BO           | BOL
Bonaire, Sint Eustatius and Saba  | BQ           | BES
Bosnia and Herzegovina            | BA           | BIH
Botswana                          | BW           | BWA
Bouvet Island                     | BV           | BVT
Brazil                            | BR           | BRA
British Indian Ocean Territory    | IO           | IOT
Brunei Darussalam                 | BN           | BRN
Bulgaria                          | BG           | BGR
Burkina Faso                      | BF           | BFA
Burundi                           | BI           | BDI

**Example**

The following example is for a hypothetical HTTPS web service that
accepts additional request headers and must be authenticated to using AAD:

<!-- csl -->
```
let uri='https://example.com/node/js/on/eniac';
let headers=dynamic({'x-ms-correlation-vector':'abc.0.1.0'});
let options=dynamic({'Authentication':'Active Directory Integrated',
  'AadResourceId':'https://eniac.to.the.max.example.com/'});
evaluate http_request_post(uri, headers, options)
```

::: zone-end

::: zone pivot="azuremonitor"

This capability isn't supported in Azure Monitor

::: zone-end
