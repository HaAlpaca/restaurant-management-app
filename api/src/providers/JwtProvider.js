import JWT from 'jsonwebtoken'
// function can 3 thu: userInfo, secretSignature, tokenLife
const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    return JWT.sign(userInfo, secretSignature, {
      algorithm: 'HS256',
      expiresIn: tokenLife
    })
  } catch (error) {
    throw new Error(error)
  }
}
const verifyToken = async (token, secretSignature) => {
  try {
    // verify cua thu vien jwt
    return JWT.verify(token, secretSignature)
  } catch (error) {
    throw new Error(error)
  }
}

export const JwtProvider = { generateToken, verifyToken }
