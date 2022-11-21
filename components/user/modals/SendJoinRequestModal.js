import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../../commonApi'
import * as yup from 'yup';
import { resHandler } from '../../helpers/helpers'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { apiStatus } from '../../helpers/status'
import { forumHandlers, mutateForumFn, reqToJoinModalAcFn } from '../../redux/actions/forumsAc/forumsAc'
import { requestedStatus } from '../forums/detailPage/comments/ForumCommProvider'
import { ShowResComponent } from '../HelperComponents'
import { getKeyProfileLoc } from "../../helpers/profileHelper"
import { useNavigate } from 'react-router-dom';
import toastMethods from '../../helpers/components/Toaster';

const types = {
  "PASSWORD": 1,
  "TEXT": 2
}

const SendRequestModal = () => {

  // Hooks and vars
  const { modals, detailPage } = useSelector(state => state.forumsReducer)
  const [pass, setPass] = useState({
    type: types.TEXT
  })
  const navigate = useNavigate()
  const createForumSchema = yup.object().shape({
    password: yup.string().required()
  });
  const { handleForum } = forumHandlers
  const { register, formState: { errors }, handleSubmit } = useForm({
    mode: "onChange",
    resolver: yupResolver(createForumSchema)
  })
  const detailPageData = detailPage.data
  const { requestToJoinModal } = modals
  const isError = requestToJoinModal.status === apiStatus.REJECTED
  const message = requestToJoinModal?.message
  const { forum_index, is_calledfrom_detailPage = false } = requestToJoinModal.data
  const isLoading = requestToJoinModal.status === apiStatus.LOADING
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(reqToJoinModalAcFn({
      visible: false,
      status: apiStatus.IDLE,
      data: {
        message: "",
        requested: false,
      }
    }))
  }

  const togglePassType = () => {
    setPass({
      ...pass,
      type: pass.type === types.PASSWORD ? types.TEXT : types.PASSWORD
    })
  }


  const sendRequest = () => {

    // is_calledfrom_detailPage : the modal is opened using a forum
    // !is_calledfrom_detailPage : the modal is opened using detail page

    if (is_calledfrom_detailPage) dispatch(handleForum({
      data: { ...detailPageData, is_requested: requestedStatus.approved }
    }))
    else dispatch(mutateForumFn({
      forum_index,
      data_to_mutate: { is_requested: requestedStatus.approved }
    }))
    toastMethods.toaster2Info("Forum joined successfully")
    closeModal()
  }

  const onSubmit = async (data) => {
    let token = getKeyProfileLoc("token", true) ?? "";

    dispatch(reqToJoinModalAcFn({
      status: apiStatus.LOADING,
      message: ""
    }))

    let obj = {
      data,
      token,
      method: "post",
      url: `joinforum/${requestToJoinModal?.data?.forum_id}`
    }

    try {
      const res = await fetchData(obj)
      resHandler(res)
      sendRequest()
    } catch (err) {
      dispatch(reqToJoinModalAcFn({
        status: apiStatus.REJECTED,
        message: err.message
      }))
    }
  }


  return (
    <>
      <Modal
        show={requestToJoinModal.visible}
        onHide={closeModal}
        size="md"
        className='send_joinreq_modal'>
        <Modal.Header>
          <h6>Join Forum</h6>
          <span onClick={closeModal} type="button">
            <i className="fa fa-times" aria-hidden="true"></i>
          </span>
        </Modal.Header>
        <Modal.Body className="privacyBody friendReqModalBody">
          <form className="reqModalImgCont my-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="body">
              Please enter the forum password to join
              <div className='w-100 eyeNinputCont mt-3'>
                <input
                  className="form-control"
                  placeholder={`Enter Password`}
                  type={pass.type === types.PASSWORD ? "password" : "text"}
                  {...register("password")} />
                <i
                  className={`eyeIcon ${pass.type === types.TEXT ? ' fa fa-eye' : ' fa fa-eye-slash'}`}
                  aria-hidden="true"
                  type="button"
                  onClick={togglePassType}
                ></i>
              </div>
              {errors?.password?.message && errors?.password?.message !== "" ?
                <ShowResComponent isError={true} message={errors?.password?.message} classList="w-100 text-left pb-2" />
                : null}
            </div>

            <ShowResComponent isError={isError} message={message} classList="w-100 text-center pb-2" />
            <Button
              className="reqModalFootBtns mt-3"
              variant="primary"
              type="submit"
            >
              {isLoading ?
                <div className="spinner-border wColor spinnerSizeFeed" role="status">
                  <span className="sr-only">Loading...</span>
                </div> :
                "Submit"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default SendRequestModal