import { FC } from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage: FC = () => {
  return (
    <>
      <Head>
        <title>About | ProphecySunya</title>
        <meta name="description" content="Learn about ProphecySunya - a decentralized prediction market platform on Starknet" />
      </Head>

      <Header />

      <main className="min-h-screen py-8">
        <Container maxWidth="lg">
          <Box className="mb-12">
            <Typography variant="h3" component="h1" className="mb-6 font-bold text-center">
              About ProphecySunya
            </Typography>
            
            <Typography variant="body1" className="mb-6">
              ProphecySunya is a decentralized prediction market platform built on Starknet that integrates prediction markets with blockchain development tools through a modular, layered architecture.
            </Typography>
            
            <Typography variant="body1" className="mb-6">
              Our platform leverages Starknet's scalability and security features while maintaining cross-chain interoperability. Users can create predictions, verify outcomes through AI oracles, mint NFTs for verified predictions, and participate in governance.
            </Typography>
          </Box>
          
          <Box className="mb-12">
            <Typography variant="h4" component="h2" className="mb-4 font-semibold">
              Architecture
            </Typography>
            
            <Typography variant="body1" className="mb-4">
              The system is built with a layered architecture:
            </Typography>
            
            <Grid container spacing={4} className="mb-6">
              <Grid item xs={12} md={6} lg={4}>
                <Box className="card h-full">
                  <Typography variant="h6" className="mb-2 font-bold">Smart Contract Layer</Typography>
                  <Typography>
                    Cairo contracts for core functionality including predictions, NFTs, gas tank, oracle, governance, and bridge contracts.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6} lg={4}>
                <Box className="card h-full">
                  <Typography variant="h6" className="mb-2 font-bold">Core Services Layer</Typography>
                  <Typography>
                    Business logic and service implementations that interact with the smart contracts.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6} lg={4}>
                <Box className="card h-full">
                  <Typography variant="h6" className="mb-2 font-bold">Service Layer</Typography>
                  <Typography>
                    API Gateway and authentication services for secure access to the platform.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6} lg={4}>
                <Box className="card h-full">
                  <Typography variant="h6" className="mb-2 font-bold">User Interface Layer</Typography>
                  <Typography>
                    UI components for predictions, wallets, and NFTs built with Next.js and Material UI.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6} lg={4}>
                <Box className="card h-full">
                  <Typography variant="h6" className="mb-2 font-bold">Frontend Application</Typography>
                  <Typography>
                    React-based single-page application providing a seamless user experience.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          
          <Box className="mb-12">
            <Typography variant="h4" component="h2" className="mb-4 font-semibold">
              Development Roadmap
            </Typography>
            
            <Box className="card">
              <Typography variant="body1" className="mb-4">
                Our development is proceeding in phases:
              </Typography>
              
              <Box className="mb-2">
                <Typography variant="subtitle1" className="font-bold">Phase 1: Smart Contract Layer</Typography>
                <Typography variant="body2">Implementation of core Cairo contracts</Typography>
              </Box>
              
              <Box className="mb-2">
                <Typography variant="subtitle1" className="font-bold">Phase 2: Core Services Layer</Typography>
                <Typography variant="body2">Development of business logic and service implementations</Typography>
              </Box>
              
              <Box className="mb-2">
                <Typography variant="subtitle1" className="font-bold">Phase 3: Service Layer and API Gateway</Typography>
                <Typography variant="body2">Implementation of API Gateway and authentication services</Typography>
              </Box>
              
              <Box className="mb-2">
                <Typography variant="subtitle1" className="font-bold">Phase 4: User Interface and Frontend</Typography>
                <Typography variant="body2">Development of UI components and frontend application</Typography>
              </Box>
              
              <Box className="mb-2">
                <Typography variant="subtitle1" className="font-bold">Phase 5: Cross-chain Integration</Typography>
                <Typography variant="body2">Implementation of cross-chain functionality and advanced features</Typography>
              </Box>
            </Box>
          </Box>
          
          <Box className="text-center">
            <Link href="/" passHref>
              <Button variant="contained" color="primary" size="large">
                Back to Home
              </Button>
            </Link>
          </Box>
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default AboutPage;
