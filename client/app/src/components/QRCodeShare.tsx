import { Flex, Icon, Switch, Text } from "@chakra-ui/react";
import { BsQuestionCircleFill } from "react-icons/bs";

const QRCodeShare = () => {
  const qrCodeCount = 2;

  return (
    <>
      <Flex direction={"column"} gap={5} mt={5}>
        <Flex direction={"column"} gap={2}>
          <Text fontSize={"xl"} fontWeight={700}>
            QR Code (optional)
          </Text>
          <Flex alignItems={"center"} justifyContent={"space-between"} gap={2}>
            <Switch size="md" />
            <Text fontSize={"sm"} fontWeight={600}>
              Generate a QR Code to share anywhere people can see it
            </Text>
          </Flex>
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Text fontSize="sm" fontWeight={500}>
              You can create {qrCodeCount} more QR Codes this month.
            </Text>
            <Icon size={8} as={BsQuestionCircleFill} />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default QRCodeShare;
