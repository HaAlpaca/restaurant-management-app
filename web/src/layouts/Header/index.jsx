import { Box} from '@chakra-ui/react'
import MainHeader from './MainHeader'
import SubHeader from './SubHeader'

function Header() {
  return (
    <Box height={'header'} >
        <SubHeader/>
        <MainHeader/>
    </Box>
  )
}

export default Header