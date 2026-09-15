import type { TipoUsuario } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      papel: TipoUsuario;
    } & DefaultSession["user"];
  }

  interface User {
    papel: TipoUsuario;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    papel: TipoUsuario;
  }
}
