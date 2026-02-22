import { render } from "@testing-library/react"
import RegisterPage from "@/app/register/page"

// Mock useAuthStore (if RegisterForm uses it)
jest.mock("@/presentation/hooks/useAuthStore", () => ({
  useAuthStore: () => ({
    setUser: jest.fn(),
  }),
}))

// Mock next/navigation (if RegisterForm contains navigation)
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    pathname: "/register",
  }),
}))

describe("Register Page", () => {
  it("renders RegisterForm", () => {
    const { container } = render(<RegisterPage />)
    expect(container.querySelector("form")).toBeInTheDocument()
  })
})