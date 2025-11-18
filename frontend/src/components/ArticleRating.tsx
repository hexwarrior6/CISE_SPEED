// frontend/src/components/ArticleRating.tsx
import React, { useState } from "react";
import styles from "../styles/ArticlesPage.module.scss";
import { useRouter } from "next/router";

interface ArticleRatingProps {
  customId: string;
  averageRating?: number;
  userRating?: number;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
}

const ArticleRating: React.FC<ArticleRatingProps> = ({
  customId,
  averageRating,
  userRating: initialUserRating,
  readonly = false,
  onRatingChange,
}) => {
  const [userRating, setUserRating] = useState(initialUserRating);
  const router = useRouter();

  // 处理评分显示逻辑：如果没有评分则显示N/A，否则显示一位小数
  const displayRating = averageRating ? averageRating.toFixed(1) : "0.0";

  const handleClick = () => {
    if (readonly) {
      // 在只读模式下，点击跳转到文章详情页
      router.push(`/articles/${customId}`);
    }
  };

  // 处理星级评分点击事件
  const handleStarClick = async (rating: number) => {
    if (readonly) {
      router.push(`/articles/${customId}`);
      return;
    }

    // 检查用户是否已登录 - 使用统一的键名
    const access_token = localStorage.getItem("access_token"); // 改为 token
    const userData = localStorage.getItem("user");

    if (!access_token || !userData) {
      alert("请先登录后再进行评分");
      router.push("/login");
      return;
    }

    let user;
    try {
      user = JSON.parse(userData);
    } catch (e) {
      alert("用户信息解析失败，请重新登录");
      router.push("/login");
      return;
    }

    // 检查用户角色 - Searcher 和 Analyst 都可以进行评分
    if (user.role !== "Searcher" && user.role !== "Analyst") {
      alert("只有Searcher和Analyst角色可以进行评分");
      return;
    }

    const confirmed = window.confirm(`确定给这篇文章评 ${rating} 分吗？`);
    if (confirmed) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${customId}/rating`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`, // 使用 token 变量
            },
            body: JSON.stringify({
              score: rating,
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          // 特殊处理权限错误
          if (response.status === 403) {
            alert("您没有权限执行此操作，请确保您已登录并且具有正确的角色");
            // 清除本地存储的认证信息
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            router.push("/login");
            return;
          }

          throw new Error(
            errorData.message ||
              `评分失败: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        setUserRating(rating); // 正确设置本地状态

        if (onRatingChange) {
          onRatingChange(rating);
        }

        console.log("评分成功:", data);
      } catch (error) {
        console.error("评分错误:", error);
        alert(
          (error instanceof Error ? error.message : String(error)) ||
            "评分失败，请重试",
        );
        // 如果评分失败，恢复原来的评分
        setUserRating(initialUserRating);
      }
    }
  };

  // 渲染可交互的星级评分
  const renderStars = () => {
    if (readonly) {
      // 只读模式下显示平均分
      return (
        <div className={styles.singleStarRating}>
          <span className={styles.singleStar}>★</span>
          <span className={styles.singleRatingValue}>{displayRating}</span>
        </div>
      );
    }

    // 交互模式下显示可点击的星星
    return (
      <div className={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${
              star <= (userRating || 0) ? styles.filled : styles.empty
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleStarClick(star);
            }}
          >
            ★
          </span>
        ))}
        <span className={styles.ratingValue}>
          {userRating ? userRating.toFixed(1) : "0.0"}
        </span>
      </div>
    );
  };

  return (
    <div
      className={styles.ratingContainer}
      onClick={handleClick}
      title={readonly ? `平均分: ${displayRating}` : "点击评分"}
      style={{ cursor: readonly ? "pointer" : "default" }}
    >
      {renderStars()}
    </div>
  );
};

export default ArticleRating;
