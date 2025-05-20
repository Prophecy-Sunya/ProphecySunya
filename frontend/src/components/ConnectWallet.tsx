import { FC } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useConnect } from '@starknet-react/core';

const ConnectWallet: FC = () => {
  const { connect, connectors } = useConnect();

  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector });
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  return (
    <Box className="flex flex-col items-center">
      <Typography variant="h6" className="mb-4">
        Connect your wallet to get started
      </Typography>
      
      <Box className="flex flex-col space-y-3">
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            variant="contained"
            color="primary"
            onClick={() => handleConnect(connector)}
            className="btn-primary w-full"
          >
            Connect with {connector.id.charAt(0).toUpperCase() + connector.id.slice(1)}
          </Button>
        ))}
        
        {connectors.length === 0 && (
          <Typography color="error">
            No wallet connectors found. Please install a Starknet wallet extension.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ConnectWallet;
