---
title: Access your Azure Data Explorer web UI data anywhere
description: This guide teaches you how to access your Azure Data Explorer Web UI Data from anywhere using syncing.
ms.topic: how-to
ms.date: 05/13/2025
#customer-intent: As a user, I want to learn how to sync my Azure Data Explorer web UI data so that I can access it from anywhere.
---

# Access your Azure Data Explorer web UI data anywhere

This article describes how to sync your Azure Data Explorer web UI profile to the cloud, enabling a consistent experience across devices and browsers. When you sync, your browser's settings, tabs, and connections are stored in the cloud, making them accessible through the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home) from anywhere. Synced data is now associated with your account rather than the specific machine, enabling a consistent experience across devices.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.

## Considerations

Before enabling sync, consider the following points:

* The first browser where syncing is enabled becomes the primary data source, overriding data in other browsers.
* Data is account-specific and can't be shared across different user accounts on the same machine.
* Syncing uploads your current device's data to the cloud, replacing local data on other browsers or devices with the cloud-stored version.
* Synced data is stored in your tenant's region. If no Azure region exists in the tenant's region, data is stored in an Azure region in Europe.
* Syncing is irreversible; once enabled:
    * Data is no longer stored exclusively on your device
    * [Exporting and importing](web-customize-settings.md#export-and-import-environment-settings) of your work environment under settings is no longer available

## Sync user profile

To sync your profile data, follow these steps:

1. From the tab bar, select **Sync off**.

1. From the **Sync user profile to cloud** dialog box, select **Turn sync on**.

    :::image type="content" source="media/web-sync/sync-on.png" alt-text="Screenshot of the Sync user profile to cloud dialog box with the Turn-on sync button highlighted.":::

1. In the **Turn on sync to cloud** dialog box, select **Confirm**.

    >[!CAUTION]
    > Syncing your profile to the cloud is irreversible. Once you confirm, your data is stored in the cloud and no longer on your device.

    :::image type="content" source="media/web-sync/sync-on-confirmation.png" alt-text="Screenshot of the Turn-on sync to cloud dialog box with the Confirm button highlighted.":::

1. In the tab bar, verify that the status shows **Sync on**. Additionally, ensure that the **Sync on** status shows on other browsers or devices when signed into the same account.

    :::image type="content" source="media/web-sync/sync-on-status.png" alt-text="Screenshot of the tab bar with the Sync on status highlighted.":::

    >[!NOTE]
    > If the status doesn't display as expected, ensure that you're logged into the same account used for syncing.

## Turn sync off

If you enabled sync and want to stop syncing your Azure Data Explorer web UI profile, follow these steps:

1. In the tab bar, select **Sync on**.
2. In the dialog box, select **Turn sync off**.
3. Confirm the action when prompted.

### Important notes when turning sync off
- Turning sync off **stops updating cloud data**, but the cloud profile previously uploaded is **not deleted**.
- Your existing cloud profile remains the version that other browsers use when sync is turned on again.
- Local browser data will no longer be uploaded or overwritten.

## Turn sync back on

If sync was previously disabled:

1. In the tab bar, select **Sync off**.
2. Select **Turn sync on**.
3. Confirm that the browser you are enabling sync on contains the state you want to upload as the cloud profile.

> [!WARNING]
> When you turn sync back on, **this browser becomes the primary source again** and will overwrite cloud-stored data.

## Determine the primary source of sync data

The primary sync source is the **first browser/device where sync was turned on**.  
This browser uploads its current tabs, settings, and connections to the cloud.

To check which environment is used as the primary source:

- Open the browser where sync is currently enabled.
- Verify that **Sync on** appears in the tab bar.
- Compare this browser’s state with what you see on other devices.  
  If other devices match this one, it is the current primary source.

If you want to change the primary source:

1. Turn sync **off**.
2. Open the browser that contains the data you want to use as the new primary environment.
3. Turn sync **back on** on that browser.

## Related content

* [Azure Data Explorer web UI query overview](web-ui-query-overview.md)
* [Customize settings in the Azure Data Explorer web UI](web-customize-settings.md)
