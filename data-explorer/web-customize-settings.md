---
title: 'Customize settings in the Azure Data Explorer web UI'
description: In this guide, you'll learn how to customize your settings in the Azure Data Explorer web UI.
ms.topic: how-to
ms.date: 01/15/2023
---

# Customize settings in the Azure Data Explorer web UI

This article will guide you through the process of customizing settings in the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home). You'll learn how to export and import environment settings, highlight error levels, and change datetime to specific time zone. This can help you protect your work environment and relocate it to other browsers and devices, as well as make it easier to identify errors.

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home).

## Go to the settings

Select the settings icon :::image type="icon" source="media/web-customize-settings/settings-icon.png" border="false"::: on the top right, to open the **Settings** window.

:::image type="content" source="media/web-customize-settings/settings-pane.png" alt-text="Screenshot of the Settings window.":::

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

Kusto tries to interpret the severity or verbosity level of each row in the results panel and color them accordingly. It does this by matching the distinct values of each column with a set of known patterns ("Warning", "Error", and so on).

### Turn on error level highlighting

To turn on error level highlighting:

1. Select the **Settings** icon next to your user name.
1. Select the **Appearance** tab and toggle the **Enable error level highlighting** option to the right.

    :::image type="content" source="media/web-customize-settings/enable-error-level-highlighting.png" alt-text="Screenshot showing how to enable error-level highlighting in the settings.":::

Error level color scheme in **Light** mode | Error level color scheme in **Dark** mode
|---|---|
:::image type="content" source="media/web-query-data/light-mode.png" alt-text="Screenshot of color legend in light mode."::: | :::image type="content" source="media/web-query-data/dark-mode.png" alt-text="Screenshot of color legend in dark mode.":::

### Column requirements for highlighting

For highlighted error levels, the column must be of type int, long, or string.

- If the column is of type `long` or `int`:
  - The column name must be *Level*
  - Values may only include numbers between 1 and 5.
- If the column is of type `string`:
  - The column name can optionally be *Level* to improve performance.
  - The column can only include the following values:
    - critical, crit, fatal, assert, high
    - error, e
    - warning, w, monitor
    - information
    - verbose, verb, d

## Change datetime to specific time zone

You can change the displayed datetime values to reflect a specific time zone. This change affects the display only, and doesn't change the underlying data in Azure Data Explorer.

1. Select the **Settings** icon next to your user name.
1. Select the **General** tab, and select a time zone from the dropdown menu.

    :::image type="content" source="media/web-query-data/time-zone.png" alt-text="Screenshot of general tab on settings blade to change time zone in Azure Data Explorer web U I.":::

The selected time zone will then be visible in the results grid menu bar.

:::image type="content" source="media/web-query-data/query-time-utc.png" alt-text="Screenshot of Query time changed to UTC in results grid menu.":::

## Next steps

Learn how to [run queries in the Azure Data Explorer web UI](web-query-data.md).
