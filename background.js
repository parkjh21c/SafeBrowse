// // 이전 도메인 저장
// let processedTabs = {};

// // URL에서 도메인 추출
// function extractDomain(url) {
//   try {
//     const parsedUrl = new URL(url);
//     return parsedUrl.hostname;  // 도메인만 반환
//   } catch (error) {
//     console.error("Error extracting domain:", error);
//     return null;
//   }
// }

// // 텝이 업데이트 됐을 때
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.url) {
//     const currentDomain = extractDomain(changeInfo.url);

//     if (currentDomain) {
//       const previousDomain = processedTabs[tabId];
//       if (previousDomain && currentDomain !== previousDomain) {
//         // 도메인 변경 감지 시 알림
//         chrome.notifications.create({
//           type: "basic",
//           iconUrl: "images/logo.png",
//           title: "Domain Change Detected",
//           message: `You are navigating from ${previousDomain} to ${currentDomain}.`
//         });
//       }

//       // 이전 도메인 업데이트
//       processedTabs[tabId] = currentDomain;
//     }
//   }
// });

// chrome.tabs.onRemoved.addListener((tabId) => {
//   // 탭이 닫힐 때 이전 도메인 삭제
//   delete processedTabs[tabId];
// });


// 웹 요청이 발생하기 전에 트리거
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.type !== "main_frame") {
    
      const url = new URL(details.url);
      const domain = url.hostname;

      // 알림 표시
      chrome.notifications.create({
        type: "basic",
        iconUrl: "images/logo.png",
        title: "도메인 변경 감지",
        message: `새 도메인: ${domain}`,
      });
    }
  },
  { urls: ["<all_urls>"] } // 모든 URL 요청을 감지
);

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
