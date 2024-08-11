import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import IUser from "../entites/User";
import { FaSpinner } from "react-icons/fa6";
import { useCustomToast } from "../components/Toast";

interface AuthContextType {
  currentUser: IUser | null;
  fetchUserData: () => Promise<void>;
  loginUser: (email: string, password: string) => Promise<any>;
  logoutUser: () => Promise<any>;
  signupUser: (formData: IUser) => Promise<any>;
  verifyUserEmail: (email: string, otp: number) => Promise<any>;
  resendOTP: (email: string) => Promise<any>;
}

// src/types.ts
export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  details?: string;
  timestamp?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { showToast } = useCustomToast();
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getCurrentUser = async (): Promise<IUser | void> => {
    try {
      const response = await axios.get("/user/user-details");
      return response.data as IUser;
    } catch (error: any) {
      return showToast("error", error.response.data.message || error.message);
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    const user = await getCurrentUser();
    setLoading(false);
    if (!user || (user as any).failed) return setCurrentUser(null);
    setCurrentUser(user);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const loginUser = async (email: string, password: string): Promise<any> => {
    try {
      const formData = { email, password };
      const response = await axios.post("/auth/login", formData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message || error.message);
    }
  };

  const logoutUser = async (): Promise<any> => {
    try {
      const response = await axios.get("/auth/logout");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message || error.message);
    }
  };

  const signupUser = async (formData: IUser): Promise<any> => {
    try {
      const response = await axios.post("/auth/signup", formData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message || error.message);
    }
  };

  const verifyUserEmail = async (email: string, otp: number): Promise<any> => {
    try {
      const formData = { email, otp };
      const response = await axios.post("/auth/verifyWithOTP", formData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message || error.message);
    }
  };

  const resendOTP = async (email: string): Promise<any> => {
    try {
      const response = await axios.post("/auth/resendOTP", { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message || error.message);
    }
  };

  const AuthValue: AuthContextType = {
    currentUser,
    fetchUserData,
    loginUser,
    logoutUser,
    signupUser,
    verifyUserEmail,
    resendOTP,
  };

  return (
    <AuthContext.Provider value={AuthValue}>
      {loading ? (
        <FaSpinner
          size={30}
          className="flex justify-center items-center min-h-96"
        />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
