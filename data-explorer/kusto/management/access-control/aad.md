---
title: Azure Active Directory (AAD) Authentication - Azure Data Explorer | Microsoft Docs
description: This article describes Azure Active Directory (AAD) Authentication in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/13/2019
---
# Azure Active Directory (AAD) Authentication

Azure Active Directory (AAD) is Azure's preferred multi-tenant cloud directory service,
capable of authenticating security principals or federating with other identity providers,
such as Microsoft's Active Directory.

AAD allows application of various kinds (web application, Windows desktop application, Universal applications,
mobile applications, etc.) to uniformly authenticate and use Kusto services.

AAD supports a number of authentication scenarios.
If there is a user present during the authentication, one should authenticate the user to AAD by AAD User Authentication.
In some cases, one wants a service to use Kusto even when no user is interactively
present. In such cases, one should authenticate the application through the use
of an application secret, as described in AAD Application Authentication.

The following methods of authentication are supported by Kusto in general,
including through its .NET libraries:

* Interactive user authentication - this mode requires interactivity, as if needed, logon UI will pop up
* User authentication with an existing AAD token previously issued for Kusto
* Application authentication with AppID and shared secret
* Application authentication with locally installed X.509v2 certificate or certificate provided inline
* Application authentication with an existing AAD token previously issued for Kusto
* User or Application authentication with an AAD token issued for another resource, provided trust exists between that resource and Kusto

Please see the [Kusto connection strings](../../api/connection-strings/kusto.md) reference for guidance and examples.

## User authentication

User authentication happens when the user presents credentials to AAD (or to some identity provide
that federates with AAD, such as ADFS), and gets back a security token that can be presented to the
Kusto service. The Kusto service doesn't care how the security token was obtained, it cares about
whether the token is valid and what information is put there by AAD (or the federated IdP).

On the client side, Kusto supports both interactive authentication, in which the AAD client library
ADAL or similar code requests the user to enter credentials. It also supports token-based
authentication, in which the application using Kusto obtains a valid user token and presents
it. Last, it supports a scenario in which the application using Kusto obtains a valid user token
for some other service (not Kusto), provided there's a trust relationship between that resource
and Kusto.

Please see [Kusto connection strings](../../api/connection-strings/kusto.md) for details on how
to use the Kusto client libraries and authenticate by using AAD to Kusto.

## Application authentication

When requests are not associated with a specific user, or there's no user available to enter
credentials, the AAD application authentication flow may be used. In this flow, the application
authenticates to AAD (or the federated IdP) by presenting some secret information. The following
scenarios are supported by the various Kusto clients:

* Application authentication using an X.509v2 certificate installed locally.
* Application authentication using an X.509v2 certificate given to the client library as a byte stream.
* Application authentication using an AAD application ID and an AAD application key
  (the equivalent of username/password authentication for applications).
* Application authentication using a previously-obtained valid AAD token (issued to Kusto).
* Application authentication using a previously-obtained valid AAD token issued to some other resource,
  provided that there's a trust relationship between that resource and Kusto.

## AAD Server Application Permissions

In the general case, an AAD Server Application can define multiple
permissions (e.g., read-only permission and a read-writer permission) and the AAD
client application may decide which permissions it needs when it requests an
authorization token. As part of token acquisition, the user will be asked
to authorize the AAD client application to be act on the user's behalf with
authorization to have these permissions. Should the user approve, these
permissions will be listed in the scope claim of the token that is issued
to the AAD client application.



The AAD client application is configured to request the "Access Kusto" permission
from the user (which AAD calls "the resource owner").

## Kusto Client SDK as an AAD Client Application

When the Kusto client libraries invoke ADAL (the AAD client library)
to acquire a token for communicating with Kusto, it provides
the following information:

1. The AAD Tenant, as received from the caller
2. The AAD Client Application ID
3. The AAD Client Resource ID
4. The AAD ReplyUrl (the URL that the AAD service will redirect-to after authentication completes successfully;
   ADAL then captures this redirect and extracts the authorization code from it).
5. The Cluster URI ('https://Cluster-and-region.kusto.windows.net').

The token returned by ADAL to the Kusto Client Library has the Kusto AAD Server Application
as the audience, and the "Access Kusto" permission as the scope.

## Authenticating with AAD Programmatically

The following articles explain how to programmatically authenticate to Kusto with AAD:

* [How to provision an AAD Application](./how-to-provision-aad-app.md)
* [How to perform AAD Authentication](./how-to-authenticate-with-aad.md)

