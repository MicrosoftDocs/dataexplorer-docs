---
title: Access your Azure Data Explorer web UI data anywhere
description: This guide teaches you how to access your Azure Data Explorer Web UI Data from anywhere using syncing.
ms.topic: how-to
ms.date: 05/13/2025
#customer-intent: As a user, I want to learn how to sync my Azure Data Explorer web UI data so that I can access it from anywhere.
---

# Access your Azure Data Explorer web UI data anywhere

This article describes how to sync your Azure Data Explorer web UI profile to the cloud, enabling a consistent experience across devices and browsers. When you sync, your browser's settings, tabs, and connections are stored in the cloud, making them accessible through the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home) from anywhere. Note that synced data is now associated with your account rather than the specific machine, enabling a consistent experience across devices.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.

## Considerations

Before enabling sync, consider the following:

* The first browser where syncing is enabled becomes the primary data source, overriding data in other browsers.
* Data is account-specific and can't be shared across different user accounts on the same machine.
* Syncing uploads your current device's data to the cloud, replacing local data on other browsers or devices with the cloud-stored version.
* Synced data is stored in your tenant's country/region. If no Azure region exists in the tenant's country/region, data will be stored in an azure region in Europe.
* Syncing is irreversible; once enabled:
    * Data is no longer stored exclusively on your device
    * [Exporting and importing](web-customize-settings.md#export-and-import-environment-settings) of your work environment under settings is no longer available

## Sync user profile

To sync your profile data, follow these steps:

1. From the tab bar, select **Sync off**.

1. From the **Sync user profile to cloud** dialog box, select **Turn sync on**.

    :::image type="content" source="media/web-sync/sync-on.png" alt-text="Screenshot of the Sync user profile to cloud dialog box with the Turn on sync button highlighted.":::

1. In the **Turn on sync to cloud** dialog box, select **Confirm**.

    >[!CAUTION]
    > Syncing your profile to the cloud is irreversible. Once you confirm, your data will be stored in the cloud and no longer on your device.

    :::image type="content" source="media/web-sync/sync-on-confirmation.png" alt-text="Screenshot of the Turn on sync to cloud dialog box with the Confirm button highlighted.":::

1. In the tab bar, verify that the status shows **Sync on**. Additionally, ensure that the **Sync on** status shows on other browsers or devices when signed into the same account.

    :::image type="content" source="media/web-sync/sync-on-status.png" alt-text="Screenshot of the tab bar with the Sync on status highlighted.":::

    >[!NOTE]
    > If the status does not display as expected, ensure that you are logged into the same account used for syncing.

## Related content

* [Azure Data Explorer web UI query overview](web-ui-query-overview.md)
* [Customize settings in the Azure Data Explorer web UI](web-customize-settings.md)
