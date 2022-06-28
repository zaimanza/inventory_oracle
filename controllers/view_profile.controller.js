var router = require('express').Router()
const user_wallet = require('../utils/user_wallet.json')
const nfts = require('../utils/nfts.json');
const { createNft } = require('../modules/nft.module');
const { Assets, Transactions, Metadatas } = require('../database/mongodb.database');
const { fetchLatestTransaction, fetchTransaction } = require('../database/bigchaindb.database');
const axios = require('axios').default;

// api/products
router.post('/view_profile/:did', async (req, res) => {
    try {
        const assetsModel = await Assets()
        const transactionsModel = await Transactions()
        const props = req.params

        if (
            !props?.did
        )
            return res.status(400).json("Unauthorized")

        var fetchedAssets = await assetsModel.find({
            "data.did": props?.did?.toString()
        }).toArray()

        var transactions = []

        for (const fetchedAsset of fetchedAssets) {
            const tempData = await fetchTransaction(fetchedAsset?.id)

            transactions.push(tempData.data)
        }

        return res.status(200).json(transactions)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post('/view_profile/:address', async (req, res) => {
    try {
        const assetsModel = await Assets()
        const transactionsModel = await Transactions()
        const metadatasModel = await Metadatas()
        const props = req.params

        if (
            !props?.address
        )
            return res.status(400).json("Unauthorized")

        var fetchedMetadata = await metadatasModel.findOne({
            "metadata.address": props?.address?.toString()
        })

        var transactions = {}

        if (fetchedMetadata) {
            const tempData = await fetchTransaction(fetchedMetadata?.id)
            transactions = tempData.data
        } else {
            return res.status(200).json(transactions)
        }

        return res.status(200).json(transactions)
    } catch (error) {
        res.status(400).json(error)
    }
})


module.exports = router;


