var router = require('express').Router()
const user_wallet = require('../utils/user_wallet.json')
const nfts = require('../utils/nfts.json');
const { createNft } = require('../modules/nft.module');
const axios = require('axios').default;

// api/products
router.post('/create_nft', async (req, res) => {
    try {
        const props = req.body

        if (!props?.nft)
            return res.status(400).json("Unauthorized")

        var createdNft = await createNft({
            asset: {
                type: "nft",
                did: props?.nft?.did.toString()
            },
            metadata: {
                name: props?.nft?.name,
                description: props?.nft?.description,
                type: props?.nft?.type,
                image: props?.nft?.image,
                attributes: props?.nft?.attributes,
                promotionDiscount: props?.nft?.promotionDiscount,
                voucher: props?.nft?.voucher,
            },
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


