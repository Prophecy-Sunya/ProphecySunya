import { FC } from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FAQPage: FC = () => {
  const faqs = [
    {
      question: 'What is ProphecySunya?',
      answer: 'ProphecySunya is a decentralized prediction market platform built on Starknet that allows users to create predictions, verify outcomes through AI oracles, mint NFTs for verified predictions, and participate in governance.'
    },
    {
      question: 'How do I create a prediction?',
      answer: 'To create a prediction, you need to connect your Starknet wallet, navigate to the home page, click on "Create Prediction", and fill out the prediction details including content, category, and expiration time.'
    },
    {
      question: 'How are predictions verified?',
      answer: 'Predictions are verified through our AI oracle system, which analyzes real-world data to determine the outcome of a prediction. The verification process is transparent and can be challenged through our governance system if needed.'
    },
    {
      question: 'What are Prophet NFTs?',
      answer: 'Prophet NFTs are non-fungible tokens that represent verified predictions. When your prediction is verified as true, you can mint an NFT that showcases your successful prediction. These NFTs also contribute to your Prophet Score, which determines your influence in the governance system.'
    },
    {
      question: 'What is the Prophet Score?',
      answer: 'The Prophet Score is a measure of your prediction accuracy and participation in the platform. A higher Prophet Score gives you more influence in the governance system and can unlock additional features and benefits.'
    },
    {
      question: 'How does the governance system work?',
      answer: 'The governance system allows users to propose and vote on changes to the platform. Your voting power is determined by your Prophet Score. Proposals can include parameter changes, feature additions, or other platform modifications.'
    },
    {
      question: 'What is the Gas Tank?',
      answer: 'The Gas Tank is a feature that allows for transaction sponsorship and meta-transactions. This means that certain actions on the platform can be performed without paying gas fees directly, making the platform more accessible to new users.'
    },
    {
      question: 'How does cross-chain bridging work?',
      answer: 'Cross-chain bridging allows predictions to be created on one blockchain and verified on another. This feature is still in development and will be available in a future release.'
    }
  ];

  return (
    <>
      <Head>
        <title>FAQ | ProphecySunya</title>
        <meta name="description" content="Frequently Asked Questions about ProphecySunya" />
      </Head>

      <Header />

      <main className="min-h-screen py-8">
        <Container maxWidth="lg">
          <Box className="mb-8">
            <Typography variant="h3" component="h1" className="mb-6 font-bold text-center">
              Frequently Asked Questions
            </Typography>
            
            <Box className="mb-8">
              {faqs.map((faq, index) => (
                <Accordion key={index} className="mb-2">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                  >
                    <Typography variant="h6" className="font-semibold">
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
            
            <Box className="text-center mt-8">
              <Typography variant="body1">
                Still have questions? Contact us at <a href="mailto:support@prophecysunya.com" className="text-primary-600 hover:underline">support@prophecysunya.com</a>
              </Typography>
            </Box>
          </Box>
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default FAQPage;
