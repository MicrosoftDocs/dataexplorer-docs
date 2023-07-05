---
title: Integrate MATLAB with Azure Data Explorer
description: This article describes how to integrate MATLAB with Azure Data Explorer.
ms.reviewer: ramacg
ms.topic: how-to
ms.date: 07/05/2023
---

# Integrate MATLAB with Azure Data Explorer

MATLAB is a programming and numeric computing platform used to analyze data, develop algorithms, and create models. In this article, you'll learn how to obtain an Azure Active Directory (Azure AD) authentication token for Azure Data Explorer in MATLAB. Then, you can use the token to interact with Azure Data Explorer through the [Azure Data Explorer REST API](kusto/api/rest/index.md).

## How to authenticate a user

To authenticate a user, an interactive authentication flow prompts the user to sign-in through a browser window. Upon successful sign-in, a user authorization token is granted.

In this section, learn how to authenticate users with MSAL.NET for .NET-based applications and MSAL4J or Matlab-Azure for Java-based applications. If you're running MATLAB on a Windows OS, use MSAL.NET. If you're running MATLAB on Linux, use MSAL4J or Matlab-Azure.

Choose the tab relevant for your operating system.

### [Windows OS](#tab/windows)

To use MSAL.NET to perform user authentication in MATLAB:

1. Download the [Microsoft Identity Client](https://www.nuget.org/packages/Microsoft.Identity.Client) and the [Microsoft Identity Abstractions](https://www.nuget.org/packages/Microsoft.IdentityModel.Abstractions) packages from Nuget.

1. Extract the downloaded packages and DLL files from *lib\net45* to a folder of choice. In this guide, we will use the folder *C:\Matlab\DLL*.

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

1. Use the [PublicClientApplicationBuilder](/dotnet/api/microsoft.identity.client.publicclientapplicationbuilder) to prompt a user interactive login:

    ```matlab
    % Create an PublicClientApplicationBuilder
    app = Microsoft.Identity.Client.PublicClientApplicationBuilder.Create(appId)
        .WithAuthority(Microsoft.Identity.Client.AzureCloudInstance.AzurePublic,tenantId)
        .WithRedirectUri('http://localhost:8675')
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

1. Use the authorization token to query your cluster:

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

## How to authenticate an application

Azure AD application authorization can be used for scenarios where interactive login is not desired and automated runs are necessary.

To get an Azure AD application token and leverage it to query your cluster:

1. [Provision an Azure AD application](provision-azure-ad-app.md). For the **Redirect URI**, select **Web** and input http://localhost:8675 as the URI.

1. Download the [Microsoft Identity Client](https://www.nuget.org/packages/Microsoft.Identity.Client) and the [Microsoft Identity Abstractions](https://www.nuget.org/packages/Microsoft.IdentityModel.Abstractions) packages from Nuget.

1. Extract the downloaded packages and DLL files from *lib\net45* to a folder of choice. In this guide, we will use the folder *C:\Matlab\DLL*.

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

## Next steps
