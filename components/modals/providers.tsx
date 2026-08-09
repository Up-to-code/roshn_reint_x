"use client";

import { ReactNode } from "react";

import { useSignInModal } from "@/components/modals//sign-in-modal";

export default function ModalProvider({ children }: { children: ReactNode }) {
  const { SignInModal } = useSignInModal();

  return (
    <>
      <SignInModal />
      {children}
    </>
  );
}
