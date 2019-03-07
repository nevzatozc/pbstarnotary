API Test Tool
Postman
Endpoint description
1. Blockchain ID validation request
Method: POST
Endpoint: localhost:8000/requestValidation
Parameters: address
Body: { "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL" }

2. Blockchain ID message signature validation
Method: POST
Endpoint: localhost:8000/message-signature/validate
Parameters: address,signature
Body: {"address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL", "signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q="}

3. Star registration
Method: POST
Endpoint: localhost:8000/block
Parameters: address, star
Body: 
{
"address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "star": {
            "dec": "68° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "Found star using https://www.google.com/sky/"
        }
}
4. Get star by Hash
Method: GET
Endpoint: localhost:8000/stars/hash:e82368481a9435f3cc4db5f3670b6681424554796258dd0b403b15fd1837def8
5. Get star by walletaddress
Method: GET
Endpoint: localhost:8000/stars/address:19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL
6. Get star by index
Method: GET
Endpoint: localhost:8000/block/11