// declarativeNetRequest API를 활용한 도메인 이동 확인 코드

chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: 1,
          priority: 1,
          action: { type: "block" },
          condition: { urlFilter: "*://*/*", resourceTypes: ["main_frame"] }
        }
      ],
      removeRuleIds: [1]
    });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "confirm_redirect") {
      const userConfirmed = confirm(`새로운 도메인(${message.url})으로 이동하시겠습니까?`);
      if (userConfirmed) {
        chrome.declarativeNetRequest.updateDynamicRules({
          addRules: [
            {
              id: 2,
              priority: 1,
              action: { type: "allow" },
              condition: { urlFilter: message.url, resourceTypes: ["main_frame"] }
            }
          ],
          removeRuleIds: [2]
        });
      }
      sendResponse({ allow: userConfirmed });
    }
    return true;
  });
  