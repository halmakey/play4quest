export function isStageFright(userAgent: string) {
  return userAgent.toLocaleLowerCase().includes("stagefright");
}

export function isAVProMobile(userAgent: string) {
  return userAgent.toLocaleLowerCase().includes("avpromobilevideo");
}
