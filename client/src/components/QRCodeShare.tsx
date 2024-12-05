import { Flex, Icon, Switch, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { BsQuestionCircleFill } from "react-icons/bs";
import { ICreateLink } from "../entites/Link";

interface IProps {
  setLinkData: Dispatch<SetStateAction<ICreateLink>>;
  qrCodePage: boolean | undefined;
}

const QRCodeShare = ({ setLinkData, qrCodePage }: IProps) => {
  const qrCodeCount = 2;

  useEffect(() => {
    if (!qrCodePage)
      setLinkData((prev) => ({ ...prev, generateQrCode: !qrCodePage }));
  }, []);

  return (
    <>
      <Flex direction={"column"} gap={5} mt={5}>
        <Flex direction={"column"} gap={2}>
          <Text fontSize={"xl"} fontWeight={700}>
            QR Code (optional)
          </Text>
          <Flex alignItems={"center"} justifyContent={"space-between"} gap={2}>
            <Switch
              onChange={() => {
                setLinkData((prev) => {
                  return { ...prev, generateQrCode: !prev.generateQrCode };
                });
              }}
              size="md"
              isChecked={!qrCodePage}
            />
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
