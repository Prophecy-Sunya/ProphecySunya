import { FC } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import Link from 'next/link';

const Header: FC = () => {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    try {
      const connector = connectors[0]; // Use first available connector
      if (connector) {
        await connect({ connector });
      }
    } catch (error) {
      console.error('Connection error:', error);
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
                  onClick={() => disconnect()}
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
              >
                Connect Wallet
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
