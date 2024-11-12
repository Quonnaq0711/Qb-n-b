import { useModal } from '../../context/modal';

function OpenModalButton({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
    if (setModalContent) setOnModalClose()
  };

  return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;
