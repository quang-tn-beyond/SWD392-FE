import React from "react";
import ComicCollection from "../../wrapper/comics/collection";
import { comics } from "../../data";


const ComicManage = () => {
    return (
        <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-7">
                <ComicCollection
                    comics={comics}
                    layout="custom-layout-class"
                    title="Comics Management"
                />
            </div>
        </div>
    );
}

export default ComicManage;