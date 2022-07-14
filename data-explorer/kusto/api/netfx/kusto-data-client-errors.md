---
title: Kusto.Data exceptions - Azure Data Explorer
description: This article describes Kusto.Data - Exceptions in Azure Data Explorer.
ms.reviewer: yogilad
ms.topic: reference
ms.date: 06/20/2022
---
# Kusto.Data exceptions

All exceptions defined in the .NET SDK implement the interface `Kusto.Cloud.Platform.Utils.ICloudPlatformException`. This is defined in the `Kusto.Cloud.Platform`
assembly, and are distributed through the `Microsoft.Azure.Kusto.Cloud.Platform` NuGet package. You can write exception handlers to inspect and process exceptions the following three get
properties:

* `int FailureCode { get; }`: Returns the equivalent HTTP status code.

* `string FailureSubCode { get; }`: Returns the equivalent HTTP reason phrase.

* `bool IsPermanent { get; }`: Returns the exception's permanence. Permanent exceptions indicate that the caller should not retry, since it's unlikely to succeed (for example, due to bad input).

Exceptions raised from `Kusto.Data` using the `Microsoft.Azure.Kusto.Data` NuGet package, inherit the `Kusto.Data.Exceptions.KustoException` class. All exceptions begin with `Kusto.Data.Exceptions`.

## Kusto.Data exceptions categories

 Based on the root cause, exceptions may inherit one of the following:

* `KustoRequestException`: Indicates a problem in the request itself, or in the environment that generated it. This is equivalent to HTTP status codes 4xx and is not a service fault.

* `KustoServiceException`: Indicates a problem in the service side processing the request. This is equivalent to HTTP status code 520.

* `KustoClientException`: Indicates a client-side problem in sending the request to the service. Specifically, this exception informs the caller that the service itself did not receive the request.

## General exceptions

