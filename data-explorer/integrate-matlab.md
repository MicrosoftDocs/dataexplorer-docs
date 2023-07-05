---
title: Integrate MATLAB with Azure Data Explorer
description: This article describes how to integrate MATLAB with Azure Data Explorer.
ms.reviewer: ramacg
ms.topic: how-to
ms.date: 07/05/2023
---

# Integrate MATLAB with Azure Data Explorer

MATLAB is a programming and numeric computing platform used to analyze data, develop algorithms, and create models. This article explains how to get an authorization token in MATLAB for Azure Data Explorer, and how to use the token to interact with your cluster.

## Prerequisites

The prerequisites vary based on the operating system used to run MATLAB. To get started, select the relevant tab.

### [Windows OS](#tab/windows)

1. Download the [Microsoft Identity Client](https://www.nuget.org/packages/Microsoft.Identity.Client) and the [Microsoft Identity Abstractions](https://www.nuget.org/packages/Microsoft.IdentityModel.Abstractions) packages from NuGet.

1. Extract the downloaded packages and DLL files from *lib\net45* to a folder of choice. In this guide, we'll use the folder *C:\Matlab\DLL*.

### [Linux](#tab/linux)


---

## Perform user authentication

With user authentication, the user is prompted to sign-in through a browser window. Upon successful sign-in, a user authorization token is granted. This section shows how to configure this interactive sign-in flow. 

Select the relevant tab.

### [Windows OS](#tab/windows)

To perform user authentication:

1. Define the constants needed for the authorization. For more information about these values, see [Authentication parameters](kusto/api/rest/authenticate-with-msal.md#authentication-parameters).

    ```matlab
    % The Azure Data Explorer cluster URL
    clusterUrl = 'https://<adx-cluster>.kusto.windows.net';
    % The Azure AD tenant ID
    tenantId = '';
    % Send a request to https://<adx-cluster>.kusto.windows.net/v1/rest/auth/metadata
    % The appId should be the value of KustoClientAppId
    appId = '';
    % The Azure AD scopes
    scopesToUse = strcat(clusterUrl,'/.default ');
    ```

1. In MATLAB studio, load the extracted DLL files:

    ```matlab
    % Access the folder that contains the DLL files
    dllFolder = fullfile("C:","Matlab","DLL");
    
    % Load the referenced assemblies in the MATLAB session
    matlabDllFiles = dir(fullfile(dllFolder,'*.dll'));
    for k = 1:length(matlabDllFiles)
        baseFileName = matlabDllFiles(k).name;
        fullFileName = fullfile(dllFolder,baseFileName);
        fprintf(1, 'Reading  %s\n', fullFileName);

        % Load the downloaded assembly in MATLAB
        NET.addAssembly(fullFileName);
    ```

1. Use the [PublicClientApplicationBuilder](/dotnet/api/microsoft.identity.client.publicclientapplicationbuilder) to prompt a user interactive sign-in:

    ```matlab
    % Create an PublicClientApplicationBuilder
    app = Microsoft.Identity.Client.PublicClientApplicationBuilder.Create(appId)...
        .WithAuthority(Microsoft.Identity.Client.AzureCloudInstance.AzurePublic,tenantId)...
        .WithRedirectUri('http://localhost:8675')...
        .Build();

    % System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
    NET.setStaticProperty ('System.Net.ServicePointManager.SecurityProtocol',System.Net.SecurityProtocolType.Tls12)
    % Start with creating a list of scopes
    scopes = NET.createGeneric('System.Collections.Generic.List',{'System.String'});
    % Add the actual scopes
    scopes.Add(scopesToUse);
    fprintf(1, 'Using appScope  %s\n', scopesToUse);
    
    % Get the token from the service
    % and show the interactive dialog in which the user can login
    tokenAcquirer = app.AcquireTokenInteractive(scopes);
    result = tokenAcquirer.ExecuteAsync;
    
    % Extract the token and when it expires
    % and retrieve the returned token
    token = char(result.Result.AccessToken);
    fprintf(2, 'User token aquired and will expire at %s & extended expires at %s', result.Result.ExpiresOn.LocalDateTime.ToString,result.Result.ExtendedExpiresOn.ToLocalTime.ToString);
    ```

1. Use the authorization token to query your cluster through the [REST API](kusto/api/rest/index.md):

    ```matlab
    options=weboptions('HeaderFields',{'RequestMethod','POST';'Accept' 'application/json';'Authorization' ['Bearer ', token]; 'Content-Type' 'application/json; charset=utf-8'; 'Connection' 'Keep-Alive'; 'x-ms-app' 'Matlab'; 'x-ms-client-request-id' 'Matlab-Query-Request'});

    % The DB and KQL variables represent the database and query to execute
    querydata = struct('db', "<DB>", 'csl', "<KQL>");
    querryresults  = webwrite("https://sdktestcluster.westeurope.dev.kusto.windows.net/v2/rest/query", querydata, options);

    % Extract the results row
    results=querryresults{3}.Rows
    ```

### [Linux](#tab/linux)

---

## Perform application authentication

Azure AD application authorization can be used for scenarios where interactive sign-in isn't desired and automated runs are necessary.

Select the relevant tab.

### [Windows OS](#tab/windows)

To perform application authentication:

1. [Provision an Azure AD application](provision-azure-ad-app.md). For the **Redirect URI**, select **Web** and input http://localhost:8675 as the URI.

1. Define the constants needed for the authorization. For more information about these values, see [Authentication parameters](kusto/api/rest/authenticate-with-msal.md#authentication-parameters).

    ```matlab
    % The Azure Data Explorer cluster URL
    clusterUrl = 'https://<adx-cluster>.kusto.windows.net';
    % The Azure AD tenant ID
    tenantId = '';
    % The Azure AD application ID and key
    appId = '';
    appSecret = '';
    ```

1. In MATLAB studio, load the extracted DLL files:

   ```matlab
    % Access the folder that contains the DLL files
    dllFolder = fullfile("C:","Matlab","DLL");
    
    % Load the referenced assemblies in the MATLAB session
    matlabDllFiles = dir(fullfile(dllFolder,'*.dll'));
    for k = 1:length(matlabDllFiles)
        baseFileName = matlabDllFiles(k).name;
        fullFileName = fullfile(dllFolder,baseFileName);
        fprintf(1, 'Reading  %s\n', fullFileName);
    
        % Load the downloaded assembly
        NET.addAssembly(fullFileName);
   ```

1. Use the [ConfidentialClientApplicationBuilder](/dotnet/api/microsoft.identity.client.confidentialclientapplicationbuilder) to perform a non-interactive automated login with the Azure AD application:

    ```matlab
    %  Create an ConfidentialClientApplicationBuilder
    app = Microsoft.Identity.Client.ConfidentialClientApplicationBuilder.Create(appId)...
        .WithAuthority(Microsoft.Identity.Client.AzureCloudInstance.AzurePublic,tenantId)...
        .WithRedirectUri('http://localhost:8675')...
        .WithClientSecret(appSecret)...
        .Build();

    % System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
    NET.setStaticProperty ('System.Net.ServicePointManager.SecurityProtocol',System.Net.SecurityProtocolType.Tls12)
    % Start with creating a list of scopes
    scopes = NET.createGeneric('System.Collections.Generic.List',{'System.String'});
    % Add the actual scopes
    scopes.Add(scopesToUse);
    fprintf(1, 'Using appScope  %s\n', scopesToUse);
    
    % Get the token from the service
    % and show the interactive dialog in which the user can login
    tokenAcquirer = app.AcquireTokenInteractive(scopes);
    result = tokenAcquirer.ExecuteAsync;
    
    % Extract the token and when it expires
    % Retrieve the returned token
    token = char(result.Result.AccessToken);
    fprintf(2, 'User token aquired and will expire at %s & extended expires at %s', result.Result.ExpiresOn.LocalDateTime.ToString,result.Result.ExtendedExpiresOn.ToLocalTime.ToString);
    ```

1. Use the authorization token to query your cluster through the [REST API](kusto/api/rest/index.md):

    ```matlab
    options=weboptions('HeaderFields',{'RequestMethod','POST';'Accept' 'application/json';'Authorization' ['Bearer ', token]; 'Content-Type' 'application/json; charset=utf-8'; 'Connection' 'Keep-Alive'; 'x-ms-app' 'Matlab'; 'x-ms-client-request-id' 'Matlab-Query-Request'});

    % The DB and KQL variables represent the database and query to execute
    querydata = struct('db', "<DB>", 'csl', "<KQL>");
    querryresults  = webwrite("https://sdktestcluster.westeurope.dev.kusto.windows.net/v2/rest/query", querydata, options);

    % Extract the results row
    results=querryresults{3}.Rows
    ```

---

## Next steps
