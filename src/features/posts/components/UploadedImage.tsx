import { AiOutlineClose } from 'react-icons/ai';

interface Iprops {
  file: File;
  onFileRemove: (name: string, size: number) => void;
}

export default function UploadedImage({ file, onFileRemove }: Iprops) {
  const image = URL.createObjectURL(file);

  return (
    <div className="new-post-form__image-container">
      <img src={image} alt={file.name} />
      <button
        type="button"
        aria-label={`remove ${file.name} image`}
        onClick={() => onFileRemove(file.name, file.size)}
        className="new-post-form__image-delete"
      >
        <AiOutlineClose />
      </button>
    </div>
  );
}
