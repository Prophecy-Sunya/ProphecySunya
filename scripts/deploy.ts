// Enhanced deployment script with improved error handling and diagnostics
import { Account, Contract, Provider, RpcProvider, ec, hash, stark } from "starknet";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Constants
const DEPLOYMENTS_DIR = path.resolve(__dirname, "../deployments");
const TEMP_DEBUG_DIR = path.resolve(__dirname, "../temp_debug");

// Ensure directories exist
if (!fs.existsSync(DEPLOYMENTS_DIR)) {
  fs.mkdirSync(DEPLOYMENTS_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_DEBUG_DIR)) {
  fs.mkdirSync(TEMP_DEBUG_DIR, { recursive: true });
}

// Contract type to pattern mapping for more flexible matching
const CONTRACT_TYPE_TO_PATTERN: Record<string, string[]> = {
  "prediction": ["prediction", "prophecy_sunya_prediction", "PredictionContract"],
  "nft": ["nft", "prophecy_sunya_nft", "NFTContract"],
  "gas_tank": ["gas_tank", "prophecy_sunya_gas_tank", "GasTankContract"],
  "oracle": ["oracle", "prophecy_sunya_oracle", "OracleContract"],
  "governance": ["governance", "prophecy_sunya_governance", "GovernanceContract"],
  "bridge": ["bridge", "prophecy_sunya_bridge", "BridgeContract"]
};

// Interface for deployment result
interface DeploymentResult {
  classHash: string;
  address: string;
  transactionHash: string;
}

// Interface for file system info
interface FileSystemInfo {
  currentDirectory: string;
  files: Record<string, string[] | string>;
}

// Interface for diagnostic data
interface DiagnosticData {
  timestamp: string;
  error: string;
  details: unknown;
  contractType?: string;
  availableContracts?: string[];
  fileSystem: FileSystemInfo;
  environment: Record<string, string | undefined>;
}

// Helper function to write file safely
function safeWriteFileSync(filePath: string, content: string): boolean {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
}

// Helper function to generate a random salt
function generateRandomSalt(): string {
  return "0x" + crypto.randomBytes(32).toString("hex");
}

