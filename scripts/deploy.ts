import { RpcProvider, Account, Contract, json, CallData, constants, hash } from "starknet";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import fetch from "node-fetch";

// Configuration
const DEVNET_URL = "http://starknet-devnet:5050";
const CONTRACTS_DIR = path.resolve(__dirname, "../src");
const DEPLOYMENTS_DIR = path.resolve(__dirname, "../deployments");

// Ensure deployments directory exists
if (!fs.existsSync(DEPLOYMENTS_DIR)) {
  fs.mkdirSync(DEPLOYMENTS_DIR, { recursive: true });
}

// Helper function to find contract files with multiple potential locations
const findContractFile = (contract: string, fileType: "compiled_contract_class" | "contract_class"): string => {
  // Try multiple potential locations
  const potentialDirs = [
    path.resolve(__dirname, "../target/dev"),
    path.resolve(__dirname, "../target/release"),
    path.resolve(__dirname, "../target"),
    // Add workspace member paths based on Scarb.toml
    path.resolve(__dirname, "../target/contracts/prediction"),
    path.resolve(__dirname, "../target/contracts/nft"),
    path.resolve(__dirname, "../target/contracts/gas_tank"),
    path.resolve(__dirname, "../target/contracts/oracle"),
    path.resolve(__dirname, "../target/contracts/governance"),
    path.resolve(__dirname, "../target/contracts/bridge")
  ];
  
  // Debug: List all directories being checked
  console.log(`Searching for ${contract}.${fileType}.json in the following directories:`);
  potentialDirs.forEach(dir => console.log(` - ${dir}`));
  
  // Try to find the file in each potential directory
  for (const dir of potentialDirs) {
    try {
      if (fs.existsSync(dir)) {
        console.log(`Checking directory: ${dir}`);
        const files = fs.readdirSync(dir);
        console.log(`Files in ${dir}:`, files);
        
        const pattern = new RegExp(`.*${contract}\\.${fileType}\\.json$`);
        const matchingFile = files.find((file) => pattern.test(file));
        
        if (matchingFile) {
          console.log(`Found matching file: ${matchingFile} in ${dir}`);
          return path.join(dir, matchingFile);
        }
      } else {
        console.log(`Directory does not exist: ${dir}`);
      }
    } catch (e) {
      console.log(`Error checking directory ${dir}:`, e);
    }
  }
  
  // If we get here, we couldn't find the file
  throw new Error(
    `Could not find ${fileType} file for contract "${contract}". ` +
    `Check if your contract name is correct and build output location.`
  );
};

// Helper function to generate a random salt
function generateRandomSalt(): string {
  return "0x" + crypto.randomBytes(32).toString("hex");
}

