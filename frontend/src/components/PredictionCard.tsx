import { FC } from 'react';
import { Box, Typography, Chip, Button, Card, CardContent, CardActions } from '@mui/material';
import { formatDistance } from 'date-fns';
import { Prediction } from '../hooks/usePredictions';

interface PredictionCardProps {
  prediction: Prediction;
}

const PredictionCard: FC<PredictionCardProps> = ({ prediction }) => {
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
        {prediction.verificationStatus === 'VERIFIED_TRUE' && (
          <Button size="small" color="secondary">
            Mint NFT
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default PredictionCard;
