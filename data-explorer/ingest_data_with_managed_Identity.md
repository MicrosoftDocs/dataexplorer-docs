# Ingest data with managed identity authentication
When [ingesting blobs]() `TBD link to how-to-guides ingest-data doc goes here` from customer owned storage accounts, Managed Identities can be used as an authentication method alternative to Storage SAS Tokens and Account Keys.
This allows for a more secure way of ingesting data, as customer SAS Tokens and Account Keys are not shared with Kusto. Instead a managed identity assigned to the Kusto Cluster is granted read permissions over the customer storage accounts and is used to upload the data to Kusto. This permission can be revoked by the customer at any time.

Note!
This method of authentication is only possible for blobs residing in customer owned accounts. It does not apply to local files uploaded by Kusto SDK to the service staging accounts.

## Assign a managed identity to your cluster
Follow [Configure managed identities on your cluster]() `TBD Link to section here` to add a System or User Assigned managed identity to your cluster. 
If your cluster already has the desired managed identity assigned to it, copy its object Id from the Azure Portal's MI overview page.

`TBD Image of MI with principal ID here`

## Grant Permissions to Managed Identity: 

On Azure Portal, navigate to the storage account you wish to ingest from. Open the in the 'Add Role Assignment' blade, and grant the chosen managed Identity `Storage Blob Data Reader` permissions to the storage account.

Note!
Granting `Owner` or `Contributor` permissions are not sufficient!

`TBD Image of SA Role assignment tab`


## Set the managed identity policy in ADX 

In order to use the managed identity to ingest data into Kusto, the `NativeIngestion` policy must be allowed for the selected managed identity. 
The policy can be defined in the Cluster or Database level of the target Kusto cluster. 

For database level run: 

```
.alter-merge database <database name> policy managed_identity "[ { 'ObjectId' : '{Managed identity principal Id}', 'AllowedUsages' : 'NativeIngestion' }]" 
```

For cluster level run: 
```
.alter-merge cluster policy managed_identity "[ { 'ObjectId' : '{Managed identity object Id}', 'AllowedUsages' : 'NativeIngestion' }]" 
```
 
Note!
In order to secure the use of managed identities in Kusto, changing the above policies require `All Database Admin' permissions on the Kusto Database. 

## Ingest blobs using Kusto SDK 

When [ingesting the data using one of Kusto SDKs]() `TBD Link to ingest how to guides - ingest data - using SDKs`, instead of creating a blob URI with SAS or Account Key, append `;managed_identity={objectId}` to the blob URI. 
If you ingest data with the System Assigned Managed Id of your Kusto cluster, you can simply append `;managed_identity=system` to the blob URI. e.g. 

```
# A blob authorized by a user assigned managed identity 
"https://demosa.blob.core.windows.net/test/export.csv;managed_identity=6a5820b9-fdf6-4cc4-81b9-b416b444fd6d"

# A blob authorized by the system assigned managed identity 
"https://demosa.blob.core.windows.net/test/export.csv;managed_identity=system"
```

Note!
- When using Managed Identities to ingest data with the C# SDK, you must provide a blob size in `BlobSourceOptions`. If the size is not set, the SDK attempts to fill in the blob size by accessing the SA resulting in a failure. 
- The size parameter should correspond to the raw (uncompressed) data size, and not necessarily to the blob size.
- If you do not know the size at the time of ingestion, you may provide a value of zero (0). Kusto service will attempt to discover the size for you using the managed identity for authentication. 