// Helper function to get predeployed accounts from Devnet
async function getPredeployedAccounts() {
  try {
    const response = await fetch(`${process.env.STARKNET_DEVNET_URL || DEVNET_URL}/predeployed_accounts`);
    if (!response.ok) {
      throw new Error(`Failed to fetch predeployed accounts: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching predeployed accounts:", error);
    
    // Fallback to hardcoded account if API fails
    // These are the default accounts created by starknet-devnet with seed 0
    return {
      data: [
        {
          address: "0x64b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691",
          private_key: "0x71d7bb07b9a64f6f78ac4c816aff4da9",
          public_key: "0x7e52885445756b313ea16849145363ccb73fb4ab0440dbac333cf9d13de82b9"
        }
      ]
    };
  }
}

// Main function
async function main() {
  console.log("Starting contract deployment...");
  
  // Debug: Check if target directory exists and list contents
  const targetDir = path.resolve(__dirname, "../target");
  if (fs.existsSync(targetDir)) {
    console.log(`Target directory exists at ${targetDir}`);
    console.log("Contents of target directory:");
    listDirectoryContents(targetDir);
  } else {
    console.log(`Target directory does not exist at ${targetDir}`);
  }
  
  // Create provider
  const provider = new RpcProvider({ nodeUrl: process.env.STARKNET_DEVNET_URL || DEVNET_URL });
  
  // Get pre-funded accounts from Devnet
  console.log("Fetching pre-funded accounts from Devnet...");
  const accounts = await getPredeployedAccounts();
  
  if (!accounts.data || accounts.data.length === 0) {
    throw new Error("No pre-funded accounts found in Devnet");
  }
  
  const prefundedAccount = accounts.data[0];
  console.log(`Using account: ${prefundedAccount.address}`);
  console.log(`Private key: ${prefundedAccount.private_key.substring(0, 10)}... (truncated)`);
  
  // Create account instance
  const account = new Account(
    provider,
    prefundedAccount.address,
    prefundedAccount.private_key
  );
  
  // Deploy contracts
  const deployments: Record<string, any> = {};
  
  // Deploy Prediction Contract
  console.log("Deploying Prediction Contract...");
  const predictionDeployment = await deployContract(account, provider, "prophecy_sunya_prediction", {});
  deployments.prediction = predictionDeployment;
  
  // Deploy NFT Contract
  console.log("Deploying NFT Contract...");
  const nftDeployment = await deployContract(account, provider, "prophecy_sunya_nft", {});
  deployments.nft = nftDeployment;
  
  // Deploy Gas Tank Contract
  console.log("Deploying Gas Tank Contract...");
  const gasTankDeployment = await deployContract(account, provider, "prophecy_sunya_gas_tank", {});
  deployments.gasTank = gasTankDeployment;
  
  // Deploy Oracle Contract
  console.log("Deploying Oracle Contract...");
  const oracleDeployment = await deployContract(account, provider, "prophecy_sunya_oracle", {});
  deployments.oracle = oracleDeployment;
  
  // Deploy Governance Contract
  console.log("Deploying Governance Contract...");
  const governanceDeployment = await deployContract(account, provider, "prophecy_sunya_governance", {});
  deployments.governance = governanceDeployment;
  
  // Deploy Bridge Contract
  console.log("Deploying Bridge Contract...");
  const bridgeDeployment = await deployContract(account, provider, "prophecy_sunya_bridge", {});
  deployments.bridge = bridgeDeployment;
  
  // Save deployments
  const deploymentsPath = path.join(DEPLOYMENTS_DIR, "devnet_latest.json");
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  console.log(`Deployments saved to ${deploymentsPath}`);
  
  console.log("All contracts deployed successfully!");
}

// Helper function to recursively list directory contents
function listDirectoryContents(dir: string, indent: string = '') {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        console.log(`${indent}📁 ${file}/`);
        listDirectoryContents(filePath, indent + '  ');
      } else {
        console.log(`${indent}📄 ${file}`);
      }
    });
  } catch (error) {
    console.error(`Error listing directory ${dir}:`, error);
  }
}

// Helper function to deploy a contract
async function deployContract(account: Account, provider: RpcProvider, contractName: string, constructorArgs: any = {}) {
  try {
    // Read contract files
    const compiledContractCasm = JSON.parse(
      fs.readFileSync(findContractFile(contractName, "compiled_contract_class")).toString("ascii")
    );
    
    const compiledContractSierra = JSON.parse(
      fs.readFileSync(findContractFile(contractName, "contract_class")).toString("ascii")
    );
    
    // Declare contract
    console.log(`Declaring ${contractName}...`);
    let declareResponse;
    try {
      // Check if contract is already declared
      const classHash = hash.computeContractClassHash(compiledContractSierra);
      try {
        await provider.getClassByHash(classHash);
        console.log(`Contract ${contractName} already declared with class hash: ${classHash}`);
      } catch (e) {
        // Contract not declared, declare it
        declareResponse = await account.declare({
          contract: compiledContractSierra,
          casm: compiledContractCasm,
        });
        
        // Wait for transaction to be accepted
        await provider.waitForTransaction(declareResponse.transaction_hash);
        console.log(`Contract ${contractName} declared with transaction hash: ${declareResponse.transaction_hash}`);
      }
    } catch (error) {
      console.error(`Error declaring contract ${contractName}:`, error);
      throw error;
    }
    
    // Prepare constructor calldata
    const contractCalldata = new CallData(compiledContractSierra.abi);
    const constructorCalldata = Object.keys(constructorArgs).length > 0 
      ? contractCalldata.compile("constructor", constructorArgs)
      : [];
    
    // Deploy contract
    console.log(`Deploying ${contractName}...`);
    // Generate a random salt using crypto
    const salt = generateRandomSalt();
    const deployResponse = await account.deployContract({
      classHash: declareResponse ? declareResponse.class_hash : hash.computeContractClassHash(compiledContractSierra),
      constructorCalldata,
      salt,
    });
    
    // Wait for transaction to be accepted
    await provider.waitForTransaction(deployResponse.transaction_hash);
    
    console.log(`Contract ${contractName} deployed at address: ${deployResponse.contract_address}`);
    
    return {
      classHash: declareResponse ? declareResponse.class_hash : hash.computeContractClassHash(compiledContractSierra),
      address: deployResponse.contract_address,
      transactionHash: deployResponse.transaction_hash,
    };
  } catch (error) {
    console.error(`Error deploying contract ${contractName}:`, error);
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
