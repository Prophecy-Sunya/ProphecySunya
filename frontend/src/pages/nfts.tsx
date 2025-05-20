import { FC } from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Grid } from '@mui/material';
import { useStarknet } from '@starknet-react/core';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ConnectWallet from '../components/ConnectWallet';

const NFTsPage: FC = () => {
  const { account } = useStarknet();
  
  // Mock NFT data - in production this would come from contract calls
  const nfts = [
    {
      id: '1',
      predictionContent: 'Ethereum will reach $10,000 by the end of 2025',
      category: 'Crypto',
      creationTime: new Date(2023, 5, 15).getTime(),
      prophetScore: 85,
      imageUrl: 'https://via.placeholder.com/300'
    },
    {
      id: '2',
      predictionContent: 'Bitcoin will have another halving in April 2024',
      category: 'Crypto',
      creationTime: new Date(2023, 6, 20).getTime(),
      prophetScore: 95,
      imageUrl: 'https://via.placeholder.com/300'
    }
  ];

  return (
    <>
      <Head>
        <title>Prophet NFTs | ProphecySunya</title>
        <meta name="description" content="View your Prophet NFTs on ProphecySunya" />
      </Head>

      <Header />

      <main className="min-h-screen py-8">
        <Container maxWidth="lg">
          <Box className="mb-8">
            <Typography variant="h4" component="h1" className="mb-4 font-semibold">
              Prophet NFTs
            </Typography>
            
            {!account ? (
              <Box className="text-center py-8">
                <ConnectWallet />
              </Box>
            ) : nfts.length === 0 ? (
              <Box className="text-center py-8">
                <Typography>You don't have any Prophet NFTs yet.</Typography>
              </Box>
            ) : (
              <Grid container spacing={4}>
                {nfts.map((nft) => (
                  <Grid item xs={12} md={4} key={nft.id}>
                    <Box className="card h-full flex flex-col">
                      <img 
                        src={nft.imageUrl} 
                        alt={`NFT for prediction: ${nft.predictionContent}`}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Box className="p-4 flex-grow">
                        <Typography variant="h6" className="mb-2 font-semibold">
                          {nft.predictionContent}
                        </Typography>
                        <Box className="flex justify-between items-center mt-4">
                          <Typography variant="body2" color="text.secondary">
                            Category: {nft.category}
                          </Typography>
                          <Typography variant="body2" color="primary" className="font-bold">
                            Prophet Score: {nft.prophetScore}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
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

export default NFTsPage;
