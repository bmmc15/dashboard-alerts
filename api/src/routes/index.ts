import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});


router.post('/webhook', (req, res) => {
    console.log('Novo alerta recebido:', req.body);

    res.status(200).send('Webhook recebido com sucesso');
})

export default router;
