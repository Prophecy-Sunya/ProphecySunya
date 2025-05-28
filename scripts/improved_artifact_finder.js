// Improved artifact finding function
function findStarknetArtifacts() {
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
    console.error("ERROR: No target directory found. Run 'scarb build' first!");
    throw new Error("Build artifacts missing. Run 'scarb build' before deployment.");
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
            const debugPath = path.resolve(__dirname, "../temp_debug/artifact_content.json");
            fs.mkdirSync(path.dirname(debugPath), { recursive: true });
            fs.writeFileSync(debugPath, JSON.stringify(JSON.parse(artifactContent), null, 2));
            console.log(`Successfully wrote file: ${debugPath}`);
            
            const artifacts = JSON.parse(artifactContent);
            
            // Validate artifact structure
            if (!artifacts.contracts || Object.keys(artifacts.contracts).length === 0) {
              console.error("ERROR: Artifacts file exists but contains no contracts");
              throw new Error("Invalid artifacts file. Rebuild contracts with 'scarb build'");
            }
            
            console.log("Successfully loaded contract artifacts");
            return artifacts;
          }
        }
        
        console.warn(`No .starknet_artifacts.json file found in ${dir}`);
      }
    } catch (error) {
      console.warn(`Warning: Error checking directory ${dir}:`, error);
    }
  }
  
  throw new Error("Could not find starknet_artifacts.json file. Make sure contracts are built with 'scarb build'");
}
