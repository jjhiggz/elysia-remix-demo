import { Elysia, t, type LocalHook } from "elysia";

import { lucia, type Auth, type Configuration } from "lucia";

import {
  auth0,
  apple,
  azureAD,
  box,
  discord,
  dropbox,
  facebook,
  github,
  gitlab,
  google,
  lichess,
  line,
  linkedIn,
  osu,
  patreon,
  reddit,
  salesforce,
  slack,
  spotify,
  twitch,
  twitter,
} from "@lucia-auth/oauth/providers";

import type { CookieOptions } from "elysia/dist/cookie";
import {
  OAuth2ProviderAuth,
  OAuth2ProviderAuthWithPKCE,
} from "@lucia-auth/oauth";
import { prisma as luciaPrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

type Prettify<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K];
};

type MaybePromise<T> = T | Promise<T>;

export const createOAuth =
  <
    Name extends string,
    const AuthConstructor extends (...a: any[]) => OAuth2ProviderAuth
  >(
    auth: ReturnType<typeof lucia>,
    createProvider: AuthConstructor,
    name: Name,
    sessionName: string,
    defaultCreateUser: (
      // @ts-ignore
      user: Awaited<
        ReturnType<ReturnType<AuthConstructor>["validateCallback"]>
      >[`${Name}User`]
    ) => MaybePromise<
      Record<string, unknown> & {
        id: string | number;
      }
    >
  ) =>
  <
    const Path extends string = `/${Name}`,
    const Callback extends string = `${Path}/callback`
  >(
    config: Prettify<
      Parameters<AuthConstructor>[1] & {
        path?: Path;
        callback?: Callback;
        createUser?: (
          // @ts-ignore
          user: Awaited<
            ReturnType<ReturnType<AuthConstructor>["validateCallback"]>
          >[`${Name}User`]
        ) => MaybePromise<
          Record<string, unknown> & {
            id: string | number;
          }
        >;
        hook?: {
          redirect?: LocalHook;
          callback?: LocalHook;
        };
        cookie?: {
          state?: CookieOptions;
          session?: CookieOptions;
        };
      }
    >
  ) => {
    const {
      path = `/${name}`,
      callback = `/${name}/callback`,
      createUser: createNewUser = defaultCreateUser,
      hook = {},
      cookie,
      ...init
    } = config;

    const provider = createProvider(auth, init);

    return new Elysia({
      name: `@elysiajs/lucia-auth/${name}`,
      seed: config,
    })
      .get(
        path,
        async ({ cookie: { oauthState }, set }) => {
          const [url, state] = await provider.getAuthorizationUrl();

          oauthState.value = state;
          oauthState.set({
            path: "/",
            sameSite: true,
            httpOnly: true,
            maxAge: 3600,
          });

          set.redirect = url.toString();
        },
        // @ts-ignore
        hook.redirect
      )
      .get(
        callback,
        async ({
          set,
          query,
          query: { code, state },
          cookie,
          cookie: { oauthState },
        }) => {
          console.log(state, oauthState.value);

          if (state !== oauthState.value) throw new Error("Invalid state");

          const callback = await provider.validateCallback(code as string);

          const { getExistingUser, createUser, createKey } = callback;

          // @ts-ignore
          const userData = callback[`${name}User`];

          const handleCreateUser = async () => {
            // @ts-ignore
            const { id, ...attributes } = await createNewUser(userData);

            await createUser({
              // @ts-ignore
              id,
              attributes,
            });

            return {
              userId: id,
              ...attributes,
            };
          };

          const user = (await getExistingUser()) ?? (await handleCreateUser());

          if (!user?.userId) return (set.status = "Internal Server Error");

          const { sessionId } = await auth.createSession({
            userId: user.userId,
            attributes: {},
          });

          cookie[sessionName].value = sessionId;
          oauthState.remove();

          return userData;
        },
        // @ts-ignore
        hook.callback
      );
  };

