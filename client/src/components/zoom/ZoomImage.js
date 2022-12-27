import { ZoomImageContainer, Image, ZoomImageText } from "./styles";

function ZoomImage({ src, bottomLine }) {
  return (
    <>
      <ZoomImageContainer>
        {src && <Image loading="lazy" src={src} alt="" />}

        <ZoomImageText>{bottomLine}</ZoomImageText>
      </ZoomImageContainer>
    </>
  );
}

export default ZoomImage;
