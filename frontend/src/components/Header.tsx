import { FC, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, CircularProgress } from '@mui/material';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import Link from 'next/link';

const Header: FC = () => {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    console.log('Header connect button clicked');
    setIsConnecting(true);
    
    try {
      const connector = connectors[0]; // Use first available connector
      if (connector) {
        console.log('Using connector:', connector.id);
        
        // Try direct connection first if available
        if (typeof window !== 'undefined' && window.starknet) {
          console.log('Attempting direct wallet connection via window.starknet');
          try {
            await window.starknet.enable();
            console.log('Direct wallet connection successful');
          } catch (directError) {
            console.error('Direct wallet connection failed:', directError);
          }
        }
        
        await connect({ connector });
        console.log('Connection successful');
      } else {
        console.error('No connectors available');
      }
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    console.log('Disconnecting wallet');
    try {
      await disconnect();
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} className="border-b border-gray-200">
      <Container maxWidth="lg">
        <Toolbar className="flex justify-between">
          <Link href="/" passHref legacyBehavior>
            <Typography variant="h6" component="a" className="font-bold cursor-pointer">
              ProphecySunya
            </Typography>
          </Link>
          
          <Box className="flex space-x-4">
            <Link href="/predictions" passHref legacyBehavior>
              <Button color="inherit" component="a">Predictions</Button>
            </Link>
            <Link href="/nfts" passHref legacyBehavior>
              <Button color="inherit" component="a">NFTs</Button>
            </Link>
            <Link href="/governance" passHref legacyBehavior>
              <Button color="inherit" component="a">Governance</Button>
            </Link>
            
            {address ? (
              <Box className="flex items-center">
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={handleDisconnect}
                  className="ml-2"
                >
                  {truncateAddress(address)}
                </Button>
              </Box>
            ) : (
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <CircularProgress size={20} color="inherit" style={{ marginRight: '8px' }} />
                    Connecting...
                  </>
                ) : (
                  'Connect Wallet'
                )}
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
