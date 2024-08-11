import { Container, Flex, Icon, Text } from "@chakra-ui/react";
import IQrCode from "../entites/QrCode";
import { IoAddSharp } from "react-icons/io5";
import QRCodeCard from "./QRCodeCard";
import { useNavigate } from "react-router-dom";

interface IProps {
  qrcodes: IQrCode[];
  onDeleteQrCode: () => void
}

const QrCodeList = ({ qrcodes, onDeleteQrCode }: IProps) => {
  const location = useNavigate();

  return (
    <Container>
      <Flex justifyContent={"space-between"} alignItems={"center"} mb={2}>
        <Text fontSize={"larger"} py={2} fontWeight={600}>
          My Sicsly QrCodes:
        </Text>
        <Flex gap={2} onClick={() => location("/create-new/qrcode")}>
          <Text fontWeight={600}>Create</Text>
          <Icon
            as={IoAddSharp}
            borderRadius={"50%"}
            minInlineSize={26}
            minBlockSize={26}
            borderWidth={2}
          />
        </Flex>
      </Flex>
      <Flex
        flexWrap={"wrap"}
        justifyContent={qrcodes.length > 1 ? "space-evenly" : "start"}
        alignItems={"start"}
        rowGap={5}
      >
        {qrcodes.map((qrcode: IQrCode, i) => {
          return <QRCodeCard onDelete={onDeleteQrCode} key={i} qrCode={qrcode} />;
        })}
      </Flex>
    </Container>
  );
};

export default QrCodeList;
