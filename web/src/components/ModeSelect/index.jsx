import { Button, useColorMode } from "@chakra-ui/react";

function ModeSelect() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button onClick={toggleColorMode} w={40}>
      {colorMode === "light" ? "Dark" : "Light"} Mode
    </Button>
  );
}

export default ModeSelect;
