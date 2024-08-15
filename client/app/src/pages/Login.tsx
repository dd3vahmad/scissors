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
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa6";

const Login: React.FC = () => {
  const { loginUser, fetchUserData } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(email, password);
      await fetchUserData();
      setLoading(false);
      navigate("/");
    } catch (error: any) {
      setLoading(false);
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
          Log in
        </Heading>
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              disabled={loading}
              colorScheme="blue"
              type="submit"
              width="full"
              mt={4}
            >
              {loading ? <Icon as={FaSpinner} /> : "Log in"}
            </Button>
          </Stack>
        </form>
        <Text mt={4} textAlign="center">
          Don't have an account?{" "}
          <span className="hover:underline" onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </Text>
      </Box>
    </Container>
  );
};

export default Login;
