// import React from 'react';

// const Login = () => {
//   const googleLogin = () => {
//     window.location.href = 'http://localhost:4000/auth/google';
//   };

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//       <button className='bg-slate-800 p-3 text-white rounded-md' onClick={googleLogin}>Login with Google</button>
//     </div>
//   );
// };

// export default Login;
import React from 'react';
import { motion } from 'framer-motion';
import { ChakraProvider, Box, Flex, VStack, HStack, Text, Button, Image } from '@chakra-ui/react';
import logo from '../assets/logo.png';
import { FaGoogle } from 'react-icons/fa';

const LandingPage: React.FC = () => {
  
  const googleLogin = () => {
    window.location.href = 'http://localhost:4000/auth/google';
  };
  return (
    <ChakraProvider>
      <Box minHeight="100vh" bg="gray.50">
        {/* Header */}
        <Flex as="header" align="center" justify="space-between" p={4}>
          <HStack spacing={4}>
            <Image src={logo} alt="EMailSense Logo" boxSize="40px" />
            <Text fontWeight="bold" fontSize="xl">EmailSense</Text>
          </HStack>
          <HStack as="nav" spacing={4}>
            <Button variant="solid" onClick={googleLogin} colorScheme="blue">Login with &nbsp;<FaGoogle className="text-slate-700" /></Button>
          </HStack>
        </Flex>

        {/* Main content */}
        <Flex direction="column" align="center" justify="center" minHeight="calc(100vh - 80px)" textAlign="center" px={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <VStack spacing={8}>
              <Text fontSize="sm" fontWeight="bold" color="blue.500">UNLOCK CONVERSATIONAL POWER</Text>
              <Text fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }} fontWeight="bold" lineHeight="1.2">
                Empower Your<br />Conversations with Next-Gen<br />Email Assistant
              </Text>
              <Text fontSize="xl" color="gray.600" maxWidth="800px">
                Unlock seamless communication and streamline your messaging experience with our innovative AI-powered email solution
              </Text>
              <Button size="lg" colorScheme="blue" px={8} onClick={googleLogin}>
                Get Started
              </Button>
            </VStack>
          </motion.div>

          {/* Dashboard Preview */}
          {/* <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box mt={16} boxShadow="2xl" borderRadius="lg" overflow="hidden">
              <Image src={logo} alt="EmailSense Dashboard Preview" />
            </Box>
          </motion.div> */}
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
