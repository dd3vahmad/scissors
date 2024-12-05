import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import TabList from "../TabList";
import { useState } from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  placement?: "left" | "right";
}

const MDrawer = ({ isOpen, onClose, placement = "left" }: IProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <>
      <Drawer size="xs" isOpen={isOpen} placement={placement} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <TabList
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onClose={onClose}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MDrawer;
