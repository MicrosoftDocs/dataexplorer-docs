---
title: Query data using MATLAB
description: Learn how to query data stored in Azure Data Explorer from within MATLAB.
ms.reviewer: ramacg
ms.topic: how-to
ms.date: 07/11/2023
---

# Query data using MATLAB

MATLAB is a programming and numeric computing platform used to analyze data, develop algorithms, and create models. This article explains how to get an authorization token in MATLAB for Azure Data Explorer, and how to use the token to interact with your cluster.

## Prerequisites

Select the tab for the operating system used to run MATLAB.

### [Windows OS](#tab/windows)

1. Download the [Microsoft Identity Client](https://www.nuget.org/packages/Microsoft.Identity.Client) and the [Microsoft Identity Abstractions](https://www.nuget.org/packages/Microsoft.IdentityModel.Abstractions) packages from NuGet.

1. Extract the downloaded packages and DLL files from *lib\net45* to a folder of choice. In this article, we'll use the folder *C:\Matlab\DLL*.

### [Linux](#tab/linux)

1. Install [JDK 8](https://openjdk.org/projects/jdk8u/) and [Maven](https://maven.apache.org).

1. Clone the [MATLAB Interface for Azure Services](https://github.com/mathworks-ref-arch/matlab-azure-services) repository:

    ```bash
    git clone https://github.com/mathworks-ref-arch/matlab-azure-services.git
    ```

1. Build the MATLAB Azure SDK jar:

    ```bash
    cd matlab-azure-services/Software/Java
    mvn clean package
    ```

    The build should produce the file: `Software/MATLAB/lib/jar/azure-common-sdk-0.2.0.jar`.

1. In the MATLAB studio, load the jar file and add it to the java static class path:

    ```matlab
    edit(fullfile(prefdir,'javaclasspath.txt'));
    ```

1. In java static class path file, add an entry corresponding to the jar file:

    ```txt
    (full-path)/matlab-azure-services/Software/MATLAB/lib/jar/azure-common-sdk-0.2.0.jar
    ```

1. Restart the MATLAB IDE. Once reloaded, run the *startup.m* script available at *matlab-azure-services\Software\MATLAB\startup.m*. This ensures all the prerequisite functions are set up for access to Azure services. The output should look as follows:

    ```bash
    >> startup
    Adding Azure Paths
    ------------------
    Adding: matlab-azure-services/Software/MATLAB/app
    Adding: matlab-azure-services/Software/MATLAB/app/functions
    Adding: matlab-azure-services/Software/MATLAB/app/system
    Adding: matlab-azure-services/Software/MATLAB/lib
    Adding: matlab-azure-services/Software/MATLAB/config
    Skipping: matlab-azure-services/Software/Utilities
    Checking the static Java classpath for: matlab-azure-services/Software/MATLAB/lib/jar/azure-common-sdk-0.2.0.jar
    Found: azure-common-sdk-0.2.0.jar
    ```

---

## Perform user authentication

With user authentication, the user is prompted to sign-in through a browser window. Upon successful sign-in, a user authorization token is granted. This section shows how to configure this interactive sign-in flow.

To perform user authentication:

### [Windows OS](#tab/windows)

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

1. Create an *Auth.json* file in your working directory with the relevant credentials. The KustoClientAppId  returned from `https://<adx-cluster>.kusto.windows.net/v1/rest/auth/metadata` needs to be replaced with the value of ClientId below:

    ```json
    {
        "AuthMethod": "InteractiveBrowser",
        "TenantId" : "<AAD Tenant / Authority ID for the login>",
        "ClientId" : "<Client ID>",
        "RedirectUrl": "http://localhost:8675"
    }
    ```

1. Query your cluster as follows:

    ```matlab
    % References the credential file created in the previous step
    credentials = configureCredentials('Auth.json');

    % Point the scopes to the ADX cluster that we want to query
    request = azure.core.credential.TokenRequestContext();
    request.addScopes('<https://adx-cluster-changeme.kusto.windows.net/.default>');
    token=credentials.getToken(request);

    % Prepare to query the cluster
    options=weboptions('HeaderFields',{'RequestMethod','POST';'Accept' 'application/json';'Authorization' ['Bearer ', token.getToken()]; 'Content-Type' 'application/json; charset=utf-8'; 'Connection' 'Keep-Alive'; 'x-ms-app' 'Matlab'; 'x-ms-client-request-id' 'Matlab-Query-Request'});

    % The DB and KQL variables represent the database and query to execute
    querydata = struct('db', "<DB>", 'csl', "<KQL>");
    querryresults  = webwrite('<https://adx-cluster-changeme.kusto.windows.net/v2/rest/query>', querydata, options);

    % The results row can be extracted as follows
    results=querryresults{3}.Rows
    ```

---

## Perform application authentication

Azure AD application authorization can be used for scenarios where interactive sign-in isn't desired and automated runs are necessary.

To perform application authentication:

### [Windows OS](#tab/windows)

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

1. Use the [ConfidentialClientApplicationBuilder](/dotnet/api/microsoft.identity.client.confidentialclientapplicationbuilder) to perform a non-interactive automated sign-in with the Azure AD application:

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
    
    % Get the token from the service and cache it until it expires
    tokenAcquirer = app.AcquireTokenForClient(scopes);
    result = tokenAcquirer.ExecuteAsync;

    % Extract the token and when it expires
    % retrieve the returned token
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

1. Create an *Auth.json* file in your working directory with the relevant credentials:

    ```json
    {
        "AuthMethod": "ClientSecret",
        "TenantId" : "<AAD Tenant / Authority ID for the login>",
        "ClientId" : "<Client ID of the Azure AD application>",
        "ClientSecret": "<Client Key of the Azure AD application>",
        "RedirectUrl": "http://localhost:8675"
    }
    ```

1. Query your cluster as follows:

    ```matlab
    % References the credential file created in the previous step
    credentials = configureCredentials('Auth.json');

    % Point the scopes to the ADX cluster that we want to query
    request = azure.core.credential.TokenRequestContext();request.addScopes('<https://adx-cluster-changeme.kusto.windows.net/.default>');
    token=credentials.getToken(request);

    % Prepare to query the cluster
    options=weboptions('HeaderFields',{'RequestMethod','POST';'Accept' 'application/json';'Authorization' ['Bearer ', token.getToken()]; 'Content-Type' 'application/json; charset=utf-8'; 'Connection' 'Keep-Alive'; 'x-ms-app' 'Matlab'; 'x-ms-client-request-id' 'Matlab-Query-Request'});

    % The DB and KQL variables represent the database and query to execute
    querydata = struct('db', "<DB>", 'csl', "<KQL>");
    querryresults  = webwrite('<https://adx-cluster-changeme.kusto.windows.net/v2/rest/query>', querydata, options);

    % The results row can be extracted as follows
    results=querryresults{3}.Rows
    ```

---

## Next steps

* Query your cluster with the [REST API](kusto/api/rest/index.md)
