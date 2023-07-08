export function isStageFright(userAgent: string) {
  return userAgent.includes("stagefright");
}

export function isAVProMobile(userAgent: string) {
  return userAgent.includes("AVProMobileVideo");
}
