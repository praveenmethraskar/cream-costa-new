import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { LoginForm } from "@/presentation/components/LoginForm"
import userEvent from "@testing-library/user-event"

// Mocks for router and auth
const mockPush = jest.fn()
const mockSetUser = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock("@/presentation/hooks/useAuthStore", () => ({
  useAuthStore: () => ({ setUser: mockSetUser }),
}))

// Correctly mock react-hot-toast default export
jest.mock("react-hot-toast", () => {
  const mockToastError = jest.fn()
  const mockToastSuccess = jest.fn()
  return {
    __esModule: true,
    default: {
      error: mockToastError,
      success: mockToastSuccess,
    },
  }
})

describe("LoginForm Component", () => {
  let toast: any

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
    // Import toast after mocks are initialized
    toast = require("react-hot-toast").default
  })

  test("successful login triggers router push & setUser", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: 1, name: "John" } }),
    })

    render(<LoginForm />)
    await userEvent.type(screen.getByPlaceholderText("Username"), "john")
    await userEvent.type(screen.getByPlaceholderText("Password"), "pass")
    fireEvent.click(screen.getByText("Submit"))

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({ id: 1, name: "John" })
      expect(mockPush).toHaveBeenCalledWith("/products")
      expect(toast.success).toHaveBeenCalledWith("Login successful!")
    })
  })

  test("shows error on failed login", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    })

    render(<LoginForm />)
    fireEvent.click(screen.getByText("Submit"))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials")
    })
  })
})