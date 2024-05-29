---
title: Access Control Overview - Azure Data Explorer
description: This article describes Access control in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.custom: has-adal-ref
ms.date: 06/28/2023
---
# Access control overview

Azure Data Explorer access control is based on authentication and authorization. Each query and command on an Azure Data Explorer resource, such as a cluster or database, must pass both authentication and authorization checks.

* [Authentication](#authentication): Validates the identity of the security principal making a request
* [Authorization](#authorization): Validates the security principal making a request is permitted to make that request on the target resource

## Authentication

To programmatically authenticate with your cluster, a client must communicate with [Microsoft Entra ID](/azure/active-directory/fundamentals/active-directory-whatis) and request an access token specific to Azure Data Explorer. Then, the client can use the acquired access token as proof of identity when issuing requests to your cluster.

The main authentication scenarios are as follows:

* [User authentication](#user-authentication): Used to verify the identity of human users.
* [Application authentication](#application-authentication): Used to verify the identity of an application that needs to access resources without human intervention by using configured credentials.
* [On-behalf-of (OBO) authentication](/azure/active-directory/develop/msal-authentication-flows#on-behalf-of-obo): Allows an application to exchange a token for said application with a token to access a Kusto service. This flow must be implemented with MSAL.
* [Single page application (SPA) authentication](/azure/active-directory/develop/msal-authentication-flows#authorization-code): Allows client-side SPA web applications to sign in users and get tokens to access your cluster. This flow must be implemented with MSAL.

> [!NOTE]
> For user and application authentication, we recommend using the [Kusto client libraries](../../kusto/api/client-libraries.md). If you require On-behalf-of (OBO) or Single-Page Application (SPA) authentication, you'll need to use MSAL directly as these flows aren't supported by the client libraries. For more information, see [Authenticate with Microsoft Authentication Library (MSAL)](../api/rest/authenticate-with-msal.md).

### User authentication

User authentication happens when a user presents credentials to Microsoft Entra ID or an identity provider that federates with Microsoft Entra ID, such as Active Directory Federation Services. The user gets back a security token that can be presented to the Azure Data Explorer service. Azure Data Explorer determines whether the token is valid, whether the token is issued by a trusted issuer, and what security claims the token contains.

Azure Data Explorer supports the following methods of user authentication, including through the [Kusto client libraries](../api/client-libraries.md):

* Interactive user authentication with sign-in through the user interface.
* User authentication with a Microsoft Entra token issued for Azure Data Explorer.
* User authentication with a Microsoft Entra token issued for another resource that can be exchanged for an Azure Data Explorer token using On-behalf-of (OBO) authentication.

### Application authentication

Application authentication is needed when requests aren't associated with a specific user or when no user is available to provide credentials. In this case, the application authenticates to Microsoft Entra ID or the federated IdP by presenting secret information.

Azure Data Explorer supports the following methods of application authentication, including through the [Kusto client libraries](../api/client-libraries.md):

* Application authentication with an Azure managed identity.
* Application authentication with an X.509v2 certificate installed locally.
* Application authentication with an X.509v2 certificate given to the client library as a byte stream.
* Application authentication with a Microsoft Entra application ID and a Microsoft Entra application key. The application ID and application key are like a username and password.
* Application authentication with a previously obtained valid Microsoft Entra token, issued to Azure Data Explorer.
* Application authentication with a Microsoft Entra token issued for another resource that can be exchanged for an Azure Data Explorer token using On-behalf-of (OBO) authentication.

## Authorization

Before carrying out an action on an Azure Data Explorer resource, all authenticated users must pass an authorization check. Azure Data Explorer uses the [Kusto role-based access control](role-based-access-control.md) model, where principals are ascribed to one or more security roles. Authorization is granted as long as one of the roles assigned to the user allows them to perform the specified action. For example, the Database User role grants security principals the right to read the data of a particular database, create tables in the database, and more.

The association of security principals to security roles can be defined individually or by using security groups that are defined in Microsoft Entra ID. For more information on how to assign security roles, see [Security roles overview](../management/security-roles.md).

## Group authorization

Authorization can be granted to Microsoft Entra ID groups by assigning one or more roles to the group. 

When the authorization of a user or application principal is checked, the system first checks for an explicit role assignment permitting the specific action. If no such role assignment exists, the system then analyzes the principal's membership across all groups that could potentially authorize the action. If the principal is confirmed to be a member of any of these groups, the requested action is authorized. Otherwise, if the principal is not a member of any such groups, the action doesn't pass the authorization check and the action isn't allowed.

> [!NOTE]
>
> Checking group memberships can be resource-intensive. 
> Since group memberships don't change frequently, the results of membership checks are cached.
> The caching duration varies and is influenced by factors such as the membership result (whether the principal is a member or not), the type of principal (user or application), among others.
> The maximum caching duration can extend up to three hours, while the minimum duration is 30 minutes.

## Related content

* Understand [Kusto role-based access control](role-based-access-control.md).
* For user or application authentication, use the [Kusto client libraries](../api/client-libraries.md).
* For OBO or SPA authentication, see [How to authenticate with Microsoft Authentication Library (MSAL)](../api/rest/authenticate-with-msal.md).
