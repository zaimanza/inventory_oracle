var router = require('express').Router()
const user_wallet = require('../utils/user_wallet.json')
const nfts = require('../utils/nfts.json')
const { fetchLatestTransaction, updateSingleAsset } = require('../database/bigchaindb.database')
const { Assets, Transactions } = require('../database/mongodb.database')
const axios = require('axios').default;

// api/products
router.post('/is_nft_exist', async (req, res) => {
    try {
        const assetsModel = await Assets()
        const transactionsModel = await Transactions()
        const props = req.body

        if (!props?.id)
            return res.status(400).json("Unauthorized")


        var fetchedAsset = await assetsModel.findOne({
            "data.id": props?.id?.toString(),
        })

        if (fetchedAsset) {
            res.status(200).json(true)
        } else {
            res.status(200).json(false)
        }
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router;


