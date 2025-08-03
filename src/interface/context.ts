import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { UserType } from "../interface/common.enum";

type Context = {
  req: FastifyRequest;
  rep: FastifyReply;
  user: string | undefined;
  userType: UserType | undefined;
};

export default Context;
