var router = require('express').Router()
const user_wallet = require('../utils/user_wallet.json')
const nfts = require('../utils/nfts.json');
const { createNft } = require('../modules/nft.module');
const { Assets, Transactions } = require('../database/mongodb.database');
const axios = require('axios').default;

// api/products
router.post('/view_profile', async (req, res) => {
    try {
        const assetsModel = await Assets()
        const transactionsModel = await Transactions()
        const props = req.body

        if (
            !props?.did
            || !props?.type
            || !props?.chain
            || !props?.address
        )
            return res.status(400).json("Unauthorized")

        var fetchedAsset = await assetsModel.findOne({
            "data.did": props?.did?.toString(),
            "data.type": props?.type?.toString(),
            "data.chain": props?.chain,
            "data.address": props?.address?.toString(),
        })

        if (fetchedAsset) {
            res.status(200).json(fetchedAsset)
        } else {
            res.status(200).json({})
        }
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router;


