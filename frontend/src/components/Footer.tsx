import { FC } from 'react';
import { Box, Typography, Container, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

const Footer: FC = () => {
  return (
    <Box component="footer" className="bg-gray-100 py-8 mt-12">
      <Container maxWidth="lg">
        <Box className="flex flex-col md:flex-row justify-between items-center">
          <Typography variant="body2" color="text.secondary" className="mb-4 md:mb-0">
            © {new Date().getFullYear()} ProphecySunya. All rights reserved.
          </Typography>
          
          <Box className="flex space-x-6">
            <Link href="/about" passHref>
              <MuiLink color="inherit" underline="hover">
                About
              </MuiLink>
            </Link>
            <Link href="/faq" passHref>
              <MuiLink color="inherit" underline="hover">
                FAQ
              </MuiLink>
            </Link>
            <MuiLink 
              href="https://github.com/mrarejimmyz/ProphecySunya" 
              target="_blank" 
              rel="noopener noreferrer" 
              color="inherit" 
              underline="hover"
            >
              GitHub
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
