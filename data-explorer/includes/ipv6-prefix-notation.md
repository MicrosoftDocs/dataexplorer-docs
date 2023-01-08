---
ms.topic: include
ms.date: 01/08/2023
---

## IP-prefix notation

IP addresses can be defined with `IP-prefix notation` using a slash (`/`) character.
The IP address to the LEFT of the slash (`/`) is the base IP address. The integer, 0 to 128, to the RIGHT of the slash (`/`) is the number of contiguous 1 bit in the netmask.

For example, fe80::85d:e82c:9446:7994/120 will have an associated net/subnetmask containing 120 contiguous bits.
