import { Router } from "express";
import crypto from "crypto";
import admin from "firebase-admin";

const router = Router();

// Initialize Firebase Admin if Service Account is provided
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY && admin.apps.length === 0) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized successfully.");
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
  }
}

const DISCORD_CLIENT_ID = "1522128445314957453";
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

// The Redirect URI must match exactly what is registered in the Discord Developer Portal.
// Usually for this platform it will be the production domain.
const getRedirectUri = (req: any) => {
  // If we are behind a proxy (like on Replit/AI Studio or Vercel), we should use X-Forwarded-Proto and X-Forwarded-Host
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  
  // If the user deployed to vercel, we can hardcode the Vercel URL based on host
  if (host && host.includes("vercel.app")) {
      return 'https://sun-emu.vercel.app/auth/discord/callback';
  }
  
  if (process.env.PUBLIC_URL) {
      return `${process.env.PUBLIC_URL}/auth/discord/callback`;
  }
  
  return `${protocol}://${host}/auth/discord/callback`;
};

router.get("/discord/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  // Store state in a secure httpOnly cookie (valid for 5 mins)
  res.cookie("oauth_state", state, {
    maxAge: 1000 * 60 * 5,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  const redirectUri = getRedirectUri(req);
  const authUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identify+email&state=${state}`;
  
  res.redirect(authUrl);
});

router.get("/discord/callback", async (req, res) => {
  const { code, state, error } = req.query;
  
  if (error) {
     return res.redirect("/os?error=discord_auth_failed");
  }

  const storedState = req.cookies.oauth_state;

  if (!state || state !== storedState) {
    return res.status(400).send("Invalid OAuth state. Please try logging in again.");
  }

  res.clearCookie("oauth_state");

  if (!code) {
    return res.status(400).send("Authorization code missing.");
  }
  
  if (!DISCORD_CLIENT_SECRET) {
      return res.status(500).send("Server configuration error: DISCORD_CLIENT_SECRET is missing.");
  }

  const redirectUri = getRedirectUri(req);

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData);
      return res.status(400).send("Failed to exchange authorization code.");
    }

    // 2. Fetch User Profile
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();
    if (!userResponse.ok) {
      return res.status(400).send("Failed to fetch Discord user profile.");
    }
    
    // We can pass the discord_access_token to the client so it can manage session state,
    // or if we have Firebase Admin, we mint a Custom Token!
    
    let firebaseCustomToken = "";
    if (admin.apps.length > 0) {
      // Create a Firebase user or get existing
      const uid = `discord:${userData.id}`;
      
      try {
        await admin.auth().getUser(uid);
        // Update user properties if needed
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          await admin.auth().createUser({
            uid: uid,
            email: userData.email,
            displayName: userData.username,
            photoURL: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : undefined,
          });
        } else {
            throw error;
        }
      }
      
      firebaseCustomToken = await admin.auth().createCustomToken(uid);
    }
    
    // Set a cookie for the application to read the token
    res.cookie("discord_session", JSON.stringify({
        id: userData.id,
        username: userData.username,
        avatar: userData.avatar,
        email: userData.email,
        access_token: tokenData.access_token, // for discord API calls if needed
        firebase_token: firebaseCustomToken // for Firebase Auth
    }), {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: false, // client needs to read it
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    // 3. Redirect back to home
    res.redirect("/os");
  } catch (error) {
    console.error("OAuth error:", error);
    res.status(500).send("Internal server error during authentication.");
  }
});

export default router;
