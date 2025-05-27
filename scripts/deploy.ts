// DEPLOY SCRIPT VERSION 2.2 - PROVIDER TYPE FIX
console.log("Running deployment script v2.2 with Provider type fix");

import { Account, Contract, ec, json, stark, hash, CallData, RpcProvider } from "starknet";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Constants
const DEPLOYMENTS_DIR = path.resolve(__dirname, "../deployments");
const STARKNET_DEVNET_URL = process.env.STARKNET_DEVNET_URL || "http://starknet-devnet:5050";

// Types
interface DeploymentResult {
  classHash: string;
  address: string;
  transactionHash: string;
}

interface Deployments {
  prediction?: DeploymentResult;
  nft?: DeploymentResult;
  gasTank?: DeploymentResult;
  oracle?: DeploymentResult;
  governance?: DeploymentResult;
  bridge?: DeploymentResult;
}

// Create deployments directory if it doesn't exist
if (!fs.existsSync(DEPLOYMENTS_DIR)) {
  fs.mkdirSync(DEPLOYMENTS_DIR, { recursive: true });
}

// Helper function to generate a random salt
function generateRandomSalt(): string {
  return "0x" + crypto.randomBytes(32).toString("hex");
}

// Main deployment function
async function main(): Promise<void> {
  console.log("Starting contract deployment with Provider type fix...");
  
  // Check if target directory exists
  const targetDir = path.resolve(__dirname, "../target");
  if (fs.existsSync(targetDir)) {
    console.log(`Target directory exists at ${targetDir}`);
    console.log("Contents of target directory:");
    listDirectoryContents(targetDir);
  } else {
    console.error(`Target directory does not exist at ${targetDir}`);
    throw new Error("Target directory not found. Make sure contracts are built with 'scarb build'");
  }
  
  // Connect to Starknet provider
  console.log(`Connecting to Starknet node at ${STARKNET_DEVNET_URL}...`);
  const provider = new RpcProvider({ nodeUrl: STARKNET_DEVNET_URL });
  
  // Get pre-funded account from Devnet
  console.log("Fetching pre-funded accounts from Devnet...");
  let account: Account;
  try {
    console.log("Trying to fetch accounts from endpoint: /predeployed_accounts");
    const response = await fetch(`${STARKNET_DEVNET_URL}/predeployed_accounts`);
    console.log(`Response status from ${STARKNET_DEVNET_URL}/predeployed_accounts: ${response.status}`);
    
    if (response.ok) {
      console.log("Found accounts at endpoint: /predeployed_accounts");
      const predeployedAccounts = await response.json();
      if (predeployedAccounts && predeployedAccounts.length > 0) {
        const accountData = predeployedAccounts[0];
        account = new Account(provider, accountData.address, accountData.private_key);
        console.log(`Using account: ${accountData.address}`);
        console.log(`Private key: ${accountData.private_key.substring(0, 10)}... (truncated)`);
      } else {
        throw new Error("No accounts found in response");
      }
    } else {
      throw new Error(`Failed to fetch accounts: ${response.statusText}`);
    }
  } catch (error) {
    console.log("No accounts found from API, using fallback accounts");
    // Use fallback account
    const privateKey = "0x71d7bb07b9a64f6f78ac4c816aff4da9";
    const accountAddress = "0x64b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691";
    account = new Account(provider, accountAddress, privateKey);
    console.log(`Using account: ${accountAddress}`);
    console.log(`Private key: ${privateKey.substring(0, 10)}... (truncated)`);
  }
  
  // Initialize deployments object with proper typing
  const deployments: Deployments = {};
  
  // Deploy Prediction Contract
  console.log("Deploying Prediction Contract...");
  const predictionDeployment = await deployContract(account, provider, "prediction");
  deployments.prediction = predictionDeployment;
  
  // Deploy NFT Contract
  console.log("Deploying NFT Contract...");
  const nftDeployment = await deployContract(account, provider, "nft");
  deployments.nft = nftDeployment;
  
  // Deploy Gas Tank Contract
  console.log("Deploying Gas Tank Contract...");
  const gasTankDeployment = await deployContract(account, provider, "gas_tank");
  deployments.gasTank = gasTankDeployment;
  
  // Deploy Oracle Contract
  console.log("Deploying Oracle Contract...");
  const oracleDeployment = await deployContract(account, provider, "oracle");
  deployments.oracle = oracleDeployment;
  
  // Deploy Governance Contract
  console.log("Deploying Governance Contract...");
  const governanceDeployment = await deployContract(account, provider, "governance");
  deployments.governance = governanceDeployment;
  
  // Deploy Bridge Contract
  console.log("Deploying Bridge Contract...");
  const bridgeDeployment = await deployContract(account, provider, "bridge");
  deployments.bridge = bridgeDeployment;
  
  // Save deployments
  const deploymentsPath = path.join(DEPLOYMENTS_DIR, "devnet_latest.json");
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  console.log(`Deployments saved to ${deploymentsPath}`);
  
  console.log("All contracts deployed successfully!");
}

