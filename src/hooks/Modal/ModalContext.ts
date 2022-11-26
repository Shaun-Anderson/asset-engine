import React from "react";

interface ModalContextProps {
  showModal: (
    modalKey: string,
    component: React.FunctionComponent<any>,
    modalData: Record<any, any>
  ) => void;
  hideModal: (modalKey: any, onClose?: any) => void;
  isOpenedModal: boolean;
}

/**
 * Throw error when ModalContext is used outside of context provider
 */
const invariantViolation = () => {
  throw new Error(
    "Attempted to call useModal outside of modal context. Make sure your app is rendered inside ModalProvider."
  );
};

const ModalContext = React.createContext<ModalContextProps>({
  showModal: invariantViolation,
  hideModal: invariantViolation,
  isOpenedModal: false,
});

export default ModalContext;
