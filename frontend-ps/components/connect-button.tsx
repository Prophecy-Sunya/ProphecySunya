import {
  addToast,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Connector, useConnect } from "@starknet-react/core";
import Image from "next/image";

const loader = ({ src }: { src: string }) => {
  return src;
};

const Wallet = ({
  name,
  alt,
  src,
  connector,
}: {
  name: string;
  alt: string;
  src: string;
  connector: Connector;
}) => {
  const { connectAsync, isPending, error } = useConnect();

  function handleConnectWallet() {
    connectAsync({ connector });
    localStorage.setItem("lastUsedConnector", connector.name);
  }

  return (
    <>
      <Button
        onPress={handleConnectWallet}
        isLoading={isPending}
        variant="shadow"
        className="flex justify-center items-center"
        size="lg"
        radius="md"
      >
        <div className="size-8">
          <Image
            alt={alt}
            loader={loader}
            src={src}
            width={70}
            height={70}
            className="h-full w-full  object-cover"
          />
        </div>
        <p className="ml-8">{name}</p>
      </Button>
      {error &&
        addToast({
          title: "Error",
          description: error.message,
          color: "danger",
        })}
    </>
  );
};

const ConnectButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { connectors, isPending } = useConnect();
  return (
    <>
      <Button
        isLoading={isPending}
        onPress={onOpen}
        className="bg-gradient-to-tr from-pink-500 to-yellow-500  text-white transition-transform duration-200 ease-in-out hover:scale-105"
        radius="full"
        variant="shadow"
      >
        Connect Wallet
      </Button>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <>
            <ModalHeader>
              <h3 className="font-semibold text-lg">Connect a Wallet</h3>
            </ModalHeader>
            <ModalBody>
              <h4 className="font-semibold">Popular</h4>
              {connectors.length > 0 && (
                <div className="flex flex-col gap-4 py-8">
                  {connectors.map((connector, index) => (
                    <Wallet
                      key={connector.id || index}
                      src={
                        typeof connector.icon === "object"
                          ? connector.icon.dark || connector.icon.light
                          : connector.icon
                      }
                      name={connector.name}
                      connector={connector}
                      alt={connector.name}
                    />
                  ))}
                </div>
              )}

              <Divider />
              <ModalFooter className="flex  justify-center items-center">
                {/* By connecting, you agree to ProphecySunya&apos;s Terms of
                Service and acknowledge you have read our Privacy Policy. */}
                <p>Don't have a wallet?</p>
                <div className="flex gap-4">
                  <a
                    href="https://www.argent.xyz/argent-x/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Argent X
                  </a>
                  <a
                    href="https://braavos.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Braavos
                  </a>
                </div>
              </ModalFooter>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConnectButton;
