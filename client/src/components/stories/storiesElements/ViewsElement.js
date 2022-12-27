import { VscEye } from 'react-icons/vsc';

function ViewsElement({ setOpenModal, story }) {
  const viewsArray = story?.views?.filter((view) => view !== null);
  return (
    <div className="flex-center" onClick={() => setOpenModal(true)}>
      <VscEye className="icon" />
      <p className="small-text">{viewsArray?.length}</p>
    </div>
  );
}

export default ViewsElement;
