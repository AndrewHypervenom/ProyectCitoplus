// Servicio de autenticación
export async function loginApi(nombre_usuario, password) {
  const res = await fetch('http://localhost:5000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre_usuario, password })
  });
  if (!res.ok) {
    throw new Error('Credenciales incorrectas');
  }
  return res.json();
}
