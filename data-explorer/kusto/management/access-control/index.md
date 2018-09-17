---
title: Kusto Access Control Overview - Azure Kusto | Microsoft Docs
description: This article describes Kusto Access Control Overview in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto Access Control Overview

Access Control in Kusto is based on two dimensions:
* [Authentication](#authentication): Validating the identity of the security principal making a request
* [Authorization](#authorization): Validating that the security principal making a request is allowed to make that request on the target resource

In order to successfully execute a query or a control command on a Kusto cluster, database or a table, the actor must successfully pass both Authentication and Authorization.

## Authentication


**Azure Active Directory (AAD)** is Azure's preferred multi-tenant cloud directory service,
capable of authenticating security principals or federating with other identity providers,
such as Microsoft's Active Directory.

AAD is the preferred method for authenticating to Kusto in Microsoft. It supports a number
of authentication scenarios:
* **User authentication** (interactive logon): Used to authenticate human principals.
* **Application authentication** (non-interactive logon): Used to authenticate services
  and applications that have to run/authenticate with no human user being present. 

### User authentication

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

### Application authentication

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


### Microsoft Accounts (MSAs)

Microsoft Accounts (MSAs) is the term for all the Microsoft-managed non-organizational user accounts, e.g. `hotmail.com`, `live.com`, `outlook.com`.
Kusto supports user authentication for MSAs (note, that there is no security groups concept), which are identified by their UPN (Universal Principal Name).
When an MSA principal is configured on a Kusto resource, Kusto **will not** attempt to resolve the UPN provided.

### Authenticated SDK or REST calls

* When using the REST API, authentication is performed using the standard HTTP `Authorization` header.
* When using any of the Kusto .NET libraries, authentication is controlled by specifying the authentication method and parameters in the [Kusto Connection String](../../api/connection-strings/kusto.md), or by setting properties on the [Client Request Properties](https://kusto.azurewebsites.net/docs/api/request-properties.html) object.

### Kusto Client SDK as an AAD Client Application

When the Kusto client libraries invoke ADAL (the AAD client library) to acquire a token for communicating with Kusto, it provides
the following information:

1. The AAD Tenant (this is the AAD authority that will authenticate the request)
2. The AAD Client Application ID (`ad30ae9e-ac1b-4249-8817-d24f5d7ad3de` for the Kusto.Data library)
3. The AAD Client Resource ID (`http://microsoft/kustoclient`).
4. The AAD ReplyUrl (the URL that the AAD service will redirect-to after authentication completes successfully;
   ADAL then captures this redirect and extracts the authorization code from it).
5. The Cluster url (e.g., `https://ClusterName.kusto.windows.net`).

The token returned by ADAL to the Kusto Client Library has the appropriate Kusto cluster URL as the audience, and the "Access Kusto" permission as the scope.

## Authorization

All authenticated principals, regardless of the method used to authenticate, also undergo
an authorization check before they are allowed to perform an action on a Kusto resource.
Kusto uses a [role-based authorization model](role-based-authorization.md): princiapsl are ascribed to one or more
**security roles**, and authorization succeeds as long as one of the principal's roles is authorized.

For example, the **database user role** grants security principals (users or services) the right to
read the data of a particular database, create tables in the database, as well as create functions in it.

The association of security principals to security roles can be defined individually,
or by using security groups (defined in AAD or dSTS). The individual commands for doing so
are defined in [Setting Role Based Authorization rules](../security-roles.md).