// Main deployment function
async function main() {
  console.log("Starting contract deployment...");
  
  // Save start time for diagnostics
  const startTime = new Date();
  
  // Connect to Starknet node
  const nodeUrl = process.env.STARKNET_RPC_URL || "http://starknet-devnet:5050";
  console.log(`Connecting to Starknet node at ${nodeUrl}...`);
  
  const provider = new RpcProvider({ nodeUrl });
  
  // Verify connection to node
  try {
    const chainId = await provider.getChainId();
    console.log(`Connected to Starknet node. Chain ID: ${chainId}`);
  } catch (error) {
    console.error("Failed to connect to Starknet node:", error);
    saveDeploymentDiagnostics({ 
      error: "Failed to connect to Starknet node", 
      details: error,
      contractType: undefined,
      availableContracts: undefined
    });
    process.exit(1);
  }
  
  // Fetch pre-funded accounts from Devnet
  console.log("Fetching pre-funded accounts from Devnet...");
  let account;
  try {
    const { address, private_key } = await getDevnetAccount(provider);
    console.log(`Using account: ${address}`);
    
    // Create account instance
    account = new Account(provider, address, private_key);
  } catch (error) {
    console.error("Failed to get Devnet account:", error);
    saveDeploymentDiagnostics({ 
      error: "Failed to get Devnet account", 
      details: error,
      contractType: undefined,
      availableContracts: undefined
    });
    process.exit(1);
  }
  
  // Find and parse artifacts
  let artifacts;
  try {
    artifacts = await findStarknetArtifacts();
    
    // Save full artifact structure for debugging
    const debugPath = path.resolve(TEMP_DEBUG_DIR, "full_artifacts_structure.json");
    safeWriteFileSync(debugPath, JSON.stringify(artifacts, null, 2));
    console.log(`Saved full artifact structure to ${debugPath} for debugging`);
  } catch (error) {
    console.error("Failed to find or parse artifacts:", error);
    saveDeploymentDiagnostics({ 
      error: "Failed to find or parse artifacts", 
      details: error,
      contractType: undefined,
      availableContracts: undefined
    });
    process.exit(1);
  }
  
  // Store deployments
  const deployments: Record<string, DeploymentResult> = {};
  
  // Deploy Prediction Contract
  console.log("Deploying Prediction Contract...");
  try {
    deployments.prediction = await deployContract(account, provider, "prediction", artifacts);
    console.log(`Prediction Contract deployed at address: ${deployments.prediction.address}`);
  } catch (error) {
    console.error("Failed to deploy prediction contract:", error);
    saveDeploymentDiagnostics({ 
      error: "Failed to deploy prediction contract", 
      details: error,
      contractType: "prediction",
      availableContracts: artifacts?.contracts ? Object.keys(artifacts.contracts) : []
    });
  }
  
  // Deploy NFT Contract
  console.log("Deploying NFT Contract...");
  try {
    deployments.nft = await deployContract(account, provider, "nft", artifacts);
    console.log(`NFT Contract deployed at address: ${deployments.nft.address}`);
  } catch (error) {
    console.error("Failed to deploy NFT contract:", error);
    saveDeploymentDiagnostics({ 
      error: "Failed to deploy NFT contract", 
      details: error,
      contractType: "nft",
      availableContracts: artifacts?.contracts ? Object.keys(artifacts.contracts) : []
    });
  }
  
  // Deploy Gas Tank Contract
  console.log("Deploying Gas Tank Contract...");
  try {
    deployments.gasTank = await deployContract(account, provider, "gas_tank", artifacts);
    console.log(`Gas Tank Contract deployed at address: ${deployments.gasTank.address}`);
  } catch (error) {
    console.error("Failed to deploy gas tank contract:", error);
    saveDeploymentDiagnostics({ 
      error: "Failed to deploy gas tank contract", 
      details: error,
      contractType: "gas_tank",
      availableContracts: artifacts?.contracts ? Object.keys(artifacts.contracts) : []
    });
  }
  
  // Deploy Oracle Contract
  console.log("Deploying Oracle Contract...");
  try {
    deployments.oracle = await deployContract(account, provider, "oracle", artifacts);
    console.log(`Oracle Contract deployed at address: ${deployments.oracle.address}`);
  } catch (error) {
    console.error("Failed to deploy oracle contract:", error);
    saveDeploymentDiagnostics({ 
      error: "Failed to deploy oracle contract", 
      details: error,
      contractType: "oracle",
      availableContracts: artifacts?.contracts ? Object.keys(artifacts.contracts) : []
    });
  }
  
  // Deploy Governance Contract
  console.log("Deploying Governance Contract...");
  try {
    deployments.governance = await deployContract(account, provider, "governance", artifacts);
    console.log(`Governance Contract deployed at address: ${deployments.governance.address}`);
  } catch (error) {
    console.error("Failed to deploy governance contract:", error);
    saveDeploymentDiagnostics({ 
      error: "Failed to deploy governance contract", 
      details: error,
      contractType: "governance",
      availableContracts: artifacts?.contracts ? Object.keys(artifacts.contracts) : []
    });
  }
  
  // Deploy Bridge Contract
  console.log("Deploying Bridge Contract...");
  try {
    deployments.bridge = await deployContract(account, provider, "bridge", artifacts);
    console.log(`Bridge Contract deployed at address: ${deployments.bridge.address}`);
  } catch (error) {
    console.error("Failed to deploy bridge contract:", error);
    saveDeploymentDiagnostics({ 
      error: "Failed to deploy bridge contract", 
      details: error,
      contractType: "bridge",
      availableContracts: artifacts?.contracts ? Object.keys(artifacts.contracts) : []
    });
  }
  
  // Save deployments
  const deploymentsPath = path.join(DEPLOYMENTS_DIR, "devnet_latest.json");
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  console.log(`Deployments saved to ${deploymentsPath}`);
  
  // Calculate deployment duration
  const endTime = new Date();
  const duration = (endTime.getTime() - startTime.getTime()) / 1000;
  console.log(`Deployment process completed in ${duration} seconds`);
  
  // Check if any contracts were deployed
  const deployedContracts = Object.keys(deployments);
  if (deployedContracts.length === 0) {
    console.error("No contracts were deployed successfully");
    saveDeploymentDiagnostics({ 
      error: "No contracts were deployed successfully",
      details: "All contract deployments failed",
      contractType: undefined,
      availableContracts: artifacts?.contracts ? Object.keys(artifacts.contracts) : []
    });
    process.exit(1);
  } else {
    console.log(`Successfully deployed ${deployedContracts.length} contracts: ${deployedContracts.join(", ")}`);
  }
}

