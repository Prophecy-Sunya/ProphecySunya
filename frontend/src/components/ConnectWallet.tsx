import { FC, useEffect, useState } from 'react';
import { Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useConnect } from '@starknet-react/core';

const ConnectWallet: FC = () => {
  const { connect, connectors } = useConnect();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Log connectors on component mount to verify they're available
  useEffect(() => {
    console.log('Available connectors:', connectors);
    
    // Check if any wallet extensions are detected
    if (typeof window !== 'undefined') {
      const hasWalletExtension = window.starknet !== undefined;
      console.log('Starknet wallet extension detected:', hasWalletExtension);
      
      if (!hasWalletExtension) {
        setError('No Starknet wallet extension detected. Please install Argent X or Braavos.');
      }
    }
  }, [connectors]);

  const handleConnect = async (connector: any) => {
    console.log('Connect button clicked with connector:', connector);
    setIsConnecting(true);
    setError(null);
    
    try {
      // Explicitly log connector details before attempting connection
      console.log('Connector details:', {
        id: connector.id,
        name: connector.name,
        available: connector.available
      });
      
      // Direct connection attempt - fallback method
      if (typeof window !== 'undefined' && window.starknet) {
        console.log('Attempting direct wallet connection via window.starknet');
        try {
          await window.starknet.enable();
          console.log('Direct wallet connection successful');
        } catch (directError) {
          console.error('Direct wallet connection failed:', directError);
        }
      }
      
      // Use the correct API format with object parameter
      await connect({ connector });
      console.log('Connection attempt completed successfully');
    } catch (error) {
      console.error('Connection error:', error);
      setError('Failed to connect wallet. Please make sure your wallet extension is unlocked and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Box className="flex flex-col items-center">
      <Typography variant="h6" className="mb-4">
        Connect your wallet to get started
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
          {error}
        </Alert>
      )}
      
      <Box className="flex flex-col space-y-3" sx={{ width: '100%', maxWidth: '300px' }}>
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            variant="contained" 
            color="primary"
            onClick={() => handleConnect(connector)}
            disabled={isConnecting}
            className="btn-primary w-full"
            style={{ marginBottom: '10px', position: 'relative' }}
          >
            {isConnecting ? (
              <>
                <CircularProgress size={24} color="inherit" style={{ marginRight: '8px' }} />
                Connecting...
              </>
            ) : (
              `Connect with ${connector.id.charAt(0).toUpperCase() + connector.id.slice(1)}`
            )}
          </Button>
        ))}
        
        {connectors.length === 0 && (
          <Typography color="error">
            No wallet connectors found. Please install a Starknet wallet extension like Argent X or Braavos.
          </Typography>
        )}
        
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
          Don't have a wallet? Install{' '}
          <a href="https://www.argent.xyz/argent-x/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
            Argent X
          </a>{' '}
          or{' '}
          <a href="https://braavos.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
            Braavos
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default ConnectWallet;