export const createOAuthWithPKCE =
  <
    Name extends string,
    const AuthConstructor extends (...a: any[]) => OAuth2ProviderAuthWithPKCE
  >(
    auth: ReturnType<typeof lucia>,
    createProvider: AuthConstructor,
    name: Name,
    sessionName: string,
    defaultCreateUser?: (
      // @ts-ignore
      user: Awaited<
        ReturnType<ReturnType<AuthConstructor>["validateCallback"]>
      >[`${Name}User`]
    ) => MaybePromise<
      Record<string, unknown> & {
        id: string | number;
      }
    >
  ) =>
  <
    const Path extends string = `/${Name}`,
    const Callback extends string = `${Path}/callback`
  >(config: {
    path?: Path;
    callback?: Callback;
    createUser?: (
      // @ts-ignore
      user: Awaited<
        ReturnType<ReturnType<AuthConstructor>["validateCallback"]>
      >[`${Name}User`]
    ) => MaybePromise<
      Record<string, unknown> & {
        id: string | number;
      }
    >;
    hook?: {
      redirect?: LocalHook;
      callback?: LocalHook;
    };
    cookie?: {
      state?: CookieOptions;
      session?: CookieOptions;
    };
    config: Parameters<AuthConstructor>[1];
  }) => {
    const {
      path = `/${name}`,
      callback = `/${name}/callback`,
      hook = {},
      createUser: createNewUser = defaultCreateUser,
      ...init
    } = config;

    const provider = createProvider(auth, init);

    return new Elysia({
      name: `@elysiajs/lucia-auth/${name}`,
      seed: config,
    })
      .get(
        path,
        async ({ cookie: { oauthState, oauthVerifier }, set }) => {
          const [url, verifier, state] = await provider.getAuthorizationUrl();

          oauthVerifier.set({
            value: verifier,
            path: "/",
            sameSite: true,
            httpOnly: true,
            maxAge: 3600,
          });

          oauthState.set({
            value: state,
            path: "/",
            sameSite: true,
            httpOnly: true,
            maxAge: 3600,
          });

          set.redirect = url.toString();
        },
        hook.redirect
      )
      .get(
        callback,
        async ({
          set,
          query,
          query: { code, state },
          cookie,
          cookie: { oauthState, oauthVerifier },
        }) => {
          if (state !== oauthState.value) throw new Error("Invalid state");

          if (state !== oauthVerifier.value)
            throw new Error("Invalid oauth verifier");

          const callback = await provider.validateCallback(
            code as string,
            oauthVerifier.value
          );

          const { getExistingUser, createUser, createKey } = callback;

          // @ts-ignore
          const userData = callback[`${name}User`];

          const handleCreateUser = async () => {
            // @ts-ignore
            const { id, ...attributes } = await createNewUser(userData);

            await createUser({
              // @ts-ignore
              id,
              attributes,
            });

            return {
              userId: id,
              ...attributes,
            };
          };

          const user = (await getExistingUser()) ?? (await handleCreateUser());

          if (!user?.userId) return (set.status = "Internal Server Error");

          const { sessionId } = await auth.createSession({
            userId: user.userId,
            attributes: {},
          });

          cookie[sessionName].value = sessionId;
          oauthState.remove();

          return userData;
        },
        // @ts-ignore
        hook.callback
      );
  };

export class InvalidSession extends Error {
  status = 401;

  constructor(public message = "Unauthorized") {
    super(message);
  }
}

const Lucia = <
  const Name extends string = "user",
  const SessionName extends string = "session"
