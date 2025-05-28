// DEPLOY SCRIPT VERSION 2.6 - MINIMAL LOGGING WITH ERROR REPORTING
// Minimal logging version for production deployment with essential error reporting

import { Account, Contract, ec, json, stark, hash, CallData, RpcProvider } from "starknet";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Constants
const DEPLOYMENTS_DIR = path.resolve(__dirname, "../deployments");
const STARKNET_DEVNET_URL = process.env.STARKNET_DEVNET_URL || "http://starknet-devnet:5050";
const DEBUG_DIR = path.resolve(__dirname, "../temp_debug");

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

// Contract name mapping
const CONTRACT_TYPE_TO_PATTERN: Record<string, string[]> = {
  "prediction": ["prediction", "prophecy_sunya::prediction", "prophecy_sunya_prediction"],
  "nft": ["nft", "prophecy_sunya::nft", "prophecy_sunya_nft"],
  "gas_tank": ["gas_tank", "gas", "prophecy_sunya::gas_tank", "prophecy_sunya_gas_tank"],
  "oracle": ["oracle", "prophecy_sunya::oracle", "prophecy_sunya_oracle"],
  "governance": ["governance", "prophecy_sunya::governance", "prophecy_sunya_governance"],
  "bridge": ["bridge", "prophecy_sunya::bridge", "prophecy_sunya_bridge"]
};

// Create required directories if they don't exist
function ensureDirectoryExists(dirPath: string): void {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`Creating directory: ${dirPath}`);
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Error creating directory ${dirPath}: ${error}`);
  }
}

// Safe file write that doesn't throw if directory doesn't exist
function safeWriteFileSync(filePath: string, content: string): boolean {
  try {
    // Ensure the directory exists
    const dirPath = path.dirname(filePath);
    ensureDirectoryExists(dirPath);
    
    // Write the file
    fs.writeFileSync(filePath, content);
    console.log(`Successfully wrote file: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}: ${error}`);
    return false;
  }
}

// Create deployments directory if it doesn't exist
ensureDirectoryExists(DEPLOYMENTS_DIR);

// Create debug directory if it doesn't exist
ensureDirectoryExists(DEBUG_DIR);

// Helper function to generate a random salt
function generateRandomSalt(): string {
  return "0x" + crypto.randomBytes(32).toString("hex");
}

// Main deployment function
async function main(): Promise<void> {
  console.log("Starting contract deployment...");
  
  // Check if target directory exists
  const targetDir = path.resolve(__dirname, "../target");
  if (!fs.existsSync(targetDir)) {
    console.error("Target directory not found. Make sure contracts are built with 'scarb build'");
    throw new Error("Target directory not found");
  }
  
  // Connect to Starknet provider
  console.log(`Connecting to Starknet node at ${STARKNET_DEVNET_URL}...`);
  const provider = new RpcProvider({ nodeUrl: STARKNET_DEVNET_URL });
  
  // Get pre-funded account from Devnet
  console.log("Fetching pre-funded accounts from Devnet...");
  let account: Account;
  try {
    const response = await fetch(`${STARKNET_DEVNET_URL}/predeployed_accounts`);
    
    if (response.ok) {
      const predeployedAccounts = await response.json();
      if (predeployedAccounts && predeployedAccounts.length > 0) {
        const accountData = predeployedAccounts[0];
        account = new Account(provider, accountData.address, accountData.private_key);
        console.log(`Using account: ${accountData.address}`);
      } else {
        throw new Error("No accounts found in response");
      }
    } else {
      throw new Error(`Failed to fetch accounts: ${response.statusText}`);
    }
  } catch (error) {
    console.log("Using fallback account due to error:", error);
    // Use fallback account
    const privateKey = "0x71d7bb07b9a64f6f78ac4c816aff4da9";
    const accountAddress = "0x64b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691";
    account = new Account(provider, accountAddress, privateKey);
    console.log(`Using fallback account: ${accountAddress}`);
  }
  
  // Find and parse the starknet_artifacts.json file
  let artifacts;
  try {
    artifacts = findStarknetArtifacts();
    console.log("Successfully loaded contract artifacts");
  } catch (error) {
    console.error("Failed to find or parse artifacts:", error);
    throw error;
  }
  
  // Initialize deployments object with proper typing
  const deployments: Deployments = {};
  
  // Deploy Prediction Contract
  console.log("Deploying Prediction Contract...");
  try {
    const predictionDeployment = await deployContract(account, provider, "prediction", artifacts);
    deployments.prediction = predictionDeployment;
    console.log(`Prediction Contract deployed at: ${predictionDeployment.address}`);
  } catch (error) {
    console.error("Failed to deploy prediction contract:", error);
    // Continue with other deployments
  }
  
  // Deploy NFT Contract
  console.log("Deploying NFT Contract...");
  try {
    const nftDeployment = await deployContract(account, provider, "nft", artifacts);
    deployments.nft = nftDeployment;
    console.log(`NFT Contract deployed at: ${nftDeployment.address}`);
  } catch (error) {
    console.error("Failed to deploy NFT contract:", error);
    // Continue with other deployments
  }
  
  // Deploy Gas Tank Contract
  console.log("Deploying Gas Tank Contract...");
  try {
    const gasTankDeployment = await deployContract(account, provider, "gas_tank", artifacts);
    deployments.gasTank = gasTankDeployment;
    console.log(`Gas Tank Contract deployed at: ${gasTankDeployment.address}`);
  } catch (error) {
    console.error("Failed to deploy gas tank contract:", error);
    // Continue with other deployments
  }
  
  // Deploy Oracle Contract
  console.log("Deploying Oracle Contract...");
  try {
    const oracleDeployment = await deployContract(account, provider, "oracle", artifacts);
    deployments.oracle = oracleDeployment;
    console.log(`Oracle Contract deployed at: ${oracleDeployment.address}`);
  } catch (error) {
    console.error("Failed to deploy oracle contract:", error);
    // Continue with other deployments
  }
  
  // Deploy Governance Contract
  console.log("Deploying Governance Contract...");
  try {
    const governanceDeployment = await deployContract(account, provider, "governance", artifacts);
    deployments.governance = governanceDeployment;
    console.log(`Governance Contract deployed at: ${governanceDeployment.address}`);
  } catch (error) {
    console.error("Failed to deploy governance contract:", error);
    // Continue with other deployments
  }
  
  // Deploy Bridge Contract
  console.log("Deploying Bridge Contract...");
  try {
    const bridgeDeployment = await deployContract(account, provider, "bridge", artifacts);
    deployments.bridge = bridgeDeployment;
    console.log(`Bridge Contract deployed at: ${bridgeDeployment.address}`);
  } catch (error) {
    console.error("Failed to deploy bridge contract:", error);
    // Continue with other deployments
  }
  
  // Save deployments
  const deploymentsPath = path.join(DEPLOYMENTS_DIR, "devnet_latest.json");
  const deploymentsWritten = safeWriteFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  if (deploymentsWritten) {
    console.log(`Deployments saved to ${deploymentsPath}`);
  } else {
    console.warn(`Could not save deployments to ${deploymentsPath}`);
  }
  
  // Check if any contracts were deployed
  const deployedContracts = Object.keys(deployments).filter(key => deployments[key as keyof Deployments]);
  if (deployedContracts.length > 0) {
    console.log(`Successfully deployed ${deployedContracts.length} contracts: ${deployedContracts.join(', ')}`);
  } else {
    console.error("No contracts were successfully deployed");
    process.exit(1);
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
            const artifactPath = path.join(dir, file);
            console.log(`Found artifacts file: ${artifactPath}`);
            const artifactContent = fs.readFileSync(artifactPath, 'utf8');
            
            // Save artifact content for debugging - using safe write that won't throw
            const debugPath = path.join(DEBUG_DIR, "artifact_content.json");
            safeWriteFileSync(debugPath, JSON.stringify(JSON.parse(artifactContent), null, 2));
            
            return JSON.parse(artifactContent);
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Error checking directory ${dir}:`, error);
      // Continue checking other directories
    }
  }
  
  throw new Error("Could not find starknet_artifacts.json file. Make sure contracts are built with 'scarb build'");
}

