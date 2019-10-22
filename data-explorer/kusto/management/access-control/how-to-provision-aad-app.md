---
title: HowTo Creating an AAD Application - Azure Data Explorer | Microsoft Docs
description: This article describes HowTo Creating an AAD Application in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 07/25/2019

---
# HowTo Creating an AAD Application

While AAD user authentication is very easy (as users are defined in AAD by
the tenant admin, such as MSIT in case of Microsoft), AAD application authentication
is somewhat more complex, because it requires creating and registering the application
with AAD. As this process is unfamiliar to many people, it is described here in some details.

AAD application authentication is useful for applications that need to access Kusto without a user being
logged-on or present (e.g., an unattended service or a scheduled flow).

Client applications and middle-tier applications that have an interactive user context should avoid this model, as authorization is performed based on the AAD
application identity instead of user identity, so the calling application will need to implement its own authorization logic to prevent misuse.

## Application Authentication use cases

We can distinguish two main scenarios that make use of application authentication:
* Applications that are intended to contact the Kusto service directly and on their own behalf
* Applications that will authenticate their users to Kusto (delegated authenticaion)

## 1. Provisioning a new application

#### Register the new application

* Log in to [Azure portal](https://portal.azure.com) and open the `Azure Active Directory` blade

    ![alt text](./images/Aad-create-app-step-0.png "Aad-create-app-step-0")

* From there, choose `App registrations` and when the blade loads, click on `New application registration`

    ![alt text](./images/Aad-create-app-step-1.png "Aad-create-app-step-1")

* Fill in the application details:
    * Name
    * Type should be set to `Web app/API`
    * Sign-on URL - this is the URL used by users to access the application. AAD does not validate the URL,<br>
        but mandates that you provide some value, so if the application does not have any URL accessible by users,<br>
        you should just put some URL that belongs to the application (such as https://<APP-CNAME> or https://<CLOUD-SERVICE-NAME>.cloudapp.net).<br>
        You can even provide a value and continue if the application hasn't been written yet.

    ![alt text](./images/Aad-create-app-step-2.png "Aad-create-app-step-2")

* Once your application is ready, open its `Settings` blade

    ![alt text](./images/Aad-create-app-step-3.png "Aad-create-app-step-3")

* Here, on the `Keys` blade, you can set up the authentication for your new application:
    * If you want to use a shared key, select key duration from the drop-down menu and copy the key when it gets generated.
        You will not be able to restore this key.
    * Another option is to use an X509 certificate to authenticate your application.
        For that, click `Upload Public Key` and follow instructions to upload the public portion of the certificate.
    * Do not forget to click `Save` when you are done.

    ![alt text](./images/Aad-create-app-step-4.png "Aad-create-app-step-4")

* Your application is set up. If all you need is access to Kusto with the newly created application, you are done.
<P>

#### Set up delegated permissions for Kusto service application

If you need the application to be able to perform user or app authentication for Kusto access, you need to set up trust between your application and Kusto:

* On the `Required permissions` blade, click `Add`

    ![alt text](./images/Aad-create-app-step-5.png "Aad-create-app-step-5")

* Pick `Select an API`, enter `KustoService` in the filter box and select `KustoService (Kusto)`
* If your Kusto clusters require MFA, enter `KustoMFA` in the filter box and select `KustoServiceMFA (KustoMFA)`

    ![alt text](./images/Aad-create-app-step-6.png "Aad-create-app-step-6")

* After confirming your selection, choose delegated permissions for `Access Kusto`

    ![alt text](./images/Aad-create-app-step-7.png "Aad-create-app-step-7")

* Click `Done` to complete the process

### 2. Set permissions to the application on Kusto cluster

> Before using your newly provisioned application, verify it resolves from Graph API.<br>
    Be advised that it usually takes some time (up to several hours) for the AAD changes to propagate.

* Access your database admin to grant permissions to the new app.
Look at [Managing database principals](../security-roles.md) section for the details about setting the permissions.<br>
For setting up ingestion permissions, consult [Ingestion Permissions](../../api/netfx/kusto-ingest-client-permissions.md) article.
* Add a connection to this service in your Kusto Explorer, if you don't have it yet.

### 3. Application can now access Kusto

When using your newly provisioned application to access Kusto clusters using Kusto client libraries, specify the following connection string (if you chose to authenticate with a shared key):
<br>
`https://`*ClusterDnsName*`/;Federated Security=True;Application Client Id=`*ApplicationClientId*`;Application Key=`*ApplicationKey*
<br>

### Appendix A: AAD Errors

#### AAD Error AADSTS650057

If your application is used to authenticate users or applications for Kusto access, you must set up delegated permissions for Kusto service applicaiton, i.e. declare that your application can authenticate users or applications for Kusto access.
Not doing so will result in an error similar to the following, when an authentication attempt is made:

`AADSTS650057: Invalid resource. The client has requested access to a resource which is not listed in the requested permissions in the client's application registration...`

You will need to follow the instructions on [setting up delegated permissions for Kusto service application](#set-up-delegated-permissions-for-kusto-service-application).

#### Enable user consent if needed

Your AAD tenant administrator may enact a policy that prevents tenant users from giving consent to applications. This situation will result in an error similar to the following, when a user tries to login to your application:

`AADSTS65001: The user or administrator has not consented to use the application with ID '<App ID>' named 'App Name'`

You will need to contact your AAD administrator to grant consent for all users in the tenant, or enable user consent for your specific application.



### Appendix B: Advanced topics and troubleshooting

* See [Kusto connection strings](../../api/connection-strings/kusto.md) documentation for full reference of supported connection strings
