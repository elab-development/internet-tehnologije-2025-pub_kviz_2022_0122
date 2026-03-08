import "@testing-library/jest-dom";

import { vi } from "vitest";

let cookieValue: string | undefined;

export function setMockCookie(value?: string) {
  cookieValue = value;
}

vi.mock("next/headers", () => {
  return {
    cookies: () => ({
      get: (name: string) => {
        if (name === "auth" && cookieValue) {
          return { value: cookieValue };
        }
        return undefined;
      },
    }),
  };
});
