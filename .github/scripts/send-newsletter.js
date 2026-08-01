console.log("Newsletter script running");

console.log({
  hasKey: !!process.env.RESEND_API_KEY,
  hasAudience: !!process.env.RESEND_AUDIENCE_ID
});