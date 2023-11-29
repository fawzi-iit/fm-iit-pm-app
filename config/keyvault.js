const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

const credential = new DefaultAzureCredential();
const vaultName = process.env.KEY_VAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`;

const client = new SecretClient(url, credential);

async function getSecret(secretName) {
    const retrievedSecret = await client.getSecret(secretName);
    return retrievedSecret.value;
}

module.exports = { getSecret };
