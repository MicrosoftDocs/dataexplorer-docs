---
ms.topic: include
ms.date: 01/08/2023
---

## IP-prefix notation

IP addresses can be defined with `IP-prefix notation` using a slash (`/`) character.
The IP address to the LEFT of the slash (`/`) is the base IP address. The integer, 0 to 32, to the RIGHT of the slash (`/`) is the number of contiguous 1 bit in the netmask.

For example, 192.168.2.0/24 will have an associated net/subnetmask containing 24 contiguous bits or 255.255.255.0 in dotted decimal format.
