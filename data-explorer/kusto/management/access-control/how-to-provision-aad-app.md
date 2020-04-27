---
title: HowTo -  Creating an AAD application - Azure Data Explorer | Microsoft Docs
description: This article describes HowTo -  Creating an AAD application in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/18/2020
---
# HowTo: Creating an AAD application

While AAD user authentication is very easy (because users are defined in AAD by
the tenant admin, such as MSIT), AAD application authentication
is somewhat more complex. This is because it requires you to create and register the application
with AAD. This process is described below in some details.

AAD application authentication is useful for applications that need to access Kusto without a user being
logged-on or present (e.g., an unattended service or a scheduled flow).

Client applications and middle-tier applications that have interactive user context should avoid this model. This is becuase authorization is performed based on the AAD
application identity instead of user identity, so the calling application will need to implement its own authorization logic to prevent misuse.

## Application Authentication use cases

There two main scenarios that make use of application authentication:
* Applications that contact the Kusto service directly and on their own behalf
* Applications that will authenticate their users to Kusto (delegated authentication)

## 1. Provisioning a new application

#### Register the new application

1. Log in to [Azure portal](https://portal.azure.com) and open the `Azure Active Directory` blade.

    :::image type="content" source="images/aad-create-app-step-0.png" alt-text="Aad create app step 0":::

1. Choose `App registrations` and when the blade loads, select `New application registration`.

    :::image type="content" source="images/aad-create-app-step-1.png" alt-text="Aad create app step 1":::

1. Fill in the application details:
    * Name
    * Type: set to `Web app/API`
    * Sign-on URL: the URL used by users to access the application. AAD does not validate the URL,<br>
        but mandates that you provide a value. So if the application does not have any URL accessible by users,<br>
        enter a URL that belongs to the application (such as https://<APP-CNAME> or https://<CLOUD-SERVICE-NAME>.cloudapp.net).<br>
        You can even provide a value and continue if the application hasn't been written yet.

    
    :::image type="content" source="images/aad-create-app-step-2.png" alt-text="Aad create app step 2":::

1. Once your application is ready, open its `Settings` blade.

    :::image type="content" source="images/aad-create-app-step-3.png" alt-text="Aad create step 3":::

1. On the `Keys` blade, set up the authentication for your new application:
    * If you want to use a shared key, select key duration from the drop-down menu and copy the key when it gets generated.
        You will not be able to restore this key.
    * Alternatively, use an X509 certificate to authenticate your application.
        To do so, select `Upload Public Key` and follow the instructions to upload the public portion of the certificate.
    * Don't forget to select `Save` when you're done.

    :::image type="content" source="images/aad-create-app-step-4.png" alt-text="Aad create app step 4":::

Your application is set up. If all you need is access to Kusto with the newly created application, you are done.

#### Set up delegated permissions for Kusto service application

If you need the application to be able to perform user or app authentication for Kusto access, you need to set up trust between your application and Kusto:

1. On the `Required permissions` blade, select `Add`.

    :::image type="content" source="images/aad-create-app-step-5.png" alt-text="Aad create app step 5":::
   
1. Choose `Select an API`, enter `KustoService` in the filter box and select `KustoService (Kusto)`.
1. If your Kusto clusters require MFA, enter `KustoMFA` in the filter box and select `KustoServiceMFA (KustoMFA)`.

    :::image type="content" source="images/aad-create-app-step-6.png" alt-text="Aad create app step 6":::

1. After confirming your selection, choose delegated permissions for `Access Kusto`.

   :::image type="content" source="images/aad-create-app-step-7.png" alt-text="Aad create app step 7":::

1. Select `Done` to complete the process.


### 2. Set permissions to the application on Kusto cluster

> Before using your newly provisioned application, verify it resolves from Graph API.<br>
    It can take up to several hours for the AAD changes to propagate.

1. Access your database admin to grant permissions to the new app.
Look at [Managing database principals](../security-roles.md) section for the details about setting the permissions.<br>
For setting up ingestion permissions, see [Ingestion Permissions](../../api/netfx/kusto-ingest-client-permissions.md).
1. Add a connection to this service in your Kusto Explorer, if you don't yet have it.

### 3. Application can now access Kusto

When using your newly provisioned application to access Kusto clusters using Kusto client libraries, specify the following connection string (if you chose to authenticate with a shared key):

`https://`*ClusterDnsName*`/;Federated Security=True;Application Client Id=`*ApplicationClientId*`;Application Key=`*ApplicationKey*


### Appendix A: AAD Errors

#### AAD Error AADSTS650057

If your application is used to authenticate users or applications for Kusto access, you must set up delegated permissions for Kusto service application, i.e. declare that your application can authenticate users or applications for Kusto access.
Not doing so will result in an error similar to the following, when an authentication attempt is made:

`AADSTS650057: Invalid resource. The client has requested access to a resource which is not listed in the requested permissions in the client's application registration...`

You will need to follow the instructions on [setting up delegated permissions for Kusto service application](#set-up-delegated-permissions-for-kusto-service-application).

#### Enable user consent if needed

Your AAD tenant administrator may enact a policy that prevents tenant users from giving consent to applications. This will result in an error similar to the following, when a user tries to login to your application:

`AADSTS65001: The user or administrator has not consented to use the application with ID '<App ID>' named 'App Name'`

You will need to ask your AAD administrator to grant consent for all users in the tenant, or enable user consent for your specific application.

### Appendix B: Advanced topics and troubleshooting

* See [Kusto connection strings](../../api/connection-strings/kusto.md) documentation for full reference of supported connection strings
