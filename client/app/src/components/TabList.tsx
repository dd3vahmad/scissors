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
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import tabs from "../data/tabs";
import { Dispatch, SetStateAction } from "react";

interface IProps {
  onClose: () => void;
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
}

const TabList = ({ onClose = () => {}, activeTab, setActiveTab }: IProps) => {
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
