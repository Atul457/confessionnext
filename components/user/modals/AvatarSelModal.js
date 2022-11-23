import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  resetAvatarModal,
  toggleAvatarModal,
} from "../../../redux/actions/avatarSelModalAC";
import auth from "../../../utils/auth";
import { isWindowPresent } from "../../../utils/checkDom";
import { avatars } from "../../../utils/provider";

const { getKeyProfileLoc } = auth;

const AvatarSelModal = ({ uploadImage }) => {
  // Hooks
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const avatarModalReducer = useSelector((state) => state.avatarModalReducer);
  const [showImages, setShowImages] = useState(false);
  const isNotTypeSelected = avatarModalReducer.type === 1;
  const profileImage = (session && isWindowPresent() ? JSON.parse(localStorage.getItem("userDetails") ?? "{ }") : false)?.image

  // Functions

  // Close modal
  const closeModal = () => {
    dispatch(resetAvatarModal());
  };

  // Select avatar
  const selectAvatar = (index) => {
    dispatch(
      toggleAvatarModal({
        selected: index,
      })
    );
  };

  // Sets avatar
  const setAvatarToProfile = () => {
    uploadImage(avatars[avatarModalReducer.selected].link);
    closeModal();
  };

  const getAvatar = () => {
    if (avatarModalReducer.selected === null)
      return profileImage && profileImage !== "" ? profileImage : avatarModalReducer.defaultImg;
    let selected = avatarModalReducer.selected;
    return avatars[selected].src;
  };

  const uploadPicFromGal = () => {
    closeModal();
    let profilePicRef = document.querySelector("#profilePicP");
    profilePicRef.click();
  };

  const revealAvatars = () => {
    dispatch(
      toggleAvatarModal({
        type: 2,
      })
    );
  };

  useEffect(() => {
    let imgurl;
    if (session) {
      imgurl = getKeyProfileLoc("image");
      avatars.forEach((curr, index) => {
        let src = curr.src;
        src = src.split("/");
        imgurl = `${imgurl}`.split("/");
        src = src[src.length - 1];
        imgurl = imgurl[imgurl.length - 1];
        if (src === imgurl) {
          dispatch(
            toggleAvatarModal({
              selected: index,
            })
          );
          return false;
        }
      });
    }
  }, []);

  return (
    <Modal
      show={avatarModalReducer.visible}
      centered
      className="avatarModal"
      size={`${isNotTypeSelected ? "md" : "lg"}`}
      onHide={closeModal}
    >
      <Modal.Header className="justify-content-between">
        <h6>{isNotTypeSelected ? "Select Profile Image" : "Select Avatar"}</h6>
        <span type="button" onClick={closeModal}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </span>
      </Modal.Header>

      {isNotTypeSelected ? (
        <Modal.Body className="privacyBody text-center profilePicOptions">
          <button
            className="modalFootBtns btn"
            variant="primary"
            onClick={uploadPicFromGal}
          >
            Upload from gallery
          </button>
          <button
            className="modalFootBtns btn"
            variant="primary"
            onClick={revealAvatars}
          >
            Select Avatar
          </button>
        </Modal.Body>
      ) : (
        <Modal.Body
          scrollable={"true"}
          className="privacyBody text-center avatar"
        >
          <div className="selectedAvatar">
            <img src={getAvatar()} alt="" />
          </div>

          <div className="avtarsCollection row mx-0">
            {avatars.map((avatar, index) => {
              return (
                <div className={`col-md-3 col-3 cols`} key={avatar.link}>
                  <span className="avatarIconCont">
                    <img
                      onLoad={() => {
                        if (index === avatars.length - 1) {
                          setShowImages(true);
                        }
                      }}
                      src={avatar.src}
                      className={`avatar ${avatarModalReducer.selected === index
                          ? "currSelectedAvatar"
                          : ""
                        } ${showImages ? "" : "hiddenAvatar"}`}
                      onClick={() => selectAvatar(index)}
                    />

                    {avatarModalReducer.selected === index && (
                      <img
                        src="/images/tickIcon.svg"
                        alt="selected"
                        className={`tickIcon ${!showImages ? "invisible" : ""}`}
                      />
                    )}
                  </span>

                  <div
                    className={`avatarPlaceholderImages glow ${!showImages ? "" : "hiddenAvatar"
                      }`}
                  ></div>
                </div>
              );
            })}
          </div>
        </Modal.Body>
      )}

      {!isNotTypeSelected && (
        <Modal.Footer className="pt-0 justify-content-center">
          <button
            className="modalFootBtns btn"
            variant="primary"
            onClick={setAvatarToProfile}
          >
            Done
          </button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default AvatarSelModal;
