import { FC, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { useStarknet } from '@starknet-react/core';
import { useContract } from '../hooks/useContract';

interface CreatePredictionModalProps {
  open: boolean;
  onClose: () => void;
}

const CreatePredictionModal: FC<CreatePredictionModalProps> = ({ open, onClose }) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [expirationDays, setExpirationDays] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { account } = useStarknet();
  const { contract, isLoading, error } = useContract('prediction');

  const handleSubmit = async () => {
    if (!content || !category || !expirationDays || !account || !contract) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Calculate expiration time in seconds from now
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = currentTime + (expirationDays * 24 * 60 * 60);
      
      // Convert content and category to felt252 (simplified for example)
      const contentFelt = content;
      const categoryFelt = category;
      
      // Call contract method
      // Note: In a production app, you would use proper Cairo contract interaction
      console.log('Creating prediction with:', {
        content: contentFelt,
        category: categoryFelt,
        expirationTime
      });
      
      // Simulate contract call success
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        // Show success notification or redirect
      }, 2000);
      
    } catch (error) {
      console.error('Error creating prediction:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={!isSubmitting ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Prediction</DialogTitle>
      
      <DialogContent>
        <Box className="my-4">
          <TextField
            label="Prediction Content"
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            required
            disabled={isSubmitting}
            placeholder="What do you predict will happen?"
            className="mb-4"
          />
          
          <FormControl fullWidth className="mb-4">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
              required
            >
              <MenuItem value="Crypto">Crypto</MenuItem>
              <MenuItem value="DeFi">DeFi</MenuItem>
              <MenuItem value="NFT">NFT</MenuItem>
              <MenuItem value="Technology">Technology</MenuItem>
              <MenuItem value="Politics">Politics</MenuItem>
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Entertainment">Entertainment</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Expiration Time</InputLabel>
            <Select
              value={expirationDays}
              onChange={(e) => setExpirationDays(Number(e.target.value))}
              disabled={isSubmitting}
              required
            >
              <MenuItem value={7}>7 days</MenuItem>
              <MenuItem value={30}>30 days</MenuItem>
              <MenuItem value={90}>90 days</MenuItem>
              <MenuItem value={180}>180 days</MenuItem>
              <MenuItem value={365}>1 year</MenuItem>
            </Select>
          </FormControl>
          
          {error && (
            <Typography color="error" className="mt-4">
              Error: {error.message || 'Failed to load contract'}
            </Typography>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!content || !category || isSubmitting || !account || isLoading}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Create Prediction'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePredictionModal;
