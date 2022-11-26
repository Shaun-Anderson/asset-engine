import React, { useState, useMemo, useCallback } from "react";
import ModalContext from "./ModalContext";

interface ModalConfig {
  [modalKey: string]: {
    component: React.FunctionComponent<any>;
    isOpen: boolean;
    data: Record<any, any>;
  };
}

const ModalProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [modalsConfig, setConfig] = useState<ModalConfig>({});
  const hideModal = useCallback(
    (modalKey, onClose?) => {
      setConfig((prevConfig) => ({
        ...prevConfig,
        [modalKey]: { ...prevConfig[modalKey], isOpen: false },
      }));

      if (onClose) {
        onClose();
      }
    },
    [setConfig]
  );
  const showModal = useCallback(
    (
      modalKey: string,
      component: React.FunctionComponent<any>,
      modalData: Record<any, any>
    ) => {
      setConfig((prevConfig) => ({
        ...prevConfig,
        [modalKey]: { isOpen: true, component, data: modalData },
      }));
    },
    [setConfig]
  );
  const contextValue = useMemo(
    () => ({
      showModal,
      hideModal,
      isOpenedModal: Object.values(modalsConfig).some(({ isOpen }) => isOpen),
    }),
    [hideModal, showModal, modalsConfig]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {Object.keys(modalsConfig).map((modalKey) => {
        const { component: Component, isOpen, data } = modalsConfig[modalKey];

        return (
          isOpen && (
            <Component
              onClose={() => hideModal(modalKey)}
              key={modalKey}
              isOpen={isOpen}
              {...data}
            />
          )
        );
      })}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
