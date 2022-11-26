import React, { useContext, useMemo, useCallback } from "react";
import ModalContext from "./ModalContext";
import ModalProvider from "./ModalProvider";

const generateModalKey = (() => {
  let count = 0;

  return () => `${++count}`;
})();

function useModal(
  component: React.FunctionComponent<any>,
  data: Record<any, any>,
  onClose?: () => void
) {
  const key = useMemo(generateModalKey, []);
  const context = useContext(ModalContext);
  const showModal = useCallback(
    (modalData?: Record<any, any>) =>
      context.showModal(
        key,
        component,
        modalData instanceof Event ? data : { ...data, ...modalData }
      ),
    [data, context.showModal]
  );
  const hideModal = useCallback(
    () => context.hideModal(key, onClose),
    [context.hideModal, onClose, key]
  );

  return [showModal, hideModal];
}

useModal.ModalContext = ModalContext;
useModal.ModalProvider = ModalProvider;

export default useModal;
