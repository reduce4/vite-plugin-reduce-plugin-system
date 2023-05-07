import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors())
app.use(express.json());
app.post('/api', (req, res) => {
    res.send({
        code: 1,
        msg: 'ok',
        data: {
            postData: req.body
        }
    })
})
app.listen(10000)