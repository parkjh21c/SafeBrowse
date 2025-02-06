chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const newUrl = new URL(details.url);
    
    // 새 도메인으로 이동 시 확인 (예: 특정 도메인 리스트를 비교하는 로직 추가 가능)
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "confirm_redirect", url: newUrl.href }, (response) => {
        if (response && response.allow) {
          resolve({ cancel: false });
        } else {
          resolve({ cancel: true });
        }
      });
    });
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// popup.js 또는 content_script.js에서 사용자 확인 로직
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "confirm_redirect") {
    const userConfirmed = confirm(`새로운 도메인(${message.url})으로 이동하시겠습니까?`);
    sendResponse({ allow: userConfirmed });
  }
  return true;
});



// // 이전 도메인 저장
// let previousDomain = null;

// chrome.webRequest.onBeforeRequest.addListener(
//     (details) => {
//         try {
//           const url = new URL(details.url); // 요청된 URL
//           const currentDomain = url.hostname; // 도메인 추출
    
//           if (previousDomain && currentDomain !== previousDomain) {
//             // 도메인 변경 감지 시 알림
//             chrome.notifications.create({
//               type: "basic",
//               iconUrl: "images/logo.png",
//               title: "Domain Request Detected",
//               message: `You are about to navigate to ${currentDomain}.`
//             });
//           }
    
//           // 이전 도메인 업데이트
//           previousDomain = currentDomain;
//         } catch (error) {
//           console.error("Error processing domain request:", error);
//         }
//       },
//       { urls: ["<all_urls>"] } // 모든 URL 요청 감지
// )

// 정확함/ but 사용자가 도메인을 통해 이동한 후 알림이 뜸 => 내가 생각한 것과 맞지 않음

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.url) {
//     const currentDomain = new URL(changeInfo.url).hostname;

//     if (previousDomain && currentDomain !== previousDomain) {
//       // 도메인이 변경되었음을 알림
//       chrome.notifications.create({
//         type: "basic",
//         iconUrl: "images/logo.png",
//         title: "Domain Change Detected",
//         message: `You are navigating from ${previousDomain} to ${currentDomain}.`
//       });
//     }

//     // 이전 도메인 업데이트
//     previousDomain = currentDomain;
//   }
// });
