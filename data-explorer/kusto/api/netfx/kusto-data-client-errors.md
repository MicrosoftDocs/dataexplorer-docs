---
title:  Kusto.Data exceptions
description: This article describes Kusto.Data exceptions in Azure Data Explorer.
ms.reviewer: yogilad
ms.topic: reference
ms.date: 06/20/2022
---
# Kusto.Data exceptions

All exceptions defined in the .NET SDK implement the interface `Kusto.Cloud.Platform.Utils.ICloudPlatformException`. The exceptions are defined in the `Kusto.Cloud.Platform` assembly, and are distributed through the `Microsoft.Azure.Kusto.Cloud.Platform` NuGet package. You can write exception handlers to inspect and process exceptions based on the following `get` properties:

* `int FailureCode { get; }`: Returns the equivalent HTTP status code.

* `string FailureSubCode { get; }`: Returns the equivalent HTTP reason phrase.

* `bool IsPermanent { get; }`: Returns the exception's permanence. Permanent exceptions indicate that the caller shouldn't retry since it's unlikely to succeed, for example, due to bad input.

Exceptions raised from `Kusto.Data` using the `Microsoft.Azure.Kusto.Data` NuGet package inherit the `Kusto.Data.Exceptions.KustoException` class. All exceptions begin with `Kusto.Data.Exceptions`.

## Kusto.Data exceptions categories

Based on the root cause, exceptions may inherit one of the following error types:

* `KustoRequestException`: Indicates a problem in the request itself, or in the environment that generated it. This exception is equivalent to HTTP status codes 4xx and isn't a service fault. For a list of errors, see [Request Exceptions](#request-exceptions).

