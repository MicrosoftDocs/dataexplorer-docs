---
title: Kusto.Data exceptions - Azure Data Explorer
description: This article describes Kusto.Data - Exceptions in Azure Data Explorer.
ms.reviewer: yogilad
ms.topic: reference
ms.date: 06/20/2022
---
#  Kusto.Data exceptions

All exceptions defined in the .NET SDK implement the interface
`Kusto.Cloud.Platform.Utils.ICloudPlatformException` (defined by the `Kusto.Cloud.Platform`
assembly, and are distributed through the `Microsoft.Azure.Kusto.Cloud.Platform`
NuGet package). Exception handlers can then inspect the following three get
properties to decide what to do with the exceptions:

* `int FailureCode { get; }`: Returns the equivalent HTTP status code.

* `string FailureSubCode { get; }`: Returns the equivalent HTTP reason phrase.

* `bool IsPermanent { get; }`: Returns the exception's permanence. Permanent exceptions indicate that the caller should not retry, since it's unlikely to succeed (for example, due to bad input).

## Kusto.Data exceptions categories

Exceptions raised from `Kusto.Data` (`Microsoft.Azure.Kusto.Data`NuGet package) inherit the `Kusto.Data.Exceptions.KustoException` class. All exceptions begin with `Kusto.Data.Exceptions`. Based on the root cause, They may also inherit one of the following exceptions:

* `KustoRequestException`: Indicates a problem in the request itself, or in the environment that generated it. This is equivalent to HTTP status codes 4xx and is not a service fault.

* `KustoServiceException`: Indicates a problem in the service side processing the request. This is equivalent to HTTP status code 520.

* `KustoClientException`: Indicates a client-side problem in sending the request to the service. Specifically, this exception informs the caller that the service itself did not receive the request.

## General exceptions

