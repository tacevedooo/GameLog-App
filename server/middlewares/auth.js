import jwt from 'jsonwebtoken'

function auth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: "Token missing" })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" })
    }

    req.user = {
      id: decoded.id,
      role: decoded.role
    }

    next()
  })
}

export default auth