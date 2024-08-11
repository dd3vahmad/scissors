import { useToast } from "@chakra-ui/react";

export const useCustomToast = () => {
  const toast = useToast();

  const showToast = (
    status: "info" | "warning" | "success" | "error" | "loading" | undefined,
    message: string
  ) => {
    const statusColors = {
      loading: "yellow",
      success: "green",
      error: "red",
      warning: "orange",
      info: "blue",
    };

    toast({
      title: message,
      status: status,
      duration: 5000,
      isClosable: true,
      position: "top-right",
      variant: "solid",
      containerStyle: {
        animation: "fadeIn 0.5s",
        backgroundColor: `${statusColors[status || "info"]}.500`,
      },
    });
  };

  return { showToast };
};
