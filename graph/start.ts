import "reflect-metadata";
import {
  applyResolversEnhanceMap,
  resolvers,
  ResolversEnhanceMap,
} from "@generated/type-graphql";
import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server";
import { AuthChecker, Authorized, buildSchema } from "type-graphql";

const PORT = process.env.GRAPH_PORT || 6060;

const prisma = new PrismaClient();
export const startGraph = async () => {
  const resolversEnhanceMap: ResolversEnhanceMap = {
    User: {
      user: [Authorized()],
      users: [Authorized()],
      findFirstUser: [Authorized()],
      aggregateUser: [Authorized()],
      createOneUser: [Authorized(["ADMIN"])],
      createManyUser: [Authorized(["ADMIN"])],
      upsertOneUser: [Authorized(["ADMIN"])],
      updateOneUser: [Authorized(["ADMIN"])],
      updateManyUser: [Authorized(["ADMIN"])],
      deleteOneUser: [Authorized(["ADMIN"])],
      deleteManyUser: [Authorized(["ADMIN"])],
    },

    Post: {
      post: [Authorized()],
      posts: [Authorized()],
      findFirstPost: [Authorized()],
      aggregatePost: [Authorized()],
      createOnePost: [Authorized("ADMIN")],
      createManyPost: [Authorized("ADMIN")],
      upsertOnePost: [Authorized("ADMIN")],
      updateOnePost: [Authorized("ADMIN")],
      updateManyPost: [Authorized("ADMIN")],
      deleteOnePost: [Authorized("ADMIN")],
      deleteManyPost: [Authorized("ADMIN")],
    },
  };

  applyResolversEnhanceMap(resolversEnhanceMap);

  const customAuthChecker: AuthChecker = (
    { root, args, context, info },
    roles
  ) => {
    if (!roles.includes("ADMIN")) {
      return true;
    }

    if ("isOwnerRole" in context && context.isOwnerRole) {
      return true;
    }

    return false;
  };
  const schema = await buildSchema({
    resolvers: resolvers,
    validate: false,
    authChecker: customAuthChecker,
  });

  const server = new ApolloServer({
    schema: schema,
    cache: "bounded",
    // TODO: production set to false
    introspection: true,
    context: async ({ req }) => {
      let isOwnerRole = false;
      const authorization = req.headers.authorization;
      // TODO: check authorization Role
      if (authorization == "OSPOWNER") {
        isOwnerRole = true;
      }
      return { prisma, isOwnerRole };
    },
  });
  const { url } = await server.listen(PORT);
  console.log(`🚀🚀🚀🚀`);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
};
