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

  useEffect(() => {
    return setIsOpen(false);
  }, [handleClickOutside]);

  return (
    <div className="dots-drop-down" ref={dropDownRef}>
      <button
        type="button"
        className="dots-drop-down__button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <BsThreeDotsVertical />
      </button>
      {isOpen ? (
        <div className="dots-drop-down__content">
          <button
            type="button"
            className="dots-drop-down__delete"
            onClick={onDelete}
          >
            <RiDeleteBinLine />
            Delete
          </button>
          <button type="button" className="drop-down" onClick={onEdit}>
            <BiEdit />
            Edit
          </button>
        </div>
      ) : null}
    </div>
  );
}
