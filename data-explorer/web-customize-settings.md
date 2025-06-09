---
title: 'Customize settings in the Azure Data Explorer web UI'
description: In this guide, you learn how to customize your settings in the Azure Data Explorer web UI.
ms.topic: how-to
ms.date: 05/13/2025
---

# Customize settings in the Azure Data Explorer web UI

This article guides you through the process of customizing settings in the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home). You learn how to export and import environment settings, highlight error levels, and change datetime to specific time zone. This can help you protect your work environment and relocate it to other browsers and devices, as well as make it easier to identify errors.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home).

## Go to the settings

Select the settings icon :::image type="icon" source="media/web-customize-settings/settings-icon.png" border="false"::: on the top right, to open the **Settings** window.

:::image type="content" source="media/web-customize-settings/settings-pane.png" alt-text="Screenshot of the Settings window.":::

## Set query recommendations

The query editor provides suggestions and warnings as you write your queries. The suggestions and warnings might be related to performance, correctness, or general best practices. To customize your suggestions and warnings, do the following steps:

1. In the **Settings** > **Editing** window, select **Set query recommendations**.

    :::image type="content" source="media/web-customize-settings/set-query-recommendations-setting.png" alt-text="Screenshot of the setting menu option to set query recommendations." lightbox="media/web-customize-settings/set-query-recommendations-setting.png":::

1. In the **Set query recommendations** dialog box, turn on or off specific **Suggestions** and **Warnings**. Use the **Activate suggestions** and **Activate warnings** at the top of the respective tabs to turn on or off all of the suggestions or warnings at once.

    :::image type="content" source="media/web-customize-settings/set-query-recommendations-dialog.png" alt-text="Screenshot of the set query recommendations dialog box." lightbox="media/web-customize-settings/set-query-recommendations-dialog.png":::

1. Select **Apply** to save the changes.

## Adjust time-out limits

Query and admin commands have a default time-out limit. To extend or reduce these limits, do the following steps:

1. In the **Settings** > **Connection** window, adjust the **Query timeout** or the **Admin command timeout**.

    :::image type="content" source="media/web-customize-settings/set-timeout-setting.png" alt-text="Screenshot of the setting menu option to set time-out limits." lightbox="media/web-customize-settings/set-timeout-setting.png":::

1. The changes are automatically saved.

To learn how to set time out limits outside of the web UI, see [Set time-out limits](/kusto/set-timeout-limits?view=azure-data-explorer&preserve-view=true).

## Export and import environment settings

The export and import actions help you protect your work environment and relocate it to other browsers and devices. The export action exports all your settings, cluster connections, and query tabs to a JSON file that can be imported into a different browser or device.

> [!NOTE]
> To sync your profile data to the cloud, see [Access your Azure Data Explorer web UI data anywhere](web-sync.md). Once enabled, exporting and importing is no longer available.

### Export environment settings

1. In the **Settings** > **General** window, select **Export**.

1. The **adx-export.json** file is downloaded to your local storage.

1. Select **Clear local state** to revert your environment to its original state. This setting deletes all your cluster connections and closes open tabs.

> [!NOTE]
> **Export** only exports query related data. No dashboard data is exported within the **adx-export.json** file.

### Import environment settings

1. In the **Settings** > **General** window, select **Import**. Then in **Warning** pop-up, select **Import**.

    :::image type="content" source="media/web-customize-settings/import-settings.png" alt-text="Screenshot of the import warning dialog box.":::

1. Locate your **adx-export.json** file from your local storage and open it.
1. Your previous cluster connections and open tabs are now available.

> [!NOTE]
> **Import** overrides any existing environment settings and data.

## Highlight error levels

Azure Data Explorer tries to interpret the severity or verbosity level of each row in the results panel and color them accordingly. It does so by matching the distinct values of each column with a set of known patterns ("Warning", "Error", and so on).

### Turn on error level highlighting

To turn on error level highlighting:

1. Select the **Settings** icon next to your user name.
1. Select the **Appearance** tab and toggle the **Enable error level highlighting** option.

    :::image type="content" source="media/web-customize-settings/enable-error-level-highlighting.png" alt-text="Screenshot showing how to enable error-level highlighting in the settings.":::

Error level color scheme in **Light** mode | Error level color scheme in **Dark** mode
|---|---|
:::image type="content" source="media/web-query-data/light-mode.png" alt-text="Screenshot of color legend in light mode."::: | :::image type="content" source="media/web-query-data/dark-mode.png" alt-text="Screenshot of color legend in dark mode.":::

### Column requirements for highlighting

For highlighted error levels, the column must be of [data type](/kusto/query/scalar-data-types/index?view=azure-data-explorer&preserve-view=true) `int`, `long`, or `string`.

* If the column is of type `long` or `int`:
  * The column name must be *Level*
  * Values can only include numbers between 1 and 5.
* If the column is of type `string`:
  * The column name can optionally be *Level* to improve performance.
  * The column can only include the following values:
    * critical, crit, fatal, assert, high
    * error, e
    * warning, w, monitor
    * information
    * verbose, verb, d

## Enable cross-tenant dashboard sharing

To enable cross-tenant sharing, a tenant admin must enable it in the Azure Data Explorer WebUI settings. This setting allows you to share dashboards with users in a different tenant.

For more information, see [Grant permissions to users in a different tenant](azure-data-explorer-dashboard-share.md#grant-permissions-to-users-in-a-different-tenant).

Under **Settings** > **Share Dashboards Across Tenants**, toggle to **On**.

:::image type="content" source="media/web-customize-settings/dashboard-sharing.png" alt-text="Screenshot of enabling dashboard sharing in settings.":::

> [!IMPORTANT]
> If a tenant admin enables cross-tenant sharing and later disables cross-tenant sharing, all dashboards shared while the feature was active remain accessible.

## Related content

* [Access your Azure Data Explorer web UI data anywhere](web-sync.md)
* [Query data in the web UI](web-ui-query-overview.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
