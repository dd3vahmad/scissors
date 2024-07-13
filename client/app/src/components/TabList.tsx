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
import { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import tabs from "../data/tabs";

interface IProps {
  onClose: () => void;
}

const TabList = ({ onClose = () => {} }: IProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const bgColor = useColorModeValue("gray.50", "gray.900");

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
                    onClose();
                    setActiveTab(i);
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
          <Link to="/settings">
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
              <Icon boxSize={5} borderRadius={8} as={IoSettingsOutline} />
              <Text>Settings</Text>
            </HStack>
          </Link>
        </ListItem>
      </List>
    </>
  );
};

export default TabList;
