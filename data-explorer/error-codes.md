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
# Ingestion error codes

The following list contains error codes you may come across during [ingestion](ingest-data-overview.md). The **Manifest constant** field can be found in your [ingestion fail log](kusto/management/ingestionfailures.md), and is organized here by **Category**. These categories are shown in the ingestion result [metrics](using-metrics.md). If the error is permanent, it will not be resolved by retrying ingestion.

|Manifest constant                                  |Description                                           |Permanent/Transient|
|---------------------------------------------------|--------------------------|------------|
| ---------**Category: BadFormat**---------                                          |
|
|Stream\_WrongNumberOfFields                        |Inconsistent number of fields in the input records. HRESULT: 0x80DA0008      |Permanent           |
|Stream\_ClosingQuoteMissing                        |Invalid CSV format. Closing quote is missing. HRESULT: 0x80DA000b            |Permanent           |
|BadRequest\_InvalidBlob                            |Blob is invalid.                                                              |Permanent           |
|BadRequest\_EmptyArchive                           |Archive is empty.                                                             |Permanent           |
|BadRequest\_InvalidArchive                         |Archive is invalid.                                                           |Permanent           |
|BadRequest\_InvalidMapping                         |Failed to parse ingestion mapping.<br>For more information about how to write ingestion mapping, see [Data mappings](./kusto/management/mappings.md).   |Permanent           |
|BadRequest\_InvalidMappingReference                |Invalid mapping reference.            |Permanent           |
|BadRequest\_FormatNotSupported                     |Format isn't supported. Some data connections don't support all formats.<br>For more information about data formats supported by Azure Data Explorer for ingestion, see [Supported data formats](ingestion-supported-formats.md). |Permanent          |
|BadRequest\_InconsistentMapping                    |Supported ingestion mapping isn't consistent with the existing table schema. |Permanent           |
|BadRequest\_UnexpectedCharacterInInputStream       |Unexpected character in the input stream.                                     |Permanent           |
|
|---------**Category: BadRequest**--------- |
|                        
|BadRequest\_EmptyBlob                              |Blob is empty.                                                               |Permanent           |
|BadRequest\_EmptyBlobUri                           |Blob Uri is empty.                                                           |Permanent           |
|BadRequest\_DuplicateMapping                       |Ingestion properties include both ingestionMapping and ingestionMappingReference, which isn't valid.              |Permanent          |
|BadRequest\_InvalidOrEmptyTableName                |Table name is empty or invalid.<br>For more information about Azure Data Explorer naming convention, see [Entity names](./kusto/query/schema-entities/entity-names.md).    |Permanent          |
|BadRequest\_EmptyDatabaseName                      |Database name is empty.             |Permanent          |
|BadRequest\_EmptyMappingReference                  |Some formats should get ingestion mapping to be ingested and the mapping reference is empty.<br>For more information about mapping, see [Data Mapping](./kusto/management/mappings.md).        |Permanent           |
|Stream\_NoDataToIngest                             |Found no data to ingest.<br>For data in JSON format, this error may indicate that the JSON format was invalid.        |Permanent          |
|Stream\_DynamicPropertyBagTooLarge                 |The data contains too large values in a dynamic column. HRESULT: 0x80DA000E         |Permanent          |
|Download\_BadRequest                               |Failed to download source from Azure Storage because of bad request.    |Permanent           |
|BadRequest\_MissingMappingtFailure                 |Avro and Json formats must be ingested with ingestionMapping or ingestionMappingReference parameter.         |Permanent           |
|BadRequest\_MessageExhausted                       |Failed to ingest data since ingestion reached the maximum retry attempts or the maximum retry period.<br>Retrying ingestion may succeed.   |Transient          |
|General\_BadRequest                                |Bad request.            |Permanent           |
|BadRequest\_CorruptedMessage                       |Message is corrupted.    |Permanent           |
|BadRequest\_SyntaxError                            |Request syntax error.     |Permanent           |
|BadRequest\_ZeroRetentionPolicyWithNoUpdatePolicy  |Table has zero retention policy and isn't the source table for any update policy.    |Permanent           |
|BadRequest\_CreationTimeEarlierThanSoftDeletePeriod|Creation time that was specified for ingestion, isn't within the SoftDeletePeriod.<br>For more information about SoftDeletePeriod, see [The policy object](./kusto/management/retentionpolicy.md#the-policy-object).  |Permanent   |
|BadRequest\_NotSupported                           |Request not supported.    |Permanent           |
|Download\_SourceNotFound                           |Failed to download source from Azure Storage. Source not found.       |Permanent       |
|BadRequest\_EntityNameIsNotValid                   |Entity name isn't valid.<br>For more information about Azure Data Explorer naming convention, see [entity names](./kusto/query/schema-entities/entity-names.md).    |Permanent           |
|BadRequest\_MalformedIngestionProperty              |Ingestion property is malformed.    |Permanent           |
|
|---------**Category: DataAccessNotAuthorized**---------                            |
|                                                   
|Download\_AccessConditionNotSatisfied              |Failed to download source from Azure storage. Access condition not satisfied.     |Permanent           |
|Download\_Forbidden                                |Failed to download source from Azure storage. Access forbidden.    |Permanent           |
|Download\_AccountNotFound                          |Failed to download source from Azure storage. Account not found.    |Permanent           |
|BadRequest\_TableAccessDenied                      |Access to table is denied.<br>For more information, see [Role-based Authorization in Kusto](./kusto/management/access-control/role-based-authorization.md).     |Permanent           |
|BadRequest\_DatabaseAccessDenied                   |Access to database is denied.<br>For more information, see [Role-based Authorization in Kusto](./kusto/management/access-control/role-based-authorization.md).                                                                               |Permanent           |
|
|---------**Category: DownloadFailed**--------- 
|
|Download\_NotTransient                             |Failed to download source from Azure storage. Not transient error occurred                   |Permanent           |
|Download\_UnknownError                             |Failed to download source from Azure storage. Unknown error occurred              |Transient           |
|
|---------**Category: EntityNotFound**---------
|
|BadRequest\_MappingReferenceWasNotFound            |Mapping reference wasn't found.   |Permanent           |
|BadRequest\_DatabaseNotExist                       |Database doesn't exist.          |Permanent           |
|BadRequest\_TableNotExist                          |Table doesn't exist.          |Permanent           |
|BadRequest\_EntityNotFound                         |Azure Data Explorer entity (such as mapping, database, or table) wasn't found.           |Permanent           |
|
|---------**Category: FileTooLarge**---------                                      
|
|Stream\_InputStreamTooLarge                        |The total size of the input data or a single field in the data is too large. HRESULT: 0x80DA0009                 |Permanent          |
|BadRequest\_FileTooLarge                           |Blob size has exceeded the size limit allowed for ingestion.<br>For more information about the size limit for ingestion, see [Azure Data Explorer data ingestion overview](/ingest-data-overview.md#Comparing-ingestion-methods-and-tools). |Permanent           |
|
|---------**Category: InternalServiceError**---------
|
|General\_InternalServerError                       |Internal server error occurred.                     |Transient          |
|General\_TransientSchemaMismatch                   |Schema of target table at start time doesn't match the schema at commit time.         |Transient           |
|Timeout                                            |The operation has been aborted because of timeout.     |Transient           |
|
|---------**Category: Unknown**---------
|
|Unknown                                            |Unknown error occurred.                             |Transient          |
|
|---------**Category: UpdatePolicyFailure**---------                               |
|
|UpdatePolicy\_QuerySchemaDoesNotMatchTableSchema   |Failed to invoke update policy. Query schema doesn't match table schema.     |Permanent           |
|UpdatePolicy\_FailedDescendantTransaction          |Failed to invoke update policy. Failed descendant transactional update policy.    |Transient           |
|UpdatePolicy\_IngestionError                       |Failed to invoke update policy. Ingestion Error occurred.<br>The error is reported on the source table of the update policy.     |Transient          |
|UpdatePolicy\_UnknownError                         |Failed to invoke update policy. Unknown error occurred.<br>The error is reported on the target table of update policy.    |Transient           |
|UpdatePolicy\_Cyclic\_Update\_Not\_Allowed         |Failed to invoke update policy. Cyclic update isn't allowed.      |Permanent           |
|
|---------**Category: UserAccessNotAuthorized**---------
|                                                   
|BadRequest\_InvalidKustoIdentityToken              |Invalid Kusto identity token.                                                                                 |Permanent           |
|Forbidden                                          |Insufficient security permissions to execute request. |
| ---------**Category: Other non errors**---------
|
|Skipped_IngestByTagAlreadyExists | Another stream with the same ingest-by tag was already ingested. <br> For more information about ingest-if-not-exists by tag, see [ingest-by tag](./kusto/management/extents-overview.md#ingest-by-extent-tags). |	Permanent |
| General_AbandonedIngestion |The operation has been abandoned during execution as the system was transiently not able to complete it. Retry is automatically triggered. |Transient|
