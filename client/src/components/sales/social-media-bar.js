import React from "react";

const SocialMediaBar = (props) => {
  return (
    <div className="social-bar">
      <ul>
        {props.socialNetworks.map((data, index) => (
          <li key={`${data}-${index}`} className="social-icon">
            <a title={data.name} href={data.href}>
              <img loading="lazy" alt={data.name} src={data.img} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialMediaBar;
