import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { forumHandlers, mutateForumFn } from '../../../redux/actions/forumsAc/forumsAc'
import { toggleNfswModal } from '../../../redux/actions/modals/ModalsAc'
import { apiStatus, resHandler } from '../../../utils/api'
import auth from '../../../utils/auth'
import { scrollDetails } from '../../../utils/dom'
import { http } from '../../../utils/http'
import WithLinkComp from '../../../utils/WithLinkComp'

const { getKeyProfileLoc } = auth


const NfswAlertModal = ({ nfsw_modal, ...rest }) => {

    // Hooks and vars
    const { data: session } = useSession()
    const dispatch = useDispatch()
    const forum_link = nfsw_modal?.forum_link ?? "#"
    const router = useRouter()
    const pathname = router.pathname
    const navigate = router.push
    const { status } = useSelector(state => state?.modalsReducer?.nfsw_modal)
    const isLoading = status === apiStatus?.LOADING

    // Functions

    // Close modal
    const closeModal = (isCancelBtnClick = false) => {

        if (isCancelBtnClick) {
            if (rest?.isForumDetailPage) {
                dispatch(toggleNfswModal({
                    isVisible: false
                }))
                if (pathname !== "/forums") navigate("/forums")
                return
            }
            return dispatch(toggleNfswModal({
                isVisible: false
            }))
        }

        confirmNfsw()

    }

    // Confirm nsfw content
    const confirmNfsw = async () => {

        if (!session) return dispatch(toggleNfswModal({
            isVisible: false,
            status: apiStatus.IDLE
        }))

        let token = getKeyProfileLoc("token") ?? "", data;

        dispatch(toggleNfswModal({
            isVisible: false,
            status: apiStatus.LOADING,
            message: ""
        }))

        let obj = {
            data,
            token,
            method: "get",
            url: `confirmnsw/${nfsw_modal?.forum_id}`
        }

        try {
            const res = await http(obj)
            resHandler(res)

            if (rest?.isForumDetailPage) {
                dispatch(forumHandlers.handleForum({
                    mutate_data_only: true,
                    is_nsw: 0
                }))
            } else if (nfsw_modal?.is_calledfrom_searchPage) {
                // dispatch(mutateSearchData({
                //     forum_index: nfsw_modal?.forum_index,
                //     is_nsw: 0
                // }))
            } else {
                dispatch(mutateForumFn({
                    forum_index: nfsw_modal?.forum_index,
                    data_to_mutate: { is_nsw: 0 }
                }))
            }

            dispatch(toggleNfswModal({
                isVisible: false,
                status: apiStatus.FULFILLED
            }))

            if (!rest?.isForumDetailPage) {
                // Works when modal is opened on search page
                navigate({
                    pathname: forum_link,
                    query: { ...(nfsw_modal?.is_calledfrom_searchPage ? { cameFromSearch: true } : {}) }
                })
                if (nfsw_modal?.rememberScrollPos) {
                    scrollDetails.setScrollDetails({ pageName: nfsw_modal?.pageName, scrollPosition: nfsw_modal?.scrollPosition })
                }
            }

        } catch (err) {
            console.log(err?.message ?? "something went wrong")
            dispatch(toggleNfswModal({
                status: apiStatus.REJECTED,
                message: err.message
            }))
        }
    }

    const getCloseBtn = () => {
        const closeBtnHtml = (
            <button
                className="reqModalFootBtns text-white"
                variant="primary"
                onClick={() => closeModal(false)}
            >
                {isLoading ? <div className="spinner-border wColor spinnerSizeFeed" role="status">
                    <span className="sr-only">Loading...</span>
                </div> : "Continue"}

            </button>
        )

        return !session ? (
            <WithLinkComp
                nfsw={true}
                rememberScrollPos={true}
                link={forum_link}
                pageName={nfsw_modal?.pageName}
                scrollPosition={nfsw_modal?.scrollPosition}
            >{closeBtnHtml}</WithLinkComp>
        ) : closeBtnHtml
    }


    return (
        <Modal
            show={true}
            onHide={() => closeModal(true)}
            size="lg"
            className='nsfw_modal'>
            <Modal.Header>
                <h6>NSFW Forum</h6>
                <span onClick={closeModal} type="button">
                    <i className="fa fa-times" aria-hidden="true"></i>
                </span>
            </Modal.Header>
            <Modal.Body className="privacyBody">
                <div className="ImgCont">
                    <div className="head">
                        <img src="/images/nfswBanner.svg" alt="nfswBanner" />
                    </div>
                    <div className="body">
                        NSFW Content
                    </div>
                    <div className='desc'>
                        This Forum Contain Adult Content marked Not Safe For Work.
                        Do you Wish to Proceed?
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="pt-0 reqModalFooter">
                <button
                    className="reqModalFootBtns cancel"
                    variant="primary"
                    onClick={() => closeModal(true)}
                >
                    Cancel
                </button>
                {getCloseBtn()}
            </Modal.Footer>
        </Modal>
    )
}

export default NfswAlertModal