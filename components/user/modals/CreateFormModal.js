import React, { useEffect, useState } from 'react'
import { button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import forum_types_arr from '../forums/forumTypes.json';
import CreatableSelect from 'react-select/creatable';
import classnames from 'classnames'
import { customStyles, forum_types } from '../forums/detailPage/comments/ForumCommProvider'
import TextareaAutosize from 'react-textarea-autosize'
import { getTagsService } from '../forums/services/forumServices'
import { http } from '../../../utils/http'
import { apiStatus, resHandler } from '../../../utils/api';
import { createForumModalFnAc, forumHandlers } from '../../../redux/actions/forumsAc/forumsAc';
import { ShowResComponent } from '../../../utils/ShowResComponent';
import auth from '../../../utils/auth';

const types = {
  "PASSWORD": 1,
  "TEXT": 2
}

const { checkAuth, getKeyProfileLoc } = auth


const CreateFormModal = () => {

  // Hooks and vars
  const [pass, setPass] = useState({
    type: types.TEXT,
    visible: false
  })
  const { modals, categories, tags } = useSelector(state => state.forumsReducer)
  const { createForumModal } = modals
  const [placeholder, setPlaceholder] = useState("Enter tags")
  const [nfsw, setNfsw] = useState(false);
  const createForumSchema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    category_id: yup.string().required(),
    type: yup.string().required(),
    password: yup.string().when("type", (type, createForumSchema) => {
      if (createForumModal?.isBeingEdited) return createForumSchema
      return type === "2" ? createForumSchema.min(6).required() : createForumSchema
    })
  });

  const [tagsArr, setTagsArr] = useState([])
  const tagError = false;
  let noOfChar = 250;
  let noOfCharsTitle = 50;

  const { handleForums } = forumHandlers
  const { register, formState: { errors }, handleSubmit, reset, clearErrors, getValues } = useForm({
    mode: "onChange",
    resolver: yupResolver(createForumSchema)
  })

  let error = Object.values(errors)
  error = error.length ? error[0] : ""
  const isError = createForumModal.status === apiStatus.REJECTED
  const message = createForumModal?.message
  const isLoading = createForumModal.status === apiStatus.LOADING
  const dispatch = useDispatch();

  // Functions

  // Close modal
  const closeModal = () => {
    dispatch(createForumModalFnAc({
      visible: false,
      status: apiStatus.IDLE,
      message: "",
      data: {
        title: "",
        description: "",
        category_id: undefined,
        post_as_anonymous: undefined,
        image: undefined,
        type: undefined,
        tags: []
      },
      forum_details: {}
    }))
  }

  useEffect(() => {
    if (createForumModal?.isBeingEdited) {
      const forum_details = createForumModal?.forum_details ?? {}
      reset({
        ...getValues(),
        ...forum_details
      })

      setNfsw(forum_details?.is_nsw)
      const isPrivate = forum_details?.type === forum_types.private
      if (isPrivate) {
        setPass({
          ...pass,
          visible: true
        })
      }

      if (forum_details?.tags?.length) {
        const optionsArr = forum_details?.tags?.map(curr => {
          return { label: curr?.tag, value: curr?.tag }
        })
        // setDefaultTags([...optionsArr])
        const tgg = optionsArr.map(curr => curr.value)
        setTagsArr(tgg)
      }
    }
  }, [])

  // Get Forums
  const getForums = async () => {
    let obj = {
      token: getKeyProfileLoc("token") ?? "",
      method: "get",
      url: `getmyforums/1`
    }
    try {
      let res = await http(obj)
      res = resHandler(res)
      dispatch(handleForums({ data: res?.forums ?? [], status: apiStatus.FULFILLED }))
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmit = async (data) => {

    const isUpdate = createForumModal?.isBeingEdited
    if (!tagsArr?.length) return dispatch(createForumModalFnAc({
      status: apiStatus.REJECTED,
      message: "select at least one tag"
    }))

    data = {
      ...data,
      is_nsw: nfsw ? 1 : 0,
      "image": "[]",
      post_as_anonymous: getKeyProfileLoc("post_as_anonymous"),
      tags: JSON.stringify(tagsArr),
      type: +data?.type,
      ...(isUpdate && {
        forum_id: createForumModal?.forum_details?.forum_id
      })
    }

    let token = getKeyProfileLoc("token") ?? "";
    dispatch(createForumModalFnAc({
      status: apiStatus.LOADING,
      message: ""
    }))

    let obj = {
      data,
      token,
      method: "post",
      url: `createforum`
    }

    try {
      const res = await http(obj)
      resHandler(res)
      dispatch(createForumModalFnAc({
        status: apiStatus.FULFILLED,
        message: "Forum created sucessfully"
      }))
      getForums()
      getTagsService({ dispatch })
      closeModal()
    } catch (err) {
      dispatch(createForumModalFnAc({
        status: apiStatus.REJECTED,
        message: err.message
      }))
    }
  }

  const TagsHandle = (action) => {
    dispatch(createForumModalFnAc({
      status: apiStatus.IDLE,
      message: ""
    }))
    const tgg = action.map(curr => curr.value)
    setTagsArr(tgg)
  }

  const togglePassType = () => {
    setPass({
      ...pass,
      type: pass.type === types.PASSWORD ? types.TEXT : types.PASSWORD
    })
  }

  return (
    <>
      <Modal
        show={createForumModal.visible}
        onHide={closeModal}
        size="lg"
        className='send_joinreq_modal'>
        <Modal.Header>
          <h6>Add Forum</h6>
          <span onClick={closeModal} type="button">
            <i className="fa fa-times" aria-hidden="true"></i>
          </span>
        </Modal.Header>
        <Modal.Body className="create_forum_modal_body">
          <form
            className="col-12 p-0 m-0 bg-white createPostOuterCont my-4"
            onSubmit={handleSubmit(onSubmit)}
          >

            <div className='w-100 mb-3'>
              <input
                className="form-control"
                placeholder={`Title`}
                maxLength={noOfCharsTitle}
                {...register("title")} />
              <span className="textAreaLimit">[ Max-Characters:{noOfCharsTitle} ]</span>
            </div>

            <div className='w-100 mb-3'>
              <TextareaAutosize
                className="form-control"
                placeholder={`Description`}
                {...register("description")}
                minRows="5"
                maxLength={noOfChar}>
              </TextareaAutosize>
              <span className="textAreaLimit">[ Max-Characters:{noOfChar} ]</span>
            </div>

            <select
              className="form-control mb-3"
              {...register("type", {
                onChange: (e) => {
                  if (e.target.value === "2") return setPass({
                    ...pass, visible: true
                  })
                  clearErrors("password")
                  setPass({
                    ...pass, visible: false
                  })
                }
              })}>
              <option value={""}>Forum Type</option>

              {/* ADDS TYPES TO THE SELECT BOX AS OPTIONS */}
              {forum_types_arr ? forum_types_arr?.map((element) => {
                return <option
                  key={`createPost ${element.id}`}
                  value={element.id}>
                  {(element.type_name)?.charAt(0)?.toUpperCase() + ((element.type_name)?.slice(1)?.toLowerCase())}
                </option>
              }) : <option value="">Forums types not found</option>}
              {/* END OF ADDS TYPES TO THE SELECT BOX AS OPTIONS */}

            </select>


            {pass.visible ? <div className='w-100 mb-3 eyeNinputCont'>
              <input
                className="form-control"
                placeholder={`Enter Password`}
                type={pass.type === types.PASSWORD ? "password" : "text"}
                maxLength={20}
                {...register("password")} />
              <i
                className={`eyeIcon ${pass.type === types.TEXT ? ' fa fa-eye' : ' fa fa-eye-slash'}`}
                aria-hidden="true"
                type="button"
                onClick={togglePassType}
              >
              </i>
            </div> : null}

            <select
              className="form-control mb-3"
              {...register("category_id")}>
              <option value={""}>Select Category</option>

              {/* ADDS CATEGORIES TO THE SELECT BOX AS OPTIONS */}
              {categories?.data ? categories?.data?.map((element) => {
                if (element.is_forum === 0) return
                return <option key={`createPost ${element.id}`} value={element.id}>{(element.category_name).charAt(0) + (element.category_name).slice(1).toLowerCase()}</option>
              }) : <option value="">Categories not found</option>}
              {/* END OF ADDS CATEGORIES TO THE SELECT BOX AS OPTIONS */}

            </select>

            <CreatableSelect
              isMulti
              isClearable={true}
              {...tagsArr.length && { value: tagsArr.map(curr => ({ value: curr, label: curr })) }}
              onChange={TagsHandle}
              options={tags?.data ?? []}
              placeholder={placeholder}
              onFocus={() => setPlaceholder("")}
              onBlur={() => setPlaceholder("Enter tags")}
              components={{
                NoOptionsMessage: () => <div className='text-center'>No tags to show</div>
              }}
              onMenuScrollToTop={true}
              className={classnames("basic-multi-select mb-3", { "is-invalid": tagError })}
              classNamePrefix="select"
              styles={customStyles}
            />
            {/* : null} */}

            <div className='w-100 mb-3 nfsw_cont'>
              <div className="toggler_nfsw_cont">
                <label htmlFor="">NSFW</label>
                <input
                  type="checkbox"
                  className="switch12"
                  id="TweightRadio"
                  onChange={(e) => { setNfsw(e.target.checked) }}
                  defaultValue={nfsw ? 1 : 0}
                  checked={nfsw} />
              </div>
              <div className='descr'>
                Users will need to confirm that they are of over legal age to view the content in the forum
              </div>
            </div>


            {error?.message && error?.message !== "" ?
              <ShowResComponent isError={true} message={error?.message?.replace("category_id", "category")} classList="w-100 text-center pb-2 mt-3" />
              : null}

            {message && message !== "" ?
              <ShowResComponent isError={isError} message={message} classList="w-100 text-center pb-2 mt-3" />
              : null}

            <button
              className="reqModalFootBtns text-white"
              variant="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ?
                <div className="spinner-border text-white" role="status">
                  <span className="sr-only">Loading...</span>
                </div> : "Submit"}
            </button>

          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default CreateFormModal