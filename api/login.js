export default function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        const ADMIN_USERNAME = process.env.USUARIO_ADMIN;
        const ADMIN_PASSWORD = process.env.SENHA_ADMIN;

        // Verifica se as credenciais correspondem às variáveis de ambiente
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Em um projeto real, você geraria um token JWT aqui.
            // Para a nossa implementação, uma resposta simples de sucesso é suficiente.
            return res.status(200).json({ success: true, message: 'Login bem-sucedido!' });
        } else {
            return res.status(401).json({ success: false, message: 'Usuário ou senha inválidos.' });
        }
    }

    // Retorna um erro se o método da requisição não for POST
    return res.status(405).json({ message: 'Método não permitido.' });
}