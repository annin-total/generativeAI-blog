// // libs/microcms.ts
// import { createClient } from "microcms-js-sdk";

// // 環境変数にMICROCMS_SERVICE_DOMAINが設定されていない場合はエラーを投げる
// // if (!process.env.MICROCMS_SERVICE_DOMAIN) {
// //   throw new Error("MICROCMS_SERVICE_DOMAIN is required");
// // }

// // 環境変数にMICROCMS_API_KEYが設定されていない場合はエラーを投げる
// // if (!process.env.MICROCMS_API_KEY) {
// //   throw new Error("MICROCMS_API_KEY is required");
// // }

// // Client SDKの初期化を行う
// export const client = createClient({
//   serviceDomain: "blog-next-turorial-youtube",
//   apiKey: "9wa3rnFwrSaYgPfh067ImeJblgjHWTLrLzhk",
// });

import { createClient } from "microcms-js-sdk";

if (!"9wa3rnFwrSaYgPfh067ImeJblgjHWTLrLzhk" || !"blog-next-turorial-youtube") {
  throw new Error("Missing environment variables for microCMS");
}

export const client = createClient({
  serviceDomain: "blog-next-turorial-youtube",
  apiKey: "9wa3rnFwrSaYgPfh067ImeJblgjHWTLrLzhk",
});

// 書き込み用クライアント
export const writeClient = createClient({
  serviceDomain: "blog-next-turorial-youtube",
  apiKey: "9wa3rnFwrSaYgPfh067ImeJblgjHWTLrLzhk",
});