// Helper function to find contract key in artifacts
function findContractKey(contractType: string, artifacts: any): string | undefined {
  if (!artifacts || !artifacts.contracts) {
    console.error("Invalid artifacts structure");
    return undefined;
  }
  
  const contractKeys = Object.keys(artifacts.contracts);
  
  // Get patterns to match for this contract type
  const patterns = CONTRACT_TYPE_TO_PATTERN[contractType] || [contractType];
  
  // Try to find a match using the patterns
  for (const pattern of patterns) {
    const matchingKey = contractKeys.find(key => 
      key.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (matchingKey) {
      return matchingKey;
    }
  }
  
  // If no match found, try a more flexible approach
  
  // If contractType is "prediction", try to find any contract
  if (contractType === "prediction") {
    // Just return the first contract as a fallback
    if (contractKeys.length > 0) {
      console.log(`Using first available contract as fallback: ${contractKeys[0]}`);
      return contractKeys[0];
    }
  }
  
  // Try to match by module name
  const modulePattern = new RegExp(`${contractType}::`, 'i');
  const moduleMatch = contractKeys.find(key => modulePattern.test(key));
  if (moduleMatch) {
    return moduleMatch;
  }
  
  console.error(`Could not find contract for type "${contractType}" in artifacts`);
  return undefined;
}

// Helper function to deploy a contract
async function deployContract(account: Account, provider: RpcProvider, contractType: string, artifacts: any): Promise<DeploymentResult> {
  try {
    // Find the contract in the artifacts
    const contractKey = findContractKey(contractType, artifacts);
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
    let declareResponse;
    try {
      // Check if contract is already declared
      const classHash = hash.computeContractClassHash(compiledContractSierra);
      try {
        await provider.getClassByHash(classHash);
        console.log(`Contract ${contractType} already declared with class hash: ${classHash}`);
      } catch (e) {
        // Contract not declared, declare it
        console.log(`Declaring ${contractType} contract...`);
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
    // Generate a random salt using crypto
    const salt = generateRandomSalt();
    console.log(`Deploying ${contractType} contract...`);
    const deployResponse = await account.deployContract({
      classHash: declareResponse ? declareResponse.class_hash : hash.computeContractClassHash(compiledContractSierra),
      constructorCalldata,
      salt,
    });
    
    // Wait for transaction to be accepted
    await provider.waitForTransaction(deployResponse.transaction_hash);
    
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
  .then(() => {
    console.log("Deployment completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
