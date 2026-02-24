//
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// Passport LocalStrategy configuration to verify email and password for authentication
export const configureLocalStrategy = () => {
  passport.use(
    new LocalStrategy(
      // changes default username input to email
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
            include: {
              profile: true,
            },
          });
          if (user === null) {
            return done(null, false, {
              message: 'Login failed; Invalid email or password',
            });
          }

          const passwordsMatch = await argon2.verify(user.password, password);

          if (passwordsMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: 'Login failed; Invalid email or password',
            });
          }
        } catch (err) {
          return done(err);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    process.nextTick(() => {
      done(null, {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    });
  });

  passport.deserializeUser(async (currentUserId, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: currentUserId.id,
        },
      });
      done(null, user.id);
    } catch (err) {
      done(err);
    }
  });
};

export default configureLocalStrategy;