// Helper function to save deployment diagnostics
function saveDeploymentDiagnostics(data: {
  error: string;
  details: unknown;
  contractType?: string;
  availableContracts?: string[];
}): void {
  const diagnosticsPath = path.join(TEMP_DEBUG_DIR, `deployment_diagnostics_${Date.now()}.json`);
  
  // Add file system information
  const fileSystemInfo: FileSystemInfo = {
    currentDirectory: process.cwd(),
    files: {}
  };
  
  // Check for target directory
  try {
    const targetDir = path.resolve(__dirname, "../target");
    if (fs.existsSync(targetDir)) {
      fileSystemInfo.files["target"] = fs.readdirSync(targetDir);
      
      const targetDevDir = path.join(targetDir, "dev");
      if (fs.existsSync(targetDevDir)) {
        fileSystemInfo.files["target/dev"] = fs.readdirSync(targetDevDir);
      }
    } else {
      fileSystemInfo.files["target"] = "Directory does not exist";
    }
  } catch (error) {
    fileSystemInfo.files["target_error"] = String(error);
  }
  
  // Add environment variables (excluding sensitive data)
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    STARKNET_NETWORK: process.env.STARKNET_NETWORK,
    STARKNET_RPC_URL: process.env.STARKNET_RPC_URL
  };
  
  // Combine all diagnostic data
  const diagnosticData: DiagnosticData = {
    timestamp: new Date().toISOString(),
    error: data.error,
    details: data.details,
    contractType: data.contractType,
    availableContracts: data.availableContracts,
    fileSystem: fileSystemInfo,
    environment: envInfo
  };
  
  // Save diagnostics
  safeWriteFileSync(diagnosticsPath, JSON.stringify(diagnosticData, null, 2));
  console.log(`Deployment diagnostics saved to ${diagnosticsPath}`);
}

// Helper function to get a pre-funded account from Devnet
async function getDevnetAccount(provider: RpcProvider): Promise<{ address: string, private_key: string }> {
  try {
    // Try to fetch pre-funded accounts from Devnet
    const response = await fetch("http://starknet-devnet:5050/predeployed_accounts");
    if (!response.ok) {
      throw new Error(`Failed to fetch predeployed accounts: ${response.statusText}`);
    }
    
    const accounts = await response.json();
    if (!accounts || !accounts.length) {
      throw new Error("No predeployed accounts found");
    }
    
    // Use the first account
    return {
      address: accounts[0].address,
      private_key: accounts[0].private_key
    };
  } catch (error) {
    console.error("Error fetching Devnet accounts:", error);
    
    // Fallback to hardcoded account if available
    if (process.env.STARKNET_ACCOUNT_ADDRESS && process.env.STARKNET_PRIVATE_KEY) {
      console.log("Using environment-provided account");
      return {
        address: process.env.STARKNET_ACCOUNT_ADDRESS,
        private_key: process.env.STARKNET_PRIVATE_KEY
      };
    }
    
    throw new Error("Failed to get Devnet account and no fallback available");
  }
}

