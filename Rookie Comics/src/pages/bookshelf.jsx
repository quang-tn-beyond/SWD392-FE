import React, { useEffect, useState, useContext } from "react";
import ComicCollection from "../wrapper/comics/collection";
import { AuthContext } from "../components/AuthContext";
import { getAllComics } from "../utils/ComicService";
import { getUserIdByEmail } from "../utils/UserService";

const Bookshelf = () => {
    const [followedComics, setFollowedComics] = useState([]); // Trữ các comic đã theo dõi
    const [userComics, setUserComics] = useState([]); // Trữ truyện của người dùng
    const { email } = useContext(AuthContext); // Lấy email từ AuthContext
    const [userId, setUserId] = useState(null); // Trữ userId

    // Lấy danh sách truyện đã theo dõi từ localStorage
    useEffect(() => {
        const storedFollowed = JSON.parse(localStorage.getItem("followedComics")) || [];
        setFollowedComics(storedFollowed);
        console.log("Followed Comics from localStorage:", storedFollowed);
    }, []);

    // Lấy userId từ email khi email thay đổi
    useEffect(() => {
        if (userId) {
            getAllComics()
                .then((response) => {
                    if (Array.isArray(response.data)) {
                        const formattedComics = response.data.map((comic) => ({
                            id: comic.comicId,
                            title: comic.comicName,
                            imageUrl: comic.coverUrl,
                            views: comic.view,
                            episodes: String(comic.quantityChap),
                            ownerId: comic.userId, // userId của chủ sở hữu truyện
                        }));
    
                        const userOwnedComics = formattedComics.filter((comic) => comic.ownerId === userId);
                        console.log("User Comics after filtering:", userOwnedComics); // Kiểm tra dữ liệu
                        setUserComics(userOwnedComics);
                    } else {
                        console.error("Dữ liệu API không đúng:", response.data);
                        setUserComics([]);
                    }
                })
                .catch((error) => {
                    console.error("Lỗi khi lấy danh sách truyện:", error);
                    setUserComics([]);
                });
        }
    }, [userId]);
    

    // Lấy danh sách tất cả truyện và lọc theo userId
    useEffect(() => {
        if (userId) {
            getAllComics()
                .then((response) => {
                    if (Array.isArray(response.data)) {
                        const formattedComics = response.data.map((comic) => ({
                            id: comic.comicId,
                            title: comic.comicName,
                            imageUrl: comic.coverUrl,
                            views: comic.view,
                            episodes: String(comic.quantityChap),
                            ownerId: comic.userId, // Thêm userId của truyện
                        }));

                        // Lọc truyện thuộc về user hiện tại
                        const userOwnedComics = formattedComics.filter((comic) => comic.ownerId === userId);
                        setUserComics(userOwnedComics);
                        console.log("User Comics:", userOwnedComics);
                    } else {
                        console.error("Dữ liệu API không đúng:", response.data);
                        setUserComics([]);
                    }
                })
                .catch((error) => {
                    console.error("Lỗi khi lấy danh sách truyện:", error);
                    setUserComics([]);
                });
        }
    }, [userId]);

    // Lọc danh sách truyện đã theo dõi từ "followedComics"
    const followedComicList = userComics.filter((comic) => followedComics.includes(comic.id));
    console.log("Followed Comic List:", followedComicList);

    return (
        <section className="product spad">
            <div className="container">
                <div className="section-title">
                    <h2>Your Bookshelf</h2>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <ComicCollection
                            comics={followedComicList} // Hiển thị danh sách truyện đã theo dõi
                            layout="custom-layout-class"
                            title="Followed Comics"
                        />
                        <ComicCollection
                            comics={userComics} // Hiển thị truyện của người dùng
                            layout="custom-layout-class"
                            title="Your Comics"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Bookshelf;
