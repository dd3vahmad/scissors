import { Flex, Icon, Input, Select, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { BiLock } from "react-icons/bi";
import { BsQuestionCircleFill } from "react-icons/bs";
import { ICreateLink } from "../entites/Link";

interface IProps {
  setLinkData: Dispatch<SetStateAction<ICreateLink>>;
}

const ShortLinkShare = ({ setLinkData }: IProps) => {
  const backHalfCount = 5;

  return (
    <>
      <Flex direction={"column"} gap={5}>
        <Flex direction={"column"} gap={2}>
          <Text fontSize={"xl"} fontWeight={700}>
            Short Link
          </Text>
          <Text fontSize={"md"} fontWeight={600}>
            Domain
          </Text>
          <Select placeholder="sics.ly" size="md" disabled={true} />
          <Icon size={8} as={BiLock} />
        </Flex>
        <Flex direction={"column"} gap={2}>
          <Text fontSize={"md"} fontWeight={600}>
            Custom back-half (Optional)
          </Text>
          <Input
            onChange={(e) =>
              setLinkData((prev) => {
                return {
                  ...prev,
                  backHalf: e.target.value,
                };
              })
            }
            size={"md"}
          />
          <Flex alignItems={"center"} justifyContent={"space-evenly"}>
            <Text fontSize="sm" fontWeight={500}>
              You can create {backHalfCount} more custom back-halves this month.
            </Text>
            <Icon size={8} as={BsQuestionCircleFill} />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default ShortLinkShare;