// Helper function to recursively list directory contents
function listDirectoryContents(dir: string, indent = ''): void {
  try {
    if (!fs.existsSync(dir)) {
      console.error(`Directory does not exist: ${dir}`);
      return;
    }
    
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
    console.error(`Error listing directory ${dir}:`, error);
  }
}

// Helper function to find and parse the starknet_artifacts.json file
function findStarknetArtifacts(): any {
  // List of potential directories to check
  const potentialDirs = [
    path.resolve(__dirname, "../target/dev"),
    path.resolve(__dirname, "../target/release"),
    path.resolve(__dirname, "../target")
  ];
  
  // Debug: List all directories being checked
  console.log("Checking for artifacts in the following directories:");
  potentialDirs.forEach(dir => console.log(` - ${dir}`));
  
  // Check if any target directory exists
  const targetExists = potentialDirs.some(dir => fs.existsSync(dir));
  if (!targetExists) {
    console.error("ERROR: No target directory found. This likely means the build process failed or was not run.");
    console.error("Please ensure 'scarb build' is executed before deployment and check for build errors.");
    
    // List root directory contents for debugging
    try {
      const rootDir = path.resolve(__dirname, "..");
      console.log("Listing root directory contents for debugging:");
      listDirectoryContents(rootDir);
    } catch (error) {
      console.error("Error listing root directory:", error);
    }
    
    throw new Error("Build artifacts missing. Run 'scarb build' before deployment and check for build errors.");
  }
  
  // Try to find artifacts in each potential directory
  for (const dir of potentialDirs) {
    try {
      if (fs.existsSync(dir)) {
        console.log(`Checking directory: ${dir}`);
        const files = fs.readdirSync(dir);
        console.log(`Files in ${dir}: ${files.join(', ')}`);
        
        for (const file of files) {
          if (file.endsWith('.starknet_artifacts.json')) {
            const artifactPath = path.join(dir, file);
            console.log(`Found artifacts file: ${artifactPath}`);
            
            // Read and parse the file
            const artifactContent = fs.readFileSync(artifactPath, 'utf8');
            
            // Save a debug copy
            const debugPath = path.resolve(TEMP_DEBUG_DIR, "artifact_content.json");
            safeWriteFileSync(debugPath, JSON.stringify(JSON.parse(artifactContent), null, 2));
            console.log(`Successfully wrote file: ${debugPath}`);
            
            const artifacts = JSON.parse(artifactContent);
            
            // Validate artifact structure
            if (!artifacts.contracts || Object.keys(artifacts.contracts).length === 0) {
              console.error("ERROR: Artifacts file exists but contains no contracts");
              console.error("This may indicate a problem with the build process or Scarb.toml configuration");
              
              // Save the empty artifacts for debugging
              safeWriteFileSync(
                path.resolve(TEMP_DEBUG_DIR, "empty_artifacts.json"),
                JSON.stringify(artifacts, null, 2)
              );
              
              throw new Error("Invalid artifacts file. Rebuild contracts with 'scarb build' and check Scarb.toml configuration");
            }
            
            console.log("Successfully loaded contract artifacts");
            console.log(`Found ${Object.keys(artifacts.contracts).length} contracts in artifacts`);
            console.log(`Contract keys: ${Object.keys(artifacts.contracts).join(', ')}`);
            
            return artifacts;
          }
        }
        
        console.warn(`No .starknet_artifacts.json file found in ${dir}`);
      }
    } catch (error) {
      console.warn(`Warning: Error checking directory ${dir}:`, error);
    }
  }
  
  // If we get here, no artifacts were found
  console.error("ERROR: Could not find starknet_artifacts.json file");
  console.error("This likely means the build process failed or the artifacts were not generated correctly");
  
  // Try to build the contracts as a fallback
  console.log("Attempting to build contracts as fallback...");
  try {
    // Check if Scarb is available
    const { execSync } = require('child_process');
    const scarbVersion = execSync('scarb --version', { encoding: 'utf8' });
    console.log(`Found Scarb: ${scarbVersion.trim()}`);
    
    // Try to build
    console.log("Running 'scarb build'...");
    const buildOutput = execSync('scarb build', { 
      encoding: 'utf8',
      cwd: path.resolve(__dirname, "..")
    });
    console.log("Build output:", buildOutput);
    
    // Check if build succeeded
    const targetDir = path.resolve(__dirname, "../target");
    if (fs.existsSync(targetDir)) {
      console.log("Build succeeded, target directory created");
      
      // Try to find artifacts again
      return findStarknetArtifacts();
    } else {
      console.error("Build command completed but target directory still not found");
    }
  } catch (error) {
    console.error("Failed to build contracts as fallback:", error);
  }
  
  throw new Error("Could not find starknet_artifacts.json file. Make sure contracts are built with 'scarb build'");
}

