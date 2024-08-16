---
title: Kusto Data ClientRequestProperties class
description: This article describes the ClientRequestProperties class of Kusto Data.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# Kusto Data ClientRequestProperties class

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

In the [Kusto Data library](about-kusto-data.md), the `ClientRequestProperties` class helps manage interaction between your client application and the service. This class contains the following information:

* [Request properties](#request-properties): A mapping of specific options for customizing request behavior.
* [Query parameters](#query-parameters): A mapping of user-declared parameters that allow for secure query customization.
* [Named properties](#named-properties): Client request ID, application details, and user data, primarily used for debugging and tracing.

## Request properties

Request properties allow you to customize the behavior of a specific query. The `ClientRequestProperties` class has various methods for managing request properties, such as set option, get option, and has option. The precise method names vary by client library per language-specific naming conventions.

For a list of available request properties, see [Request properties](../rest/request-properties.md).

For example usage, see [Customize query behavior with client request properties](../get-started/app-basic-query.md#customize-query-behavior-with-client-request-properties).

## Query parameters

The [query parameters declaration statement](../../query/query-parameters-statement.md) can be used to declare parameters for a [Kusto Query Language (KQL)](../../query/index.md) query. In Kusto Data, the `ClientRequestProperties` class contains methods to set, clear, and check the presence of such query parameters.

The set parameter method provides overloads for common data types, such as `string` and `long`. For all other types, express the value as a KQL literal in `string` format, and make sure that the `declare` `query_parameters` statement declares the correct [scalar data type](../../query/scalar-data-types/index.md).

For example usage, see [Use query parameters to protect user input](../get-started/app-basic-query.md#use-query-parameters-to-protect-user-input).

## Named properties

The following table describes the named properties available in the `ClientRequestProperties` class. Each property translates to an [HTTP header](../rest/request.md#request-headers) and can also be set when making a [REST API](../rest/index.md) request.

| Property name | HTTP header | Description |
|--|--|--|
| `ClientRequestId` or `client_request_id` (based on language-specific naming conventions) | `x-ms-client-request-id` | An ID used to identify the request. This specification is helpful for debugging and may be required for specific scenarios like query cancellation. </br></br>We recommend using the format *ClientApplicationName*`.`*ActivityType*`;`*UniqueId*. If the client doesn't specify a value for this property, a random value is assigned. |
| `Application` | `x-ms-app` | The name of the client application that makes the request. This value is used for tracing. </br></br>If the client doesn't specify a value for this property, the property is automatically set to the name of the process hosting the Kusto Data library. To specify this property in a [Kusto connection string](../connection-strings/kusto.md), use the `Application Name for Tracing` property. |
| `User` | `x-ms-user` | The identity of the user that makes the request. This value is used for tracing.</br></br>To specify this property in a [Kusto connection string](../connection-strings/kusto.md), use the `User Name for Tracing` property. |

> [!CAUTION]
> The client request ID property is recorded for diagnostics. Avoid sending sensitive data like personally identifiable or confidential information.

## Related content

* [Kusto Data overview](about-kusto-data.md)
* [Create an app to run basic queries](../get-started/app-basic-query.md)
* [Request properties](../rest/request-properties.md)
