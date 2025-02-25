import React, { useEffect, useState } from "react";
import ComicCollection from "../wrapper/comics/collection";
import { comics } from "../data";

const Bookshelf = () => {
    const [followedComics, setFollowedComics] = useState([]);

    useEffect(() => {
        const storedFollowed = JSON.parse(localStorage.getItem("followedComics")) || [];
        setFollowedComics(storedFollowed);
    }, []);

    const followedComicList = comics.filter((comic) => followedComics.includes(comic.id));

    return (
        <section className="product spad">
            <div className="container">
                <div className="col-lg-8">
                    <ComicCollection
                        comics={followedComicList} // Hiển thị danh sách truyện đã theo dõi
                        layout="custom-layout-class"
                        title="Followed Comics"
                    />
                </div>
            </div>
        </section>
    );
}

export default Bookshelf;