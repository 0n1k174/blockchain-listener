const {Router} = require('express')
const ContractListenerV1 = require("../../../controllers/contract-listener/v1");
const router = Router();

router
    .get('/',ContractListenerV1.get)
    .get('/balance', ContractListenerV1.getBalance)


module.exports = router;
