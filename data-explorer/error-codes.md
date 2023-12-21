---
title: Ingestion error codes - Azure Data Explorer
description: This article lists ingestion error codes in Azure Data Explorer.
ms.reviewer: vladikbr
ms.topic: reference
ms.date: 12/21/2023
---
# Ingestion error codes

This article contains error codes that may occur during [data ingestion](ingest-data-overview.md).

When you enable failed ingestion [diagnostic logs](using-diagnostic-logs.md) on your cluster, you can see error codes in the **Failed ingestion** [operation log](/azure/azure-monitor/reference/tables/failedingestion).

You can use the [.show ingestion failures command](kusto/management/ingestionfailures.md) to present information on data ingestion management command failures, though this command excludes failures from other stages of the ingestion process. For a comprehensive view of failures across all stages, refer to [ingestion metrics](using-metrics.md#ingestion-metrics) and [diagnostic logs](using-diagnostic-logs.md#ingestion). 

The **Ingestion result** metric provides information about the **Category** of ingestion errors, although it doesn't show the specific error codes. The errors in this article are organized by these categories.

> [!NOTE]
> For transient errors or 'General_RetryAttemptsExceeded' error, retrying the ingestion may succeed.

## Category: BadFormat

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|Stream_WrongNumberOfFields                        |Inconsistent number of fields in the input records. HRESULT: 0x80DA0008      |Permanent           |
|Stream_ClosingQuoteMissing                        |Invalid CSV format. Closing quote is missing. HRESULT: 0x80DA000b            |Permanent           |
|BadRequest_InvalidBlob                            |Blob is invalid.                                                              |Permanent           |
|BadRequest_EmptyArchive                           |Archive is empty.                                                             |Permanent           |
|BadRequest_InvalidArchive                         |Archive is invalid.                                                           |Permanent           |
|BadRequest_InvalidMapping                         |Failed to parse ingestion mapping.<br>For more information about how to write ingestion mapping, see [Data mappings](./kusto/management/mappings.md).   |Permanent           |
|BadRequest_InvalidMappingReference                |Invalid mapping reference.            |Permanent           |
|BadRequest_FormatNotSupported                     |Format isn't supported. This may be because you're using a format not supported by a particular data connection. <br>For more information about data formats supported for ingestion, see [Supported data formats](ingestion-supported-formats.md). |Permanent          |
|BadRequest_InconsistentMapping                    |Supported ingestion mapping isn't consistent with the existing table schema. |Permanent           |
|BadRequest_UnexpectedCharacterInInputStream       |Unexpected character in the input stream.                                     |Permanent           |

## Category: BadRequest

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|BadRequest_EmptyBlob                              |Blob is empty.  |Permanent
|BadRequest_NoRecordsOrWrongFormat                 |Blob is empty or specified [ingestion format](ingestion-supported-formats.md) doesn't match blob content (for example, `JSON` format used instead of `MULTIJSON`).  |Permanent
|BadRequest_EmptyBlobUri                           |Blob Uri is empty.                                                           |Permanent           |
|BadRequest_DuplicateMapping                       |Ingestion properties include both ingestionMapping and ingestionMappingReference, which isn't valid.              |Permanent          |
|BadRequest_InvalidOrEmptyTableName                |Table name is empty or invalid.<br>For more information about naming conventions, see [Entity names](./kusto/query/schema-entities/entity-names.md).    |Permanent          |
|BadRequest_EmptyDatabaseName                      |Database name is empty.             |Permanent          |
|BadRequest_EmptyMappingReference                  |Some formats should get ingestion mapping to be ingested and the mapping reference is empty.<br>For more information about mapping, see [Data Mapping](./kusto/management/mappings.md).        |Permanent           |
|Download_BadRequest                               |Failed to download source from Azure Storage because of bad request.    |Permanent           |
|BadRequest_MissingMappingtFailure                 |Avro and Json formats must be ingested with ingestionMapping or ingestionMappingReference parameter.         |Permanent           |
|Stream_NoDataToIngest                             |Found no data to ingest.<br>For data in JSON format, this error may indicate that the JSON format was invalid.        |Permanent          |
|Stream_DynamicPropertyBagTooLarge                 |The data contains too large values in a dynamic column. HRESULT: 0x80DA000E         |Permanent          |
|General_BadRequest                                |Bad request.            |Permanent           |
|BadRequest_CorruptedMessage                       |Message is corrupted.    |Permanent           |
|BadRequest_SyntaxError                            |Request syntax error.     |Permanent           |
|BadRequest_ZeroRetentionPolicyWithNoUpdatePolicy  |Table has zero retention policy and isn't the source table for any update policy.    |Permanent           |
|BadRequest_CreationTimeEarlierThanSoftDeletePeriod|Creation time that was specified for ingestion, isn't within the `SoftDeletePeriod`.<br>For more information about `SoftDeletePeriod`, see [The policy object](./kusto/management/retentionpolicy.md#the-policy-object).  |Permanent   |
|BadRequest_NotSupported                           |Request not supported.    |Permanent           |
|Download_SourceNotFound                           |Failed to download source from Azure Storage. Source not found.       |Permanent       |
|BadRequest_EntityNameIsNotValid                   |Entity name isn't valid.<br>For more information about naming conventions, see [Entity names](./kusto/query/schema-entities/entity-names.md).    |Permanent           |
|BadRequest_MalformedIngestionProperty              |Ingestion property is malformed.    |Permanent           |
| BadRequest_IngestionPropertyNotSupportedInThisContext | Ingestion property isn't supported in this context.| Permanent |
| BadRequest_NonMultiDatabaseDataConnection        | Event contains the 'Database' property that routes ingested data to a different database than the target database configured in the data connection's settings. However, since the connection isn't set to allow routing to multiple databases, dynamic database routing isn't allowed.| Permanent |
| BadRequest_InvalidBlobUri                        | Blob URI is invalid.      | Permanent          |
| BadRequest_DataCapacityLimitReached              | Storage account has reached its data capacity limit.      | Permanent          |
| BadRequest_InvalidManagedIdentity                | Managed Identity either doesn't exist or doesn't have the required permissions.      | Permanent          |

## Category: DataAccessNotAuthorized

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|Download_AccessConditionNotSatisfied              |Failed to download source from Azure storage. Access condition not satisfied.     |Permanent           |
|Download_Forbidden                                |Failed to download source from Azure storage. Access forbidden.    |Permanent           |
|Download_AccountNotFound                          |Failed to download source from Azure storage. Account not found.    |Permanent           |
|BadRequest_TableAccessDenied                      |Access to table is denied.<br>For more information, see [role-based access control](./kusto/management/access-control/role-based-access-control.md).     |Permanent           |
|BadRequest_DatabaseAccessDenied                   |Access to database is denied.<br>For more information, see [role-based access control](./kusto/management/access-control/role-based-access-control.md).                        |Permanent           |
|BadRequest_InvalidAuthentication                  |Authentication to data isn't valid.                                |Permanent           |

## Category: DownloadFailed

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|Download_NotTransient                             |Failed to download source from Azure storage. Not transient error occurred                   |Permanent           |
|Download_UnknownError                             |Failed to download source from Azure storage. Unknown error occurred                          |Transient           |
|Download_TransientNameResolutionFailure           |Failed to download source from Azure storage. Transient storage account name resolution failure occurred   |Transient           |


## Category: EntityNotFound

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|BadRequest_MappingReferenceWasNotFound            |Mapping reference wasn't found.   |Permanent           |
|BadRequest_DatabaseNotExist                       |Database doesn't exist.          |Permanent           |
|BadRequest_TableNotExist                          |Table doesn't exist.          |Permanent           |
|BadRequest_EntityNotFound                         |The entity (such as mapping, database, or table) wasn't found.           |Permanent           |

## Category: FileTooLarge

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|Stream_InputStreamTooLarge                        |The total size of the input data or a single field in the data is too large. HRESULT: 0x80DA0009<br>For more information about the size limit for this type of ingestion, see [The string data type](./kusto/query/scalar-data-types/string.md). |Permanent          |
|BadRequest_FileTooLarge                           |Blob size has exceeded the size limit allowed for ingestion.<br>For more information about the size limit for ingestion, see [Azure Data Explorer data ingestion overview](ingest-data-overview.md#comparing-ingestion-methods-and-tools). |Permanent           |

## Category: InternalServiceError

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|General_InternalServerError                       |Internal server error occurred.                     |Transient          |
|General_TransientSchemaMismatch                   |Schema of target table when starting the ingestion doesn't match the schema when committing the ingestion.         |Transient           |
|Timeout                                            |The operation has been aborted because of timeout.     |Transient           |
|OutOfMemory                                       |Ingestion operation ran out of memory.                  |Transient           |
|Schema_PermanentUpdateFailure                     |Failed to update schema permanently.                    |Permanent           |

## Category: UpdatePolicyFailure

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|UpdatePolicy_QuerySchemaDoesNotMatchTableSchema   |Failed to invoke update policy. Query schema doesn't match table schema.     |Permanent           |
|UpdatePolicy_FailedDescendantTransaction          |Failed to invoke update policy. Failed descendant transactional update policy.    |Transient           |
|UpdatePolicy_IngestionError                       |Failed to invoke update policy. Ingestion Error occurred.<br>The error is reported on the source table of the update policy.     |Transient          |
|UpdatePolicy_UnknownError                         |Failed to invoke update policy. Unknown error occurred.<br>The error is reported on the target table of update policy.    |Transient           |
|UpdatePolicy_Cyclic_Update_Not_Allowed            |Failed to invoke update policy. Cyclic update isn't allowed.      |Permanent           |
|UpdatePolicy_BadRequest                           |Failed to invoke update policy as a result of a bad request,<br>for example, a query semantic error.    |Permanent           |

## Category: UserAccessNotAuthorized

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|BadRequest_InvalidKustoIdentityToken              |Invalid Kusto identity token.                           |Permanent           |
|Forbidden                                          |Insufficient security permissions to execute request. | Permanent|

## Category: ThrottledOnEngine

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|General_ThrottledIngestion                    |Throttled ingestion.                                  |Transient          |

## Category: RetryAttemptsExceeded

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|General_RetryAttemptsExceeded                 |Operation has exceeded the retry attempts limit or timespan limit following a recurring transient error.                                  |Permanent          |

## Category: BlobAlreadyReceived

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|BlobAlreadyReceived_BlobAlreadyFoundInBatch   |Detected the same blob in the same specific batch for ingestion. In this case, only one copy of the blob will be used for ingestion. Many errors of this type may indicate that the ingestion configuration is suboptimal. For example, defining two Event Grid data connections on the same storage.                              |Permanent          |

## Category: Unknown

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|Unknown                                            |Unknown error occurred.                             |Transient          |