* `KustoServiceException`: Indicates a problem in the service side processing the request. This exception is equivalent to HTTP status codes 5xx. For a list of errors, see [Service exceptions](#service-exceptions).

* `KustoClientException`: Indicates a client-side problem in sending the request to the service. Specifically, this exception informs the caller that the service itself didn't receive the request. For a list of errors, see [Client exceptions](#client-exceptions).

### Client exceptions

All client exceptions have a **Failure code** of `0`, no **Failure subcode**, and a **Permanence** of `False` unless noted in the reason column. Client exceptions contain the following exception categories:

| Exception name | Reason |
|--|--|
| `CslInvalidQueryException` | Query failure due to the query itself. For a list of errors, see [Client query exceptions](#client-query-exceptions). |
| `KustoClientAuthenticationException` | Client-side authentication flow failure. For a list of errors, see [Authentication exceptions](#authentication-exceptions). |
| `KustoClientInvalidConnectionStringException` | Kusto Connection String Builder is initialized with conflicting, or insufficient properties. |
| `KustoClientNameResolutionFailureException` | A Kusto client failed to resolve the service name. |
| `KustoClientNotSupportedException` | A feature isn't supported by Kusto .NET Core client. |
| `KustoClientPrincipalIdentityMustBeNullException` | A Kusto client is asked to transmit a `ClientRequestProperties` object with non-null PrincipalIdentity. |
| `KustoClientTemporaryStorageRetrievalException` | Retrieving temporary storage failed. |
| `KustoClientTimeoutAwaitingPendingOperationException` | Indicates a time-out waiting for the completion of a pending operation. |
| `KustoClientTimeoutException` | A client is unable to send or complete a request due to a client-side timeout. |

### Client query exceptions

All client query exceptions have a **Failure code** of `0`, no **Failure subcode**, and a **Permanence** of `False` unless noted in the reason column.

| Exception name | Reason |
|--|--|
| `CslBinaryOperationHasIncompatibleTypesException` | A binary operator combined two expressions with incompatible types. |
| `CslExpectingBooleanLambdaException` | The parser is expecting a boolean lambda expression. |
| `CslExpectingConstantExpressionException` | Indicates a failure with an expression that should represent a constant. |
| `CslExpectingConstantNodeType` | Translating a query was aborted because the expression node type doesn't yield a constant value. |
| `CslExpectingScalarExpressionException` | Indicates a failure because the parser is expecting a scalar expression. |
| `CslExpectingScalarProjectionLambdaExpressionException` | Indicates a failure when the expression is expected to be a lambda expression performing scalar projection. |
| `CslExpectingTableExpressionException` | Indicates a failure when the parser is expecting a table expression. |
| `CslExpressionHasUnsupportedNodeTypeException` | A `System.Linq.Expressions.Expression` has an unsupported node type. |
| `CslInternalQueryTranslationErrorException` | Translating a query was aborted due to an internal failure. |
| `CslNotSupportedException` | Translating a query was aborted because it includes a method for which there's no support. |
| `CslUnsupportedMethodArityInExpressionException` | Translating a query was aborted because the method arity isn't supported. |
| `CslUnsupportedTypeInNewExpressionException` | Translating a query was aborted because the type argument to operator new isn't supported. |

### Authentication exceptions

All authentication exceptions have a **Failure code** of `0`, no **Failure subcode**, and a **Permanence** of `False` unless noted in the reason column.

| Exception name | Reason |
|--|--|--|--|--|
| `KustoClientApplicationAuthenticationException` | Client-side Microsoft Entra Application authentication failure. </br> **Permanence**: True |
| `KustoClientApplicationCertificateNotFoundException` | A certificate required for application authentication isn't found. </br> **Permanence**: True |
| `KustoClientLocalSecretAuthenticationAccessDisabledException` | When an attempt to request authentication based on a local secret via the connection string fails and `KustoConnectionStringBuilder.PreventAccessToLocalSecretsViaKeywords` is true. </br> **Failure code**: 400 </br> **Failure subcode**: LocalSecretAuthenticationAccessDisabled</br> **Permanence**: True |
| `KustoClientUserAuthenticationException` | Client-side Microsoft Entra user authentication failure. </br> **Permanence**: True |
| `KustoClientUserInteractiveModeNotValidException` | Client-side failure to authenticate to Microsoft Entra ID. </br> **Permanence**: True |

## Request Exceptions

All request exceptions have a **Failure code** of `0`, no **Failure subcode**, and a **Permanence** of `False` unless noted in the reason column.

| Exception name | Reason |
|--|--|
| `EntityNameIsNotValidException` | Indicates an entity name isn't valid. </br> **Failure code**: 400 </br> **Failure subcode**: BadRequest_EntityNameIsNotValid </br> **Permanence**: True|
| `ClusterSuspendedException` | A request with `request_execute_only_if_running` flag is denied because the service is in a suspended state. </br> **Failure code**: 412 </br> **Failure subcode**: PreconditionFailed </br> **Permanence**: True |
| `KustoBadRequestException` | The Kusto service was sent a bad request. For a list of errors, see [Bad request exceptions](#bad-request-exceptions). </br> **Failure code**: 400 </br> **Failure subcode**: General_BadRequest </br> **Permanence**: True |
| `KustoConflictException` | The Kusto service was sent a request, which can't be performed due to service state. </br> **Failure code**: 409 </br> **Failure subcode**: Conflict </br> **Permanence**: True|
| `KustoFailedChangeServiceStateException` | The CM failed to change service state. |
| `KustoRequestDeniedException` | The Kusto service was sent a request with insufficient security permissions to execute. </br> **Failure code**: 403 </br> **Failure subcode**: Forbidden </br> **Permanence**: True |
| `KustoRequestPayloadTooLargeException` | The payload is too large. For example, when Kusto is told to process more data than is allowed in a single batch. </br> **Failure code**: 413 </br> **Failure subcode**: Payload too large </br> **Permanence**: True |

### Bad request exceptions

All bad request exceptions have a **Failure code** of `0`, no **Failure subcode**, and a **Permanence** of `False` unless noted in the reason column.

| Exception name | Reason |
|--|--|
| `DatabaseNotFoundException` | Failure to locate a database. </br> **Failure code**: 400 </br> **Failure subcode**: BadRequest_DatabaseNotExist </br> **Permanence**: True|
| `DuplicateMappingException` | Ingestion properties contain bad ingestion mapping and ingestion mapping references. </br> **Failure code**: 400 </br> **Failure subcode**: BadRequest_DuplicateMapping </br> **Permanence**: True|
| `EntityNotFoundInContainerException` | Failure to locate an entity. </br> **Failure code**: 400 </br> **Failure subcode**: General_BadRequest </br> **Permanence**: True|
| `EntityTypeIsNotValidException` | The entity type is unsupported. </br> **Failure code**: 400 </br> **Failure subcode**: General_BadRequest </br> **Permanence**: True|
| `FormatNotSupportedException` | The format provided isn't supported. </br> **Failure code**: 400 </br> **Failure subcode**: BadRequest_FormatNotSupported </br> **Permanence**: True|
| `IngestionPropertyNotSupportedInThisContextException` | The ingestion property isn't supported in this context. </br> **Failure code**: 400 </br> **Failure subcode**: BadRequest_IngestionPropertyNotSupportedInThisContext </br> **Permanence**: True|
| `MalformedIngestionPropertyException` | The ingestion property is malformed. </br> **Failure code**: 400 </br> **Failure subcode**: BadRequest_MalformedIngestionProperty </br> **Permanence**: True|
| `MappingNotFoundException` | The failure to locate a mapping reference. </br> **Failure code**: 400 </br> **Failure subcode**: BadRequest_MappingReferenceWasNotFound </br> **Permanence**: True|
| `MappingNotValidException` | The ingestion properties contain invalid ingestion mapping or ingestion mapping reference. </br> **Failure code**: 400 </br> **Failure subcode**: BadRequest_InvalidMapping </br> **Permanence**: True|
| `QueryCslTreeExceedsDepthsLimitsException` | The csl tree exceeds depth limits. </br> **Failure code**: 400 </br> **Failure subcode**: General_BadRequest </br> **Permanence**: True|
| `RelopSemanticException` | A semantic error that happened during relop compilation phase. </br> **Failure code**: 400 </br> **Failure subcode**: General_BadRequest </br> **Permanence**: True|
| `SemanticException` | Indicates a semantic error. </br> **Failure code**: 400 </br> **Failure subcode**: General_BadRequest </br> **Permanence**: True|
| `SyntaxException` | Indicate a syntax error. </br> **Failure code**: 400 </br> **Failure subcode**: BadRequest_SyntaxError </br> **Permanence**: True|
| `InappropriateNullLiteralException` | The null literal can't appear in the context that it appears in. </br> **Failure code**: 400 </br> **Failure subcode**: BadRequest_SyntaxError </br> **Permanence**: True|
| `InvalidLiteralFormatException` | Parsing a literal failed due to bad formatting. </br> **Failure code**: 400 </br> **Failure subcode**: BadRequest_SyntaxError </br> **Permanence**: True|
| `TableNotFoundException` | Failure to locate a table. </br> **Failure code**: 400 </br> **Failure subcode**: BadRequest_TableNotExist </br> **Permanence**: True|

## Service exceptions

All service exceptions have a **Failure code** of `0`, no **Failure subcode**, and a **Permanence** of `False` unless noted in the reason column.

| Exception name | Reason |
|--|--|
| `KustoServicePartialQueryFailureException` | A query execution started successfully but failed prior to completion. |
| `WeakConsistencyEntityNotFoundException` | Indicates a failure to locate an entity in weak consistency mode. |
| `KustoDataStreamException` | Generic exception that carries error information inside a Kusto Data Stream. |
| `KustoRequestThrottledException` | The request is denied due to throttling. </br> **Failure code**: 429 </br> **Failure subcode**: TooManyRequests </br> **Permanence**: False |
| `KustoServicePartialQueryFailureIllFormattedDataException` | Carries error information inside a Kusto Data Stream indicating ill-formatted data. </br> **Failure code**: 400 </br> **Failure subcode**:IllFormattedData  </br> **Permanence**: True|
| `KustoServicePartialQueryFailureLimitsExceededException` | Carries error information inside a Kusto Data Stream indicating that limits have been exceeded. </br> **Failure code**: 400 </br> **Failure subcode**: LimitsExceeded </br> **Permanence**: True|
| `KustoServicePartialQueryFailureLowMemoryConditionException` |Carries error information inside a Kusto Data Stream indicating low memory conditions. </br> **Failure code**: 400 </br> **Failure subcode**: LowMemoryCondition </br> **Permanence**: True|
| `KustoServiceTimeoutException` | Raised when request execution has timed-out on the service side. </br> **Failure code**: 504 </br> **Failure subcode**: RequestExecutionTimeout </br> **Permanence**: False |
