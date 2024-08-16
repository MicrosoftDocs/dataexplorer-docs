from azure.identity import DefaultAzureCredential
from azure.mgmt.kusto import KustoManagementClient
from azure.mgmt.kusto import models
import time
from azure.core.exceptions import HttpResponseError 

subscription_id = "{subscriptionId}"
resource_group_name = "{resourceGroupName}"
cluster_name = "{clusterName}"

client = KustoManagementClient(DefaultAzureCredential(), subscription_id)
lro_poller = client.clusters.begin_update(resource_group_name, cluster_name, models.ClusterUpdate.from_dict({"zones": ["1", "2", "3"]}))

while (not(lro_poller.done())):
    time.sleep(60)

print (f"status: {lro_poller.status()}")

try:
    lro_poller.result()
except HttpResponseError as e:
    print (f"Exception: {e}")