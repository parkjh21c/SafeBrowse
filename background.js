import config from "./config/apikey.js";

// SafeBrowsing API 키
const API_KEY = config.SafeBrosing_API_KEY;
const SAFE_BROWSING_URL = "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=" + API_KEY;

// 웹 요청이 발생하기 전에 트리거
chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    if (details.type !== "main_frame") return;

    const url = details.url;

    // SafeBrowsing API로 URL 안전성 확인
    const isSafe = await checkUrlSafety(url);

    if (!isSafe) {
      // 사용자 확인 알림
      const userConfirmed = await showConfirmationDialog(url);

      if (!userConfirmed) {
        // 요청 차단
        return { cancel: true };
      }
    }
  },
  { urls: ["<all_urls>"] }, // 모든 URL 요청 감지
  ["blocking"] // 요청 차단을 위해 "blocking" 옵션 추가
);

// SafeBrowsing API로 URL 안전성 확인
async function checkUrlSafety(url) {
  const body = {
    client: {
      clientId: "your-client-id",
      clientVersion: "1.0.0",
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url }],
    },
  };

  const response = await fetch(SAFE_BROWSING_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return !data.matches; // matches가 없으면 안전
  }

  console.error("SafeBrowsing API 요청 실패");
  return true; // 실패 시 기본적으로 안전으로 처리
}

// 사용자 확인 알림
async function showConfirmationDialog(url) {
  return new Promise((resolve) => {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "images/logo.png",
      title: "안전하지 않은 도메인 감지",
      message: `이 URL(${url})은 안전하지 않을 수 있습니다. 계속 진행하시겠습니까?`,
      buttons: [{ title: "예" }, { title: "아니오" }],
    }, (notificationId) => {
      chrome.notifications.onButtonClicked.addListener((id, buttonIndex) => {
        if (id === notificationId) {
          resolve(buttonIndex === 0); // 0: 예, 1: 아니오
        }
      });
    });
  });
}
