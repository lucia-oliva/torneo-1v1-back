import { Router } from 'express';
import {
  createExpiredSessionCookie,
  createSessionCookie,
  readSessionFromRequest,
  verifyAdminPassword,
} from '../src/authToken.js';

const router = Router();

function getAdminUser() {
  return {
    email: process.env.ADMIN_EMAIL,
    role: 'admin',
  };
}

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const admin = getAdminUser();

  if (!admin.email || !process.env.ADMIN_PASSWORD) {
    return res.status(500).json({
      ok: false,
      message: 'Faltan configurar ADMIN_EMAIL y ADMIN_PASSWORD en el backend',
    });
  }

  const validEmail = String(email || '').toLowerCase() === admin.email.toLowerCase();
  const validPassword = verifyAdminPassword(password);

  if (!validEmail || !validPassword) {
    return res.status(401).json({
      ok: false,
      message: 'Email o contraseña incorrectos',
    });
  }

  res.setHeader('Set-Cookie', createSessionCookie(admin));

  return res.status(200).json({
    ok: true,
    message: 'Login correcto',
    user: admin,
  });
});

router.post('/logout', (_req, res) => {
  res.setHeader('Set-Cookie', createExpiredSessionCookie());

  return res.status(200).json({
    ok: true,
    message: 'Sesión cerrada',
  });
});

router.get('/me', (req, res) => {
  const session = readSessionFromRequest(req);

  if (!session) {
    return res.status(401).json({
      ok: false,
      user: null,
    });
  }

  return res.status(200).json({
    ok: true,
    user: session,
  });
});

export default router;