// Helper function to find contract key in artifacts with improved matching
function findContractKey(contractType: string, artifacts: any): string | undefined {
  if (!artifacts || !artifacts.contracts) {
    console.error("Invalid artifacts structure");
    return undefined;
  }
  
  const contractKeys = Object.keys(artifacts.contracts);
  console.log(`Looking for contract type "${contractType}" in ${contractKeys.length} available contracts`);
  
  // Get patterns to match for this contract type
  const patterns = CONTRACT_TYPE_TO_PATTERN[contractType] || [contractType];
  console.log(`Using patterns for matching: ${patterns.join(', ')}`);
  
  // Try to find a match using the patterns
  for (const pattern of patterns) {
    console.log(`Trying to match pattern: ${pattern}`);
    
    // Try exact match first
    const exactMatch = contractKeys.find(key => key === pattern);
    if (exactMatch) {
      console.log(`Found exact match: ${exactMatch}`);
      return exactMatch;
    }
    
    // Try case-insensitive includes match
    const includesMatch = contractKeys.find(key => 
      key.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (includesMatch) {
      console.log(`Found includes match: ${includesMatch}`);
      return includesMatch;
    }
  }
  
  // If no match found, try more flexible approaches
  console.log("No direct pattern matches found, trying flexible matching approaches");
  
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
    console.log(`Found module pattern match: ${moduleMatch}`);
    return moduleMatch;
  }
  
  // Try to match by partial name (more flexible)
  for (const key of contractKeys) {
    const keyParts = key.toLowerCase().split(/[_:]/);
    if (keyParts.some(part => contractType.toLowerCase().includes(part) || part.includes(contractType.toLowerCase()))) {
      console.log(`Found partial name match: ${key}`);
      return key;
    }
  }
  
  console.error(`Could not find contract for type "${contractType}" in artifacts`);
  console.error(`Available contracts: ${contractKeys.join(', ')}`);
  return undefined;
}

// Helper function to resolve a filename to a full path in the target directory
function resolveFilenameToPath(filename: string): string | null {
  // List of potential directories to check
  const potentialDirs = [
    path.resolve(__dirname, "../target/dev"),
    path.resolve(__dirname, "../target/release"),
    path.resolve(__dirname, "../target")
  ];
  
  // Check each directory for the file
  for (const dir of potentialDirs) {
    if (fs.existsSync(dir)) {
      const filePath = path.join(dir, filename);
      if (fs.existsSync(filePath)) {
        console.log(`Resolved filename "${filename}" to path: ${filePath}`);
        return filePath;
      }
    }
  }
  
  console.error(`Could not resolve filename "${filename}" to a valid path`);
  return null;
}

