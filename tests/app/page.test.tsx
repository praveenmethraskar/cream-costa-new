import { render } from "@testing-library/react";
import LoginPage from "@/app/page";

// Inline mocks to avoid circular dependency
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    pathname: "/",
  }),
}));

jest.mock("@/presentation/hooks/useAuthStore", () => ({
  useAuthStore: () => ({
    setUser: jest.fn(),
  }),
}));

describe("Login Page", () => {
  it("renders LoginForm", () => {
    const { container } = render(<LoginPage />);
    expect(container.querySelector("form")).toBeInTheDocument();
  });
});
