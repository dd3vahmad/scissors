import {
  Divider,
  HStack,
  Heading,
  Icon,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { IconType } from "react-icons";
import { BiHome, BiLink } from "react-icons/bi";
import { ImQrcode } from "react-icons/im";
import { IoAnalyticsOutline, IoSettingsOutline } from "react-icons/io5";
import { RiPagesLine } from "react-icons/ri";
import { Link } from "react-router-dom";

interface IProps {
  onClose?: () => void;
}

interface ITab {
  name: string;
  icon: IconType;
  path: string;
}

const TabList = ({ onClose = () => {} }: IProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs: ITab[] = [
    {
      name: "Home",
      icon: BiHome,
      path: "/",
    },
    {
      name: "Links",
      icon: BiLink,
      path: "/links",
    },
    {
      name: "QR Codes",
      icon: ImQrcode,
      path: "/qrcodes",
    },
    {
      name: "Pages",
      icon: RiPagesLine,
      path: "/pages",
    },
    {
      name: "Analytics",
      icon: IoAnalyticsOutline,
      path: "/analytics",
    },
  ];

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
                  _hover={{ bg: "gray.50" }}
                  bg={activeTab === i ? "gray.100" : "none"}
                  borderRadius={"sm"}
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
              _hover={{ bg: "gray.50" }}
              bg={activeTab === tabs.length ? "gray.100" : "none"}
              borderRadius={"sm"}
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