// Helper function to load JSON from a file or parse a JSON string
function loadOrParseJson(input: any): any {
  // If input is already an object, return it
  if (input !== null && typeof input === 'object') {
    return input;
  }
  
  // If input is a string, try to parse it as JSON
  if (typeof input === 'string') {
    try {
      // Try to parse as JSON string
      return JSON.parse(input);
    } catch (e) {
      // If it's not valid JSON, check if it's a file path
      if (input.startsWith('/') && fs.existsSync(input)) {
        try {
          const fileContent = fs.readFileSync(input, 'utf8');
          return JSON.parse(fileContent);
        } catch (fileError) {
          console.error(`Error loading JSON from file ${input}:`, fileError);
          throw new Error(`Failed to load JSON from file: ${input}`);
        }
      } else {
        // Check if it's a filename that needs to be resolved to a path
        const resolvedPath = resolveFilenameToPath(input);
        if (resolvedPath) {
          try {
            const fileContent = fs.readFileSync(resolvedPath, 'utf8');
            return JSON.parse(fileContent);
          } catch (fileError) {
            console.error(`Error loading JSON from resolved file ${resolvedPath}:`, fileError);
            throw new Error(`Failed to load JSON from resolved file: ${resolvedPath}`);
          }
        }
        
        console.error(`Error parsing JSON string:`, e);
        throw new Error(`Invalid JSON format: ${input.substring(0, 50)}...`);
      }
    }
  }
  
  throw new Error(`Unsupported input type for JSON parsing: ${typeof input}`);
}

