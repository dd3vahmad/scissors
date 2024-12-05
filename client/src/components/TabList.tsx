import {
  Divider,
  HStack,
  Heading,
  Icon,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import tabs from "../data/tabs";
import { Dispatch, SetStateAction } from "react";
import { IoSettings } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { useAuth } from "../context/auth";
import { useCustomToast } from "./Toast";

interface IProps {
  onClose: () => void;
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
}

const TabList = ({ onClose = () => {}, activeTab, setActiveTab }: IProps) => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const { logoutUser } = useAuth();
  const { showToast } = useCustomToast();
  const goTo = useNavigate();

  const logout = async () => {
    try {
      await logoutUser();
      onClose();
      showToast("info", "Logout successful");
      goTo("/login");
    } catch (error: any) {
      showToast("error", error.message);
    }
  };

  return (
    <>
      <Heading marginBottom={3} fontSize="xl">
        Menu
      </Heading>
      <List>
        {tabs.map((tab, i) => {
          return (
            <ListItem paddingY="5px" key={i}>
              <Link to={tab.path}>
                <HStack
                  _hover={{ bg: bgColor }}
                  bg={activeTab === i ? bgColor : "none"}
                  borderRadius={8}
                  px={"10px"}
                  py={"8px"}
                  onClick={() => {
                    setActiveTab(i);
                    onClose();
                  }}
                  cursor={"pointer"}
                >
                  <Icon boxSize={5} as={tab.icon} />
                  <Text fontSize="lg">{tab.name}</Text>
                </HStack>
              </Link>
            </ListItem>
          );
        })}
        <Divider />
        <ListItem paddingY="10px">
          <Link to="/account-settings">
            <HStack
              _hover={{ bg: bgColor }}
              bg={activeTab === tabs.length ? bgColor : "none"}
              borderRadius={8}
              px={"10px"}
              py={"8px"}
              onClick={() => {
                setActiveTab(tabs.length);
                onClose();
              }}
              cursor={"pointer"}
            >
              <Icon boxSize={5} borderRadius={8} as={IoSettings} />
              <Text>Settings</Text>
            </HStack>
          </Link>
        </ListItem>
        <ListItem>
          <HStack
            _hover={{ bg: "red.300" }}
            bg={"red.400"}
            textColor={"white"}
            borderRadius={8}
            px={"10px"}
            py={"8px"}
            onClick={logout}
            cursor={"pointer"}
          >
            <Icon boxSize={5} borderRadius={8} as={LuLogOut} />
            <Text>Logout</Text>
          </HStack>
        </ListItem>
      </List>
    </>
  );
};

export default TabList;
