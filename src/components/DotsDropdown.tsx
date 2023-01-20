import { useState, useEffect, useRef } from 'react';
import { BiEdit } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiDeleteBinLine } from 'react-icons/ri';
import useClickOutsideRef from '../hooks/useClickOutsideRef';

interface IProps {
  onDelete: () => void;
  onEdit: () => void;
}

export default function DotsDropdown({ onDelete, onEdit }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);
  const handleClickOutside = useClickOutsideRef(dropDownRef);

  function handleEdit() {
    onEdit();
    setIsOpen(false);
  }
  function handleDelete() {
    onDelete();
    setIsOpen(false);
  }

  useEffect(() => {
    return setIsOpen(false);
  }, [handleClickOutside]);

  return (
    <div className="dots-drop-down" ref={dropDownRef}>
      <button
        type="button"
        className="dots-drop-down__button"
        aria-label={isOpen ? 'Close more options' : 'More options'}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <BsThreeDotsVertical />
      </button>
      {isOpen ? (
        <div className="dots-drop-down__content">
          <button
            type="button"
            className="dots-drop-down__delete"
            onClick={handleDelete}
          >
            <RiDeleteBinLine />
            Delete
          </button>
          <button type="button" className="drop-down" onClick={handleEdit}>
            <BiEdit />
            Edit
          </button>
        </div>
      ) : null}
    </div>
  );
}
