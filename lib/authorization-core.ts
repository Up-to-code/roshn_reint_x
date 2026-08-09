export interface AuthorizationActor {
  id: string;
  role?: string | null;
}

export class AuthorizationError extends Error {
  constructor(
    message: string,
    readonly status: 401 | 403,
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function assertAuthenticated<T extends AuthorizationActor | null | undefined>(
  actor: T,
): asserts actor is Exclude<T, null | undefined> {
  if (!actor) throw new AuthorizationError("Authentication required", 401);
}

export function assertAdmin<T extends AuthorizationActor | null | undefined>(
  actor: T,
): asserts actor is Exclude<T, null | undefined> {
  assertAuthenticated(actor);
  if (actor.role !== "ADMIN") {
    throw new AuthorizationError("Administrator access required", 403);
  }
}

export function assertSelfOrAdmin<T extends AuthorizationActor | null | undefined>(
  actor: T,
  subjectId: string,
): asserts actor is Exclude<T, null | undefined> {
  assertAuthenticated(actor);
  if (actor.id !== subjectId && actor.role !== "ADMIN") {
    throw new AuthorizationError("Access denied", 403);
  }
}
