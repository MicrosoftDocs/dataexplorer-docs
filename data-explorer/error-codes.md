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

The following is a list of error codes you may encounter during [ingestion](ingest-data-overview.md). The **Manifest constant** field can be found in your [ingestion fail log](kusto/management/ingestionfailures.md), and is organized here by **Category**. These categories are shown in the ingestion result [metrics](using-metrics.md). If the field **Is permanent** equals 1, the error is not transient, and will not be resolved by retrying ingestion.

|Manifest constant                                  |Description                                           |Is permanent|
|---------------------------------------------------|--------------------------|------------|
| ---------**Category: BadFormat**---------                                          |
|
|Stream\_WrongNumberOfFields                        |Inconsistent number of fields in the input records. HRESULT: 0x80DA0008      |1           |
|Stream\_ClosingQuoteMissing                        |Invalid CSV format. Closing quote is missing. HRESULT: 0x80DA000b            |1           |
|BadRequest\_InvalidBlob                            |Blob is invalid.                                                              |1           |
|BadRequest\_EmptyArchive                           |Archive is empty.                                                             |1           |
|BadRequest\_InvalidArchive                         |Archive is invalid.                                                           |1           |
|BadRequest\_InvalidMapping                         |Failed to parse ingestion mapping.<br>For more information about how to write ingestion mapping, see [Data mappings](./kusto/management/mappings.md).   |1           |
|BadRequest\_InvalidMappingReference                |Invalid mapping reference.            |1           |
|BadRequest\_FormatNotSupported                     |Format isn't supported. Some data connections don't support all formats.<br>For more information about data formats supported by Azure Data Explorer for ingestion, see [Supported data formats](ingestion-supported-formats.md). |1           |
|BadRequest\_InconsistentMapping                    |Supported ingestion mapping isn't consistent with the existing table schema. |1           |
|BadRequest\_UnexpectedCharacterInInputStream       |Unexpected character in the input stream.                                     |1           |
|
|---------**Category: BadRequest**--------- |
|                        
|BadRequest\_EmptyBlob                              |Blob is empty.                                                               |1           |
|BadRequest\_EmptyBlobUri                           |Blob Uri is empty.                                                           |1           |
|BadRequest\_DuplicateMapping                       |Ingestion properties include both ingestionMapping and ingestionMappingReference, which isn't valid.              |1           |
|BadRequest\_InvalidOrEmptyTableName                |Table name is empty or invalid.<br>For more information about Azure Data Explorer naming convention, see [Entity names](./kusto/query/schema-entities/entity-names.md).    |1           |
|BadRequest\_EmptyDatabaseName                      |Database name is empty.             |1           |
|BadRequest\_EmptyMappingReference                  |Some formats should get ingestion mapping to be ingested and the mapping reference is empty.<br>For more information about mapping, see [Data Mapping](./kusto/management/mappings.md).        |1           |
|Stream\_NoDataToIngest                             |Found no data to ingest.<br>For data in JSON format, this error may indicate that the JSON format was invalid.        |1           |
|Stream\_DynamicPropertyBagTooLarge                 |The data contains too large values in a dynamic column. HRESULT: 0x80DA000E         |1           |
|Download\_BadRequest                               |Failed to download source from Azure Storage because of bad request.    |1           |
|BadRequest\_MissingMappingtFailure                 |Avro and Json formats must be ingested with ingestionMapping or ingestionMappingReference parameter .         |1           |
|BadRequest\_MessageExhausted                       |Failed to ingest data since ingestion reached the maximum retry attempts or the maximum retry period.<br>Retrying ingestion may succeed.   |0           |
|General\_BadRequest                                |Bad request.            |1           |
|BadRequest\_CorruptedMessage                       |Message is corrupted.    |1           |
|BadRequest\_SyntaxError                            |Request syntax error.     |1           |
|BadRequest\_ZeroRetentionPolicyWithNoUpdatePolicy  |Table has zero retention policy and isn't the source table for any update policy .    |1           |
|BadRequest\_CreationTimeEarlierThanSoftDeletePeriod|Creation time that was specified for ingestion, isn't within the SoftDeletePeriod.<br>For more information about SoftDeletePeriod, see [The policy object](./kusto/management/retentionpolicy.md#the-policy-object).  |1   |
|BadRequest\_NotSupported                           |Request not supported .    |1           |
|Download\_SourceNotFound                           |Failed to download source from Azure Storage. Source not found.       |1       |
|BadRequest\_EntityNameIsNotValid                   |Entity name isn't valid.<br>For more information about Azure Data Explorer naming convention, see [entity names](./kusto/query/schema-entities/entity-names.md).    |1           |
|BadRequest\_MalformedIngestionProperty              |Ingestion property is malformed.    |1           |
|
|---------**Category: DataAccessNotAuthorized**---------                            |
|                                                   
|Download\_AccessConditionNotSatisfied              |Failed to download source from Azure storage. Access condition not satisfied.     |1           |
|Download\_Forbidden                                |Failed to download source from Azure storage. Access forbidden.    |1           |
|Download\_AccountNotFound                          |Failed to download source from Azure storage. Account not found.    |1           |
|BadRequest\_TableAccessDenied                      |Access to table is denied.<br>For more information, see [Role-based Authorization in Kusto](./kusto/management/access-control/role-based-authorization.md).     |1           |
|BadRequest\_DatabaseAccessDenied                   |Access to database is denied.<br>For more information, see [Role-based Authorization in Kusto](./kusto/management/access-control/role-based-authorization.md).                                                                               |1           |
|
|---------**Category: DownloadFailed**--------- 
|
|Download\_NotTransient                             |Failed to download source from Azure storage. Not transient error .occurred                                                                                                                                                                                                                    |1           |
|Download\_UnknownError                             |Failed to download source from Azure storage. Unknown error. occurred                                                                                                                                                                                                                          |0           |
|
|---------**Category: EntityNotFound**---------
|
|BadRequest\_MappingReferenceWasNotFound            |Mapping reference wasn't found.   |1           |
|BadRequest\_DatabaseNotExist                       |Database doesn't exist.          |1           |
|BadRequest\_TableNotExist                          |Table doesn't exist.          |1           |
|BadRequest\_EntityNotFound                         |Azure Data Explorer entity (such as mapping, database, or table) wasn't found.           |1           |
|
|---------**Category: FileTooLarge**---------                                      
|
|Stream\_InputStreamTooLarge                        |The total size of the input data or a single field in the data is too large. HRESULT: 0x80DA0009                 |1           |
|BadRequest\_FileTooLarge                           |Blob size has exceeded the size limit allowed for ingestion.<br>For more information about the size limit for ingestion, see [Azure Data Explorer data ingestion overview](/ingest-data-overview.md#Comparing-ingestion-methods-and-tools). |1           |
|
|---------**Category: InternalServiceError**---------
|
|General\_InternalServerError                       |Internal server error occurred.                     |0           |
|General\_TransientSchemaMismatch                   |Schema of target table at start time doesn't match the schema at commit time.         |0           |
|Timeout                                            |The operation has been aborted because of timeout.     |0           |
|
|---------**Category: Unknown**---------
|
|Unknown                                            |Unknown error occurred.                             |0           |
|
|---------**Category: UpdatePolicyFailure**---------                               |
|
|UpdatePolicy\_QuerySchemaDoesNotMatchTableSchema   |Failed to invoke update policy. Query schema doesn't match table schema.     |1           |
|UpdatePolicy\_FailedDescendantTransaction          |Failed to invoke update policy. Failed descendant transactional update policy.    |0           |
|UpdatePolicy\_IngestionError                       |Failed to invoke update policy. Ingestion Error occurred.<br>The error is reported on the source table of the update policy.     |0           |
|UpdatePolicy\_UnknownError                         |Failed to invoke update policy. Unknown error occurred.<br>The error is reported on the target table of update policy.    |0           |
|UpdatePolicy\_Cyclic\_Update\_Not\_Allowed         |Failed to invoke update policy. Cyclic update isn't allowed.      |1           |
|
|---------**Category: UserAccessNotAuthorized**---------
|                                                   
|BadRequest\_InvalidKustoIdentityToken              |Invalid Kusto identity token.                                                                                 |1           |
|Forbidden                                          |Insufficient security permissions to execute request.
|
| ---------**Category: Other**---------
|
|Skipped_IngestByTagAlreadyExists | Another stream with the same ingest-by tag was already ingested. <br> For more information about ingest-if-not-exists by tag, see [ingest-by tag](./kusto/management/extents-overview.md#ingest-by-extent-tags). |	1 |
| General_AbandonedIngestion |The operation has been abandoned during execution as the system was transiently not able to complete it. Retry is automatically triggered. | 0|
