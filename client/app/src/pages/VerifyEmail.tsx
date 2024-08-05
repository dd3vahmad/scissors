import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth"; // Adjust the path accordingly

const VerifyEmail: React.FC = () => {
  const { verifyUserEmail } = useAuth(); // Add a verifyEmail method in your AuthContext
  const [otp, setOtp] = useState<number | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem("new-user-email");
      await verifyUserEmail(email || "", otp || 0);
      navigate("/login");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Container centerContent>
      <Box
        p={8}
        mt={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        maxWidth="400px"
        width="full"
      >
        <Heading as="h1" mb={6} textAlign="center">
          Verify Your Email
        </Heading>
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="otp" isRequired>
              <FormLabel>Enter OTP</FormLabel>
              <Input
                type="number"
                value={otp || ""}
                onChange={(e) => setOtp(Number(e.target.value))}
              />
            </FormControl>
            <Button colorScheme="blue" type="submit" width="full" mt={4}>
              Verify
            </Button>
          </Stack>
        </form>
        <Text mt={4} textAlign="center">
          <a href="/resend-otp">Resend OTP</a>
        </Text>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
