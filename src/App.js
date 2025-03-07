import React, { useState, useRef, useEffect, useCallback } from "react";
import Confetti from "react-canvas-confetti";
import { motion } from "framer-motion";

// -------------------------
// Zodiac Determination & Messages
// -------------------------
const getZodiacSign = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // JavaScript months start at 0
  const day = date.getDate();

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return { sign: "Bảo Bình", emoji: "♒", dates: "20/1 - 18/2" };
  }
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return { sign: "Song Ngư", emoji: "♓", dates: "19/2 - 20/3" };
  }
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return { sign: "Bạch Dương", emoji: "♈", dates: "21/3 - 19/4" };
  }
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return { sign: "Kim Ngưu", emoji: "♉", dates: "20/4 - 20/5" };
  }
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
    return { sign: "Song Tử", emoji: "♊", dates: "21/5 - 21/6" };
  }
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
    return { sign: "Cự Giải", emoji: "♋", dates: "22/6 - 22/7" };
  }
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return { sign: "Sư Tử", emoji: "♌", dates: "23/7 - 22/8" };
  }
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return { sign: "Xử Nữ", emoji: "♍", dates: "23/8 - 22/9" };
  }
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
    return { sign: "Thiên Bình", emoji: "♎", dates: "23/9 - 23/10" };
  }
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) {
    return { sign: "Bọ Cạp", emoji: "♏", dates: "24/10 - 22/11" };
  }
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) {
    return { sign: "Nhân Mã", emoji: "♐", dates: "23/11 - 21/12" };
  }
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return { sign: "Ma Kết", emoji: "♑", dates: "22/12 - 19/1" };
  }
  return { sign: "Không xác định", emoji: "❓", dates: "" };
};

const zodiacMessages = {
  "Bảo Bình": {
    personality: "Sáng tạo, độc lập, có tư duy tiến bộ",
    message: "Bạn là người của những ý tưởng đột phá!",
  },
  "Song Ngư": {
    personality: "Nhạy cảm, giàu trí tưởng tượng, có tính nghệ sĩ",
    message: "Thế giới cần sự dịu dàng của bạn!",
  },
  "Bạch Dương": {
    personality: "Năng động, quyết đoán, lãnh đạo bẩm sinh",
    message: "Hãy tiếp tục tỏa sáng như ngọn lửa nhiệt huyết!",
  },
  "Kim Ngưu": {
    personality: "Kiên định, đáng tin cậy, yêu cái đẹp",
    message: "Sự vững vàng của bạn là điểm tựa cho mọi người!",
  },
  "Song Tử": {
    personality: "Thông minh, hoạt ngôn, thích giao tiếp",
    message: "Bạn là cơn gió mát mang đến niềm vui!",
  },
  "Cự Giải": {
    personality: "Nhân ái, trung thành, có thiên hướng gia đình",
    message: "Trái tim ấm áp của bạn là điều quý giá nhất!",
  },
  "Sư Tử": {
    personality: "Tự tin, hào phóng, thích được công nhận",
    message: "Hãy tiếp tục tỏa sáng như mặt trời!",
  },
  "Xử Nữ": {
    personality: "Tỉ mỉ, logic, có óc phân tích",
    message: "Sự chỉn chu của bạn khiến mọi việc hoàn hảo!",
  },
  "Thiên Bình": {
    personality: "Hòa nhã, lịch thiệp, yêu hòa bình",
    message: "Bạn mang đến sự cân bằng cho thế giới!",
  },
  "Bọ Cạp": {
    personality: "Quyết liệt, đam mê, có chiều sâu",
    message: "Sức mạnh nội tâm của bạn thật đáng ngưỡng mộ!",
  },
  "Nhân Mã": {
    personality: "Lạc quan, yêu tự do, thích phiêu lưu",
    message: "Hãy cứ vươn tới những chân trời mới!",
  },
  "Ma Kết": {
    personality: "Có trách nhiệm, tham vọng, thực tế",
    message: "Sự kiên trì của bạn chính là chìa khóa thành công!",
  },
};

