import { useState } from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Grid, Button, CircularProgress } from '@mui/material';
import { useAccount, useConnect } from '@starknet-react/core';
import { Prediction } from '../hooks/usePredictions';

// Components
import PredictionCard from '../components/PredictionCard';
import ConnectWallet from '../components/ConnectWallet';
import CreatePredictionModal from '../components/CreatePredictionModal';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { address: account } = useAccount();
  const { connect, connectors } = useConnect();
  // Placeholder for predictions data
  const predictions: Prediction[] = [
    {
      id: '1',
      content: 'Ethereum will reach $10,000 by the end of 2025',
      category: 'Crypto',
      creator: '0x123...456',
      expirationTime: new Date(2025, 11, 31).getTime(),
      verificationStatus: 'PENDING'
    },
    {
      id: '2',
      content: 'Bitcoin will have another halving in April 2024',
      category: 'Crypto',
      creator: '0x789...012',
      expirationTime: new Date(2024, 3, 30).getTime(),
      verificationStatus: 'VERIFIED_TRUE'
    },
    {
      id: '3',
      content: 'Starknet TVL will exceed $1B in 2024',
      category: 'DeFi',
      creator: '0x345...678',
      expirationTime: new Date(2024, 11, 31).getTime(),
      verificationStatus: 'PENDING'
    }
  ];

  return (
    <>
      <Head>
        <title>ProphecySunya | Decentralized Prediction Markets on Starknet</title>
        <meta name="description" content="ProphecySunya is a decentralized prediction market platform built on Starknet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen py-8">
        <Container maxWidth="lg">
          <Box className="text-center mb-12">
            <Typography variant="h2" component="h1" className="mb-4 font-bold">
              ProphecySunya
            </Typography>
            <Typography variant="h5" component="h2" className="mb-8 text-gray-600">
              Decentralized Prediction Markets on Starknet
            </Typography>
            
            {!account ? (
              <ConnectWallet />
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={() => setOpenCreateModal(true)}
                className="btn-primary"
              >
                Create Prediction
              </Button>
            )}
          </Box>

          <Box className="mb-8">
            <Typography variant="h4" component="h3" className="mb-4 font-semibold">
              Latest Predictions
            </Typography>
            
            <Grid container spacing={4}>
              {predictions.map((prediction) => (
                <Grid item xs={12} md={4} key={prediction.id}>
                  <PredictionCard prediction={prediction} />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box className="text-center mt-12">
            <Typography variant="h4" component="h3" className="mb-4 font-semibold">
              How It Works
            </Typography>
            
            <Grid container spacing={4} className="mt-4">
              <Grid item xs={12} md={4}>
                <Box className="card h-full">
                  <Typography variant="h6" className="mb-2 font-bold">Create</Typography>
                  <Typography>
                    Create predictions about future events with specific timeframes and categories.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box className="card h-full">
                  <Typography variant="h6" className="mb-2 font-bold">Verify</Typography>
                  <Typography>
                    Predictions are verified through AI oracles and community governance.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box className="card h-full">
                  <Typography variant="h6" className="mb-2 font-bold">Mint</Typography>
                  <Typography>
                    Verified predictions can be minted as NFTs with prophet scores.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </main>

      <Footer />

      {openCreateModal && (
        <CreatePredictionModal 
          open={openCreateModal} 
          onClose={() => setOpenCreateModal(false)} 
        />
      )}
    </>
  );
}
