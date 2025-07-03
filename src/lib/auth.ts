export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jwt");
}

export function setToken(jwt: string) {
  localStorage.setItem("jwt", jwt);
}
