import { HStack, IconButton } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { FaGoogle, FaApple, FaGithub, FaGitlab } from "react-icons/fa";

const OAuthProviders = () => {
  return (
    <HStack>
      <Tooltip content="Continue with Google">
        <IconButton size="lg" variant="outline">
          <FaGoogle />
        </IconButton>
      </Tooltip>
      <Tooltip content="Continue with Apple">
        <IconButton size="lg" variant="outline">
          <FaApple />
        </IconButton>
      </Tooltip>
      <Tooltip content="Continue with Github">
        <IconButton size="lg" variant="outline">
          <FaGithub />
        </IconButton>
      </Tooltip>
      <Tooltip content="Continue with Gitlab">
        <IconButton size="lg" variant="outline">
          <FaGitlab />
        </IconButton>
      </Tooltip>
    </HStack>
  );
};

export default OAuthProviders;
