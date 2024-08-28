import Header from "./layouts/Header";
import { Box } from '@chakra-ui/react'
function App() {
  return (
    <>
      <Box sx={{
        width: '100vw',
        height: '100vh'
      }}>
        <Header/>
        hello
      </Box>
    </>
  );
}

export default App;
