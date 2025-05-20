import { FC } from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { useStarknet } from '@starknet-react/core';
import { usePredictions } from '../hooks/usePredictions';
import PredictionCard from '../components/PredictionCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PredictionsPage: FC = () => {
  const { account } = useStarknet();
  const { predictions, isLoading, error } = usePredictions();

  return (
    <>
      <Head>
        <title>All Predictions | ProphecySunya</title>
        <meta name="description" content="Browse all predictions on ProphecySunya" />
      </Head>

      <Header />

      <main className="min-h-screen py-8">
        <Container maxWidth="lg">
          <Box className="mb-8">
            <Typography variant="h4" component="h1" className="mb-4 font-semibold">
              All Predictions
            </Typography>
            
            {isLoading ? (
              <Box className="text-center py-8">
                <Typography>Loading predictions...</Typography>
              </Box>
            ) : error ? (
              <Box className="text-center py-8">
                <Typography color="error">Error: {error.message}</Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </Box>
            ) : predictions.length === 0 ? (
              <Box className="text-center py-8">
                <Typography>No predictions found.</Typography>
              </Box>
            ) : (
              <Grid container spacing={4}>
                {predictions.map((prediction) => (
                  <Grid item xs={12} md={4} key={prediction.id}>
                    <PredictionCard prediction={prediction} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default PredictionsPage;
