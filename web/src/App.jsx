import { Route, Routes } from "react-router-dom";
import Header from "./layouts/Header";
import { Box } from "@chakra-ui/react";
import Dashboard from "./pages/Dashboard";
function App() {
  return (
    <>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
        }}
      >
        {/* đây là phần header, có 2 header và subheader, mainheader */}
        <Header />
        {/* phần này là có các path */}
        <Box px={"50"} sx={{ height: "calc(100vh - 100px)" }}>
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
}

export default App;
