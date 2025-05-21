"use client";

import * as React from "react";
import { useStoreWallet } from "@/stores/wallet-store";

const Hydration = () => {
  React.useEffect(() => {
    useStoreWallet.persist.rehydrate();
  }, []);

  return null;
};

export default Hydration;
