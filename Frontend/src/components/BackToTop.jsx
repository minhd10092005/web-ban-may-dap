import React, { useState, useEffect } from 'react';
import { FaAngleDoubleUp } from 'react-icons/fa';
import './BackToTop.css';

const BackToTop = () => {
    // Trạng thái (state) để theo dõi xem nút có nên hiển thị hay không
    const [isVisible, setIsVisible] = useState(false);

    // Hàm kiểm tra vị trí cuộn chuột
    const toggleVisibility = () => {
        // Nếu cuộn xuống quá 300px thì hiện nút, ngược lại thì giấu đi
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Hàm thực hiện hành động cuộn lên đầu trang mượt mà
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Hiệu ứng cuộn lướt đi chứ không bị giật cục
        });
    };

    // Lắng nghe sự kiện cuộn chuột của người dùng
    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        // Dọn dẹp sự kiện khi component bị unmount để tránh nặng máy
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <>
            {/* Chỉ render nút khi isVisible là true */}
            {isVisible && (
                <div onClick={scrollToTop} className="back-to-top-btn">
                    <FaAngleDoubleUp />
                </div>
            )}
        </>
    );
};

export default BackToTop;