// Helper function to recursively list directory contents
function listDirectoryContents(dir: string, indent: string = ''): void {
  try {
    const files = fs.readdirSync(dir);
    console.log(`Files in ${dir}: ${JSON.stringify(files)}`);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        console.log(`Checking directory: ${filePath}`);
        listDirectoryContents(filePath, indent + '  ');
      }
    });
  } catch (error) {
    console.error(`Directory does not exist: ${dir}`);
  }
}

// Helper function to find and parse the starknet_artifacts.json file
function findStarknetArtifacts(): any {
  // Try multiple potential locations
  const potentialDirs = [
    path.resolve(__dirname, "../target/dev"),
    path.resolve(__dirname, "../target/release"),
    path.resolve(__dirname, "../target")
  ];
  
  for (const dir of potentialDirs) {
    try {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.endsWith('.starknet_artifacts.json')) {
            console.log(`Found artifacts file: ${path.join(dir, file)}`);
            return JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
          }
        }
      }
    } catch (error) {
      console.error(`Error checking directory ${dir}:`, error);
    }
  }
  
  throw new Error("Could not find starknet_artifacts.json file. Make sure contracts are built with 'scarb build'");
}

// Helper function to deploy a contract
async function deployContract(account: Account, provider: RpcProvider, contractType: string): Promise<DeploymentResult> {
  try {
    // Find and parse the starknet_artifacts.json file
    const artifacts = findStarknetArtifacts();
    
    // Find the contract in the artifacts
    const contractKey = Object.keys(artifacts.contracts).find(key => key.includes(contractType));
    if (!contractKey) {
      throw new Error(`Could not find contract for type "${contractType}" in artifacts`);
    }
    
    console.log(`Found contract in artifacts: ${contractKey}`);
    const contractArtifact = artifacts.contracts[contractKey];
    
    // Extract the Sierra and CASM artifacts
    const compiledContractSierra = contractArtifact.sierra;
    const compiledContractCasm = contractArtifact.casm;
    
    if (!compiledContractSierra || !compiledContractCasm) {
      throw new Error(`Missing Sierra or CASM artifacts for contract "${contractType}"`);
    }
    
    // Declare contract
    console.log(`Declaring ${contractType} contract...`);
    let declareResponse;
    try {
      // Check if contract is already declared
      const classHash = hash.computeContractClassHash(compiledContractSierra);
      try {
        await provider.getClassByHash(classHash);
        console.log(`Contract ${contractType} already declared with class hash: ${classHash}`);
      } catch (e) {
        // Contract not declared, declare it
        declareResponse = await account.declare({
          contract: compiledContractSierra,
          casm: compiledContractCasm,
        });
        
        // Wait for transaction to be accepted
        await provider.waitForTransaction(declareResponse.transaction_hash);
        console.log(`Contract ${contractType} declared with transaction hash: ${declareResponse.transaction_hash}`);
      }
    } catch (error) {
      console.error(`Error declaring contract ${contractType}:`, error);
      throw error;
    }
    
    // Prepare constructor calldata (empty for now)
    const constructorCalldata: string[] = [];
    
    // Deploy contract
    console.log(`Deploying ${contractType} contract...`);
    // Generate a random salt using crypto
    const salt = generateRandomSalt();
    const deployResponse = await account.deployContract({
      classHash: declareResponse ? declareResponse.class_hash : hash.computeContractClassHash(compiledContractSierra),
      constructorCalldata,
      salt,
    });
    
    // Wait for transaction to be accepted
    await provider.waitForTransaction(deployResponse.transaction_hash);
    
    console.log(`Contract ${contractType} deployed at address: ${deployResponse.contract_address}`);
    
    return {
      classHash: declareResponse ? declareResponse.class_hash : hash.computeContractClassHash(compiledContractSierra),
      address: deployResponse.contract_address,
      transactionHash: deployResponse.transaction_hash,
    };
  } catch (error) {
    console.error(`Error deploying contract ${contractType}:`, error);
    throw error;
  }
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