// -------------------------
// useTypewriter Hook (with onComplete callback)
// -------------------------
function useTypewriter(text, speed = 50, onComplete) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let index = 0;
    setDisplayed("");
    // Make sure we do not append when index >= text.length
    const interval = setInterval(() => {
      if (index >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
        return;
      }
      setDisplayed((prev) => prev + text[index]);
      index++;
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);
  return displayed;
}

// -------------------------
// Fireworks Component
// -------------------------
const Fireworks = () => {
  const refAnimationInstance = useRef(null);
  const intervalRef = useRef(null);
  const getInstance = (instance) => {
    refAnimationInstance.current = instance;
  };
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (refAnimationInstance.current) {
        refAnimationInstance.current({
          particleCount: 100,
          spread: 120,
          origin: {
            x: Math.random(),
            y: Math.random() * 0.5,
          },
          colors: ["#ff1461", "#18ff92", "#5a87ff", "#fbf38c"],
        });
      }
    }, 800);
    return () => clearInterval(intervalRef.current);
  }, []);
  return (
    <Confetti
      refConfetti={getInstance}
      style={{
        position: "fixed",
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
};

// -------------------------
// FlowerAnimation Component
// -------------------------
// Vẽ bông hoa hoàn chỉnh với 12 cánh, nhụy vàng, thân cong và lá.
// Chỉ cánh hoa sẽ xoay khi animated, phần còn lại đứng yên.
const FlowerAnimation = ({ color, phase }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const canvasSize = 500;
  const centerX = canvasSize / 2;
  const centerY = 200;

  const drawPetal = useCallback(
    (ctx, angle, petalColor) => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.translate(0, -55);
      ctx.beginPath();
      ctx.ellipse(0, 0, 20, 50, 0, 0, 2 * Math.PI);
      ctx.fillStyle = petalColor || color || "pink";
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.restore();
    },
    [centerX, centerY, color]
  );

  const drawLeaf = (ctx, x, y, angle) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 10, 0, 0, 2 * Math.PI);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.restore();
  };

  const drawPetals = (ctx, rotationValue) => {
    const petalCount = 12;
    for (let i = 0; i < petalCount; i++) {
      const angle = ((2 * Math.PI) / petalCount) * i + rotationValue;
      drawPetal(ctx, angle, color);
    }
  };

  const drawStationaryParts = (ctx) => {
    // Nhụy của hoa
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    // Thân hoa (với quadratic curve)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 15);
    ctx.quadraticCurveTo(centerX - 40, centerY + 70, centerX, centerY + 130);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.lineWidth = 1;
    // Lá
    drawLeaf(ctx, centerX - 30, centerY + 70, -Math.PI / 4);
    drawLeaf(ctx, centerX + 30, centerY + 90, Math.PI / 4);
  };

  const drawInitialAnimation = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawPetals(ctx, 0);
    drawStationaryParts(ctx);
  };

  const startRotationAnimation = (ctx) => {
    let rotation = 0;
    const animate = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      drawPetals(ctx, rotation);
      drawStationaryParts(ctx);
      rotation += 0.02;
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (phase === 0) {
      drawInitialAnimation(ctx);
    } else if (phase === 1) {
      startRotationAnimation(ctx);
    }
    // Khi phase === 2, canvas sẽ ẩn đi.
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [phase, color, drawPetal]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      style={{
        transition: "all 1s ease",
        opacity: phase === 2 ? 0 : 1,
        position: phase === 2 ? "fixed" : "relative",
        display: "block",
        margin: "0 auto",
      }}
    />
  );
};

