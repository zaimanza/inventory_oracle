var router = require('express').Router()
const user_wallet = require('../utils/user_wallet.json')
const nfts = require('../utils/nfts.json');
const { createNft } = require('../modules/nft.module');
const { fetchLatestTransaction, updateSingleAsset } = require('../database/bigchaindb.database')
const { Assets, Transactions } = require('../database/mongodb.database')
const axios = require('axios').default;

// api/products
router.post('/update_nft', async (req, res) => {
    try {
        const assetsModel = await Assets()
        const transactionsModel = await Transactions()

        const props = req.body

        if (!props?.nft)
            return res.status(400).json("Unauthorized")

        var fetchedAsset = await assetsModel.findOne({
            "data.id": props?.nft?.id.toString()
        })

        var fetchedRaffleLatestTransaction = await fetchLatestTransaction(fetchedAsset?.id)
        if (!fetchedRaffleLatestTransaction) {
            return res.status(400).json("Transaction does not exist")
        }


        var appendNft = await updateSingleAsset({
            txCreatedID: fetchedRaffleLatestTransaction?.id,
            metadata: {
                name: props?.nft?.name,
                description: props?.nft?.description,
                type: props?.nft?.type,
                image: props?.nft?.image,
                attributes: props?.nft?.attributes,
                promotionDiscount: props?.nft?.promotionDiscount,
                voucher: props?.nft?.voucher,
            },
            publicKey: user_wallet.publicKey,
            privateKey: user_wallet.privateKey,
        })

        var returnData = {}

        if (appendNft) {
            returnData = appendNft
        }

        res.status(200).json(returnData)
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router;


