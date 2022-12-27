import React, { useState, useCallback, useEffect } from "react";

import defaultUrl from "../../../assets/images/pro1.png";

const ImageComponent = ({
  src,
  placeholder,
  public_id,
  width,
  height,
  style,
  imageUrl,
  ...restProps
}) => {
  const [currentSrc, setSrc] = useState(placeholder || src);

  const onLoad = useCallback(() => {
    setSrc(src);
  }, [src]);

  useEffect(() => {
    const img = new Image();
    img.loading = "lazy";
    img.src = src;
    img.addEventListener("load", onLoad);
    return () => {
      img.removeEventListener("load", onLoad);
    };
  }, [src, onLoad]);

  const handleFailedImage = (e) => {
    console.log(e, src);
    setSrc(placeholder);
  };

  if (imageUrl !== undefined && imageUrl) {
    return (
      <img
        loading="lazy"
        src={imageUrl}
        width={width}
        height={height}
        style={style}
        onError={handleFailedImage}
        {...restProps}
        alt="failed public id "
      />
    );
  }
  if (typeof public_id !== "undefined" && public_id) {
    return (
      <img
        loading="lazy"
        src={public_id}
        width={width}
        height={height}
        style={style}
        onError={handleFailedImage}
        {...restProps}
        alt="failed public id "
      />
    );
  }

  return (
    <img
      loading="lazy"
      src={currentSrc || defaultUrl}
      onError={handleFailedImage}
      width={width}
      height={height}
      style={style}
      {...restProps}
      alt="failed"
    />
  );
};

export default ImageComponent;
