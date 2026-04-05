import React from "react";
import "./about.css";

import heroImg from "./img/anh1.png";
import companyImg from "./img/anh-khoi-2.png";
import researchImg from "./img/anh-nha-may.jpg";
import distributionImg from "./img/logo-dau.png";

function About() {
  return (
    <div className="about-container">

      {/* HERO SECTION */}
      <section className="about-hero">
        <img src={heroImg} alt="Hero" />
        <div className="hero-text">
          <h1>Giới thiệu về công ty dược phẩm</h1>
          <p>
            Chúng tôi cam kết cải thiện sức khỏe cộng đồng thông qua các giải
            pháp dược phẩm tiên tiến và những sản phẩm thuốc chất lượng cao.
          </p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="about-two-column">
        <img src={companyImg} alt="Company" />
        <div>
          <h2>Chúng tôi là ai</h2>
          <p>
            Công ty dược phẩm của chúng tôi tập trung vào nghiên cứu, phát triển
            và cung cấp các sản phẩm y tế chất lượng cao nhằm nâng cao chất
            lượng cuộc sống cho mọi người. Chúng tôi kết hợp khoa học hiện đại,
            công nghệ tiên tiến và quy trình kiểm soát nghiêm ngặt để đảm bảo
            tính an toàn và hiệu quả của sản phẩm.
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="about-grid">

        <div className="about-card">
          <img src={researchImg} alt="Research" />
          <h3>Nghiên cứu & Phát triển</h3>
          <p>
            Đội ngũ nghiên cứu của chúng tôi không ngừng phát triển các loại
            thuốc và phương pháp điều trị mới nhằm cải thiện sức khỏe cho bệnh
            nhân.
          </p>
        </div>

        <div className="about-card">
          <img src={distributionImg} alt="Quality" />
          <h3>Đảm bảo chất lượng</h3>
          <p>
            Chúng tôi tuân thủ nghiêm ngặt các tiêu chuẩn sản xuất dược phẩm
            quốc tế để đảm bảo mỗi sản phẩm đều đạt chất lượng và độ an toàn cao.
          </p>
        </div>

        <div className="about-card">
          <img src={distributionImg} alt="Distribution" />
          <h3>Phân phối toàn cầu</h3>
          <p>
            Sản phẩm của chúng tôi được phân phối tới bệnh viện, nhà thuốc và
            các đối tác y tế trên toàn thế giới.
          </p>
        </div>

      </section>

      {/* MISSION */}
      <section className="about-two-column reverse">
        <div>
          <h2>Sứ mệnh của chúng tôi</h2>
          <p>
            Sứ mệnh của chúng tôi là cung cấp các loại thuốc an toàn, hiệu quả
            và giá cả hợp lý nhằm nâng cao chất lượng cuộc sống cho bệnh nhân
            trên toàn thế giới.
          </p>
        </div>

        {/* dùng lại ảnh */}
        <img src={companyImg} alt="Mission" />

      </section>

      {/* VIDEO SECTION */}
  {/* VIDEO SECTION */}
      <section className="about-video">
        <h2>Video giới thiệu công ty</h2>

        <iframe 
          width="900" 
          height="500" 
          src="https://www.youtube.com/embed/NoKH3E4MXhc?si=uQAq9Tfh-Bdg-HLK" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
        ></iframe>

      </section>

    </div>
  );
}

export default About;