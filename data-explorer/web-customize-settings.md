---
title: 'Customize settings in the Azure Data Explorer web UI'
description: In this guide, you'll learn how to customize your settings in the Azure Data Explorer web UI.
ms.topic: how-to
ms.date: 05/28/2023
---

# Customize settings in the Azure Data Explorer web UI

This article will guide you through the process of customizing settings in the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home). You'll learn how to export and import environment settings, highlight error levels, and change datetime to specific time zone. This can help you protect your work environment and relocate it to other browsers and devices, as well as make it easier to identify errors.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home).

## Go to the settings

Select the settings icon :::image type="icon" source="media/web-customize-settings/settings-icon.png" border="false"::: on the top right, to open the **Settings** window.

:::image type="content" source="media/web-customize-settings/settings-pane.png" alt-text="Screenshot of the Settings window.":::

## Set query recommendations

The query editor provides suggestions and warnings as you write your queries. The suggestions and warnings may be related to performance, correctness, or general best practices. To customize your suggestions and warnings, do the following steps:

1. In the **Settings** > **Editing** window, select **Set query recommendations**.

    :::image type="content" source="media/web-customize-settings/set-query-recommendations-setting.png" alt-text="Screenshot of the setting menu option to set query recommendations." lightbox="media/web-customize-settings/set-query-recommendations-setting.png":::

1. In the **Set query recommendations** dialog box, turn on or off specific **Suggestions** and **Warnings**. Use the **Activate suggestions** and **Activate warnings** at the top of the respective tabs to turn on or off all of the suggestions or warnings at once.

    :::image type="content" source="media/web-customize-settings/set-query-recommendations-dialog.png" alt-text="Screenshot of the set query recommendations dialog box." lightbox="media/web-customize-settings/set-query-recommendations-dialog.png":::

1. Select **Apply** to save the changes.

## Adjust timeout limits

Query and admin commands have a default timeout limit. To extend or reduce these limits, do the following steps:

1. In the **Settings** > **Connection** window, adjust the **Query timeout** or the **Admin command timeout**.

    :::image type="content" source="media/web-customize-settings/set-timeout-setting.png" alt-text="Screenshot of the setting menu option to set timeout limits." lightbox="media/web-customize-settings/set-timeout-setting.png":::

1. The changes are automatically saved.

To learn how to set timeout limits outside of the web UI, see [Set timeout limits](set-timeout-limits.md).

## Export and import environment settings

The export and import actions help you protect your work environment and relocate it to other browsers and devices. The export action will export all your settings, cluster connections, and query tabs to a JSON file that can be imported into a different browser or device.

### Export environment settings

1. In the **Settings** > **General** window, select **Export**.

1. The **adx-export.json** file will be downloaded to your local storage.

1. Select **Clear local state** to revert your environment to its original state. This setting deletes all your cluster connections and closes open tabs.

> [!NOTE]
> **Export** only exports query related data. No dashboard data will be exported within the **adx-export.json** file.

### Import environment settings

1. In the **Settings** > **General** window, select **Import**. Then in **Warning** pop-up, select **Import**.

    :::image type="content" source="media/web-customize-settings/import-settings.png" alt-text="Screenshot of the import warning dialog box.":::

1. Locate your **adx-export.json** file from your local storage and open it.
1. Your previous cluster connections and open tabs are now available.

> [!NOTE]
> **Import** overrides any existing environment settings and data.

## Highlight error levels

Azure Data Explorer tries to interpret the severity or verbosity level of each row in the results panel and color them accordingly. It does this by matching the distinct values of each column with a set of known patterns ("Warning", "Error", and so on).

### Turn on error level highlighting

To turn on error level highlighting:

1. Select the **Settings** icon next to your user name.
1. Select the **Appearance** tab and toggle the **Enable error level highlighting** option to the right.

    :::image type="content" source="media/web-customize-settings/enable-error-level-highlighting.png" alt-text="Screenshot showing how to enable error-level highlighting in the settings.":::

Error level color scheme in **Light** mode | Error level color scheme in **Dark** mode
|---|---|
:::image type="content" source="media/web-query-data/light-mode.png" alt-text="Screenshot of color legend in light mode."::: | :::image type="content" source="media/web-query-data/dark-mode.png" alt-text="Screenshot of color legend in dark mode.":::

### Column requirements for highlighting

For highlighted error levels, the column must be of [data type](kusto/query/scalar-data-types/index.md) `int`, `long`, or `string`.

* If the column is of type `long` or `int`:
  * The column name must be *Level*
  * Values may only include numbers between 1 and 5.
* If the column is of type `string`:
  * The column name can optionally be *Level* to improve performance.
  * The column can only include the following values:
    * critical, crit, fatal, assert, high
    * error, e
    * warning, w, monitor
    * information
    * verbose, verb, d

## Related content

* [Query data in the web UI](web-ui-query-overview.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
