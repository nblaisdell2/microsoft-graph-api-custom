import "isomorphic-fetch";
import { ClientSecretCredential } from "@azure/identity";
import { Client, PageCollection } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

import { AppSettings } from "./appSettings";

let _settings: AppSettings | undefined = undefined;
let _clientSecretCredential: ClientSecretCredential | undefined = undefined;
let _appClient: Client | undefined = undefined;

export function initializeGraphAPIClient(settings: AppSettings) {
  // Ensure settings isn't null
  if (!settings) {
    throw new Error("Settings cannot be undefined");
  }

  _settings = settings;

  if (!_clientSecretCredential) {
    _clientSecretCredential = new ClientSecretCredential(
      _settings.tenantId,
      _settings.clientId,
      _settings.clientSecret
    );
  }

  if (!_appClient) {
    const authProvider = new TokenCredentialAuthenticationProvider(
      _clientSecretCredential,
      {
        scopes: ["https://graph.microsoft.com/.default"],
      }
    );

    // Initialize the client object, so we can make API calls going forward
    _appClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });
  }
}

export async function getAppOnlyTokenAsync(): Promise<string> {
  // Ensure credential isn't undefined
  if (!_clientSecretCredential) {
    throw new Error("Graph has not been initialized for app-only auth");
  }

  // Request token with given scopes
  const response = await _clientSecretCredential.getToken([
    "https://graph.microsoft.com/.default",
  ]);
  return response.token;
}

export async function getUsersAsync(): Promise<PageCollection> {
  // Ensure client isn't undefined
  if (!_appClient) {
    throw new Error("Graph has not been initialized for app-only auth");
  }

  return _appClient
    ?.api("/users")
    .select(["displayName", "id", "mail"])
    .top(25)
    .orderby("displayName")
    .get();
}

// This function serves as a playground for testing Graph snippets
// or other code
export async function makeGraphCallAsync() {
  // INSERT YOUR CODE HERE
}
