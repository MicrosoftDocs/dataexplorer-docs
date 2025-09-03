---
title: Graph visualization with Graphistry
description: Learn how to use Graphistry for large-scale graph visualization with GPU acceleration through Azure Marketplace.
ms.reviewer: royo
ms.topic: conceptual
ms.date: 08/27/2025
---

# Graph visualization with Graphistry

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Graphistry is a GPU-accelerated graph visualization platform that excels at visualizing large-scale graphs with millions of nodes and edges. It's available through the Azure Marketplace and provides professional-grade performance for enterprise graph analytics scenarios.

## Overview

Graphistry is ideal for scenarios requiring:

- **Large-scale visualization**: Handle millions of nodes and edges with smooth interaction
- **High-performance analytics**: GPU acceleration for complex graph algorithms
- **Professional deployment**: Enterprise-grade security, scalability, and support
- **Advanced interactivity**: Sophisticated filtering, search, and analysis capabilities

## Key capabilities

### Performance and scale

- **GPU acceleration**: Utilizes graphics processing units for high-performance rendering
- **Massive graphs**: Handle datasets with millions of nodes and edges
- **Real-time interaction**: Smooth zooming, panning, and filtering even with large datasets
- **Efficient algorithms**: Optimized layout algorithms for complex graph structures

### Advanced analytics

- **Pattern detection**: Identify clusters, communities, and anomalies in large graphs
- **Temporal analysis**: Visualize how graphs evolve over time
- **Multi-dimensional filtering**: Filter by multiple node and edge attributes simultaneously
- **Graph algorithms**: Built-in centrality measures, pathfinding, and community detection

### Enterprise features

- **Security**: Role-based access control and data encryption
- **Scalability**: Horizontal scaling for large deployments  
- **Integration**: REST APIs and connectors for various data sources
- **Collaboration**: Share visualizations and insights across teams

## Azure Marketplace deployment

### Prerequisites

- Azure subscription with appropriate permissions
- Resource group for Graphistry deployment
- Network configuration for data access

### Deployment steps

1. **Access Azure Marketplace**:
   - Navigate to the Azure portal
   - Search for "Graphistry" in the Azure Marketplace
   - Select the appropriate Graphistry offering

2. **Configure deployment**:
   - Choose your Azure subscription and resource group
   - Select the appropriate VM size (GPU-enabled instances recommended)
   - Configure network settings and security groups
   - Set up authentication and access controls

3. **Complete installation**:
   - Review deployment settings
   - Accept licensing terms
   - Deploy the Graphistry instance
   - Wait for deployment completion (typically 10-15 minutes)

4. **Initial configuration**:
   - Access the Graphistry web interface
   - Configure data source connections
   - Set up user accounts and permissions
   - Test connectivity to your Kusto clusters

## Connecting to Kusto data

### Data export options

Graphistry can connect to your graph data through several methods:

#### Option 1: Direct database connection

```kusto
// Export graph data for Graphistry ingestion
graph("BloodHound_AD")
| graph-to-table nodes with_node_id=id
| project id, nodeType = labels[0], properties = bag_pack_columns(*)
| export async data to blob("https://storage.blob.core.windows.net/container/nodes.json")
```

```kusto
graph("BloodHound_AD") 
| graph-to-table edges with_source_id=source with_target_id=target
| project source, target, edgeType = labels[0], properties = bag_pack_columns(*)
| export async data to blob("https://storage.blob.core.windows.net/container/edges.json")
```

#### Option 2: Real-time streaming

```kusto
// Stream real-time graph updates to Event Hub
.create table GraphUpdates (
    updateType: string,
    nodeId: string,
    sourceId: string,
    targetId: string,
    timestamp: datetime,
    properties: dynamic
)

// Stream updates to Event Hub for Graphistry consumption
GraphUpdates
| where timestamp >= ago(5m)
| export data to eventhub("graphistry-updates")
```

#### Option 3: API integration

Configure Graphistry to periodically fetch data using Kusto REST APIs:

```json
{
  "datasource": {
    "type": "kusto",
    "cluster": "https://your-cluster.kusto.windows.net",
    "database": "your-database",
    "nodeQuery": "graph('GraphName') | graph-to-table nodes",
    "edgeQuery": "graph('GraphName') | graph-to-table edges",
    "refreshInterval": "5m"
  }
}
```

## Visualization examples

### Security graph analysis

Graphistry excels at visualizing security relationships and attack paths:

**BloodHound Active Directory Analysis:**

The BloodHound AD dataset from the sample graphs demonstrates Graphistry's capabilities with complex security data:

- **Nodes**: Users, computers, groups, domains (13,547 nodes)
- **Edges**: Permissions, group memberships, authentication paths (808,157 edges)
- **Use cases**: Attack path analysis, privilege escalation detection, access review

**Key insights available through Graphistry:**

- **Attack path discovery**: Visualize potential paths from compromised accounts to high-value targets
- **Privilege analysis**: Understand complex permission inheritance patterns
- **Anomaly detection**: Identify unusual access patterns or permissions
- **Temporal analysis**: Track how access patterns change over time

### Network topology visualization

For network and infrastructure monitoring:

