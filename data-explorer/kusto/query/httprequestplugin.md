---
title: http_request plugin / http_request_post plugin - Azure Data Explorer | Microsoft Docs
description: This article describes http_request plugin / http_request_post plugin in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# http_request plugin / http_request_post plugin

  `evaluate` `http_request` `(` *Uri* [`,` *RequestHeaders* [`,` *Options*]] `)`

  `evaluate` `http_request_post` `(` *Uri* [`,` *RequestHeaders* [`,` *Options* [`,` *Content*]]] `)`

The `http_request` plugin sends a `GET` request to an HTTP/HTTPS service
and returns the response as table with one record and two `dynamic` columns:
* `ResponseHeaders` (a property bag indicating the response header).
* `ResponseBody` (a parse of the response body as a `dynamic` value).

The `http_request_post` plugin is similar to `http_request`, but does so by
sending a POST request.

> [!WARNING]
> Both plugins are disabled by default to prevent a scenario
> in which somebody sends a Kusto user a link to a query that, when run, sends
> Kusto-stored user data to a foreign web service. Database administrators must
> consider this security aspect before enabling the plugins. In the future Kusto
> will feature a specific policy allowing database admins fine-grained control
> over which external URIs to allow. Until this is done, the recommendation
> is to enable these plugins for testing purposes and testing data only.

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

**Authentication**

The http_request and http_request_post plugins support the following authentication
scenarios:
1. The query can specify authentication parameters as part of the *Uri* argument,
   if that is the way the web service accepts authentication.
2. The query can specify authentication parameters as part of the *RequestHeaders*
   argument, either by using the HTTP standard `Authorization` header, or any
   customer header supported by the web service.
3. The query can specify the value of the `Authorization` HTTP header in the
   *Options* argument.
4. The query can request AAD integrated authentication by using the *Options*
   argument. This requires setting the slot `Authentication` to
   `Active Directory Integrated`, and the slot `AadResourceId` to the
   AAD ResourceId value of the target web service.
   This authentication method mandates HTTPS (Kusto will not send an AAD token
   over an HTTP connection.)

> [!WARNING]
> Be extra careful not to send secret information such as
> authentication tokens over HTTP connections. Additionally, if the query includes
> such confidential information please make sure that the relevant parts of the
> query text are obfuscated so that they'll be ommitted from any Kusto tracing.
> Please see [obfuscated string literals](./scalar-data-types/string.md#obfuscated-string-literals) for more details.

**Restrictions**

Kusto service controls allowed sql_request plugin destinations by [Callout policy](../concepts/calloutpolicy.md)

**Example**

The following example retrieves the a canonical list of country codes:

```kusto
evaluate http_request('http://services.groupkt.com/country/get/all')
| project CC=ResponseBody.RestResponse.result
| mvexpand CC limit 10000
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

```kusto
let uri='https://example.com/node/js/on/eniac';
let headers=dynamic({'x-ms-correlation-vector':'abc.0.1.0'});
let options=dynamic({'Authentication':'Active Directory Integrated',
  'AadResourceId':'https://eniac.to.the.max.example.com/'});
evaluate http_request_post(uri, headers, options)
```