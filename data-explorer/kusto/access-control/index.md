---
title: Access Control Overview - Azure Data Explorer
description: This article describes Access control in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.custom: has-adal-ref
ms.date: 06/21/2023
---
# Access control overview

Azure Data Explorer access control is based on authentication and authorization. Each query and command on an Azure Data Explorer resource, such as a cluster or database, must pass both authentication and authorization checks.

* [Authentication](#authentication): Validates the identity of the security principal making a request
* [Authorization](#authorization): Validates that the security principal making a request is permitted to make that request on the target resource

## Authentication

[Azure Active Directory (Azure AD)](aad.md) is the only method of authentication to Azure Data Explorer. Azure AD can authenticate security principals or federate with other identity providers, and it supports both user and application authentication.

[User authentication](aad.md#user-authentication) is used to verify the identity of human principals and can be carried out interactively, where a human user provides credentials, or programmatically using a token. [Application authentication](aad.md#application-authentication) is used to authenticate services and applications that need to run and access resources without human intervention.

### User authentication

User authentication happens when a user presents credentials to Azure AD or an identity provider that federates with Azure AD, such as Active Directory Federation Services. The user gets back a security token that can be presented to the Azure Data Explorer service. Azure Data Explorer determines whether the token is valid, whether the token is issued by a trusted issuer, and what security claims the token contains.

Azure Data Explorer supports the following methods of user authentication, including through the Kusto [client libraries](../api/client-libraries.md):

* Interactive user authentication with sign-in through the user interface.
* User authentication with an Azure AD token issued for Azure Data Explorer.
* User authentication with an Azure AD token issued for another resource. In this case, a trust relationship must exist between that resource and Azure Data Explorer.

### Application authentication

Application authentication is needed when requests aren't associated with a specific user or when no user is available to provide credentials. In this case, the application authenticates to Azure AD or the federated IdP by presenting secret information.

Azure Data Explorer supports the following methods of application authentication, including through the Kusto [client libraries](../api/client-libraries.md):

* Application authentication with an Azure managed identity.
* Application authentication with an X.509v2 certificate installed locally.
* Application authentication with an X.509v2 certificate given to the client library as a byte stream.
* Application authentication with an Azure AD application ID and an Azure AD application key. The application ID and application key are like a username and password.
* Application authentication with a previously obtained valid Azure AD token, issued to Azure Data Explorer.
* Application authentication with an Azure AD token issued for another resource. In this case, a trust relationship must exist between that resource and Azure Data Explorer.

## Authorization

Before carrying out an action on an Azure Data Explorer resource, all authenticated users must pass an authorization check. Azure Data Explorer uses the [Kusto role-based access control](role-based-access-control.md) model, where principals are ascribed to one or more security roles. Authorization is granted as long as one of the roles assigned to the user allows them to perform the specified action. For example, the Database User role grants security principals the right to read the data of a particular database, create tables in the database, and more.

The association of security principals to security roles can be defined individually or by using security groups that are defined in Azure AD. For more information on how to assign security roles, see [Security roles overview](../management/security-roles.md).

## Next steps

* [Authenticate with Azure Active Directory](aad.md)
* Use the [client libraries](../api/client-libraries.md)
* Build [Kusto connection strings](../api/connection-strings/kusto.md)
* Understand [Kusto role-based access control](role-based-access-control.md)
