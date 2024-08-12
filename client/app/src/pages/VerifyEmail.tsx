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
  Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { useCustomToast } from "../components/Toast";
import { FaSpinner } from "react-icons/fa6";

const VerifyEmail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { verifyUserEmail, resendOTP } = useAuth();
  const { showToast } = useCustomToast();
  const [otp, setOtp] = useState<number | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const email = localStorage.getItem("new-user-email");
      await verifyUserEmail(email || "", otp || 0);
      localStorage.removeItem("new-user-email");
      setLoading(false);
      navigate("/login");
    } catch (error: any) {
      setError(error.message);
      showToast("error", error.message);
      setLoading(false);
    }
  };

  const resendotp = async () => {
    try {
      setLoading(true);
      const email = localStorage.getItem("new-user-email") || "";
      await resendOTP(email);
      showToast("info", "OTP resent successfully");
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      showToast("error", error.message);
      setLoading(false);
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
            <Button
              disabled={loading}
              colorScheme="blue"
              type="submit"
              width="full"
              mt={4}
            >
              {loading ? <Icon as={FaSpinner} /> : "Verify"}
            </Button>
          </Stack>
        </form>
        <Text mt={4} textAlign="center">
          <Button disabled={loading} onClick={resendotp}>
            {loading ? <Icon as={FaSpinner} /> : "Resend OTP"}
          </Button>
        </Text>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
