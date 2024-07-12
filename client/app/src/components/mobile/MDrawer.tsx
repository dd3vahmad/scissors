import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import TabList from "../TabList";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  placement?: "left" | "right";
}

const MDrawer = ({ isOpen, onClose, placement = "left" }: IProps) => {
  return (
    <>
      <Drawer size="xs" isOpen={isOpen} placement={placement} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <TabList />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MDrawer;