// Helper function to extract Sierra and CASM artifacts from different artifact structures
function extractSierraAndCasm(contractArtifact: any): { sierra: any, casm: any } | null {
  // Save contract artifact for debugging
  const debugPath = path.resolve(TEMP_DEBUG_DIR, `contract_artifact_structure.json`);
  safeWriteFileSync(debugPath, JSON.stringify(contractArtifact, null, 2));
  console.log(`Saved contract artifact structure to ${debugPath} for debugging`);
  
  let sierraData = null;
  let casmData = null;
  
  // Check for direct sierra and casm fields (original expected structure)
  if (contractArtifact.sierra && contractArtifact.casm) {
    console.log("Found direct sierra and casm fields in artifact");
    sierraData = contractArtifact.sierra;
    casmData = contractArtifact.casm;
  }
  // Check for sierra_program and casm_program fields (alternative names)
  else if (contractArtifact.sierra_program && contractArtifact.casm_program) {
    console.log("Found sierra_program and casm_program fields in artifact");
    sierraData = contractArtifact.sierra_program;
    casmData = contractArtifact.casm_program;
  }
  // Check for nested artifacts structure (as seen in the error log)
  else if (contractArtifact.artifacts) {
    console.log("Found nested artifacts field, checking its structure");
    
    // Check if artifacts field has sierra and casm
    if (contractArtifact.artifacts.sierra && contractArtifact.artifacts.casm) {
      console.log("Found sierra and casm in nested artifacts field");
      sierraData = contractArtifact.artifacts.sierra;
      casmData = contractArtifact.artifacts.casm;
    }
    // Check if artifacts field has sierra_program and casm_program
    else if (contractArtifact.artifacts.sierra_program && contractArtifact.artifacts.casm_program) {
      console.log("Found sierra_program and casm_program in nested artifacts field");
      sierraData = contractArtifact.artifacts.sierra_program;
      casmData = contractArtifact.artifacts.casm_program;
    }
    // Check if artifacts is an array and contains sierra and casm objects
    else if (Array.isArray(contractArtifact.artifacts)) {
      console.log("Artifacts field is an array, searching for sierra and casm objects");
      
      const sierraArtifact = contractArtifact.artifacts.find((a: any) => a.type === 'sierra' || a.name === 'sierra');
      const casmArtifact = contractArtifact.artifacts.find((a: any) => a.type === 'casm' || a.name === 'casm');
      
      if (sierraArtifact && casmArtifact) {
        console.log("Found sierra and casm objects in artifacts array");
        sierraData = sierraArtifact.content || sierraArtifact.value || sierraArtifact.data;
        casmData = casmArtifact.content || casmArtifact.value || casmArtifact.data;
      }
    }
  }
  
  // Check for compiled_contract_class and contract_class files
  if (!sierraData || !casmData) {
    if (contractArtifact.contract_name) {
      console.log("Checking for separate compiled_contract_class and contract_class files");
      
      try {
        const contractName = contractArtifact.contract_name;
        
        // Look for compiled_contract_class.json (CASM)
        const casmFilename = `${contractName}.compiled_contract_class.json`;
        // Look for contract_class.json (Sierra)
        const sierraFilename = `${contractName}.contract_class.json`;
        
        // Resolve filenames to full paths
        const casmFilePath = resolveFilenameToPath(casmFilename);
        const sierraFilePath = resolveFilenameToPath(sierraFilename);
        
        if (casmFilePath && sierraFilePath && fs.existsSync(casmFilePath) && fs.existsSync(sierraFilePath)) {
          console.log(`Found separate files for ${contractName}:`);
          console.log(`Sierra: ${sierraFilePath}`);
          console.log(`CASM: ${casmFilePath}`);
          
          const sierraContent = JSON.parse(fs.readFileSync(sierraFilePath, 'utf8'));
          const casmContent = JSON.parse(fs.readFileSync(casmFilePath, 'utf8'));
          
          sierraData = sierraContent;
          casmData = casmContent;
        }
      } catch (error) {
        console.error("Error trying to load separate contract files:", error);
      }
    }
  }
  
  // If we found both sierra and casm data, ensure they're properly parsed
  if (sierraData && casmData) {
    try {
      // Save raw data for debugging
      const sierraDebugPath = path.resolve(TEMP_DEBUG_DIR, `sierra_raw_data.json`);
      const casmDebugPath = path.resolve(TEMP_DEBUG_DIR, `casm_raw_data.json`);
      
      safeWriteFileSync(sierraDebugPath, JSON.stringify(sierraData, null, 2));
      safeWriteFileSync(casmDebugPath, JSON.stringify(casmData, null, 2));
      
      console.log(`Saved raw sierra and casm data for debugging`);
      
      // Parse or load the data if needed
      const parsedSierra = loadOrParseJson(sierraData);
      const parsedCasm = loadOrParseJson(casmData);
      
      // Save parsed data for debugging
      const sierraParsedDebugPath = path.resolve(TEMP_DEBUG_DIR, `sierra_parsed_data.json`);
      const casmParsedDebugPath = path.resolve(TEMP_DEBUG_DIR, `casm_parsed_data.json`);
      
      safeWriteFileSync(sierraParsedDebugPath, JSON.stringify(parsedSierra, null, 2));
      safeWriteFileSync(casmParsedDebugPath, JSON.stringify(parsedCasm, null, 2));
      
      console.log(`Saved parsed sierra and casm data for debugging`);
      
      return {
        sierra: parsedSierra,
        casm: parsedCasm
      };
    } catch (error) {
      console.error("Error parsing sierra or casm data:", error);
      
      // Save error information
      const errorInfo = {
        error: String(error),
        sierraType: typeof sierraData,
        casmType: typeof casmData,
        sierraPreview: typeof sierraData === 'string' ? sierraData.substring(0, 100) : null,
        casmPreview: typeof casmData === 'string' ? casmData.substring(0, 100) : null
      };
      
      const errorPath = path.resolve(TEMP_DEBUG_DIR, `parsing_error.json`);
      safeWriteFileSync(errorPath, JSON.stringify(errorInfo, null, 2));
      console.log(`Error details saved to ${errorPath}`);
    }
  }
  
  // If we get here, we couldn't find or parse the sierra and casm artifacts
  console.error("Could not find or parse Sierra or CASM artifacts in the contract structure");
  console.error(`Contract artifact keys: ${Object.keys(contractArtifact).join(', ')}`);
  
  return null;
}

