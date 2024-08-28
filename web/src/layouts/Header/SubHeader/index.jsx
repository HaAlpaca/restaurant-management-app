import { Box} from "@chakra-ui/react";
import ModeSelect from "../../../components/ModeSelect";

function SubHeader() {

  return (
    <Box height={"subHeader"} sx={{ display: "flex", alignItems: "center" }} px={"50"}>
      <ModeSelect />
    </Box>
  );
}

export default SubHeader;