// -------------------------
// WomensDayMessage Component
// -------------------------
// Hiển thị lời chúc cá nhân hóa theo hiệu ứng gõ chữ, bao gồm thông tin zodiac (nếu có).
// Chỉ hiển thị phần thông tin cung nếu cung khác "Không xác định".
const WomensDayMessage = ({ formData, onComplete }) => {
  let zodiac = { sign: "", emoji: "", dates: "" };
  let zodiacInfo = { personality: "", message: "" };
  if (formData.dob) {
    zodiac = getZodiacSign(formData.dob);
    // Chỉ lấy thông tin nếu zodiac.sign khác "Không xác định"
    if (zodiac.sign !== "Không xác định") {
      zodiacInfo = zodiacMessages[zodiac.sign] || {
        personality: "",
        message: "",
      };
    }
  }
  const zodiacDisplay =
    formData.dob && zodiac.sign !== "Không xác định"
      ? `Bạn thuộc cung ${zodiac.sign} ${zodiac.emoji} (${zodiac.dates})\n${zodiacInfo.personality}\n${zodiacInfo.message}\n\n`
      : "";
  const fullMessage = `H💖✨Happy Women's Day🦛🦛🦛, ${
    formData.name || ""
  }!\n\n${zodiacDisplay}🦛🦛You embody strength, grace, and brilliance.\nWishing you a journey full of joy and possibilities `;

  const message = useTypewriter(fullMessage, 50, onComplete);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        background: "rgba(255,255,255,0.9)",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ fontSize: "2rem", color: "purple", whiteSpace: "pre-line" }}>
        {message}
      </h1>
    </div>
  );
};

// -------------------------
// WomensDayCard Component (Main)
// -------------------------
// Quy trình:
// 1. Hiển thị form nhập tên và ngày sinh.
// 2. Sau khi submit, hiển thị lời chúc (hiệu ứng gõ chữ) và bông hoa (phase 0).
//    Sau 3 giây, chuyển sang phase 1 (xoay cánh hoa).
// 3. Khi hiệu ứng gõ chữ hoàn tất, chờ thêm 5 giây rồi chuyển sang overlay cuối:
//    - Nền đen, overlay "Happy Women's Day" theo phong cách vintage và hiệu ứng pháo hoa.
const WomensDayCard = () => {
  const [formData, setFormData] = useState({ name: "", dob: "" });
  const [submitted, setSubmitted] = useState(false);
  // animationStep: 0 = tĩnh, 1 = xoay cánh hoa, 2 = overlay cuối.
  const [animationStep, setAnimationStep] = useState(0);

  // Phát audio nền khi component mount.
  useEffect(() => {
    const audio = new Audio(
      "https://www.bensound.com/bensound-music/bensound-sunny.mp3"
    );
    audio.volume = 0.2;
    audio.loop = true;
    audio.play();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() !== "" && formData.dob.trim() !== "") {
      setSubmitted(true);
      setAnimationStep(0);
    }
  };

  // Sau 3 giây chuyển từ phase 0 (tĩnh) sang phase 1 (xoay cánh hoa)
  useEffect(() => {
    let timer;
    if (submitted && animationStep === 0) {
      timer = setTimeout(() => setAnimationStep(1), 3000);
    }
    return () => clearTimeout(timer);
  }, [submitted, animationStep]);

  // Callback từ hiệu ứng gõ chữ: khi gõ xong, chờ thêm 5 giây rồi chuyển sang overlay cuối (phase 2)
  const handleTextComplete = () => {
    setTimeout(() => {
      setAnimationStep(2);
    }, 5000);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* Nếu chưa submit: hiển thị form */}
      {!submitted && (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <div style={{ margin: "10px" }}>
            <label>
              Enter your name:{" "}
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </label>
          </div>
          <div style={{ margin: "10px" }}>
            <label>
              Enter your birthday:{" "}
              <input
                type="date"
                value={formData.dob}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
                required
              />
            </label>
          </div>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
      )}

      {/* Trước overlay cuối: hiển thị lời chúc và bông hoa */}
      {submitted && animationStep < 2 && (
        <>
          <WomensDayMessage
            formData={formData}
            onComplete={handleTextComplete}
          />
          <FlowerAnimation color="pink" phase={animationStep} />
        </>
      )}

      {/* Overlay cuối: nền đen, văn bản overlay và pháo hoa */}
      {submitted && animationStep === 2 && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              zIndex: 0,
            }}
          ></div>
          <Fireworks />
          <motion.div
            animate={{ opacity: [0, 1, 0.8, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "3em",
              fontFamily: "'Garamond', serif",
              color: "#e91e63",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              background: "rgba(0,0,0,0.8)",
              padding: "20px 40px",
              borderRadius: "10px",
              border: "3px dashed #e91e63",
              zIndex: 1,
            }}
          >
            Happy Women's Day
          </motion.div>
        </>
      )}
    </div>
  );
};

export default WomensDayCard;
