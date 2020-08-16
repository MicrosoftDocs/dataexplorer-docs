---
 title: include file
 description: include file
 services: iot-hub
 author: orspod
 ms.service: iot-hub
 ms.topic: include
 ms.date: 09/07/2018
 ms.author: orspodek
 ms.custom: include file
---

In this section, you use the Azure CLI to create a device identity for this article. Device IDs are case sensitive.

1. Open [Azure Cloud Shell](https://shell.azure.com/).

1. In Azure Cloud Shell, run the following command to install the Microsoft Azure IoT Extension for Azure CLI:

    ```azurecli-interactive
    az extension add --name azure-iot
    ```

2. Create a new device identity called `myDeviceId` and retrieve the device connection string with these commands:

    ```azurecli-interactive
    az iot hub device-identity create --device-id myDeviceId --hub-name {Your IoT Hub name}
    az iot hub device-identity show-connection-string --device-id myDeviceId --hub-name {Your IoT Hub name} -o table
    ```

   [!INCLUDE [iot-hub-pii-note-naming-device](iot-hub-pii-note-naming-device.md)]

Make a note of the device connection string from the result. This device connection string is used by the device app to connect to your IoT Hub as a device.

<!-- images and links -->
