var router = require('express').Router()
const user_wallet = require('../utils/user_wallet.json')
const nfts = require('../utils/nfts.json')
const axios = require('axios').default;

// api/products
router.post('/update_nft', async (req, res) => {
    try {
        const props = req.body

        // check moralis profile by profile id to pass the address of wallet and nfts
        // const result = await axios.get('https://0mf8hnak6t6g.usemoralis.com:2053/server/' + props?.address + '/nft')
        //     .then(function (response) {
        //         // handle success
        //         console.log(response);
        //     })
        //     .catch(function (error) {
        //         // handle error
        //         console.log(error);
        //     })
        //     .then(function () {
        //         // always executed
        //     });

        for (const nft of nfts) {
            const isNftExists = await axios.post('/is_nft_exist', {
                id: nft.id,
            })

            if (!isNftExists) {
                const createdNft = await axios.post('/create_nft', {
                    nft: nft,
                })
            } else {
                const updatedNft = await axios.post('/update_nft', {
                    nft: nft,
                })
            }
        }

        var returnData = {}
        if (JSON.stringify(returnData) != JSON.stringify({})) {
            res.status(200).json(true)
        } else {
            res.status(200).json(false)
        }
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router;


