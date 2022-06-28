var router = require('express').Router()
const user_wallet = require('../utils/user_wallet.json')
const nfts = require('../utils/nfts.json');
const { createNft } = require('../modules/nft.module');
const { Assets, Transactions, Metadatas } = require('../database/mongodb.database');
const { fetchLatestTransaction, fetchTransaction } = require('../database/bigchaindb.database');
const axios = require('axios').default;

// api/products
router.post('/profile/:did/crypto_wallet', async (req, res) => {
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
            console.log(tempData.data)
            transactions.push({
                asset: tempData.data?.asset?.data,
                metadata: tempData.data?.metadata
            })
        }

        return res.status(200).json(transactions)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post('/crypto_wallet/check/:address', async (req, res) => {
    try {
        const assetsModel = await Assets()
        const transactionsModel = await Transactions()
        const metadatasModel = await Metadatas()
        var props = req.params

        if (
            !props?.address
        )
            return res.status(400).json("Unauthorized")
        console.log(props?.address)
        var fetchedMetadata = await metadatasModel.findOne({
            "metadata.address": props?.address
        })
        console.log(fetchedMetadata)
        var transactions = {}

        if (fetchedMetadata) {
            const tempData = await fetchTransaction(fetchedMetadata?.id)
            transactions = {
                asset: tempData.data?.asset?.data,
                metadata: tempData.data?.metadata
            }
        } else {
            return res.status(200).json(transactions)
        }

        return res.status(200).json(transactions)
    } catch (error) {
        res.status(400).json(error)
    }
})


module.exports = router;


