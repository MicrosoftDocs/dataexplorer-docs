---
title: Kusto.Data exceptions - Azure Data Explorer
description: This article describes Kusto.Data - Errors and Exceptions in Azure Data Explorer.
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

Exceptions raised from `Kusto.Data` (`Microsoft.Azure.Kusto.Data`
NuGet package) inherit the `Kusto.Data.Exceptions.KustoException` class. Based on the root cause, They may also inherit one of the following exceptions:

* `Kusto.Data.Exceptions.KustoRequestException`: Indicates a problem in the request itself, or in the environment that generated it. This is equivalent to HTTP status codes 4xx and is not a service fault.

* `Kusto.Data.Exceptions.KustoServiceException`: Indicates a problem in the service side processing the request. This is equivalent to HTTP status code 520.

* `Kusto.Data.Exceptions.KustoClientException`: Indicates a client-side problem in sending the request to the service. Specifically, this exception informs the caller that the service itself did not receive the request.

## General exceptions

| Exception name | Description | Failure code | Failure subcode | Permanence |
|--|--|--|--|--|
|`Kusto.Data.Exceptions.EntityNameIsNotValidException` | Raised to indicate that the entity name is not valid. | 400 |  BadRequest_EntityNameIsNotValid | True |
|`Kusto.Data.Exceptions.KustoClientException` | Raised when a Kusto client is unable to send or complete a request. This category includes client authentication exceptions. Specific errors can be found in the [client exceptions](#client-exceptions) table. | 0 |   | False |
|`Kusto.Data.Exceptions.KustoRequestException` | Raised when the Kusto service was sent a bad request. Specific errors can be found in the [Request Exceptions](#request-exceptions) table. | 0 |   | True |
|`Kusto.Data.Exceptions.KustoServiceException` | Raised when the Kusto service was unable to process a request. Specific errors can be found in the [Service exceptions](#service-exceptions) table. | 0 |   | False |
|`Kusto.Data.Exceptions.KustoServicePartialQueryFailureException` | Raised when query execution has started successfully but failed prior to completion.  | 0 |   | False |
|`Kusto.Data.Exceptions.WeakConsistencyEntityNotFoundException` | Raised to indicate the failure to locate an entity in weak consistency mode. | 0 |   | False |

### Client exceptions

Client exceptions contain the following exception categories:

| Exception name | Description | Failure code | Failure subcode | Permanence |
|--|--|--|--|--|
|`Kusto.Data.Exceptions.CslInvalidQueryException` | Raised to indicate a query failure due to the query itself. Specific errors can be found in the [Client query exceptions](#client-query-exceptions) table. |  |  |  |
|`Kusto.Data.Exceptions.KustoClientAuthenticationException` | Raised on the client-side when an authentication flow fails.  Specific errors can be found in the [Authentication exceptions](#authentication-exceptions) table. | 0 |   | False |
|`Kusto.Data.Exceptions.KustoClientInvalidConnectionStringException` | Raised when Kusto Connection String Builder is initialized with conflicting or insufficient properties. | 0 |   | False |
|`Kusto.Data.Exceptions.KustoClientNameResolutionFailureException` | Raised when a Kusto client failed to resolve the service name.  | 0 |   | False |
|`Kusto.Data.Exceptions.KustoClientNotSupportedException` | Raised on the client-side when a feature is not supported by Kusto .NET Core client. | 0 |   | False |
|`Kusto.Data.Exceptions.KustoClientPrincipalIdentityMustBeNullException` | Raised when a Kusto client is asked to transmit a `ClientRequestProperties` object with non-null PrincipalIdentity. | 0 |   | False |
|`Kusto.Data.Exceptions.KustoClientTemporaryStorageRetrievalException` | Raised when a command to retrieve temporary storage has failed. | 0 |   | False |
|`Kusto.Data.Exceptions.KustoClientTimeoutAwaitingPendingOperationException` | Raised when timing out awaiting for the completion of a pending operation. | 0 |   | False |
|`Kusto.Data.Exceptions.KustoClientTimeoutException` | Raised when a Kusto client is unable to send or complete a request due to a client-side timeout. | 0 |   | False |

### Client query exceptions

| Exception name | Description | Failure code | Failure subcode | Permanence |
|--|--|--|--|--|
|`Kusto.Data.Exceptions.CslBinaryOperationHasIncompatibleTypesException` | Raised to indicate that a binary operator combined two expressions with incompatible types. | 0 |   | False |
|`Kusto.Data.Exceptions.CslExpectingBooleanLambdaException` | Raised when the parser is in a state expecting a boolean lambda expression. | 0 |   | False |
|`Kusto.Data.Exceptions.CslExpectingConstantExpressionException` | Raised to indicate that an expression should represent a constant. | 0 |   | False |
|`Kusto.Data.Exceptions.CslExpectingConstantNodeType` | Raised to indicate that translating a query was aborted as the expression node type does not yield a constant value. | 0 |   | False |
|`Kusto.Data.Exceptions.CslExpectingScalarExpressionException` | Raised when the parser is in a state expecting a scalar expression. | 0 |   | False |
|`Kusto.Data.Exceptions.CslExpectingScalarProjectionLambdaExpressionException` | Raised when the expression is expected to be a lambda expression performing scalar projection. | 0 |   | False |
|`Kusto.Data.Exceptions.CslExpectingTableExpressionException` | Raised when the parser is in a state expecting a table expression. | 0 |   | False |
|`Kusto.Data.Exceptions.CslExpressionHasUnsupportedNodeTypeException` | Raised to indicate that a `System.Linq.Expressions.Expression` has an unsupported node type. | 0 |   | False |
|`Kusto.Data.Exceptions.CslInternalQueryTranslationErrorException` | Raised to indicate that translating a query was aborted due to an internal failure. | 0 |   | False |
|`Kusto.Data.Exceptions.CslNotSupportedException` | Raised to indicate that translating a query was aborted as it includes a method for which there's no support. | 0 |   | False |
|`Kusto.Data.Exceptions.CslUnsupportedMethodArityInExpressionException` | Raised to indicate that translating a query was aborted as the method arity is not supported. | 0 |   | False |
|`Kusto.Data.Exceptions.CslUnsupportedTypeInNewExpressionException` | Raised to indicate that translating a query was aborted as the type argument to operator new is not supported. | 0 |   | False |

### Authentication exceptions

| Exception name | Description | Failure code | Failure subcode | Permanence |
|--|--|--|--|--|
|`Kusto.Data.Exceptions.KustoClientApplicationAuthenticationException` | Raised on the client-side when Azure Active Directory Application authentication fails. | 0 |   | True |
|`Kusto.Data.Exceptions.KustoClientApplicationCertificateNotFoundException` | Raised when certificate required for application authentication is not found. | 0 |   | True |
|`Kusto.Data.Exceptions.KustoClientLocalSecretAuthenticationAccessDisabledException` | Raised when `KustoConnectionStringBuilder.PreventAccessToLocalSecretsViaKeywords` is true, and there's an attempt to request authentication based on a local secret via the connection string. | 400 |  LocalSecretAuthenticationAccessDisabled | True |
|`Kusto.Data.Exceptions.KustoClientUserAuthenticationException` | Raised on the client-side when Azure Active Directory User authentication fails. | 0 |   | True |
|`Kusto.Data.Exceptions.KustoClientUserInteractiveModeNotValidException` | Raised on the client-side when it fails to authenticate to Azure Active Directory. | 0 |   | True |

## Request Exceptions

| Exception name | Description | Failure code | Failure subcode | Permanence |
|--|--|--|--|--|
| `Kusto.Data.Exceptions.ClusterSuspendedException` | Raised when a request with 'request_execute_only_if_running' flag is denied because the service is in a suspended state. | 412 |  PreconditionFailed | True |
| `Kusto.Data.Exceptions.KustoBadRequestException` | Raised when the Kusto service was sent a bad request (could not be parsed  or had semantic errors etc.). Specific errors can be found in the [Bad request exceptions](#bad-request-exceptions) table. | 400 | General_BadRequest | True |
| `Kusto.Data.Exceptions.KustoConflictException` | Raised when the Kusto service was sent a request, which cannot be performed due to service state. | 409 | Conflict | True |
| `Kusto.Data.Exceptions.KustoFailedChangeServiceStateException` | Raised on when the CM failed to change service state. | 0 |   | False |
| `Kusto.Data.Exceptions.KustoRequestDeniedException` | Raised when the Kusto service was sent a request with insufficient security permissions to execute. | 403 | Forbidden | True |
| `Kusto.Data.Exceptions.KustoRequestPayloadTooLargeException` | Raised when the payload is too large. For example when Kusto is told to process more data than is allowed in a single batch. | 413 | Payload too large | True |

### Bad request exceptions

| Exception name | Description | Failure code | Failure subcode | Permanence |
|--|--|--|--|--|
| `Kusto.Data.Exceptions.DatabaseNotFoundException` | Raised to indicate the failure to locate a database. | 400 | BadRequest_DatabaseNotExist | True |
| `Kusto.Data.Exceptions.DuplicateMappingException` | Raised to indicate that the ingestion properties contain ingestion mapping and ingestion mapping reference. | 400 |  BadRequest_DuplicateMapping | True |
| `Kusto.Data.Exceptions.EntityNotFoundInContainerException` | Raised to indicate the failure to locate an entity. | 400 | General_BadRequest | True |
| `Kusto.Data.Exceptions.EntityTypeIsNotValidException` | Raised to indicate that the entity type is unsupported. | 400 | General_BadRequest | True |
| `Kusto.Data.Exceptions.FormatNotSupportedException` | Raised to indicate that the format provided is not supported. | 400 | BadRequest_FormatNotSupported | True |
| `Kusto.Data.Exceptions.IngestionPropertyNotSupportedInThisContextException` | Raised to indicate that the ingestion property is not supported in this context. | 400 | BadRequest_IngestionPropertyNotSupportedInThisContext | True |
| `Kusto.Data.Exceptions.MalformedIngestionPropertyException` | Raised to indicate that the ingestion property is malformed. | 400 | BadRequest_MalformedIngestionProperty | True |
| `Kusto.Data.Exceptions.MappingNotFoundException` | Raised to indicate the failure to locate a mapping reference. | 400 | BadRequest_MappingReferenceWasNotFound | True |
| `Kusto.Data.Exceptions.MappingNotValidException` | Raised to indicate that the ingestion properties contain invalid ingestion mapping or ingestion mapping reference. | 400 | BadRequest_InvalidMapping | True |
| `Kusto.Data.Exceptions.QueryCslTreeExceedsDepthsLimitsException` | Raised when the csl tree exceeds depth limits. | 400 | General_BadRequest | True |
| `Kusto.Data.Exceptions.RelopSemanticException` | Raised to indicate a semantic error that happened during relop compilation phase. | 400 | General_BadRequest | True |
| `Kusto.Data.Exceptions.SemanticException` | Raised to indicate a semantic error. | 400 | General_BadRequest | True |
| `Kusto.Data.Exceptions.SyntaxException` | Raised to indicate a syntax error. | 400 | BadRequest_SyntaxError | True |
| `Kusto.Data.Exceptions.InappropriateNullLiteralException` | Raised to indicate that the null literal cannot appear in the context that it appears in. | 400 |  BadRequest_SyntaxError | True |
| `Kusto.Data.Exceptions.InvalidLiteralFormatException` | Raised to indicate that parsing a literal failed due to bad formatting. | 400 | BadRequest_SyntaxError | True |
| `Kusto.Data.Exceptions.TableNotFoundException` | Raised to indicate the failure to locate a table. | 400 | BadRequest_TableNotExist | True |

## Service exceptions

| Exception name | Description | Failure code | Failure subcode | Permanence |
|--|--|--|--|--|
| `Kusto.Data.Exceptions.KustoDataStreamException` | Generic exception that carries error information inside a Kusto Data Stream. | 0 |   | False |
| `Kusto.Data.Exceptions.KustoRequestThrottledException` | Raised when the request is denied due to throttling. | 429 | TooManyRequests | False |
| `Kusto.Data.Exceptions.KustoServicePartialQueryFailureIllFormattedDataException` | Exception that carries error information inside a Kusto Data Stream (ill-formatted data). | 400 | IllFormattedData | True |
| `Kusto.Data.Exceptions.KustoServicePartialQueryFailureLimitsExceededException` | Exception that carries error information inside a Kusto Data Stream (limits exceeded) | 400 | LimitsExceeded | True |
| `Kusto.Data.Exceptions.KustoServicePartialQueryFailureLowMemoryConditionException` | Exception that carries error information inside a Kusto Data Stream (low memory conditions). | 400 | LowMemoryCondition | True |
| `Kusto.Data.Exceptions.KustoServiceTimeoutException` | Raised when request execution has timed-out on the service side. | 504 | RequestExecutionTimeout | False |
