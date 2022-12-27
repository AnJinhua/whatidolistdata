import { DeleteBtn, EditableContainer, SaveBtn } from "./styles";
import { HiPencilAlt } from "react-icons/hi";
import { RiDragDropLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateUser, handleShow, resumeUploadS3 } from "../../actions/user";
import { deleteState } from "../../actions/auth";
import { API_URL } from "../../constants/api";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SocialIcon } from "react-social-icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AutoComplete from "./AutoComplete";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { fetchList } from "../../actions/list";
import useSWR from "swr";

function EditableProfile() {
  const default_props = {
    loading: false,
    resumefileObject: null,
    submit_disabled: "",
  };

  //regex to match any website link or empty string
  const websiteRegex =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  const linkedinRegex =
    /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9(\.|\-)_]+/;
  //regex to match youtube url https://www.youtube.com/channel/<channelId>/
  const youtubeRegex =
    /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?youtube.com\/[a-zA-Z0-9(\.|\-)_]+/;
  //regex to match instagram url https://www.instagram.com/<username>/
  const instagramRegex =
    /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?instagram.com\/[a-zA-Z0-9(\.|\-)_]+/;
  //regex to match twitter url https://twitter.com/<username>/
  const twitterRegex =
    /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?twitter.com\/[a-zA-Z0-9(.|\-)_]+/;

  const soundcloudRegex =
    /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?soundcloud.com\/[a-zA-Z0-9(.|\-)_]+/;

  const audiomackRegex =
    /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?audiomack.com\/[a-zA-Z0-9(.|\-)_]+/;

  const musicYoutubeRexex =
    /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?music.youtube.com\/[a-zA-Z0-9(.|\-)_]+/;
  const looksrareRegex =
    /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?looksrare.org\/[a-zA-Z0-9(.|\-)_]+/;
  const openseaRegex =
    /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?opensea.io\/[a-zA-Z0-9(.|\-)_]+/;

  //regex expression to match spotify url https://spotify.com/user/<username>/ or https://open.spotify.com/user/<username>
  const spotifyRegex =
    /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?(?:spotify\.com\/|open\.spotify\.com\/)[a-zA-Z0-9(\.|\-)_]+/;

  //facebook instagram twitter linkedin youtube website
  const schema = yup.object().shape({
    facebookURL: yup
      .string()
      .default(null)
      .nullable()
      .matches(
        /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?(?:facebook|web\.facebook)\.com\/[a-zA-Z0-9(.|\-)_]+/,
        "facebook url is invalid"
      ),
    twitterURL: yup
      .string()
      .default(null)
      .nullable()
      .matches(twitterRegex, "twitter url is invalid"),
    youtubeURL: yup
      .string()
      .default(null)
      .nullable()
      .matches(youtubeRegex, "youtube url is invalid"),
    instagramURL: yup
      .string()
      .default(null)
      .nullable()
      .matches(instagramRegex, "instagram url is invalid"),
    linkedinURL: yup
      .string()
      .default(null)
      .nullable()
      .matches(linkedinRegex, "linkedin url is invalid"),
    soundcloudURL: yup
      .string()
      .default(null)
      .nullable()
      .matches(soundcloudRegex, "soundcloud url is invalid"),
    spotifyURL: yup
      .string()
      .default(null)
      .nullable()
      .matches(spotifyRegex, "spotify url is invalid"),
    audiomackURL: yup
      .string()
      .default(null)
      .nullable()
      .matches(audiomackRegex, "audiomac url is invalid"),
    musicYoutubeURL: yup
      .string()
      .default(null)
      .nullable()
      .matches(musicYoutubeRexex, "youtube music url is invalid"),
    looksrareURL: yup
      .string()
      .default(null)
      .nullable()
      .matches(looksrareRegex, "looksrare url is invalid"),
    openseaURL: yup
      .string()
      .default(null)
      .nullable()
      .matches(openseaRegex, "opensea url is invalid"),
    websiteURL: yup
      .string()
      .default(null)
      .nullable()
      .matches(websiteRegex, "invalid website url"),
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const [showUniversities, setShowUniversities] = useState(false);
  const [universityList, setUniversityList] = useState([]);
  const user = useSelector((state) => state.user);
  const { profile } = user;
  useState("");
  const [state, setState] = useState(default_props);
  const [cookies] = useCookies(["user"]);
  const { categoryData } = useSWR(`${API_URL}/getExpertsCategoryList`);
  const catigoryList = useSelector((state) => state.list.List);
  const getExpertCommunity = () =>
    catigoryList.find((item) =>
      item.subcategories.find(
        (subitem) => subitem.slug === profile?.expertCategories?.[0]
      )
    );
  const {
    getValues,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    criteriaMode: "all",
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      university: profile.university,
      area_of_expertise: getExpertCommunity()?.slug,
      category_of_expertise: profile?.expertCategories?.[0],
      focus_of_expertise: profile?.expertFocusExpertise,
      years_of_expertise: profile?.yearsexpertise,
      twitterURL: profile?.twitterURL,
      facebookURL: profile?.facebookURL,
      instagramURL: profile?.instagramURL,
      linkedinURL: profile?.linkedinURL,
      youtubeURL: profile?.youtubeURL,
      soundcloudURL: profile?.soundcloudURL,
      spotifyURL: profile?.spotifyURL,
      audiomackURL: profile?.audiomackURL,
      musicYoutubeURL: profile?.musicYoutubeURL,
      openseaURL: profile?.openseaURL,
      looksrareURL: profile?.looksrareURL,
      websiteURL: profile?.websiteURL,
    },
  });

  const getExpertCategoryExpertise = () => {
    const formValue = getValues();
    return catigoryList.find(
      ({ slug }) => slug === formValue.area_of_expertise
    );
  };

  const [categoryExpertiseList, setCategoryExpertiseList] = useState(
    getExpertCategoryExpertise()?.subcategories
  );

  const onChangeAreaOfExpertise = (e) => {
    const updateCategoryList = catigoryList.find(
      ({ slug }) => slug === e.target.value
    );

    setCategoryExpertiseList(updateCategoryList?.subcategories);
  };

  //retrun true if errors is not empty
  const hasError = Object.keys(errors).length > 0;

  let cancelToken;

  const searchInvoke = async (e) => {
    if (cancelToken) {
      cancelToken.cancel("Operations cancelled due to new request");
    }

    cancelToken = axios.CancelToken.source();

    try {
      if (e.target.value && e.target.value.length >= 2) {
        const results = await axios.get(
          `${API_URL}/university/${e.target.value}`,
          {
            cancelToken: cancelToken.token,
          }
        );
        if (results?.data.length > 0) {
          setUniversityList(results?.data);
        } else {
          setUniversityList([]);
        }
        console.log(results.data);
      } else {
        setUniversityList([]);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (catigoryList.length === 0 && categoryData) {
      dispatch(fetchList(categoryData));
    }
  }, [catigoryList.length, categoryData, dispatch]);

  const deleteAccount = async () => {
    if (global.confirm("Do you really want to delete your account?")) {
      dispatch(deleteState(history, profile?._id));
    }
  };

  const onChangeFile = async (e) => {
    //disable save change
    setState({
      ...state,
      submit_disabled: false,
    });

    //set image to be updated
    const file = e.target.files[0];
    const imageDta = new FormData();
    imageDta.append("file", file);
    try {
      const { data } = await resumeUploadS3(imageDta, cookies?.token);

      const resumeData = {
        key: data.key,
        location: data.location,
        cdnUrl: data.cdnUrl,
      };
      setState({
        ...state,
        resumefileObject: resumeData,
        submit_disabled: true,
      });
    } catch (error) {
      console.log(error);
      toast.error("error while updating ", {
        position: "top-center",
        theme: "dark",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const saveChanges = async (e) => {
    const values = getValues();

    setState({ ...state, loading: true });
    if (state.submit_disabled === true) {
      return;
    }

    const request_array = {
      user_email: cookies.user.email,
      updated_university: values.university,
      updated_area_of_experties2: values.category_of_expertise,
      updated_years_of_experties: values.years_of_expertise,
      updated_focus_of_experties: values.focus_of_expertise,

      resumefileObject: state.resumefileObject,

      instagramURL: values.instagramURL,
      youtubeURL: values.youtubeURL,
      linkedinURL: values.linkedinURL,
      twitterURL: values.twitterURL,
      facebookURL: values.facebookURL,
      websiteURL: values.websiteURL,
      soundcloudURL: values.soundcloudURL,
      spotifyURL: values.spotifyURL,
      audiomackURL: values.audiomackURL,
      musicYoutubeURL: values.musicYoutubeURL,
      looksrareURL: values.looksrareURL,
      openseaURL: values.openseaURL,
    };

    return axios
      .post(`${API_URL}/userExpertUpdate`, request_array, {
        headers: {
          authorization: cookies.token,
        },
      })
      .then((response) => {
        dispatch(updateUser(response.data));
        if (!response.data.success) {
          setState({
            ...state,
            responseMsg:
              "<div class='alert alert-danger text-center'>" +
              response.data.error +
              "</div>",
          });

          window.$(".form-control").val("");
          window.$("form").each(function () {
            this.reset();
          });
        }

        if (response.data.success) {
          setState({ ...state, loading: false });

          history.push("/profile");
          toast.success("Profile Updated Successfully", {
            position: "top-center",
            theme: "dark",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setState({
            ...state,
            responseMsg:
              "<div class='alert alert-success text-center'>" +
              response.data.message +
              "</div>",
          });
        }
      })
      .catch((error) => {
        toast.error("Profile Updated Failed", {
          position: "top-center",
          theme: "dark",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setState({
          ...state,
          responseMsg:
            "<div class='alert alert-danger text-center'>" + error + "</div>",
        });
      });
  };

  return (
    <EditableContainer>
      <div className="header">
        <div className="header-flex">
          <img
            loading="lazy"
            src={
              profile?.imageUrl ? profile.imageUrl?.cdnUrl : "/img/profile.png"
            }
            alt="avatar"
            className="header-avatar"
          />
          <div className="text-container">
            <div className="text-lg">
              {profile?.profile?.firstName + " " + profile?.profile?.lastName}
            </div>
            {/* <p className="text-base">{profile?.slug}</p> */}
          </div>
        </div>
      </div>

      <p className="underline-text">Public profile</p>

      <div className="editable-form">
        <div className="avatar-container">
          <div
            className="edit-avatar-container"
            onClick={() => dispatch(handleShow())}
          >
            <img
              loading="lazy"
              src={
                profile?.imageUrl
                  ? profile.imageUrl?.cdnUrl
                  : "/img/profile.png"
              }
              alt="profile"
              className="editable-avatar"
            />
            <div className="editable-btn">
              <HiPencilAlt />
              <p>edit</p>
            </div>
          </div>
        </div>

        <div className="form">
          {/* name */}
          <div className="form-grid">
            <div className="input-container">
              <p className="form-text">Name</p>
              <div className="form-container ">
                <input
                  type="text"
                  className="form-input"
                  placeholder="first name"
                  disabled
                  defaultValue={`${profile?.profile?.firstName}`}
                />
              </div>
            </div>

            <div className="input-container">
              <p className="form-text none">last name</p>
              <div className="form-container">
                <input
                  type="text"
                  className="form-input"
                  placeholder="last name"
                  disabled
                  defaultValue={`${profile?.profile?.lastName}`}
                />
              </div>
            </div>
          </div>

          {/* university */}
          <div className="input-container">
            <p className="form-text">University</p>

            <ClickAwayListener onClickAway={() => setShowUniversities(false)}>
              <div className="auto-complete-container">
                <div className="form-container">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="name of university"
                    {...register("university")}
                    onChange={(e) => {
                      searchInvoke(e);
                    }}
                    onFocus={() => setShowUniversities(true)}
                  />
                </div>

                {/* auto complete component */}

                {showUniversities && universityList.length > 0 && (
                  <AutoComplete
                    universityList={universityList}
                    setValue={setValue}
                    setShowUniversities={setShowUniversities}
                  />
                )}
              </div>
            </ClickAwayListener>
          </div>

          {/* expertise */}
          <div className="form-grid">
            <div className="input-container">
              <p className="form-text">Area of expertise</p>
              <div className="form-container ">
                <select
                  name="area_experties"
                  id="area-experties"
                  className="form-input"
                  {...register("area_of_expertise")}
                  onChange={onChangeAreaOfExpertise}
                >
                  {catigoryList?.map(({ name, slug }) => (
                    <option value={slug} key={slug}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-container">
              <p className="form-text none">category</p>
              <div className="form-container">
                <select
                  name="expertSubCategories"
                  className="form-input"
                  {...register("category_of_expertise")}
                >
                  {categoryExpertiseList?.map(({ name, slug }) => (
                    <option value={slug} key={slug}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-container">
              <input
                type="text"
                className="form-input"
                placeholder="focus of expertise"
                {...register("focus_of_expertise")}
              />
            </div>

            <div className="form-container">
              <input
                type="text"
                className="form-input"
                placeholder="years of experience"
                {...register("years_of_expertise")}
              />
            </div>
          </div>

          {/* resume */}
          <div className="input-container">
            <p className="form-text">Resume</p>
            {state?.resumefileObject && (
              <a
                href={`${state?.resumefileObject.cdnUrl}`}
                title="Download"
                target="_blank"
                download
                rel="noreferrer"
                className="fa fa-file-pdf-o"
              >
                {" "}
              </a>
            )}
            <div className="form-container">
              <div className="drop-zone-container">
                <RiDragDropLine className="drop-zone-icon" />
                <p className="upload-btn-text">select or drag resume here</p>

                <input
                  type="file"
                  className="drop-input"
                  accept=".pdf"
                  name="resumeFile"
                  onChange={onChangeFile}
                />
              </div>
            </div>
          </div>

          {/* social links */}
          <div className="form-grid">
            <div className="input-container">
              <p className="form-text">Social links</p>
              <div className="form-container ">
                <div className="social-flex">
                  <SocialIcon
                    target="_blank"
                    rel="noopener noreferrer"
                    url="https://facebook.com"
                    style={{
                      height: "2rem",
                      width: "2rem",
                      marginRight: "1rem",
                    }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    name="facebookURL"
                    placeholder="paste facebook url"
                    {...register("facebookURL")}
                  />
                </div>
              </div>
            </div>

            <div className="input-container">
              <p className="form-text none"> name</p>
              <div className="form-container">
                <div className="social-flex">
                  <SocialIcon
                    target="_blank"
                    rel="noopener noreferrer"
                    url="https://instagram.com"
                    style={{
                      height: "2rem",
                      width: "2rem",
                      marginRight: "1rem",
                    }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="paste instagram url"
                    name="instagramURL"
                    {...register("instagramURL")}
                  />
                </div>
              </div>
            </div>
            <div className="form-container">
              <div className="social-flex">
                <SocialIcon
                  target="_blank"
                  rel="noopener noreferrer"
                  url="https://twitter.com"
                  style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="paste twitter url"
                  name="twitterURL"
                  {...register("twitterURL")}
                />
              </div>
            </div>
            <div className="form-container">
              <div className="social-flex">
                <SocialIcon
                  target="_blank"
                  rel="noopener noreferrer"
                  url="https://linkedin.com"
                  style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
                />
                <input
                  type="text"
                  className="form-input"
                  name="linkedinURL"
                  {...register("linkedinURL")}
                  placeholder="paste linkedin url"
                />
              </div>
            </div>

            <div className="form-container">
              <div className="social-flex">
                <SocialIcon
                  target="_blank"
                  rel="noopener noreferrer"
                  url="https://youtube.com"
                  style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="paste link from youtube"
                  name="youtubeURL"
                  {...register("youtubeURL")}
                />
              </div>
            </div>

            {/* sound cloud */}
            <div className="form-container">
              <div className="social-flex">
                <SocialIcon
                  target="_blank"
                  rel="noopener noreferrer"
                  url="https://soundcloud.com"
                  style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="paste link from soundcloud"
                  name="soundcloudURL"
                  {...register("soundcloudURL")}
                />
              </div>
            </div>

            {/* spotify */}
            <div className="form-container">
              <div className="social-flex">
                <SocialIcon
                  target="_blank"
                  rel="noopener noreferrer"
                  url="https://www.spotify.com"
                  style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="paste link from spotify"
                  name="spotifyURL"
                  {...register("spotifyURL")}
                />
              </div>
            </div>
            {/* audiomac */}
            <div className="form-container">
              <div className="social-flex">
                <a
                  href="https://audiomack.com"
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
                <input
                  type="text"
                  className="form-input"
                  placeholder="paste link from audiomac"
                  name="audiomackURL"
                  {...register("audiomackURL")}
                />
              </div>
            </div>
            {/* music youtube */}
            <div className="form-container">
              <div className="social-flex">
                <SocialIcon
                  target="_blank"
                  rel="noopener noreferrer"
                  url="https://music.youtube.com/"
                  style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="paste link from youtube music"
                  name="musicYoutubeURL"
                  {...register("musicYoutubeURL")}
                />
              </div>
            </div>

            {/* looksrare */}
            <div className="form-container">
              <div className="social-flex">
                <a
                  href="https://looksrare.org"
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

                <input
                  type="text"
                  className="form-input"
                  placeholder="paste link from looksrare"
                  name="looksrareURL"
                  {...register("looksrareURL")}
                />
              </div>
            </div>

            {/* opensea */}
            <div className="form-container">
              <div className="social-flex">
                <a
                  href="https://opensea.io"
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
                <input
                  type="text"
                  className="form-input"
                  placeholder="paste link from opensea"
                  name="openseaURL"
                  {...register("openseaURL")}
                />
              </div>
            </div>

            <div className="form-container">
              <div className="social-flex">
                <SocialIcon
                  target="_blank"
                  rel="noopener noreferrer"
                  url="https://whatido.app"
                  style={{ height: "2rem", width: "2rem", marginRight: "1rem" }}
                />

                <input
                  type="text"
                  className="form-input"
                  placeholder="jhondoe.com"
                  name="websiteURL"
                  {...register("websiteURL")}
                />
              </div>
            </div>
          </div>

          {/* error message */}
          <div className="form-grid">
            {errors?.facebookURL?.message && (
              <p className="error-message text-container">
                {errors?.facebookURL?.message}
              </p>
            )}
            {errors?.instagramURL?.message && (
              <p className="error-message text-container">
                {errors?.instagramURL?.message}
              </p>
            )}
            {errors?.twitterURL?.message && (
              <p className="error-message text-container">
                {errors?.twitterURL?.message}
              </p>
            )}
            {errors?.linkedinURL?.message && (
              <p className="error-message text-container">
                {errors?.linkedinURL?.message}
              </p>
            )}
            {errors?.youtubeURL?.message && (
              <p className="error-message text-container">
                {errors?.youtubeURL?.message}
              </p>
            )}

            {errors?.soundcloudURL?.message && (
              <p className="error-message text-container">
                {errors?.soundcloudURL?.message}
              </p>
            )}
            {errors?.spotifyURL?.message && (
              <p className="error-message text-container">
                {errors?.spotifyURL?.message}
              </p>
            )}
            {errors?.audiomackURL?.message && (
              <p className="error-message text-container">
                {errors?.audiomackURL?.message}
              </p>
            )}
            {errors?.musicYoutubeURL?.message && (
              <p className="error-message text-container">
                {errors?.musicYoutubeURL?.message}
              </p>
            )}
            {errors?.looksrareURL?.message && (
              <p className="error-message text-container">
                {errors?.looksrareURL?.message}
              </p>
            )}
            {errors?.openseaURL?.message && (
              <p className="error-message text-container">
                {errors?.openseaURL?.message}
              </p>
            )}
            {errors?.websiteURL?.message && (
              <p className="error-message text-container">
                {errors?.websiteURL?.message}
              </p>
            )}
          </div>

          {/*  */}

          {/* submit button */}
          <div className="actions-btn-container">
            <SaveBtn
              onClick={saveChanges}
              className="action-btn save"
              grayed={state.loading || state.submit_disabled || hasError}
              disabled={state.loading || state.submit_disabled || hasError}
            >
              save changes
            </SaveBtn>
            <DeleteBtn className="action-btn delete" onClick={deleteAccount}>
              delete account
            </DeleteBtn>
          </div>
        </div>
      </div>
    </EditableContainer>
  );
}

export default EditableProfile;
