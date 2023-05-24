---
ms.topic: include
ms.date: 01/08/2023
---

## IP-prefix notation

IP-prefix notation (also known as CIDR notation) is a concise way of representing an IP address and its associated network mask. The format is `<base IP>/<prefix length>`, where the prefix length is the number of leading 1 bits in the netmask. The prefix length determines the range of IP addresses that belong to the network.

For IPv4, the prefix length is a number between 0 and 32. So the notation 192.168.2.0/24 represents the IP address 192.168.2.0 with a netmask of 255.255.255.0. This netmask has 24 leading 1 bits, or a prefix length of 24.

For IPv6, the prefix length is a number between 0 and 128. So the notation fe80::85d:e82c:9446:7994/120 represents the IP address fe80::85d:e82c:9446:7994 with a netmask of ffff:ffff:ffff:ffff:ffff:ffff:ffff:ff00. This netmask has 120 leading 1 bits, or a prefix length of 120.
