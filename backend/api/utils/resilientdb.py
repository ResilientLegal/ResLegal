import json
import requests
from rest_framework.views import APIView
from rest_framework.response import Response


GRAPHQL_URL = "http://localhost:18000/graphql"
REST_URL = "http://localhost:18000/v1/transactions"



def generate_keys_mutation():
    query =  """
    mutation {
      generateKeys {
        publicKey
        privateKey
      }
    }
    """
    req = requests.post(GRAPHQL_URL, json={"query": query})
    return Response(req.json())


def postTransaction(metadata, asset): 
    mutation = """
    mutation PostTx($data: PrepareAsset!) {
      postTransaction(data: $data) {
        id
      }
    }
    """
    variables = {
        "data": {
            "operation": "CREATE",
            "amount": 100,
            "signerPublicKey": metadata.get("signerPublicKey"),
            "signerPrivateKey": metadata.get("signerPrivateKey"),
            "recipientPublicKey": metadata.get("recipientPublicKey"),
            "asset": {"data": asset},
        }
    }
    return mutation, variables



def post(data):
    r = requests.post(REST_URL + '/commit', headers={"Content-Type": "application/json"}, data=json.dumps(data), timeout=10)
    return Response(r)


def get(txn_id):
    r = requests.get(REST_URL + f'/{txn_id}', headers={"Content-Type": "application/json"})
    if (r):
        return Response(r.json())
