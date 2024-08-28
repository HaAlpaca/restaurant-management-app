
import { useToast,Button} from '@chakra-ui/react'
function Toast() {
  const toast = useToast();
  const success = () =>
    toast({
      title: 'Account created.',
      description: "We've created your account for you.",
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
  return (
    <Button onClick={success}>
        Show Toast
    </Button>
  );
}

export default Toast;