| Exception name | Reason | Failure code | Failure subcode | Permanence | Mitigation |
|--|--|--|--|--|--|
|`EntityNameIsNotValidException` | Raised to indicate that the entity name is not valid. | 400 |  BadRequest_EntityNameIsNotValid | True | |
|`KustoClientException` | Raised when a Kusto client is unable to send or complete a request. This category includes client authentication exceptions. For a list of errors, see [client exceptions](#client-exceptions). | 0 |   | False | |
|`KustoRequestException` | Raised when the Kusto service was sent a bad request. For a list of errors, see [Request Exceptions](#request-exceptions). | 0 |   | True | |
|`KustoServiceException` | Raised when the Kusto service was unable to process a request. For a list of errors, see [Service exceptions](#service-exceptions). | 0 |   | False | |
|`KustoServicePartialQueryFailureException` | Raised when query execution has started successfully but failed prior to completion.  | 0 |   | False | |
|`WeakConsistencyEntityNotFoundException` | Raised to indicate the failure to locate an entity in weak consistency mode. | 0 |   | False | |

### Client exceptions

Client exceptions contain the following exception categories:

| Exception name | Reason | Failure code | Failure subcode | Permanence | Mitigation |
|--|--|--|--|--|--|
|`CslInvalidQueryException` | Raised to indicate a query failure due to the query itself. For a list of errors, see [Client query exceptions](#client-query-exceptions). |  |  |  |  |
|`KustoClientAuthenticationException` | Raised on the client-side when an authentication flow fails. For a list of errors, see [Authentication exceptions](#authentication-exceptions). | 0 |   | False | |
|`KustoClientInvalidConnectionStringException` | Raised when Kusto Connection String Builder is initialized with conflicting or insufficient properties. | 0 |   | False | |
|`KustoClientNameResolutionFailureException` | Raised when a Kusto client failed to resolve the service name.  | 0 |   | False | |
|`KustoClientNotSupportedException` | Raised on the client-side when a feature is not supported by Kusto .NET Core client. | 0 |   | False | |
|`KustoClientPrincipalIdentityMustBeNullException` | Raised when a Kusto client is asked to transmit a `ClientRequestProperties` object with non-null PrincipalIdentity. | 0 |   | False | |
|`KustoClientTemporaryStorageRetrievalException` | Raised when a command to retrieve temporary storage has failed. | 0 |   | False | |
|`KustoClientTimeoutAwaitingPendingOperationException` | Raised when timing out awaiting for the completion of a pending operation. | 0 |   | False | |
|`KustoClientTimeoutException` | Raised when a Kusto client is unable to send or complete a request due to a client-side timeout. | 0 |   | False | |

### Client query exceptions

| Exception name | Reason | Failure code | Failure subcode | Permanence | Mitigation |
|--|--|--|--|--|--|
|`CslBinaryOperationHasIncompatibleTypesException` | Raised to indicate that a binary operator combined two expressions with incompatible types. | 0 |   | False | |
|`CslExpectingBooleanLambdaException` | Raised when the parser is in a state expecting a boolean lambda expression. | 0 |   | False | |
|`CslExpectingConstantExpressionException` | Raised to indicate that an expression should represent a constant. | 0 |   | False | |
|`CslExpectingConstantNodeType` | Raised to indicate that translating a query was aborted as the expression node type does not yield a constant value. | 0 |   | False | |
|`CslExpectingScalarExpressionException` | Raised when the parser is in a state expecting a scalar expression. | 0 |   | False | |
|`CslExpectingScalarProjectionLambdaExpressionException` | Raised when the expression is expected to be a lambda expression performing scalar projection. | 0 |   | False | |
|`CslExpectingTableExpressionException` | Raised when the parser is in a state expecting a table expression. | 0 |   | False | |
|`CslExpressionHasUnsupportedNodeTypeException` | Raised to indicate that a `System.Linq.Expressions.Expression` has an unsupported node type. | 0 |   | False | |
|`CslInternalQueryTranslationErrorException` | Raised to indicate that translating a query was aborted due to an internal failure. | 0 |   | False | |
|`CslNotSupportedException` | Raised to indicate that translating a query was aborted as it includes a method for which there's no support. | 0 |   | False | |
|`CslUnsupportedMethodArityInExpressionException` | Raised to indicate that translating a query was aborted as the method arity is not supported. | 0 |   | False | |
|`CslUnsupportedTypeInNewExpressionException` | Raised to indicate that translating a query was aborted as the type argument to operator new is not supported. | 0 |   | False | |

### Authentication exceptions

| Exception name | Reason | Failure code | Failure subcode | Permanence | Mitigation |
|--|--|--|--|--|--|
|`KustoClientApplicationAuthenticationException` | Raised on the client-side when Azure Active Directory Application authentication fails. | 0 |   | True | |
|`KustoClientApplicationCertificateNotFoundException` | Raised when certificate required for application authentication is not found. | 0 |   | True | |
|`KustoClientLocalSecretAuthenticationAccessDisabledException` | Raised when `KustoConnectionStringBuilder.PreventAccessToLocalSecretsViaKeywords` is true, and there's an attempt to request authentication based on a local secret via the connection string. | 400 |  LocalSecretAuthenticationAccessDisabled | True | |
|`KustoClientUserAuthenticationException` | Raised on the client-side when Azure Active Directory User authentication fails. | 0 |   | True | |
|`KustoClientUserInteractiveModeNotValidException` | Raised on the client-side when it fails to authenticate to Azure Active Directory. | 0 |   | True | |

## Request Exceptions

| Exception name | Reason | Failure code | Failure subcode | Permanence |  Mitigation |
|--|--|--|--|--|--|
| `ClusterSuspendedException` | Raised when a request with 'request_execute_only_if_running' flag is denied because the service is in a suspended state. | 412 |  PreconditionFailed | True | |
| `KustoBadRequestException` | Raised when the Kusto service was sent a bad request (could not be parsed  or had semantic errors etc.).  For a list of errors, see [Bad request exceptions](#bad-request-exceptions). | 400 | General_BadRequest | True | |
| `KustoConflictException` | Raised when the Kusto service was sent a request, which cannot be performed due to service state. | 409 | Conflict | True | |
| `KustoFailedChangeServiceStateException` | Raised on when the CM failed to change service state. | 0 |   | False | |
| `KustoRequestDeniedException` | Raised when the Kusto service was sent a request with insufficient security permissions to execute. | 403 | Forbidden | True | |
| `KustoRequestPayloadTooLargeException` | Raised when the payload is too large. For example when Kusto is told to process more data than is allowed in a single batch. | 413 | Payload too large | True | |

### Bad request exceptions

| Exception name | Reason | Failure code | Failure subcode | Permanence | Mitigation |
|--|--|--|--|--|--|
| `DatabaseNotFoundException` | Raised to indicate the failure to locate a database. | 400 | BadRequest_DatabaseNotExist | True | |
| `DuplicateMappingException` | Raised to indicate that the ingestion properties contain ingestion mapping and ingestion mapping reference. | 400 |  BadRequest_DuplicateMapping | True | |
| `EntityNotFoundInContainerException` | Raised to indicate the failure to locate an entity. | 400 | General_BadRequest | True | |
| `EntityTypeIsNotValidException` | Raised to indicate that the entity type is unsupported. | 400 | General_BadRequest | True | |
| `FormatNotSupportedException` | Raised to indicate that the format provided is not supported. | 400 | BadRequest_FormatNotSupported | True | |
| `IngestionPropertyNotSupportedInThisContextException` | Raised to indicate that the ingestion property is not supported in this context. | 400 | BadRequest_IngestionPropertyNotSupportedInThisContext | True | |
| `MalformedIngestionPropertyException` | Raised to indicate that the ingestion property is malformed. | 400 | BadRequest_MalformedIngestionProperty | True | |
| `MappingNotFoundException` | Raised to indicate the failure to locate a mapping reference. | 400 | BadRequest_MappingReferenceWasNotFound | True | |
| `MappingNotValidException` | Raised to indicate that the ingestion properties contain invalid ingestion mapping or ingestion mapping reference. | 400 | BadRequest_InvalidMapping | True | |
| `QueryCslTreeExceedsDepthsLimitsException` | Raised when the csl tree exceeds depth limits. | 400 | General_BadRequest | True | |
| `RelopSemanticException` | Raised to indicate a semantic error that happened during relop compilation phase. | 400 | General_BadRequest | True | |
| `SemanticException` | Raised to indicate a semantic error. | 400 | General_BadRequest | True | |
| `SyntaxException` | Raised to indicate a syntax error. | 400 | BadRequest_SyntaxError | True | |
| `InappropriateNullLiteralException` | Raised to indicate that the null literal cannot appear in the context that it appears in. | 400 |  BadRequest_SyntaxError | True | |
| `InvalidLiteralFormatException` | Raised to indicate that parsing a literal failed due to bad formatting. | 400 | BadRequest_SyntaxError | True | |
| `TableNotFoundException` | Raised to indicate the failure to locate a table. | 400 | BadRequest_TableNotExist | True | |

## Service exceptions

| Exception name | Reason | Failure code | Failure subcode | Permanence | Mitigation |
|--|--|--|--|--|--|
| `KustoDataStreamException` | Generic exception that carries error information inside a Kusto Data Stream. | 0 |   | False | |
| `KustoRequestThrottledException` | Raised when the request is denied due to throttling. | 429 | TooManyRequests | False | |
| `KustoServicePartialQueryFailureIllFormattedDataException` | Exception that carries error information inside a Kusto Data Stream (ill-formatted data). | 400 | IllFormattedData | True | |
| `KustoServicePartialQueryFailureLimitsExceededException` | Exception that carries error information inside a Kusto Data Stream (limits exceeded) | 400 | LimitsExceeded | True | |
| `KustoServicePartialQueryFailureLowMemoryConditionException` | Exception that carries error information inside a Kusto Data Stream (low memory conditions). | 400 | LowMemoryCondition | True| |
| `KustoServiceTimeoutException` | Raised when request execution has timed-out on the service side. | 504 | RequestExecutionTimeout | False | |