```kusto
// Create network topology graph
let NetworkDevices = datatable(deviceId:string, deviceType:string, location:string, importance:int)[
    "router-01", "router", "datacenter-1", 10,
    "switch-01", "switch", "datacenter-1", 8,
    "firewall-01", "firewall", "perimeter", 10,
    "server-01", "server", "datacenter-1", 7
    // ... thousands more devices
];
let NetworkConnections = datatable(source:string, target:string, connectionType:string, bandwidth:real)[
    "router-01", "switch-01", "ethernet", 10.0,
    "firewall-01", "router-01", "ethernet", 1.0,
    // ... hundreds of thousands of connections  
];
// Export to Graphistry for visualization
```

## Advanced features

### Multi-layered analysis

Graphistry supports complex multi-dimensional analysis:

- **Layer filtering**: Show/hide different types of relationships
- **Time-based analysis**: Scrub through temporal data
- **Attribute-based coloring**: Color nodes and edges by various properties
- **Size-based encoding**: Node size based on centrality or importance metrics

### Interactive exploration

- **Drill-down capabilities**: Click on nodes to explore neighborhoods
- **Search and filter**: Find specific nodes or patterns within large graphs  
- **Path analysis**: Trace paths between any two nodes
- **Clustering**: Automatically identify and highlight communities

### Collaboration features

- **Shared workspaces**: Collaborate on graph analysis with team members
- **Annotation tools**: Add comments and observations to specific graph areas
- **Export capabilities**: Save visualizations as images or interactive web pages
- **Presentation mode**: Create guided tours through graph discoveries

## Best practices

### Data preparation

- **Optimize data export**: Use efficient formats like Parquet or compressed JSON
- **Property selection**: Include only necessary node and edge properties
- **Data validation**: Ensure node IDs are consistent between nodes and edges
- **Incremental updates**: Use streaming for real-time scenarios

### Performance optimization

- **GPU hardware**: Use GPU-enabled Azure VMs for best performance
- **Memory management**: Ensure sufficient RAM for your dataset size
- **Network configuration**: Optimize network connectivity between Kusto and Graphistry
- **Batch processing**: Process large datasets in manageable chunks

### Security considerations

- **Access controls**: Configure appropriate user permissions and roles
- **Data encryption**: Ensure data is encrypted in transit and at rest
- **Network security**: Use private endpoints and VPN connections where appropriate
- **Audit logging**: Enable logging for compliance and monitoring

## Licensing and costs

### Commercial licensing

Graphistry is a commercial product with various licensing options:

- **Developer licenses**: For development and testing scenarios
- **Professional licenses**: For production use with support
- **Enterprise licenses**: For large-scale deployments with advanced features

### Azure infrastructure costs

Consider the following Azure costs:

- **Virtual machine costs**: GPU-enabled VMs are more expensive than standard compute
- **Storage costs**: For data staging and caching
- **Network costs**: Data transfer between services
- **Additional services**: Event Hubs, Storage Accounts, etc.

### ROI considerations

- **Time savings**: Faster insight discovery compared to traditional tools
- **Scale benefits**: Handle larger datasets than alternative solutions
- **Professional support**: Commercial support reduces operational overhead
- **Advanced analytics**: Sophisticated analysis capabilities justify premium pricing

## Integration patterns

### Automated workflows

```kusto
// Automated export for regular Graphistry updates
.create function ExportForGraphistry() {
    let nodes = graph("ProductionGraph") 
                | graph-to-table nodes 
                | project id = nodeId, type = labels[0], properties = bag_pack_columns(*);
    let edges = graph("ProductionGraph")
                | graph-to-table edges
                | project source = sourceId, target = targetId, 
                         type = labels[0], properties = bag_pack_columns(*);
    // Export to shared storage location
    nodes | export async data to blob("container/nodes.parquet");
    edges | export async data to blob("container/edges.parquet");
}

// Schedule regular updates
.create table GraphistrySchedule (lastUpdate: datetime)
```

### Real-time monitoring

Combine Kusto's real-time capabilities with Graphistry's visualization:

- **Continuous ingestion**: Stream data into Kusto from various sources
- **Incremental processing**: Update graph models with new data
- **Change detection**: Identify and visualize graph changes
- **Alert integration**: Trigger alerts based on graph patterns

## Troubleshooting

### Common deployment issues

**Installation problems:**

- Verify Azure permissions for marketplace deployments
- Check GPU driver compatibility and updates
- Ensure adequate VM sizing for your dataset

**Connectivity issues:**

- Configure network security groups appropriately
- Verify Kusto cluster accessibility from Graphistry
- Test authentication and authorization settings

### Performance troubleshooting

**Slow visualization:**

- Increase VM size or add GPU resources
- Optimize data export formats and compression
- Reduce dataset size through sampling or filtering

**Memory issues:**

- Monitor memory usage and increase VM RAM
- Implement data paging for very large graphs
- Use incremental loading for massive datasets

## Related content

- [Graph visualization overview](graph-visualization-overview.md)
- [Graph sample data](graph-sample-data.md)
- [Graph operators](graph-operators.md)
- [Large-scale graph best practices](graph-best-practices.md)
- [Azure Marketplace](https://azuremarketplace.microsoft.com/)
