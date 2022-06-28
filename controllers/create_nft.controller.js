var router = require('express').Router()
const user_wallet = require('../utils/user_wallet.json')
const nfts = require('../utils/nfts.json');
const { createNft } = require('../modules/nft.module');
const axios = require('axios').default;

// api/products
router.post('/create_nft', async (req, res) => {
    try {
        var props = req.body

        if (!props?.nft)
            return res.status(400).json("Unauthorized")

        var asset = {
            type: props?.nft?.type.toString(),
            did: props?.nft?.did.toString()
        }

        delete props.nft.type;
        delete props.nft.did;

        var createdNft = await createNft({
            asset: asset,
            metadata: props?.nft,
            publicKey: user_wallet?.publicKey,
            privateKey: user_wallet?.privateKey
        })

        var returnData = {}

        if (createdNft) {
            returnData = createdNft
        }

        res.status(200).json(returnData)
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router;


