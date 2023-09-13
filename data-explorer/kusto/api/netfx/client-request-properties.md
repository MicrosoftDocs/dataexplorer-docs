---
title: ClientRequestProperties class
description: This article describes the ClientRequestProperties class of Kusto Data.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 09/13/2023
---
# ClientRequestProperties class

In the Kusto Data library, the `ClientRequestProperties` class helps manage interaction between your client application and the service. This class contains the following information:

* [Request properties](#request-properties): A mapping of specific options for customizing request behavior.
* [Query parameters](#query-parameters): A mapping of user-declared parameters that allow for secure query customization.
* [Named properties](#named-properties): Client request ID, application details, and user data, primarily used for debugging and tracing.

## Request properties

Request properties allow you to customize the behavior of a specific query. The `ClientRequestProperties` class has various methods for managing request properties, such as set option, get option, and has option. The precise method names vary by client library per language-specific naming conventions.

For a list of available request properties, see [Request properties](../rest/request-properties.md).

For example usage, see [Customize query behavior with client request properties](../get-started/app-basic-query.md#customize-query-behavior-with-client-request-properties).

## Query parameters

The [query parameters declaration statement](../../query/queryparametersstatement.md) can be used to declare parameters for a [Kusto Query Language (KQL)](../../query/index.md) query. In Kusto Data, the `ClientRequestProperties` class contains methods to set, clear, and check the presence of such query parameters.

The set parameter method provides overloads for common data types, such as `string` and `long`. For all other types, express the value as a KQL literal in `string` format, and make sure that the `declare` `query_parameters` statement declares the correct [scalar data type](../../query/scalar-data-types/index.md).

For example usage, see [Use query parameters to protect user input](../get-started/app-basic-query.md#use-query-parameters-to-protect-user-input).

## Named properties

The following table describes the named properties available in the `ClientRequestProperties` class that are valuable for debugging and tracing purposes.

| Property name | Description |
|--|--|
| `ClientRequestId` or `client_request_id` (based on language-specific naming conventions)| An ID used to identify the request. This specification is helpful for debugging and may be required for specific scenarios like query cancellation. </br></br>We recommend using the format *ClientApplicationName*`.`*ActivityType*`;`*UniqueId*. If the client doesn't specify a value for this property, a random value is assigned.</br></br>Translates to the `x-ms-client-request-id` [HTTP header](../rest/request.md#request-headers).|
| `Application` | The name of the client application that makes the request. This value is used for tracing. </br></br>If the client doesn't specify a value for this property, the property is automatically set to the name of the process hosting the Kusto Data library. To specify this property in a [Kusto connection string](../connection-strings/kusto.md), use the `Application Name for Tracing` property.</br></br>Translates to the `x-ms-app` [HTTP header](../rest/request.md#request-headers).|
| `User` | The identity of the user that makes the request. This value is used for tracing.</br></br>To specify this property in a [Kusto connection string](../connection-strings/kusto.md), use the `User Name for Tracing` property.</br></br>Translates to the `x-ms-user` [HTTP header](../rest/request.md#request-headers).|

> [!CAUTION]
> The client request ID property is recorded for diagnostics. Avoid sending sensitive data like personally identifiable or confidential information.

## Related content

* [Create an app to run basic queries](../get-started/app-basic-query.md)
* [Request properties](../rest/request-properties.md)
