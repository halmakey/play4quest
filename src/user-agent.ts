function isStageFright(userAgent: string) {
  return userAgent.includes("stagefright");
}

function isAVProMobile(userAgent: string) {
  return userAgent.includes("AVProMobileVideo");
}
