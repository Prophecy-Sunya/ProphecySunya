import { RpcProvider, Account, Contract, json, CallData, constants, hash } from "starknet";
import fs from "fs";
import path from "path";

// Configuration
const DEVNET_URL = "http://starknet-devnet:5050";
const CONTRACTS_DIR = path.resolve(__dirname, "../src");
const TARGET_DIR = path.resolve(__dirname, "../target/dev");
const DEPLOYMENTS_DIR = path.resolve(__dirname, "../deployments");

// Ensure deployments directory exists
if (!fs.existsSync(DEPLOYMENTS_DIR)) {
  fs.mkdirSync(DEPLOYMENTS_DIR, { recursive: true });
}

// Helper function to find contract files
const findContractFile = (contract: string, fileType: "compiled_contract_class" | "contract_class"): string => {
  const files = fs.readdirSync(TARGET_DIR);
  const pattern = new RegExp(`.*${contract}\\.${fileType}\\.json$`);
  const matchingFile = files.find((file) => pattern.test(file));
  
  if (!matchingFile) {
    throw new Error(
      `Could not find ${fileType} file for contract "${contract}". ` +
      `Check if your contract name is correct inside the ${TARGET_DIR} directory.`
    );
  }
  
  return path.join(TARGET_DIR, matchingFile);
};

// Main deployment function
async function main() {
  console.log("Starting deployment process...");
  
  // Connect to Devnet
  console.log(`Connecting to Devnet at ${DEVNET_URL}`);
  const provider = new RpcProvider({ nodeUrl: DEVNET_URL });
  
  // Get pre-funded account from Devnet
  console.log("Fetching pre-funded account from Devnet...");
  const accountsResponse = await fetch(`${DEVNET_URL}/predeployed_accounts`);
  const accounts = await accountsResponse.json();
  
  if (!accounts || accounts.length === 0) {
    throw new Error("No pre-funded accounts found in Devnet");
  }
  
  const prefundedAccount = accounts[0];
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
  const predictionDeployment = await deployContract(account, "prophecy_sunya_prediction", {});
  deployments.prediction = predictionDeployment;
  
  // Deploy NFT Contract
  console.log("Deploying NFT Contract...");
  const nftDeployment = await deployContract(account, "prophecy_sunya_nft", {});
  deployments.nft = nftDeployment;
  
  // Deploy Gas Tank Contract
  console.log("Deploying Gas Tank Contract...");
  const gasTankDeployment = await deployContract(account, "prophecy_sunya_gas_tank", {});
  deployments.gasTank = gasTankDeployment;
  
  // Deploy Oracle Contract
  console.log("Deploying Oracle Contract...");
  const oracleDeployment = await deployContract(account, "prophecy_sunya_oracle", {});
  deployments.oracle = oracleDeployment;
  
  // Deploy Governance Contract
  console.log("Deploying Governance Contract...");
  const governanceDeployment = await deployContract(account, "prophecy_sunya_governance", {});
  deployments.governance = governanceDeployment;
  
  // Deploy Bridge Contract
  console.log("Deploying Bridge Contract...");
  const bridgeDeployment = await deployContract(account, "prophecy_sunya_bridge", {});
  deployments.bridge = bridgeDeployment;
  
  // Save deployments
  const deploymentsPath = path.join(DEPLOYMENTS_DIR, "devnet_latest.json");
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  console.log(`Deployments saved to ${deploymentsPath}`);
  
  console.log("All contracts deployed successfully!");
}

// Helper function to deploy a contract
async function deployContract(account: Account, contractName: string, constructorArgs: any = {}) {
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
      // Use hash.computeContractClassHash instead of stark.computeContractClassHash
      const classHash = hash.computeContractClassHash(compiledContractSierra);
      try {
        // Use the provider directly without accessing private properties
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
    // Use hash.randomAddress instead of stark.randomAddress
    const salt = hash.randomAddress();
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
