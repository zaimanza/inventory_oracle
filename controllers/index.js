var router = require('express').Router();

// split up route handling
router.use('/', require('./is_nft_exist.controller'))
router.use('/', require('./create_nft.controller'))
router.use('/', require('./update_nft.controller'))
router.use('/', require('./view_profile.controller'))

module.exports = router;