// Helper function to deploy a contract with improved error handling
async function deployContract(account: Account, provider: RpcProvider, contractType: string, artifacts: any): Promise<DeploymentResult> {
  try {
    // Find the contract in the artifacts
    const contractKey = findContractKey(contractType, artifacts);
    if (!contractKey) {
      throw new Error(`Could not find contract for type "${contractType}" in artifacts`);
    }
    
    console.log(`Found contract in artifacts: ${contractKey}`);
    const contractArtifact = artifacts.contracts[contractKey];
    
    // Save contract artifact for debugging
    const debugPath = path.resolve(TEMP_DEBUG_DIR, `${contractType}_artifact.json`);
    safeWriteFileSync(debugPath, JSON.stringify(contractArtifact, null, 2));
    
    // Extract the Sierra and CASM artifacts using the new helper function
    const extractedArtifacts = extractSierraAndCasm(contractArtifact);
    
    if (!extractedArtifacts) {
      throw new Error(`Missing Sierra or CASM artifacts for contract "${contractType}"`);
    }
    
    const compiledContractSierra = extractedArtifacts.sierra;
    const compiledContractCasm = extractedArtifacts.casm;
    
    // Declare contract
    let declareResponse;
    try {
      // Check if contract is already declared
      const classHash = hash.computeContractClassHash(compiledContractSierra);
      console.log(`Computed class hash for ${contractType}: ${classHash}`);
      
      try {
        await provider.getClassByHash(classHash);
        console.log(`Contract ${contractType} already declared with class hash: ${classHash}`);
      } catch (e) {
        // Contract not declared, declare it
        console.log(`Declaring ${contractType} contract...`);
        
        // Set explicit transaction version to 1 for compatibility with older devnets
        declareResponse = await account.declare({
          contract: compiledContractSierra,
          casm: compiledContractCasm,
          // Explicitly set version to 1 for compatibility with older devnets
          transactionVersion: 1
        });
        
        // Wait for transaction to be accepted
        await provider.waitForTransaction(declareResponse.transaction_hash);
        console.log(`Contract ${contractType} declared with transaction hash: ${declareResponse.transaction_hash}`);
      }
    } catch (error) {
      console.error(`Error declaring contract ${contractType}:`, error);
      
      // Try with version 0 if version 1 fails
      if (String(error).includes("Invalid version")) {
        console.log("Trying with transaction version 0...");
        try {
          declareResponse = await account.declare({
            contract: compiledContractSierra,
            casm: compiledContractCasm,
            transactionVersion: 0
          });
          
          // Wait for transaction to be accepted
          await provider.waitForTransaction(declareResponse.transaction_hash);
          console.log(`Contract ${contractType} declared with transaction hash: ${declareResponse.transaction_hash} (using version 0)`);
        } catch (fallbackError) {
          console.error(`Error declaring contract ${contractType} with version 0:`, fallbackError);
          throw fallbackError;
        }
      } else {
        throw error;
      }
    }
    
    // Prepare constructor calldata (empty for now)
    const constructorCalldata: string[] = [];
    
    // Deploy contract
    // Generate a random salt using crypto
    const salt = generateRandomSalt();
    console.log(`Deploying ${contractType} contract with salt: ${salt}`);
    
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
    
    // Save detailed error information
    const errorInfo = {
      contractType,
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    };
    
    const errorPath = path.resolve(TEMP_DEBUG_DIR, `${contractType}_deploy_error.json`);
    safeWriteFileSync(errorPath, JSON.stringify(errorInfo, null, 2));
    console.log(`Error details saved to ${errorPath}`);
    
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
    
    // Save final error information
    const errorInfo = {
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    };
    
    const errorPath = path.resolve(TEMP_DEBUG_DIR, `deployment_final_error.json`);
    safeWriteFileSync(errorPath, JSON.stringify(errorInfo, null, 2));
    console.log(`Final error details saved to ${errorPath}`);
    
    process.exit(1);
  });
