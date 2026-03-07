const express = require("express")
const fetch = require("node-fetch")

const app = express()

const MERCHANT = "MERCHANT_ID_KAMU"
const APIKEY = "API_KEY_KAMU"

app.get("/cekid/:id", async (req,res)=>{

let id = req.params.id

let url = `https://v1.apigames.id/merchant/${MERCHANT}/cek-username/ml/${id}?signature=${APIKEY}`

let response = await fetch(url)
let data = await response.json()

res.json(data)

})

app.listen(10000, ()=>{
console.log("Vipercell server running")
})
