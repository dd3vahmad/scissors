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

const SignUp: React.FC = () => {
  const { signupUser } = useAuth(); // Add a signUp method in your AuthContext
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const formData = {
        firstname,
        lastname,
        username,
        email,
        password,
      };
      await signupUser(formData);
      navigate("/verify-email"); // Redirect to email verification page
    } catch (error) {
      setError("Failed to sign up. Please try again.");
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
        maxWidth="500px"
        width="full"
      >
        <Heading as="h1" mb={6} textAlign="center">
          Sign Up
        </Heading>
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="firstname" isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </FormControl>
            <FormControl id="lastname" isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </FormControl>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
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
            <FormControl id="confirm-password" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" type="submit" width="full" mt={4}>
              Sign Up
            </Button>
          </Stack>
        </form>
        <Text mt={4} textAlign="center">
          Already have an account?{" "}
          <span className="hover:underline" onClick={() => navigate("/login")}>
            Login
          </span>
        </Text>
      </Box>
    </Container>
  );
};

export default SignUp;
