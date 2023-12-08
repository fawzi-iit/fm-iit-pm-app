require("dotenv").config();
const mongoose = require("mongoose");
const { getSecret } = require("./keyvault");

async function putKeyVaultSecretInEnvVar() {

    const secretName = process.env.KEY_VAULT_SECRET_NAME_DB_URI;
    const keyVaultName = process.env.KEY_VAULT_NAME;

    console.log(secretName);
    console.log(keyVaultName);
    
    if (!secretName || !keyVaultName) throw Error("getSecret: Required params missing");

    connectionString = await getSecret(secretName, keyVaultName);
    process.env.DB_URI = connectionString;

}

async function getConnectionInfo() {
  if (!process.env.DB_URI) {

    await putKeyVaultSecretInEnvVar();

    // still don't have a database url?
    if(!process.env.DB_URI){
      throw new Error("No value in DB_URI in env var");
    }
  }

  // To override the database name, set the DATABASE_NAME environment variable in the .env file
  const DATABASE_NAME = process.env.DB_NAME || "fm-iit-app";
  
  return {
    DB_URI: process.env.DB_URI,
    DB_NAME: process.env.DB_NAME
  }
}

module.exports = {
  getConnectionInfo
}