import React from "react";
import { SocialIcon } from "react-social-icons";

const socials = ({ expert }) => {
  const socialRedirectUrl = (url) => {
    if (url.includes("https://")) {
      return url;
    } else if (url.includes("http://")) {
      return url;
    } else if (url.includes("www.")) {
      return url;
    } else {
      return `https://${url}`;
    }
  };
  return (
    <>
      <div className="profile-bor-detail expert-endorsements">
        <dt>Social Link </dt>
        <dd>
          {expert.facebookURL && (
            <SocialIcon
              target="_blank"
              rel="noopener noreferrer"
              url={socialRedirectUrl(expert.facebookURL)}
              style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
            />
          )}
          {expert.twitterURL && (
            <SocialIcon
              target="_blank"
              rel="noopener noreferrer"
              url={socialRedirectUrl(expert.twitterURL)}
              style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
            />
          )}

          {expert.linkedinURL && (
            <SocialIcon
              target="_blank"
              rel="noopener noreferrer"
              url={socialRedirectUrl(expert.linkedinURL)}
              style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
            />
          )}
          {expert.instagramURL && (
            <SocialIcon
              target="_blank"
              rel="noopener noreferrer"
              url={socialRedirectUrl(expert.instagramURL)}
              style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
            />
          )}
          {expert.youtubeURL && (
            <SocialIcon
              target="_blank"
              rel="noopener noreferrer"
              url={socialRedirectUrl(expert.youtubeURL)}
              style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
            />
          )}
          {expert.soundcloudURL && (
            <SocialIcon
              target="_blank"
              rel="noopener noreferrer"
              url={socialRedirectUrl(expert.youtubeURL)}
              style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
            />
          )}
          {expert.spotifyURL && (
            <SocialIcon
              target="_blank"
              rel="noopener noreferrer"
              url={socialRedirectUrl(expert.spotifyURL)}
              style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
            />
          )}
          {expert.audiomackURL && (
            <a
              href={socialRedirectUrl(expert.audiomackURL)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                loading="lazy"
                alt="audiomac"
                src="https://donnysliststory.sfo3.cdn.digitaloceanspaces.com/profile/audiomac-removebg-preview.png"
                style={{
                  height: "2rem",
                  width: "2rem",
                  marginRight: "1rem",
                  objectFit: "cover",
                }}
              />
            </a>
          )}
          {expert.musicYoutubeURL && (
            <SocialIcon
              target="_blank"
              rel="noopener noreferrer"
              url={socialRedirectUrl(expert.musicYoutubeURL)}
              style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
            />
          )}
          {expert.looksrareURL && (
            <a
              href={socialRedirectUrl(expert.looksrareURL)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                loading="lazy"
                alt="looksrare"
                src="https://donnysliststory.sfo3.cdn.digitaloceanspaces.com/profile/looksrarelogo.jpeg"
                style={{
                  height: "2rem",
                  width: "2rem",
                  marginRight: "1rem",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </a>
          )}
          {expert.openseaURL && (
            <a
              href={socialRedirectUrl(expert.openseaURL)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                loading="lazy"
                alt="opensea"
                src="https://donnysliststory.sfo3.cdn.digitaloceanspaces.com/profile/opensea.png"
                style={{
                  height: "2rem",
                  width: "2rem",
                  marginRight: "1rem",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </a>
          )}
          {expert.websiteURL && (
            <SocialIcon
              target="_blank"
              rel="noopener noreferrer"
              url={socialRedirectUrl(expert.websiteURL)}
              style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
            />
          )}
          {expert.facebookURL === "" &&
            expert.twitterURL === "" &&
            expert.linkedinURL === "" &&
            expert.instagramURL === "" &&
            expert.websiteURL === "" &&
            expert.youtubeURL === "" &&
            expert.soundcloudURL === "" &&
            expert.spotifyURL === "" &&
            expert.audiomackURL === "" &&
            expert.musicYoutubeURL === "" &&
            expert.looksrareURL === "" &&
            expert.openseaURL === "" &&
            "No Social Links Available Yet"}
        </dd>
      </div>
    </>
  );
};

export default socials;
