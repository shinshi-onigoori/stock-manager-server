import express from 'express';

const router = express.Router()

// TODO sign in のAPIをGETからPOSTに戻す
router.get("/signin", (req, res) => {
    console.log("API to sign in.")
    return res.status(200).send({
        message: 'API to sign in.',
      })
})

router.post("/signup", (req, res) => {
    console.log("API to sign up.")
    return res.status(200).send({
        message: 'API to sign up.',
      })
})

export const authRouter = router;