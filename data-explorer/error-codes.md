---
title: Ingestion error codes in Azure Data Explorer
description: This topic lists ingestion error codes in Azure Data Explorer 
author: orspod
ms.author: orspodek
ms.reviewer: vladikbr
ms.service: data-explorer
ms.topic: reference
ms.date: 11/11/2020
---
# Ingestion error codes in Azure Data Explorer

The following list contains error codes you may come across during [ingestion](ingest-data-overview.md). When you enable failed ingestion [diagnostic logs](using-diagnostic-logs.md#ingestion-logs-schema) on your cluster, you can see error codes in the **Failed ingestion** operation log. You can also monitor the **Ingestion result** [metric](using-metrics.md#ingestion-metrics) to see the **Category** of ingestion errors, but not the specific error codes. Errors below are organized by these categories. 

> [!NOTE]
> If the error is transient, retrying the ingestion may succeed.

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
|BadRequest_FormatNotSupported                     |Format isn't supported. This may be because you are using a format not supported by a particular data connection. <br>For more information about data formats supported by Azure Data Explorer for ingestion, see [Supported data formats](ingestion-supported-formats.md). |Permanent          |
|BadRequest_InconsistentMapping                    |Supported ingestion mapping isn't consistent with the existing table schema. |Permanent           |
|BadRequest_UnexpectedCharacterInInputStream       |Unexpected character in the input stream.                                     |Permanent           |

## Category: BadRequest

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|BadRequest_EmptyBlob                              |Blob is empty.                                                               |Permanent           |
|BadRequest_EmptyBlobUri                           |Blob Uri is empty.                                                           |Permanent           |
|BadRequest_DuplicateMapping                       |Ingestion properties include both ingestionMapping and ingestionMappingReference, which isn't valid.              |Permanent          |
|BadRequest_InvalidOrEmptyTableName                |Table name is empty or invalid.<br>For more information about Azure Data Explorer naming convention, see [Entity names](./kusto/query/schema-entities/entity-names.md).    |Permanent          |
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
|BadRequest_EntityNameIsNotValid                   |Entity name isn't valid.<br>For more information about Azure Data Explorer naming convention, see [Entity names](./kusto/query/schema-entities/entity-names.md).    |Permanent           |
|BadRequest_MalformedIngestionProperty              |Ingestion property is malformed.    |Permanent           |
| BadRequest_IngestionPropertyNotSupportedInThisContext | Ingestion property is not supported in this context| Permanent

## Category: DataAccessNotAuthorized

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|Download_AccessConditionNotSatisfied              |Failed to download source from Azure storage. Access condition not satisfied.     |Permanent           |
|Download_Forbidden                                |Failed to download source from Azure storage. Access forbidden.    |Permanent           |
|Download_AccountNotFound                          |Failed to download source from Azure storage. Account not found.    |Permanent           |
|BadRequest_TableAccessDenied                      |Access to table is denied.<br>For more information, see [Role-based Authorization in Kusto](./kusto/management/access-control/role-based-authorization.md).     |Permanent           |
|BadRequest_DatabaseAccessDenied                   |Access to database is denied.<br>For more information, see [Role-based Authorization in Kusto](./kusto/management/access-control/role-based-authorization.md).                        |Permanent           |

## Category: DownloadFailed

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|Download_NotTransient                             |Failed to download source from Azure storage. Not transient error occurred                   |Permanent           |
|Download_UnknownError                             |Failed to download source from Azure storage. Unknown error occurred              |Transient           |


## Category: EntityNotFound

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|BadRequest_MappingReferenceWasNotFound            |Mapping reference wasn't found.   |Permanent           |
|BadRequest_DatabaseNotExist                       |Database doesn't exist.          |Permanent           |
|BadRequest_TableNotExist                          |Table doesn't exist.          |Permanent           |
|BadRequest_EntityNotFound                         |Azure Data Explorer entity (such as mapping, database, or table) wasn't found.           |Permanent           |

## Category: FileTooLarge

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|Stream_InputStreamTooLarge                        |The total size of the input data or a single field in the data is too large. HRESULT: 0x80DA0009                 |Permanent          |
|BadRequest_FileTooLarge                           |Blob size has exceeded the size limit allowed for ingestion.<br>For more information about the size limit for ingestion, see [Azure Data Explorer data ingestion overview](ingest-data-overview.md#comparing-ingestion-methods-and-tools). |Permanent           |

## Category: InternalServiceError

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|General_InternalServerError                       |Internal server error occurred.                     |Transient          |
|General_TransientSchemaMismatch                   |Schema of target table when starting the ingestion doesn't match the schema when committing the ingestion.         |Transient           |
|Timeout                                            |The operation has been aborted because of timeout.     |Transient           |
|BadRequest_MessageExhausted                       |Failed to ingest data since ingestion reached the maximum retry attempts or the maximum retry period.<br>Retrying ingestion may succeed.   |Transient          |

## Category: UpdatePolicyFailure

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|UpdatePolicy_QuerySchemaDoesNotMatchTableSchema   |Failed to invoke update policy. Query schema doesn't match table schema.     |Permanent           |
|UpdatePolicy_FailedDescendantTransaction          |Failed to invoke update policy. Failed descendant transactional update policy.    |Transient           |
|UpdatePolicy_IngestionError                       |Failed to invoke update policy. Ingestion Error occurred.<br>The error is reported on the source table of the update policy.     |Transient          |
|UpdatePolicy_UnknownError                         |Failed to invoke update policy. Unknown error occurred.<br>The error is reported on the target table of update policy.    |Transient           |
|UpdatePolicy_Cyclic_Update_Not_Allowed         |Failed to invoke update policy. Cyclic update isn't allowed.      |Permanent           |

## Category: UserAccessNotAuthorized

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|BadRequest_InvalidKustoIdentityToken              |Invalid Kusto identity token.                           |Permanent           |
|Forbidden                                          |Insufficient security permissions to execute request. | Permanent|

## Category: Unknown

|Error message                                 |Description                                           |Permanent/Transient|
|---|---|---|
|Unknown                                            |Unknown error occurred.                             |Transient          |
