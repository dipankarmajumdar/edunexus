import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import "dotenv/config"

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const name = profile.displayName;
                const picture = profile.photos[0].value;

                let user = await User.findOne({ email });

                if (!user) {
                    const randomPassword = Math.random().toString(36).slice(-8);
                    const hashedPassword = await bcrypt.hash(randomPassword, 10);
                    user = await User.create({
                        name,
                        email,
                        password: hashedPassword,
                        isOAuthUser: true,
                        photoUrl: picture,
                    });
                }

                done(null, { email, name, picture, id: user._id });
            } catch (err) {
                done(err, null);
            }
        }
    )
);

export default passport;
