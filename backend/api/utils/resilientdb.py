import requests
from rest_framework.views import APIView
from rest_framework.response import Response


GRAPHQL_URL = "http://localhost:18000/graphql"


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

def get_transaction_query(txn_id):
    query = """
    query GetTransaction($id: String!) {
      getTransaction(id: $id) {
        signerPublicKey
        asset
      }
    }
    """
    variables = {"id": txn_id}
    return query, variables
