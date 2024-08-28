import { Button, useColorMode } from "@chakra-ui/react";

function ModeSelect({color}) {
  const { colorMode, toggleColorMode } = useColorMode();
  
  return (
    <Button onClick={toggleColorMode} w={40} bgColor={color}>
      {colorMode === "light" ? "Dark" : "Light"} Mode
    </Button>
  );
}

export default ModeSelect;
