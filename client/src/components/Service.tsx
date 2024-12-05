import { Button, Flex, Image, Text } from "@chakra-ui/react";
import getCroppedImageUrl from "../Utils/image-url";
import { useNavigate } from "react-router-dom";
import IService from "../entites/Service";

interface IProps {
  service: IService;
}

const Service = ({ service }: IProps) => {
  const location = useNavigate();

  return (
    <Flex gap={3}>
      <Image
        objectFit={"cover"}
        boxSize={"100px"}
        src={getCroppedImageUrl(service.banner)}
        borderRadius={8}
      />
      <Flex direction={"column"} justifyContent={"space-between"}>
        <Text as={"samp"} fontSize={"xl"}>
          {service.title}
        </Text>
        <Button onClick={() => location(service.path)}>
          Go to {service.name}
        </Button>
      </Flex>
    </Flex>
  );
};

export default Service;
