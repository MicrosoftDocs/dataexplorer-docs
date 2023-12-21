using Azure.Core;
using Azure.ResourceManager.Kusto;
using Azure.ResourceManager.Kusto.Models;
using ArmClient = Azure.ResourceManager.ArmClient;
using ClientSecretCredential = Azure.Identity.ClientSecretCredential;
using WaitUntil = Azure.WaitUntil;

var tenantId = "{tenantId}";
var clientId = "{clientId}";
var clientSecret = "{clientSecret}";
var subscriptionId = "{subscriptionId}";
var resourceGroupName = "{resourceGroupName}";
var clusterName = "{clusterName}";

var credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
var resourceManagementClient = new ArmClient(credentials, subscriptionId);
var resourceIdentifier = new ResourceIdentifier($"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Kusto/Clusters/{clusterName}");
var cluster = resourceManagementClient.GetKustoClusterResource(resourceIdentifier);

var kustoClusterPatch = new KustoClusterPatch(AzureLocation.NorthEurope);
kustoClusterPatch.Zones.Clear();
kustoClusterPatch.Zones.Add("1");
kustoClusterPatch.Zones.Add("2");
kustoClusterPatch.Zones.Add("3");

var armOperation = await cluster.UpdateAsync(WaitUntil.Started, kustoClusterPatch).ConfigureAwait(false);

var response = armOperation.UpdateStatus();
Console.WriteLine($"ClientRequestId: {response.ClientRequestId}");

while (true)
{
  Console.WriteLine($"{DateTime.UtcNow:o} {response.Status, -5} {response.ReasonPhrase}");
  if (armOperation.HasCompleted)
    break;

  await Task.Delay(60000).ConfigureAwait(false);
  response = await armOperation.UpdateStatusAsync().ConfigureAwait(false);
}