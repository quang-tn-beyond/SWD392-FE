import { LoginForm } from "../components/login/LoginForm";

export default function Login() {
  return (
    <div className="page-container">
      
      
      <LoginForm />

      <div className="background-images">
        <video autoPlay playsInline loop muted className="top-image">
          <source src="assets/img/vid/anime.webm" type="video/webm" />
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      </div>
    </div>
  );
}

// src="public/assets/img/vid/purple-sunset2.960x540.mp4"