| Exception name | Reason | Failure code | Failure subcode | Permanence | Mitigation |
|--|--|--|--|--|--|
|`EntityNameIsNotValidException` | Indicates an entity name is not valid. | 400 |  BadRequest_EntityNameIsNotValid | True | |
|`KustoClientException` | The client is unable to send or complete a request. This category includes client authentication exceptions. For a list of errors, see [client exceptions](#client-exceptions). | 0 |   | False | |
|`KustoRequestException` | A bad request was sent to the Kusto service. For a list of errors, see [Request Exceptions](#request-exceptions). | 0 |   | True | |
|`KustoServiceException` | The Kusto service was unable to process a request. For a list of errors, see [Service exceptions](#service-exceptions). | 0 |   | False | |
|`KustoServicePartialQueryFailureException` | A query execution has started successfully but failed prior to completion.  | 0 |   | False | |
|`WeakConsistencyEntityNotFoundException` | Indicates a failure to locate an entity in weak consistency mode. | 0 |   | False | |

### Client exceptions

Client exceptions contain the following exception categories:

| Exception name | Reason | Failure code | Failure subcode | Permanence | Mitigation |
|--|--|--|--|--|--|
|`CslInvalidQueryException` | Query failure due to the query itself. For a list of errors, see [Client query exceptions](#client-query-exceptions). |  |  |  |  |
|`KustoClientAuthenticationException` | Client-side authentication flow failure. For a list of errors, see [Authentication exceptions](#authentication-exceptions). | 0 |   | False | |
|`KustoClientInvalidConnectionStringException` | Kusto Connection String Builder is initialized with conflicting or insufficient properties. | 0 |   | False | |
|`KustoClientNameResolutionFailureException` | A Kusto client failed to resolve the service name.  | 0 |   | False | |
|`KustoClientNotSupportedException` | A feature is not supported by Kusto .NET Core client. | 0 |   | False | |
|`KustoClientPrincipalIdentityMustBeNullException` | A Kusto client is asked to transmit a `ClientRequestProperties` object with non-null PrincipalIdentity. | 0 |   | False | |
|`KustoClientTemporaryStorageRetrievalException` | A command to retrieve temporary storage has failed. | 0 |   | False | |
|`KustoClientTimeoutAwaitingPendingOperationException` | Indicates a time out waiting for the completion of a pending operation. | 0 |   | False | |
|`KustoClientTimeoutException` | A client is unable to send or complete a request due to a client-side timeout. | 0 |   | False | |

### Client query exceptions

| Exception name | Reason | Failure code | Failure subcode | Permanence | Mitigation |
|--|--|--|--|--|--|
|`CslBinaryOperationHasIncompatibleTypesException` | A binary operator combined two expressions with incompatible types. | 0 |   | False | |
|`CslExpectingBooleanLambdaException` | The parser is expecting a boolean lambda expression. | 0 |   | False | |
|`CslExpectingConstantExpressionException` | An expression that should represent a constant. | 0 |   | False | |
|`CslExpectingConstantNodeType` | Translating a query was aborted as the expression node type does not yield a constant value. | 0 |   | False | |
|`CslExpectingScalarExpressionException` | The parser is expecting a scalar expression. | 0 |   | False | |
|`CslExpectingScalarProjectionLambdaExpressionException` | The expression is expected to be a lambda expression performing scalar projection. | 0 |   | False | |
|`CslExpectingTableExpressionException` | The parser is expecting a table expression. | 0 |   | False | |
|`CslExpressionHasUnsupportedNodeTypeException` | A `System.Linq.Expressions.Expression` has an unsupported node type. | 0 |   | False | |
|`CslInternalQueryTranslationErrorException` | Translating a query was aborted due to an internal failure. | 0 |   | False | |
|`CslNotSupportedException` | Translating a query was aborted because it includes a method for which there's no support. | 0 |   | False | |
|`CslUnsupportedMethodArityInExpressionException` | Translating a query was aborted because the method arity is not supported. | 0 |   | False | |
|`CslUnsupportedTypeInNewExpressionException` | Translating a query was aborted because the type argument to operator new is not supported. | 0 |   | False | |

### Authentication exceptions

| Exception name | Reason | Failure code | Failure subcode | Permanence | Mitigation |
|--|--|--|--|--|--|
|`KustoClientApplicationAuthenticationException` | Client-side Azure Active Directory Application authentication failure. | 0 |   | True | |
|`KustoClientApplicationCertificateNotFoundException` | A certificate required for application authentication is not found. | 0 |   | True | |
|`KustoClientLocalSecretAuthenticationAccessDisabledException` | When `KustoConnectionStringBuilder.PreventAccessToLocalSecretsViaKeywords` is true, and there's an attempt to request authentication based on a local secret via the connection string. | 400 |  LocalSecretAuthenticationAccessDisabled | True | |
|`KustoClientUserAuthenticationException` | Client-side Azure Active Directory User authentication failure. | 0 |   | True | |
|`KustoClientUserInteractiveModeNotValidException` | Client-side failure to authenticate to Azure Active Directory. | 0 |   | True | |

## Request Exceptions

| Exception name | Reason | Failure code | Failure subcode | Permanence |  Mitigation |
|--|--|--|--|--|--|
| `ClusterSuspendedException` | A request with `request_execute_only_if_running` flag is denied because the service is in a suspended state. | 412 |  PreconditionFailed | True | |
| `KustoBadRequestException` | The Kusto service was sent a bad request. For a list of errors, see [Bad request exceptions](#bad-request-exceptions) nm. | 400 | General_BadRequest | True | |
| `KustoConflictException` | The Kusto service was sent a request which cannot be performed due to service state. | 409 | Conflict | True | |
| `KustoFailedChangeServiceStateException` | The CM failed to change service state. | 0 |   | False | |
| `KustoRequestDeniedException` | The Kusto service was sent a request with insufficient security permissions to execute. | 403 | Forbidden | True | |
| `KustoRequestPayloadTooLargeException` | The payload is too large. For example when Kusto is told to process more data than is allowed in a single batch. | 413 | Payload too large | True | |

### Bad request exceptions

| Exception name | Reason | Failure code | Failure subcode | Permanence | Mitigation |
|--|--|--|--|--|--|
| `DatabaseNotFoundException` | Failure to locate a database. | 400 | BadRequest_DatabaseNotExist | True | |
| `DuplicateMappingException` | Ingestion properties contain ingestion mapping and ingestion mapping reference. | 400 |  BadRequest_DuplicateMapping | True | |
| `EntityNotFoundInContainerException` | Failure to locate an entity. | 400 | General_BadRequest | True | |
| `EntityTypeIsNotValidException` | The entity type is unsupported. | 400 | General_BadRequest | True | |
| `FormatNotSupportedException` | The format provided is not supported. | 400 | BadRequest_FormatNotSupported | True | |
| `IngestionPropertyNotSupportedInThisContextException` | The ingestion property is not supported in this context. | 400 | BadRequest_IngestionPropertyNotSupportedInThisContext | True | |
| `MalformedIngestionPropertyException` | The ingestion property is malformed. | 400 | BadRequest_MalformedIngestionProperty | True | |
| `MappingNotFoundException` | The failure to locate a mapping reference. | 400 | BadRequest_MappingReferenceWasNotFound | True | |
| `MappingNotValidException` | The ingestion properties contain invalid ingestion mapping or ingestion mapping reference. | 400 | BadRequest_InvalidMapping | True | |
| `QueryCslTreeExceedsDepthsLimitsException` | The csl tree exceeds depth limits. | 400 | General_BadRequest | True | |
| `RelopSemanticException` | A semantic error that happened during relop compilation phase. | 400 | General_BadRequest | True | |
| `SemanticException` | Indicates a semantic error. | 400 | General_BadRequest | True | |
| `SyntaxException` | Indicate a syntax error. | 400 | BadRequest_SyntaxError | True | |
| `InappropriateNullLiteralException` | The null literal cannot appear in the context that it appears in. | 400 |  BadRequest_SyntaxError | True | |
| `InvalidLiteralFormatException` | Parsing a literal failed due to bad formatting. | 400 | BadRequest_SyntaxError | True | |
| `TableNotFoundException` | Failure to locate a table. | 400 | BadRequest_TableNotExist | True | |

## Service exceptions

| Exception name | Reason | Failure code | Failure subcode | Permanence | Mitigation |
|--|--|--|--|--|--|
| `KustoDataStreamException` | Generic exception that carries error information inside a Kusto Data Stream. | 0 |   | False | |
| `KustoRequestThrottledException` | The request is denied due to throttling. | 429 | TooManyRequests | False | |
| `KustoServicePartialQueryFailureIllFormattedDataException` | Carries error information inside a Kusto Data Stream indicating ill-formatted data. | 400 | IllFormattedData | True | |
| `KustoServicePartialQueryFailureLimitsExceededException` | Carries error information inside a Kusto Data Stream indicating that limits have been exceeded. | 400 | LimitsExceeded | True | |
| `KustoServicePartialQueryFailureLowMemoryConditionException` |Carries error information inside a Kusto Data Stream indicating low memory conditions. | 400 | LowMemoryCondition | True| |
| `KustoServiceTimeoutException` | Raised when request execution has timed-out on the service side. | 504 | RequestExecutionTimeout | False | |
