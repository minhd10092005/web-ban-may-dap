import React, { useState, useEffect } from "react";
import "./contact.css";

// 🔥 IMPORT SERVICE
import { getQuotes, createQuote } from "../../services/api";

function Contact() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
        rating: 0
    });

    const [feedbacks, setFeedbacks] = useState([]);
    const [filter, setFilter] = useState(0);
    const [showMessage, setShowMessage] = useState(false);

    const ratingLabels = {
        1: "😡 Tệ",
        2: "😐 Trung bình",
        3: "🙂 Bình thường",
        4: "😊 Khá",
        5: "😍 Tốt"
    };

    // 🔥 LOAD DATA FROM BACKEND
    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const data = await getQuotes();

            // 🔥 MAP DATA từ backend → UI
            const mapped = data.map(item => ({
                name: item.fullName,
                email: item.email,
                message: item.comments,
                rating: item.rating || 0,
                status: item.status || ""
            }));

            setFeedbacks(mapped);
        } catch (err) {
            console.error("Lỗi load API:", err);
        }
    };

    // ⭐ trung bình
    const averageRating =
        feedbacks.length === 0
            ? 0
            : (
                feedbacks.reduce((sum, f) => sum + f.rating, 0) /
                feedbacks.length
            ).toFixed(1);

    // ⭐ count
    const ratingCount = {
        1: feedbacks.filter(f => f.rating === 1).length,
        2: feedbacks.filter(f => f.rating === 2).length,
        3: feedbacks.filter(f => f.rating === 3).length,
        4: feedbacks.filter(f => f.rating === 4).length,
        5: feedbacks.filter(f => f.rating === 5).length,
    };

    // filter
    const filteredFeedbacks =
        filter === 0
            ? feedbacks
            : feedbacks.filter(f => f.rating === filter);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // 🔥 SUBMIT TO BACKEND
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.rating === 0) {
            alert("Vui lòng chọn số sao!");
            return;
        }

        try {
            await createQuote({
                fullName: form.name,
                email: form.email,
                comments: form.message,
                rating: form.rating,
                status: ratingLabels[form.rating]
            });

            // reload data từ DB
            fetchFeedbacks();

            // reset form
            setForm({
                name: "",
                email: "",
                message: "",
                rating: 0
            });

            // 🎉 message đẹp
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);

        } catch (err) {
            console.error("Lỗi gửi feedback:", err);
        }
    };

    return (
        <div className="contact-container">

            {/* 🎉 SUCCESS MESSAGE */}
            {showMessage && (
                <div className="success-message">
                    🎉 Cảm ơn bạn đã góp ý! Chúng tôi sẽ ghi nhận ý kiến của bạn ❤️
                </div>
            )}

            {/* MAP */}
            <div className="contact-map">
                <iframe
                    title="map"
                    src="https://www.google.com/maps?q=21.035756,105.816410&z=15&output=embed"
                ></iframe>
            </div>

            {/* ROW */}
            <div className="contact-row">

                {/* ADDRESS */}
                <div className="contact-address">
                    <h2>Company Address</h2>
                    <p>
                        Aptech Education <br />
                        285 Đội Cấn <br />
                        Hà Nội
                    </p>
                </div>

                {/* FORM */}
                <div className="contact-form-box">
                    <h2>Send Feedback</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            name="name"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="email"
                            placeholder="Your Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={form.message}
                            onChange={handleChange}
                        />

                        {/* STAR */}
                        <div className="stars">
                            {[1,2,3,4,5].map(star => (
                                <span
                                    key={star}
                                    className={form.rating >= star ? "active" : ""}
                                    onClick={() => setForm({ ...form, rating: star })}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <p className="rating-text">
                            {form.rating
                                ? ratingLabels[form.rating]
                                : "Chưa chọn đánh giá"}
                        </p>

                        <button type="submit">Send</button>
                    </form>
                </div>

            </div>

            {/* SUMMARY */}
            <div className="rating-summary">
                <h2>{averageRating} ★ ({feedbacks.length} reviews)</h2>
            </div>

            {/* SHOPEE UI */}
            <div className="shopee-rating">

                <div className="rating-overview">
                    <h1>{averageRating} ★</h1>
                    <p>{feedbacks.length} đánh giá</p>
                </div>

                <div className="rating-bars">
                    {[5,4,3,2,1].map(star => {
                        const percent = feedbacks.length === 0
                            ? 0
                            : (ratingCount[star] / feedbacks.length) * 100;

                        return (
                            <div
                                key={star}
                                className="bar-row"
                                onClick={() => setFilter(star)}
                            >
                                <span>{star} ★</span>
                                <div className="bar">
                                    <div
                                        className="fill"
                                        style={{ width: percent + "%" }}
                                    ></div>
                                </div>
                                <span>{ratingCount[star]}</span>
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* FILTER */}
            <div className="filter-tabs">
                <button
                    onClick={() => setFilter(0)}
                    className={filter === 0 ? "active" : ""}
                >
                    Tất cả ({feedbacks.length})
                </button>

                {[5,4,3,2,1].map(star => (
                    <button
                        key={star}
                        onClick={() => setFilter(star)}
                        className={filter === star ? "active" : ""}
                    >
                        {star} ★ ({ratingCount[star]})
                    </button>
                ))}
            </div>

            {/* SLIDER */}
            <FeedbackSection feedbacks={filteredFeedbacks} />

        </div>
    );
}

//////////////////////////////////////////////////////
// SLIDER (GIỮ NGUYÊN)
//////////////////////////////////////////////////////

function FeedbackSection({ feedbacks }) {

    const [index, setIndex] = useState(0);

    useEffect(() => {
        setIndex(0);
    }, [feedbacks]);

    useEffect(() => {
        if (feedbacks.length === 0) return;

        const interval = setInterval(() => {
            setIndex(prev =>
                prev === feedbacks.length - 1 ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [feedbacks, index]);

    if (feedbacks.length === 0) {
        return <p className="no-feedback">Không có feedback</p>;
    }

    const fb = feedbacks[index];

    return (
        <div className="feedback-section">

            <h2>Customer Feedback</h2>

            <div className="feedback-slider">

                <button className="nav prev"
                    onClick={() =>
                        setIndex(index === 0 ? feedbacks.length - 1 : index - 1)
                    }>
                    ❮
                </button>

                <div className="feedback-card">
                    <h4>{fb.name}</h4>
                    <p className="email">{fb.email}</p>

                    <div className="stars-view">
                        {"★".repeat(fb.rating)}
                        {"☆".repeat(5 - fb.rating)}
                    </div>

                    <p className="status">{fb.status}</p>
                    <p className="message">"{fb.message}"</p>
                </div>

                <button className="nav next"
                    onClick={() =>
                        setIndex(index === feedbacks.length - 1 ? 0 : index + 1)
                    }>
                    ❯
                </button>

            </div>

            {/* <div className="dots">
                {feedbacks.map((_, i) => (
                    <span key={i}
                        className={i === index ? "active" : ""}
                        onClick={() => setIndex(i)}
                    ></span>
                ))}
            </div> */}

        </div>
    );
}

export default Contact;