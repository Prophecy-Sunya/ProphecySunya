import { FC } from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { useStarknet } from '@starknet-react/core';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ConnectWallet from '../components/ConnectWallet';

const GovernancePage: FC = () => {
  const { account } = useStarknet();
  
  // Mock governance proposals - in production this would come from contract calls
  const proposals = [
    {
      id: '1',
      description: 'Increase oracle verification threshold to 75%',
      creator: '0x123...456',
      startTime: new Date(2023, 5, 15).getTime(),
      endTime: new Date(2023, 6, 15).getTime(),
      status: 'ACTIVE',
      yesVotes: 120,
      noVotes: 45
    },
    {
      id: '2',
      description: 'Add support for Ethereum L1 prediction bridging',
      creator: '0x789...012',
      startTime: new Date(2023, 4, 10).getTime(),
      endTime: new Date(2023, 5, 10).getTime(),
      status: 'PASSED',
      yesVotes: 230,
      noVotes: 20
    }
  ];

  return (
    <>
      <Head>
        <title>Governance | ProphecySunya</title>
        <meta name="description" content="Participate in ProphecySunya governance" />
      </Head>

      <Header />

      <main className="min-h-screen py-8">
        <Container maxWidth="lg">
          <Box className="mb-8">
            <Typography variant="h4" component="h1" className="mb-4 font-semibold">
              Governance
            </Typography>
            
            {!account ? (
              <Box className="text-center py-8">
                <ConnectWallet />
              </Box>
            ) : (
              <>
                <Box className="mb-6 flex justify-between items-center">
                  <Typography variant="h5" component="h2">
                    Active Proposals
                  </Typography>
                  <Button variant="contained" color="primary">
                    Create Proposal
                  </Button>
                </Box>
                
                {proposals.length === 0 ? (
                  <Box className="text-center py-8">
                    <Typography>No active proposals found.</Typography>
                  </Box>
                ) : (
                  <Grid container spacing={4}>
                    {proposals.map((proposal) => (
                      <Grid item xs={12} key={proposal.id}>
                        <Box className="card">
                          <Box className="flex justify-between items-start mb-4">
                            <Typography variant="h6" className="font-semibold">
                              {proposal.description}
                            </Typography>
                            <Box className={`px-3 py-1 rounded-full text-white text-sm ${
                              proposal.status === 'ACTIVE' ? 'bg-blue-500' : 
                              proposal.status === 'PASSED' ? 'bg-green-500' : 
                              proposal.status === 'REJECTED' ? 'bg-red-500' : 
                              'bg-gray-500'
                            }`}>
                              {proposal.status}
                            </Box>
                          </Box>
                          
                          <Box className="mb-4">
                            <Typography variant="body2" color="text.secondary">
                              Created by: {proposal.creator}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Voting Period: {new Date(proposal.startTime).toLocaleDateString()} - {new Date(proposal.endTime).toLocaleDateString()}
                            </Typography>
                          </Box>
                          
                          <Box className="mb-4">
                            <Box className="flex justify-between mb-1">
                              <Typography variant="body2">Yes: {proposal.yesVotes}</Typography>
                              <Typography variant="body2">No: {proposal.noVotes}</Typography>
                            </Box>
                            <Box className="w-full bg-gray-200 rounded-full h-2.5">
                              <Box 
                                className="bg-primary-600 h-2.5 rounded-full" 
                                style={{ width: `${(proposal.yesVotes / (proposal.yesVotes + proposal.noVotes)) * 100}%` }}
                              ></Box>
                            </Box>
                          </Box>
                          
                          {proposal.status === 'ACTIVE' && (
                            <Box className="flex space-x-4">
                              <Button variant="contained" color="primary" className="flex-1">
                                Vote Yes
                              </Button>
                              <Button variant="outlined" color="primary" className="flex-1">
                                Vote No
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </Box>
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default GovernancePage;
