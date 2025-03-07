import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import "../../styles/Login.css"

const Login = () => {
  const [credentials, setCredentials] = useState({
    storeName: "",
    password: "",
  })
  const [error, setError] = useState("")
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    const validStores = [
      { storeName: "StoreA", password: "password1" },
      { storeName: "StoreB", password: "password2" },
      { storeName: "StoreC", password: "password3" },
    ]

    const store = validStores.find(
      (store) => store.storeName === credentials.storeName && store.password === credentials.password,
    )

    if (store) {
      login({ storeName: store.storeName })
      navigate("/")
    } else {
      setError("Invalid store name or password")
    }
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>Store Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="storeName">Store Name</label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={credentials.storeName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

