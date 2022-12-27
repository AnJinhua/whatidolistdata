import { NoArchiveContiner, NoImage, NoArchiveText } from "./styles";

function NoArchive({ src, bottomLine }) {
  return (
    <>
      <NoArchiveContiner>
        {src && <NoImage src={src} alt="" />}

        <NoArchiveText>{bottomLine}</NoArchiveText>
      </NoArchiveContiner>
    </>
  );
}

export default NoArchive;
