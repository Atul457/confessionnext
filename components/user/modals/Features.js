import React from 'react';
import { Modal } from 'react-bootstrap';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import Link from "next/link"

const Features = (props) => {

    return (
        <>
            <Modal show={props.visible} onHide={props.closeModal} centered size="md">
                <Modal.Header className='justify-content-between'>
                    <h6>New Features</h6>
                    <span onClick={props.closeModal} type="button">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </span>
                </Modal.Header>
                <Modal.Body className="privacyBody text-left featuresModal">
                    <Carousel
                        autoPlay={true}
                        infiniteLoop={true}
                        interval={10000}
                        showThumbs={false}
                        showStatus={false}
                        showArrows={false}>
                        <div className="carousel_item_feature">
                            <div className="imgWrapper">
                                <img src="/images/carousel3.svg" className="carouselImage" alt="carouselImage3" />
                            </div>
                            <div>Sign up or Login to get notified when people respond to your post</div>
                        </div>
                        <div className="carousel_item_feature">
                            <div className="imgWrapper">
                                <img src="/images/carousel2.svg" className="carouselImage" alt="carouselImage2" />
                            </div>
                            <div>Sign up or Login to connect with friends and chat anonymously!</div>
                        </div>
                        <div className="carousel_item_feature">
                            <div className="imgWrapper">
                                <img src="/images/carousel1.svg" className="carouselImage" alt="carouselImage1" />
                            </div>
                            <div>Sign up or Login to get notified when exciting community features and updates are available</div>
                        </div>
                    </Carousel>

                    <Modal.Footer className="pt-0 justify-content-center">
                        <button className="modalFootBtns btn" variant="primary" onClick={props.closeModal}>
                            <Link href="/login">Sign in</Link>
                        </button>
                        <button className="modalFootBtns btn" variant="primary" onClick={props.closeModal}>
                            <Link href="/register">Sign up</Link>
                        </button>
                    </Modal.Footer>
                </Modal.Body>

            </Modal>
        </>
    )
}

export default Features