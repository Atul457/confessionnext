import React from 'react'


const ForumMiddleCompWrapper = ({ children }) => {

    return (
        <div className="rightColumn rightColumnFeed">
            <div className="rightMainFormCont rightMainFormContFeed p-0">
                <div className="preventHeader">preventHead</div>
                <div className="w-100 py-md-4 p-0 p-md-3 preventFooter">
                    <div className="row forPosSticky">
                        {/* Middlecontainer */}
                        <section className="col-lg-12 col-12 mt-0 mt-lg-0 px-0 px-md-3">
                            <div className="postsMainCont">
                                <div className="row mx-0">
                                    {children}
                                </div>
                            </div>
                        </section>
                        {/* Middlecontainer */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForumMiddleCompWrapper