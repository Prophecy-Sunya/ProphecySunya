import { FC } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useStarknet, useConnectors } from '@starknet-react/core';
import Link from 'next/link';

const Header: FC = () => {
  const { account } = useStarknet();
  const { connect, disconnect, connectors } = useConnectors();

  const handleConnect = async () => {
    try {
      const connector = connectors[0]; // Use first available connector
      if (connector) {
        await connect(connector);
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
          <Link href="/" passHref>
            <Typography variant="h6" component="div" className="font-bold cursor-pointer">
              ProphecySunya
            </Typography>
          </Link>
          
          <Box className="flex space-x-4">
            <Link href="/predictions" passHref>
              <Button color="inherit">Predictions</Button>
            </Link>
            <Link href="/nfts" passHref>
              <Button color="inherit">NFTs</Button>
            </Link>
            <Link href="/governance" passHref>
              <Button color="inherit">Governance</Button>
            </Link>
            
            {account ? (
              <Box className="flex items-center">
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => disconnect()}
                  className="ml-2"
                >
                  {truncateAddress(account)}
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
