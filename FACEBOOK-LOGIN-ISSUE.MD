# Prompt for AI to Debug Facebook Login Error

## Copy and paste this prompt to ChatGPT, Claude, or any AI:

---

**I'm getting a Facebook login error on my website. Please help me diagnose and fix it.**

**Error Message:**
```
This content isn't available right now
Invalid Scopes: email. This message is only shown to developers. Users of your app will ignore these permissions if present. Please read the documentation for valid permissions at: https://developers.facebook.com/docs/facebook-login/permissions
```

**My Current Implementation:**

**Framework/Language:** [e.g., React, Node.js, PHP, Python, etc.]

**Current Login Code:**
```javascript
// Paste your Facebook login code here
// Example:
FB.login(function(response) {
  // ...
}, {scope: 'email, public_profile'});
```

**Facebook SDK Initialization:**
```javascript
// Paste how you initialize the Facebook SDK
// Example:
FB.init({
  appId: 'YOUR_APP_ID',
  xfbml: true,
  version: 'v19.0'
});
```

**What I'm Trying to Accomplish:**
[e.g., "I want to get the user's email after they log in" OR "I just want basic profile information"]

**What I've Already Tried:**
[List any solutions you've attempted]

**My Questions:**
1. Why is the `email` scope invalid for my app?
2. How do I fix this error?
3. What scopes should I use instead?
4. If I need email access, what's the process to enable it?
5. Can you provide corrected code for my specific framework?

**Additional Context:**
- App Type: [e.g., Website, Mobile App, etc.]
- App Status: [Development/Testing/Production]
- Is my app in App Review?: [Yes/No]
- Using a library?: [e.g., react-facebook-login, passport.js, etc.]

---

## Optional: Use this shorter version if you're in a hurry:

---

I'm getting "Invalid Scopes: email" when users try to login with Facebook. My login code requests the 'email' scope. 

**Here's my code:**
```javascript
[PASTE YOUR FACEBOOK LOGIN CODE HERE]
```

**What I need:** 
1. What's wrong with the email scope?
2. How to fix it?
3. What scopes should I use instead?
4. If I need email, how do I enable it?

**Framework:** [e.g., React, Node.js, etc.]

---

## Tips for Better AI Response:

✅ **Include:**
- Exact error message
- Your current code
- What you're trying to achieve
- Your framework/language
- How you're initializing Facebook SDK

❌ **Don't forget:**
- Don't ask "why doesn't it work" without context
- Include the full scope string you're requesting
- Mention if you're in development or production

---

**Result:** The AI will provide targeted solutions, corrected code, and step-by-step fixes.
