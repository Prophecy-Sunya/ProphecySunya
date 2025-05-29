"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import {
  useAccount,
  useDisconnect,
  useStarkProfile,
} from "@starknet-react/core";
import { useEffect, useState } from "react";
import AccountBalance from "./account-balance";
import CopyButton from "./copy-button";
import Image from "next/image";

const AddressBar = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: starkProfile } = useStarkProfile({
    address,
    useDefaultPfp: true,
  });
  const [imageError, setImageError] = useState(false);

  // Reset imageError when address changes
  useEffect(() => {
    setImageError(false);
  }, [address]);

  if (!address) {
    return null;
  }

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <>
      <Popover placement="bottom-end" backdrop="blur" offset={10}>
        <PopoverTrigger>
          <Button
            className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
            radius="full"
            variant="shadow"
          >
            <span className="flex items-center">
              {!imageError && starkProfile?.profilePicture && (
                <div className="mr-2 size-8 relative">
                  <Image
                    src={starkProfile.profilePicture}
                    className="object-cover"
                    alt="starknet profile"
                    fill
                    onError={() => {
                      setImageError(true);
                    }}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
                  />
                </div>
              )}
              {starkProfile?.name
                ? starkProfile.name
                : address?.slice(0, 6).concat("...").concat(address?.slice(-5))}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Card className="flex w-[90vw] max-w-[25rem] flex-col justify-between gap-4 text-md  transition-colors duration-500 ease-linear border border-default/50">
            <CardHeader className="justify-between">
              <h3 className="text-xl font-semibold">Connected</h3>
            </CardHeader>
            <CardBody>
              <div className="mx-auto">
                <div className="mx-auto mb-4 h-20 w-20 overflow-clip rounded-full ">
                  {!imageError && starkProfile?.profilePicture && (
                    <div className="mr-2 size-full relative">
                      <Image
                        src={starkProfile?.profilePicture}
                        className="object-cover"
                        fill
                        alt="starknet profile"
                        onError={() => setImageError(true)}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
                      />
                    </div>
                  )}
                </div>
                <CopyButton
                  copyText={starkProfile?.name || address || ""}
                  buttonText={
                    starkProfile?.name ||
                    address
                      ?.slice(0, 12)
                      .concat("...")
                      .concat(address?.slice(-5))
                  }
                />
              </div>
              <div className="rounded-[12px] bg-[--modal-assets-bg] transition-colors duration-500 ease-linear">
                <AccountBalance address={address || ""} />
              </div>
            </CardBody>
            <CardFooter className="flex justify-center">
              <Button
                color="danger"
                size="lg"
                variant="shadow"
                onPress={handleDisconnect}
                fullWidth
              >
                Disconnect
              </Button>
            </CardFooter>
          </Card>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AddressBar;
