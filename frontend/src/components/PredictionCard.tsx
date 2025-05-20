import { FC, useState } from 'react';
import { Box, Typography, Chip, Button, Card, CardContent, CardActions, CircularProgress, Snackbar, Alert } from '@mui/material';
import { formatDistance } from 'date-fns';
import { Prediction } from '../hooks/usePredictions';
import { useAccount } from '@starknet-react/core';
import { useContract } from '../hooks/useContract';

interface PredictionCardProps {
  prediction: Prediction;
}

const PredictionCard: FC<PredictionCardProps> = ({ prediction }) => {
  const { address: account } = useAccount();
  const { contract } = useContract('prediction');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED_TRUE':
        return 'success';
      case 'VERIFIED_FALSE':
        return 'error';
      case 'EXPIRED':
        return 'warning';
      case 'CHALLENGED':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'VERIFIED_TRUE':
        return 'Verified True';
      case 'VERIFIED_FALSE':
        return 'Verified False';
      case 'EXPIRED':
        return 'Expired';
      case 'CHALLENGED':
        return 'Challenged';
      default:
        return 'Pending';
    }
  };

  const timeUntilExpiration = formatDistance(
    new Date(prediction.expirationTime),
    new Date(),
    { addSuffix: true }
  );

  const handleVerify = async (isTrue: boolean) => {
    if (!account) {
      setNotification({
        message: 'Please connect your wallet first',
        type: 'error'
      });
      return;
    }

    try {
      setIsVerifying(true);
      console.log(`Verifying prediction ${prediction.id} as ${isTrue ? 'true' : 'false'}`);
      
      // Use contract if available, otherwise simulate
      if (contract) {
        try {
          // Mock verification call
          await new Promise(resolve => setTimeout(resolve, 1500));
          console.log('Verification successful');
        } catch (error) {
          console.error('Verification error:', error);
          throw new Error('Failed to verify prediction');
        }
      } else {
        // Simulate verification
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setNotification({
        message: `Prediction verified as ${isTrue ? 'true' : 'false'}`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error verifying prediction:', error);
      setNotification({
        message: `Error verifying prediction: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleMintNFT = async () => {
    if (!account) {
      setNotification({
        message: 'Please connect your wallet first',
        type: 'error'
      });
      return;
    }

    try {
      setIsMinting(true);
      console.log(`Minting NFT for prediction ${prediction.id}`);
      
      // Use contract if available, otherwise simulate
      if (contract) {
        try {
          // Mock minting call
          await new Promise(resolve => setTimeout(resolve, 2000));
          console.log('Minting successful');
        } catch (error) {
          console.error('Minting error:', error);
          throw new Error('Failed to mint NFT');
        }
      } else {
        // Simulate minting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setNotification({
        message: 'NFT minted successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error minting NFT:', error);
      setNotification({
        message: `Error minting NFT: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
    } finally {
      setIsMinting(false);
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-grow">
        <Box className="flex justify-between items-start mb-2">
          <Chip 
            label={prediction.category} 
            size="small" 
            color="primary" 
            variant="outlined" 
            className="mb-2"
          />
          <Chip 
            label={getStatusText(prediction.verificationStatus)} 
            size="small" 
            color={getStatusColor(prediction.verificationStatus) as any}
          />
        </Box>
        
        <Typography variant="h6" component="h3" className="mb-2 font-semibold">
          {prediction.content}
        </Typography>
        
        <Box className="mt-4 text-sm text-gray-500">
          <Typography variant="body2">
            Created by: {prediction.creator.substring(0, 6)}...{prediction.creator.substring(prediction.creator.length - 4)}
          </Typography>
          <Typography variant="body2">
            Expires: {timeUntilExpiration}
          </Typography>
        </Box>
      </CardContent>
      
      <CardActions>
        <Button size="small" color="primary">
          View Details
        </Button>
        
        {prediction.verificationStatus === 'PENDING' && (
          <>
            <Button 
              size="small" 
              color="success" 
              onClick={() => handleVerify(true)}
              disabled={isVerifying}
            >
              {isVerifying ? <CircularProgress size={16} /> : 'Verify True'}
            </Button>
            <Button 
              size="small" 
              color="error" 
              onClick={() => handleVerify(false)}
              disabled={isVerifying}
            >
              {isVerifying ? <CircularProgress size={16} /> : 'Verify False'}
            </Button>
          </>
        )}
        
        {prediction.verificationStatus === 'VERIFIED_TRUE' && (
          <Button 
            size="small" 
            color="secondary"
            onClick={handleMintNFT}
            disabled={isMinting}
          >
            {isMinting ? <CircularProgress size={16} color="inherit" /> : 'Mint NFT'}
          </Button>
        )}
      </CardActions>
      
      <Snackbar 
        open={!!notification} 
        autoHideDuration={6000} 
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeNotification} severity={notification?.type || 'success'} sx={{ width: '100%' }}>
          {notification?.message || ''}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default PredictionCard;
