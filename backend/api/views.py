import json
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import viewsets
from .models import Matter
from .serializers import MatterSerializer

GRAPHQL_URL = "http://localhost:8000/graphql"
REST_URL = "http://localhost:18000/v1/transactions"

class MatterViewSet(viewsets.ModelViewSet):
    queryset = Matter.objects.all()
    serializer_class = MatterSerializer


class CommitTransaction(APIView):
    # def postGraphQl(self, request):
    #     metadata = request.data["metadata"]
    #     asset = request.data["asset"]

    #     query = f"""
    #     mutation {{
    #       postTransaction(data: {{
    #         operation: "CREATE",
    #         amount: 1,
    #         signerPublicKey: "{metadata['signerPublicKey']}",
    #         signerPrivateKey: "{metadata['signerPrivateKey']}",
    #         recipientPublicKey: "{metadata['recipientPublicKey']}",
    #         asset: {{
    #           data: {asset}
    #         }}
    #       }}) {{
    #         id
    #       }}
    #     }}
    #     """

    #     r = requests.post(GRAPHQL_URL, json={"query": query})
    #     return Response(r.json())
    
    def post(self, request):
        r = requests.post(REST_URL + '/commit', headers={"Content-Type": "application/json"}, data=json.dumps(request.data), timeout=10)
        return Response(r)
        


class GetTransaction(APIView):
    # def get(self, request, txn_id):
    #     query = """
    #     query GetTx($id: ID!) {
    #         getTransaction(id: $id) {
    #             id
    #             version
    #             amount
    #             uri
    #             type
    #             publicKey
    #             operation
    #             metadata
    #             asset
    #             signerPublicKey
    #         }
    #     }
    #     """

    #     r = requests.post(GRAPHQL_URL, json={"query": query, "variables": {"id": txn_id}})
    #     return Response(r.json())

    def get(self, request, txn_id):
        r = requests.get(REST_URL + f'/{txn_id}', headers={"Content-Type": "application/json"})
        if (r):
            return Response(r.json())
