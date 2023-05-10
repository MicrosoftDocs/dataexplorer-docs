---
title: Kusto Access Control Overview - Azure Data Explorer
description: This article describes Kusto Access Control Overview in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.custom: has-adal-ref
ms.date: 05/10/2023
---
# Access Control Overview

Azure Data Explorer access control is based on authentication and authorization. Each query and command on an Azure Data Explorer resource, such as a cluster or database, must pass both authentication and authorization checks.

* [Authentication](#authentication): Validates the identity of the security principal making a request
* [Authorization](#authorization): Validates that the security principal making a request is permitted to make that request on the target resource

## Authentication

[Azure Active Directory (Azure AD)](/azure/active-directory/fundamentals/active-directory-whatis) is the preferred method of authentication to Azure Data Explorer. Azure AD can authenticate security principals or federate with other identity providers, and it supports both user and application authentication.

* **User authentication** (interactive sign-in): Used to authenticate human principals.
* **Application authentication** (non-interactive sign-in): Used to authenticate services and applications that have to run and authenticate with no human user present.

### User authentication

User authentication is intended for requests linked to a specific human principal, and a token is used to connect the principal with their requests.

To authenticate a user, they must present credentials to either Azure AD or an identity provider that works with Azure AD. If authentication is successful, the user receives a token to present to the Azure Data Explorer service.

Azure Data Explorer provides two types of user authentication: interactive and token-based. Interactive authentication prompts the user to enter their credentials using Microsoft Authentication Library (MSAL). Alternatively, token-based authentication allows the application to obtain a valid user token.

### Application authentication

Application authentication is needed when requests are not associated with a specific user or when no user is available to provide credentials. In this case, the application authenticates to Azure AD or the federated IdP by presenting secret information. The following application authentication scenarios are supported:

* Application authentication using an X.509v2 certificate installed locally.
* Application authentication using an X.509v2 certificate given to the client library as a byte stream.
* Application authentication using an Azure AD application ID and an Azure AD application key. The application ID and application key are like a username and password.
* Application authentication using a previously obtained valid Azure AD token, issued to Azure Data Explorer.
* Application authentication using a previously obtained valid Azure AD token, issued to some other resource. This method will work if there's a trust relationship between that resource and Azure Data Explorer.

## Authorization

Before carrying out an action on an Azure Data Explorer resource, all authenticated users must pass an authorization check. Azure Data Explorer uses a [role-based access control](role-based-access-control.md) model, where principals are ascribed to one or more security roles. Authorization is granted as long as one of the roles assigned to the user allows them to perform the specified action. For example, the Database User role grants security principals the right to read the data of a particular database, create tables in the database, and more.

The association of security principals to security roles can be defined individually or by using security groups that are defined in Azure AD. For more information on how to assign security roles, see [Security roles overview](../management/security-roles.md).

## Next steps

* Access Azure Data Explorer using the [client libraries](../api/client-libraries.md)
* Build a [Kusto connection strings](../api/connection-strings/kusto.md)
* Read the overview on [role-based access control](role-based-access-control.md)