>(
  configuration: Prettify<
    {
      name?: Name;
      session?: SessionName;
    } & Omit<Configuration, "env"> & {
        env?: Configuration["env"];
        cookie?: Parameters<typeof t.Cookie>[1];
      }
  >
) => {
  const auth = lucia({
    ...configuration,
    env:
      (process.env.ENV ?? process.env.NODE_ENV) === "production"
        ? "PROD"
        : "DEV",
  });

  const name: Name = configuration.name ?? ("user" as Name);
  const sessionName: SessionName =
    configuration.session ?? ("session" as SessionName);

  const elysia = new Elysia({
    name: "@elysiajs/lucia-auth",
    seed: configuration,
  })
    .error({
      INVALID_SESSION: InvalidSession,
    })
    .derive(async ({ cookie }) => {
      const session = cookie[sessionName];

      const decorators = {
        auth,
        get id() {
          try {
            return auth
              .getSession(session.value)
              .then(({ user: { userId } }) => userId);
          } catch {
            throw new InvalidSession();
          }
        },
        get data() {
          return decorators.id.then(async (id) => auth.getUser(id));
        },
        async signUp(
          {
            username,
            password,
            ...rest
          }: {
            username: string;
            password: string;
            // @ts-ignore
          } & Lucia.DatabaseUserAttributes,
          {
            createSession = false,
          }: {
            /**
             * @default false
             */
            createSession: boolean;
          } = {
            createSession: false,
          }
        ) {
          const data = await auth.createUser({
            key: {
              providerId: "username",
              providerUserId: username,
              password,
            },
            attributes: {
              username,
              ...rest,
            },
          });

          if (createSession) await decorators.signIn(username, password);

          return data;
        },
        async signIn(username: string, password: string) {
          const { userId } = await auth.useKey("username", username, password);

          const { sessionId } = await auth.createSession({
            userId,
            attributes: {},
          });

          session.value = sessionId;
          session.set({
            httpOnly: true,
            maxAge: 3600,
            path: "/",
          });
        },
        async updateUser(
          // @ts-ignore
          attributes: Lucia.DatabaseUserAttributes
        ) {
          auth.updateUserAttributes(await decorators.id, attributes);
        },
        async updatePassword(username: string, password: string) {
          const { userId } = await auth.updateKeyPassword(
            "username",
            username,
            password
          );

          const { sessionId } = await auth.createSession({
            userId,
            attributes: {},
          });

          session.value = sessionId;
        },
        async refresh() {
          const { userId: id, sessionId } = await auth.createSession({
            userId: await decorators.id,
            sessionId: session.value,
            attributes: {},
          });

          session.value = sessionId;
        },
        async signOut(type?: "all" | "unused" | "current") {
          if (!type) await auth.invalidateSession(session.value);
          else
            switch (type) {
              case "all":
                await auth.invalidateAllUserSessions(session.value);
                break;

              case "current":
                await auth.invalidateSession(session.value);
                break;

              case "unused":
                await auth.deleteDeadUserSessions(session.value);
                break;
            }

          session.remove();
        },
        async delete({
          confirm,
        }: {
          confirm: "DELETE ALL USER DATA and is not reversible";
        }) {
          await Promise.all([
            auth.deleteUser(await decorators.id),
            auth.invalidateAllUserSessions(session.value),
          ]);

          session.remove();
        },
        async validate() {
          if (!session.value) throw new InvalidSession();

          try {
            await auth.validateSession(session.value);
          } catch {
            throw new InvalidSession();
          }
        },
      } as const;

      return {
        [name as Name]: decorators,
      } as Record<Name, typeof decorators>;
    });

  return {
    lucia: auth,
    elysia,
    oauth: {
      auth0: createOAuth(
        auth,
        auth0,
        "auth0",
        sessionName,
        ({ email, sub }) => ({
          id: sub,
          username: email,
        })
      ),
      apple: createOAuth(
        auth,
        apple,
        "apple",
        sessionName,
        ({ email, sub }) => ({
          id: sub,
          username: email,
        })
      ),
      azure: createOAuthWithPKCE(
        auth,
        azureAD,
        "azureAD",
        sessionName,
        ({ email, sub }) => ({
          id: sub,
          username: email,
        })
      ),
      box: createOAuth(auth, box, "box", sessionName, ({ id, name }) => ({
        id,
        username: name,
      })),
      discord: createOAuth(
        auth,
        discord,
        "discord",
        sessionName,
        ({ id, username }) => ({
          id,
          username,
        })
      ),
      dropbox: createOAuth(
        auth,
        dropbox,
        "dropbox",
        sessionName,
        ({ email, name }) => ({
          id: email,
          username: name,
        })
      ),
      facebook: createOAuth(
        auth,
        facebook,
        "facebook",
        sessionName,
        ({ id, name }) => ({
          id,
          username: name,
        })
      ),
      github: createOAuth(
        auth,
        github,
        "github",
        sessionName,
        ({ id, login }) => ({
          id: id.toString(),
          username: login,
        })
      ),
      gitlab: createOAuth(
        auth,
        gitlab,
        "gitlab",
        sessionName,
        ({ id, name }) => ({
          id: id.toString(),
          username: name,
        })
      ),
      google: createOAuth(
        auth,
        google,
        "google",
        sessionName,
        ({ sub, name }) => ({
          id: sub,
          username: name,
        })
      ),
      lichless: createOAuthWithPKCE(
        auth,
        lichess,
        "lichess",
        sessionName,
        ({ id, username }) => ({
          id,
          username,
        })
      ),
      line: createOAuth(
        auth,
        line,
        "line",
        sessionName,
        ({ userId, displayName }) => ({
          id: userId,
          username: displayName,
        })
      ),
      linkedIn: createOAuth(
        auth,
        linkedIn,
        "linkedIn",
        sessionName,
        ({ name, email }) => ({
          id: email,
          username: name,
        })
      ),
      osu: createOAuth(auth, osu, "osu", sessionName, ({ id, username }) => ({
        id: id.toString(),
        username,
      })),
      patreon: createOAuth(
        auth,
        patreon,
        "patreon",
        sessionName,
        ({ id, attributes: { full_name } }) => ({
          id,
          username: full_name,
        })
      ),
      reddit: createOAuth(
        auth,
        reddit,
        "reddit",
        sessionName,
        ({ id, name }) => ({
          id,
          username: name,
        })
      ),
      salesforce: createOAuth(
        auth,
        salesforce,
        "salesforce",
        sessionName,
        ({ user_id, name }) => ({
          id: user_id,
          username: name,
        })
      ),
      slack: createOAuth(
        auth,
        slack,
        "slack",
        sessionName,
        ({ sub, name }) => ({
          id: sub,
          username: name,
        })
      ),
      spotify: createOAuth(
        auth,
        spotify,
        "spotify",
        sessionName,
        ({ id, display_name }) => ({
          id: id,
          username: display_name,
        })
      ),
      twitch: createOAuth(
        auth,
        twitch,
        "twitch",
        sessionName,
        ({ id, display_name }) => ({
          id,
          username: display_name,
        })
      ),
      twitter: createOAuthWithPKCE(
        auth,
        twitter,
        "twitter",
        sessionName,
        ({ id, name }) => ({
          id: id,
          username: name,
        })
      ),
    },
  };
};

export const luciaModule = Lucia({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [Bun.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === "production",
  },
  adapter: luciaPrismaAdapter(new PrismaClient()),
});
